import submissionModel from "../models/submissionModel.js";
import examModel from "../models/examModel.js";
import axios from "axios";

export const startSubmission = async (req, res) => {
  try {
    const { examId } = req.body;
    const studentId = req.user.id; 

    // 1. Fetch the exam to get the duration limit
    const exam = await examModel.findById(examId);
    if (!exam || !exam.isActive) {
      return res.status(404).json({ success: false, message: "Exam not found or inactive." });
    }

    // 2. RESUME LOGIC: Check if the student already has a session for this exam
    let submission = await submissionModel.findOne({
      exam: examId,
      student: studentId
    });

    if (submission) {
      // If they already started, just return the existing session so they can resume
      return res.status(200).json({ success: true, submission });
    }

    // 3. NEW SESSION: Calculate the exact end time based on exam duration
    const startedAt = new Date();
    const endsAt = new Date(startedAt.getTime() + exam.durationInMinutes * 60000);

    // 4. Create the blank submission document in MongoDB
    submission = await submissionModel.create({
      exam: examId,
      student: studentId,
      startedAt: startedAt,
      endsAt: endsAt,
      status: "in-progress",
      answers: [],
      proctoringFlags: []
    });

    res.status(200).json({ success: true, submission });
  } catch (error) {
    console.error("Start Submission Error:", error);
    res.status(500).json({ success: false, message: "Failed to start exam session." });
  }
};

// to handle frequent API saves - a quiet, background operation designed to prevent data loss. 
// It fires frequently (e.g., every 2 seconds after the student stops typing) to ensure that if their browser crashes, 
// their text or code is safely stored in the database.
const autosave = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { questionId, language, answer } = req.body;

    if (!questionId || answer === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Attempt to update the existing answer for this question
    let result = await submissionModel.findOneAndUpdate(
      {
        _id: sessionId,
        "answers.questionId": questionId,
        status: "in-progress",
      },
      {
        $set: {
          "answers.$.answer": answer,
          "answers.$.language": language,
        },
      },
      { returnDocument: 'after' } ,
    );

    // If the answer object doesn't exist in the array yet, push it
    if (!result) {
      result = await submissionModel.findOneAndUpdate(
        { _id: sessionId, status: "in-progress" },
        {
          $push: {
            answers: { questionId, language, answer },
          },
        },
        { returnDocument: 'after' } ,
      );

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Session not found or exam submitted.",
        });
      }
    }

    return res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("Autosave Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to autosave" });
  }
};


//responsible for executing the code, grading it against test cases, and permanently recording the score.
const studentSubmit = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { questionId, language, code } = req.body;

    const submission = await submissionModel.findOne({
      _id: sessionId,
      status: "in-progress",
    });
    
    if (!submission) {
      return res.status(404).json({ success: false, message: "Active submission session not found." });
    }

    const exam = await examModel.findById(submission.exam);
    if (!exam) return res.status(404).json({ success: false, message: "Exam not found" });

    const question = exam.questions.id(questionId);
    if (!question) return res.status(404).json({ success: false, message: "Question not found" });

    let testResults = [];
    let passedAll = true;
    let totalScore = 0;

    for (const testCase of question.testCases) {
      const pistonPayload = {
        language: language,
        version: "*",
        files: [{ name: "main", content: code }],
        stdin: testCase.input || "",
        run_timeout: 3000,
        compile_timeout: 3000,
      };

      const { data } = await axios.post("http://68.210.224.3/api/v2/execute", pistonPayload);

      const compileCode = data.compile ? data.compile.code : 0;
      const compileOutput = data.compile ? data.compile.output : "";
      const runCodeStatus = data.run ? data.run.code : 0;
      const runOutput = data.run ? data.run.output : "";

      const actualOutputClean = runOutput.trim();
      const expectedOutputClean = testCase.expectedOutput.trim();

      const isPassed = compileCode === 0 && runCodeStatus === 0 && actualOutputClean === expectedOutputClean;

      let errorMessage = null;
      let errorType = null; 

      if (!isPassed) {
        passedAll = false; // <-- BUG 2 FIXED: Must flag as failed
        
        // Explicit error typing (no string guessing)
        if (data.message) {
          errorMessage = data.message;
          errorType = "System Error";
        } else if (compileCode !== 0) {
          errorMessage = compileOutput;
          errorType = "Compilation Error";
        } else if (runCodeStatus !== 0) {
          errorMessage = runOutput;
          errorType = "Runtime Error";
        } else {
          errorMessage = `Expected: ${expectedOutputClean}, Got: ${actualOutputClean}`;
          errorType = "Wrong Answer";
        }
      }
      
      if (isPassed) totalScore += testCase.points || 1;

      testResults.push({
        testCaseId: testCase._id,
        passed: isPassed,
        actualOutput: runOutput,
        executionTimeMs: 0,
        errorMessage: isPassed ? null : errorMessage,
        errorType: errorType // Temporary field for status calculation
      });
    }

    // Determine precise status
    let overallStatus = "Accepted";
    if (!passedAll) {
      const firstError = testResults.find((tr) => !tr.passed);
      overallStatus = firstError.errorType; 
    }

    // Strip the temporary errorType before saving to DB
    const cleanedTestResults = testResults.map(tr => {
      const { errorType, ...rest } = tr;
      return rest;
    });

    const newQuestionSubmission = {
      questionId: questionId,
      language: language,
      code: code,
      status: overallStatus,
      testResults: cleanedTestResults,
      score: totalScore,
    };

    // 1. Remove old draft
    await submissionModel.updateOne(
      { _id: sessionId },
      { $pull: { answers: { questionId: questionId } } }
    );

    // 2. Save new graded result (BUG 1 FIXED: Removed duplicate save)
    await submissionModel.findOneAndUpdate(
      { _id: sessionId },
      {
        $push: { answers: newQuestionSubmission },
        $inc: { totalScore: totalScore },
      },
      { returnDocument: 'after' } 
    );

    // --- EXAM FEEDBACK MASKING ---
    const publicResults = cleanedTestResults.filter((tr) => {
      const originalTestCase = question.testCases.id(tr.testCaseId);
      return originalTestCase && !originalTestCase.isHidden;
    });

    let studentFacingStatus = "Submitted Successfully"; 
    const failedPublicTest = publicResults.find(tr => !tr.passed);

    if (overallStatus === "Compilation Error") {
      studentFacingStatus = "Compilation Error"; 
    } else if (failedPublicTest) {
      studentFacingStatus = "Public Tests Failed";
    }

    res.status(200).json({
      success: true,
      status: studentFacingStatus, 
      results: publicResults, 
    });
  } catch (error) {
    console.error("Evaluation Error:", error);
    res.status(500).json({ success: false, message: "Failed to evaluate code." });
  }
};

