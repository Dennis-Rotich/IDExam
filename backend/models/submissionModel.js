import mongoose from "mongoose";

// 2A. Results of Individual Test Cases
const testResultSchema = new mongoose.Schema({
  testCaseId: { type: mongoose.Schema.Types.ObjectId, required: true },
  passed: { type: Boolean, required: true },
  actualOutput: { type: String },
  executionTimeMs: { type: Number },
  errorMessage: { type: String },
});

// 2B. The Code Submitted for a Single Problem
// Broadened to handle both code and standard answers
const answerSubmissionSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },

  // Mixed type to support string | string[] | number | boolean and renamed to answer
  // Mongoose Mixed allows flexible structures for autosaving
  answer: { type: mongoose.Schema.Types.Mixed },

  // Only relevant if it's a coding question
  language: { type: String },

  status: {
    type: String,
    enum: [
      "Pending",
      "Accepted",
      "Wrong Answer",
      "Compilation Error",
      "Runtime Error",
      "Time Limit Exceeded",
    ],
    default: "Pending",
  },
  testResults: [testResultSchema],
  score: { type: Number, default: 0 },
});

// 2C. The Main Submission Record
const submissionSchema = new mongoose.Schema(
  {
    exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    // The student's code for each problem in the exam
    // renamed from problemSubmissions to answers
    answers: [answerSubmissionSchema],

    totalScore: { type: Number, default: 0 },
    isGraded: { type: Boolean, default: false },

    startedAt: { type: Date, required: true },
    endsAt: { type: Date, required: true }, // Added for ExamTimerProps for autosubmission
    submittedAt: { type: Date },
  },
  { timestamps: true },
);

// prevents duplicate submissions per student per exam
submissionSchema.index({ exam: 1, student: 1 }, { unique: true });
// makes the 1-minute cron job incredibly fast and lightweight - examSweeper.js
submissionSchema.index({ status: 1, endsAt: 1 });

const submissionModel =
  mongoose.models.submission || mongoose.model("submission", submissionSchema);

export default submissionModel;
