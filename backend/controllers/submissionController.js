import submissionModel from "../models/submissionModel.js";
import examModel from "../models/examModel.js";
import questionModel from '../models/questionModel.js';
import axios from "axios";

export const startSubmission = async (req, res) => {
  try {
    const { examId } = req.body;
    const studentId = req.user.id;

    const exam = await examModel.findById(examId);
    if (!exam || !exam.isActive) {
      return res.status(404).json({ success: false, message: "Exam not found or inactive." });
    }

    // 2. Atomically find existing session or create a new one
    const startedAt = new Date();
    const endsAt = new Date(startedAt.getTime() + exam.durationInMinutes * 60000);

    const submission = await submissionModel.findOneAndUpdate(
      { exam: examId, student: studentId },
      {
        $setOnInsert: {
          exam: examId,
          student: studentId,
          startedAt,
          endsAt,
          status: "in-progress",
          answers: [],
          proctoringFlags: []
        }
      },
      { upsert: true, returnDocument: "after" }
    );

    res.status(200).json({ success: true, submission });
  } catch (error) {
    console.error("Start Submission Error:", error);
    res.status(500).json({ success: false, message: "Failed to start exam session." });
  }
};

export const updateAnswerScore = async (req, res) => {
  try {
    const { sessionId, answerId } = req.params;
    const { score, feedback } = req.body;

    const submission = await submissionModel.findById(sessionId);
    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    const answer = submission.answers.id(answerId);
    if (!answer) {
      return res.status(404).json({ success: false, message: "Answer not found in this submission" });
    }

    answer.score = Number(score);
    // FIX: was referencing undefined variable `instructorFeedback` instead of `feedback`
    if (feedback !== undefined) {
      answer.instructorFeedback = feedback;
    }

    submission.totalScore = submission.answers.reduce((total, ans) => total + (ans.score || 0), 0);

    if (submission.status !== "graded") {
      submission.status = "graded";
    }

    await submission.save();

    res.status(200).json({
      success: true,
      message: "Score updated successfully",
      totalScore: submission.totalScore
    });
  } catch (error) {
    console.error("Update Score Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Quiet background save to prevent data loss on browser crash
const autosave = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { questionId, language, answer } = req.body;

    if (!questionId || answer === undefined) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Try to update existing answer first
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
      { returnDocument: "after" }
    );

    // If no existing answer, push a new one
    if (!result) {
      result = await submissionModel.findOneAndUpdate(
        { _id: sessionId, status: "in-progress" },
        {
          $push: {
            answers: { questionId, language, answer },
          },
        },
        { returnDocument: "after" }
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
    return res.status(500).json({ success: false, message: "Failed to autosave" });
  }
};

// Executes code against test cases, grades, and records the score
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

    const question = await questionModel.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    let testResults = [];
    let passedAll = true;
    let totalScore = 0;

    for (const testCase of question.testCases) {
      const pistonPayload = {
        language: language === "javascript" ? "js" : language,
        version: "*",
        files: [{ name: "main", content: code }],
        stdin: testCase.input || "",
        run_timeout: 3000,
        compile_timeout: 3000,
      };

      try {
        const { data } = await axios.post("http://68.210.224.3/api/v2/execute", pistonPayload);

        const compileCode = data.compile ? data.compile.code : 0;
        const compileOutput = data.compile ? data.compile.output : "";
        const runCodeStatus = data.run ? data.run.code : 0;
        const runOutput = data.run ? data.run.output : "";

        const actualOutputClean = runOutput.trim();
        const expectedOutputClean = (testCase.expectedOutput || "").trim();

        const isPassed = compileCode === 0 && runCodeStatus === 0 && actualOutputClean === expectedOutputClean;

        let errorMessage = null;
        let errorType = null;

        if (!isPassed) {
          passedAll = false;

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
          errorType: errorType
        });

      } catch (execError) {
        // FIX: if one test case execution throws, record it as a failure instead of crashing the whole request
        passedAll = false;
        testResults.push({
          testCaseId: testCase._id,
          passed: false,
          actualOutput: "",
          executionTimeMs: 0,
          errorMessage: "Execution service error",
          errorType: "System Error"
        });
      }
    }

    let overallStatus = "Accepted";
    if (!passedAll) {
      const firstError = testResults.find((tr) => !tr.passed);
      overallStatus = firstError ? firstError.errorType : "Wrong Answer";
    }

    const cleanedTestResults = testResults.map(({ errorType, ...rest }) => rest);

    const newQuestionSubmission = {
      questionId,
      language,
      code,
      status: overallStatus,
      testResults: cleanedTestResults,
      score: totalScore,
    };

    await submissionModel.updateOne(
      { _id: sessionId },
      { $pull: { answers: { questionId } } }
    );

    await submissionModel.findOneAndUpdate(
      { _id: sessionId },
      {
        $push: { answers: newQuestionSubmission },
        $inc: { totalScore: totalScore },
      },
      { returnDocument: "after" }
    );

    // FIX: guard against undefined testCaseId before calling toString()
    const publicResults = cleanedTestResults.filter((tr) => {
      if (!tr.testCaseId) return false;
      const originalTestCase = question.testCases.find(
        tc => tc._id.toString() === tr.testCaseId.toString()
      );
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

    if (!language || !code) {
      return res.status(400).json({ success: false, message: "Language and code are required." });
    }

    const pistonPayload = {
      // FIX: normalize JS language identifier same as studentSubmit
      language: language === "javascript" ? "js" : language,
      version: "*",
      files: [{ name: "main", content: code }],
      run_timeout: 3000,
      compile_timeout: 3000,
    };

    const { data } = await axios.post("http://68.210.224.3/api/v2/execute", pistonPayload);

    const compileCode = data.compile ? data.compile.code : 0;
    const compileOutput = data.compile ? data.compile.output : "";
    const runCodeStatus = data.run ? data.run.code : 0;
    const runOutput = data.run ? data.run.output : "";

    const isError = compileCode !== 0 || runCodeStatus !== 0;
    const actualOutputClean = compileCode !== 0 ? compileOutput.trim() : runOutput.trim();
    const finalOutput = data.message ? data.message.trim() : actualOutputClean;

    // FIX: return isError and output so the frontend console can display it
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
          status: "submitted",
          submittedAt: new Date()
        }
      },
      { returnDocument: "after" }
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

    let submission = await submissionModel.findOne({ _id: sessionId })
      .populate("student", "name studentId email")
      .populate("exam", "title courseCode examCode totalPoints")
      .populate("answers.questionId");

    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    // Lazy evaluation: auto-submit if time has expired
    if (submission.status === "in-progress" && new Date() > submission.endsAt) {
      submission.status = "submitted";
      submission.submittedAt = submission.endsAt;
      await submission.save();
    }

    res.status(200).json({ success: true, submission });
  } catch (error) {
    console.error("Fetch Submission Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
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