const runCode = async (req, res) => {
  try {
    const { language, code } = req.body;

    const pistonPayload = {
      language: language,
      version: "*",
      files: [{ name: "main", content: code }],
      run_timeout: 3000,
      compile_timeout: 3000,
    };

    const { data } = await axios.post(
      "http://127.0.0.1:2000/api/v2/execute",
      pistonPayload,
    );

    const compileCode = data.compile ? data.compile.code : 0;
    const compileOutput = data.compile ? data.compile.output : "";
    const runCodeStatus = data.run ? data.run.code : 0;
    const runOutput = data.run ? data.run.output : "";

    const isError = compileCode !== 0 || runCodeStatus !== 0;

    const actualOutputClean = compileCode !== 0 ? compileOutput.trim() : runOutput.trim();
    const finalOutput = data.message ? data.message.trim() : actualOutputClean;

    res.status(200).json({
      success: true,
      isError,
      output: finalOutput,
    });
  } catch (error) {
    console.error("Execution Error:", error);
    res.status(500).json({ success: false, message: "Error during code execution." });
  }
};

export const finalizeExam = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const submission = await submissionModel.findOneAndUpdate(
      { _id: sessionId, status: "in-progress" },
      { 
        $set: { 
          status: "submitted", // Must match schema enum
          submittedAt: new Date() 
        } 
      },
      { returnDocument: 'after' } 
    );

    if (!submission) {
      return res.status(404).json({ success: false, message: "Active session not found or already submitted." });
    }

    res.status(200).json({ success: true, message: "Exam finalized successfully." });
  } catch (error) {
    console.error("Finalize Exam Error:", error);
    res.status(500).json({ success: false, message: "Failed to finalize exam." });
  }
};

const getSubmission = async (req, res) => {
  try {
    const { sessionId } = req.params;
    let submission = await submissionModel.findOne({ _id: sessionId });

    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    // LAZY EVALUATION
    if (submission.status === "in-progress" && new Date() > submission.endsAt) {
      submission = await submissionModel.findOneAndUpdate(
        { _id: sessionId },
        {
          $set: {
            status: "submitted", // Must match schema enum
            submittedAt: submission.endsAt,
          },
        },
        { returnDocument: 'after' } ,
      );
    }

    res.status(200).json({ success: true, submission });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error });
  }
};

const getStudentSubmissions = async (req, res) => {
  try {
    const studentId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [submissions, totalSubmissions] = await Promise.all([
      submissionModel
        .find({ student: studentId })
        .populate("exam", "title subject duration")
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit),
      submissionModel.countDocuments({ student: studentId }),
    ]);

    const totalPages = Math.ceil(totalSubmissions / limit);

    res.status(200).json({
      success: true,
      data: submissions,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalSubmissions,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get Student Submissions Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export {
  studentSubmit,
  runCode,
  autosave,
  getSubmission,
  getStudentSubmissions,
};