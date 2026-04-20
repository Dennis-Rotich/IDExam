import mongoose from "mongoose";

// 2A. Results of Individual Test Cases
const testResultSchema = new mongoose.Schema({
  testCaseId: { type: mongoose.Schema.Types.ObjectId },
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
  score: { type: Number, default: 1 },
  // Required for instructor feedback
  instructorFeedback: { type: String },
});

// 2C. The Main Submission Record
const submissionSchema = new mongoose.Schema(
  {
    exam: { type: mongoose.Schema.Types.ObjectId, ref: "exam", required: true },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    answers: [answerSubmissionSchema],
    totalScore: { type: Number, default: 0 },
    isGraded: { type: Boolean, default: false },
    startedAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    submittedAt: { type: Date },
    // Required for the cron job for autosubmission and the Student "Resume" button
    status: {
      type: String,
      enum: ["in-progress", "submitted", "graded", "abandoned"],
      default: "in-progress",
    },
    // Required for the Student Overview recent results list
    passed: { type: Boolean, default: false },
    // Required to permanently store Live Proctoring alerts
    proctoringFlags: [
      {
        type: {
          type: String,
          enum: ["tab_switch", "disconnect", "execution_error", "custom"],
        },
        message: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
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
