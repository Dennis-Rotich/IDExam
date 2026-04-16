import submissionModel from "../models/submissionModel.js";
import examModel from "../models/examModel.js";
import questionModel from "../models/questionModel.js";
import axios from "axios";

const startSubmission = async (req, res) => {
  try {
    const { examId } = req.body;
    const studentId = req.user.id;

    const exam = await examModel.findById(examId);
    if (!exam || !exam.isActive) {
      return res
        .status(404)
        .json({ success: false, message: "Exam not found or inactive." });
    }

    // Atomic upsert - prevents duplicate key error on concurrent requests (e.g. two devices)
    const startedAt = new Date();
    const endsAt = new Date(
      startedAt.getTime() + exam.durationInMinutes * 60000,
    );

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
          proctoringFlags: [],
        },
      },
      { upsert: true, returnDocument: "after" },
    );

    res.status(200).json({ success: true, submission });
  } catch (error) {
    console.error("Start Submission Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to start exam session." });
  }
};

const updateAnswerScore = async (req, res) => {
  try {
    const { sessionId, answerId } = req.params;
    const { score, feedback } = req.body;

    const submission = await submissionModel.findById(sessionId);
    if (!submission) {
      return res
        .status(404)
        .json({ success: false, message: "Submission not found" });
    }

    const answer = submission.answers.id(answerId);
    if (!answer) {
      return res.status(404).json({
        success: false,
        message: "Answer not found in this submission",
      });
    }

    answer.score = Number(score);
    // FIX: was referencing undefined variable `instructorFeedback` instead of `feedback`
    if (feedback !== undefined) {
      answer.instructorFeedback = feedback;
    }

    submission.totalScore = submission.answers.reduce(
      (total, ans) => total + (ans.score || 0),
      0,
    );

    if (submission.status !== "graded") {
      submission.status = "graded";
    }

    await submission.save();

    res.status(200).json({
      success: true,
      message: "Score updated successfully",
      totalScore: submission.totalScore,
    });
  } catch (error) {
    console.error("Update Score Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Quiet background save to prevent data loss on browser crash
const autosave = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { questionId, language, answer } = req.body;

    if (!questionId || answer === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
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
      { returnDocument: "after" },
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
        { returnDocument: "after" },
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

// Executes code against test cases, grades, and records the score
const studentSubmit = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { questionId, studentAnswer, language, executionResults } = req.body;

    const submission = await submissionModel.findById(sessionId);
    const question = await questionModel.findById(questionId);

    if (!submission || !question) {
      return res.status(404).json({ success: false, message: "Not found." });
    }

    let finalTestResults = [];
    let autoGradeStatus = "Pending";
    let calculatedScore = 0;

    // Handle Coding Questions
    if (question.type === "CODING" || !question.type) {
      if (executionResults && executionResults.length > 0) {
        finalTestResults = executionResults.map((result, index) => {
          const originalTestCase = question.testCases[index];
          if (!originalTestCase) throw new Error("Test case mismatch.");

          return {
            testCaseId: originalTestCase._id,
            passed: result.passed,
            actualOutput: result.output,
            errorMessage: result.error,
          };
        });

        const allPassed = finalTestResults.every((tc) => tc.passed);
        autoGradeStatus = allPassed ? "Accepted" : "Wrong Answer";
        calculatedScore = allPassed ? question.pointsWeight : 0;
      }
    }
    // Handle Multiple Choice
    else if (question.type === "MULTIPLE_CHOICE") {
      const isCorrect = studentAnswer === question.correctAnswer;
      autoGradeStatus = isCorrect ? "Accepted" : "Wrong Answer";
      calculatedScore = isCorrect ? question.pointsWeight : 0;
    }
    // Handle Theory / Short Answer
    else {
      autoGradeStatus = "Pending";
      calculatedScore = 0;
    }

    // Check if answer already exists to update it, otherwise push new
    const existingAnswerIndex = submission.answers.findIndex(
      (ans) => ans.questionId.toString() === questionId,
    );

    const answerPayload = {
      questionId: question._id,
      answer: studentAnswer,
      language: language || "text",
      status: autoGradeStatus,
      score: calculatedScore,
      testResults: finalTestResults,
    };

    if (existingAnswerIndex > -1) {
      submission.answers[existingAnswerIndex] = answerPayload;
    } else {
      submission.answers.push(answerPayload);
    }

    // Recalculate total score
    submission.totalScore = submission.answers.reduce(
      (sum, ans) => sum + ans.score,
      0,
    );

    await submission.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Question saved.",
        status: autoGradeStatus,
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const runCode = async (req, res) => {
  try {
    const { language, code } = req.body;

    if (!language || !code) {
      return res
        .status(400)
        .json({ success: false, message: "Language and code are required." });
    }

    const pistonPayload = {
      // FIX: normalize JS language identifier same as studentSubmit
      language: language === "javascript" ? "js" : language,
      version: "*",
      files: [{ name: "main", content: code }],
      run_timeout: 3000,
      compile_timeout: 3000,
    };

    const { data } = await axios.post(
      "http://68.210.224.3/api/v2/execute",
      pistonPayload,
    );

    const compileCode = data.compile ? data.compile.code : 0;
    const compileOutput = data.compile ? data.compile.output : "";
    const runCodeStatus = data.run ? data.run.code : 0;
    const runOutput = data.run ? data.run.output : "";

    const isError = compileCode !== 0 || runCodeStatus !== 0;
    const actualOutputClean =
      compileCode !== 0 ? compileOutput.trim() : runOutput.trim();
    const finalOutput = data.message ? data.message.trim() : actualOutputClean;

    // FIX: return isError and output so the frontend console can display it
    res.status(200).json({
      success: true,
      isError,
      output: finalOutput,
    });
  } catch (error) {
    console.error("Execution Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error during code execution." });
  }
};

const finalizeExam = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const submission = await submissionModel.findOneAndUpdate(
      { _id: sessionId, status: "in-progress" },
      {
        $set: {
          status: "submitted",
          submittedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Active session not found or already submitted.",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Exam finalized successfully." });
  } catch (error) {
    console.error("Finalize Exam Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to finalize exam." });
  }
};

const updateSubmissionStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status } = req.body;

    // 1. Validate status
    const validStatuses = ["in-progress", "submitted", "graded", "abandoned"];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status." });
    }

    // 2. Fetch the overall submission
    const submission = await submissionModel
      .findById(sessionId)
      .populate("exam");
    if (!submission) {
      return res
        .status(404)
        .json({ success: false, message: "Submission not found." });
    }

    // 3. Update status and handle passing logic
    submission.status = status;
    if (status === "graded") {
      submission.isGraded = true;
      const passMark = submission.exam?.passMark ?? 50;
      submission.passed = submission.totalScore >= passMark;
    }

    await submission.save();

    res.status(200).json({
      success: true,
      message: `Submission marked as ${status}.`,
      submission,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const getSubmission = async (req, res) => {
  try {
    const { sessionId } = req.params;

    let submission = await submissionModel
      .findOne({ _id: sessionId })
      .populate("student", "name studentId email")
      .populate("exam", "title courseCode examCode totalPoints")
      .populate("answers.questionId");

    if (!submission) {
      return res
        .status(404)
        .json({ success: false, message: "Submission not found" });
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
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
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
  updateAnswerScore,
  startSubmission,
  finalizeExam,
  updateSubmissionStatus,
};
