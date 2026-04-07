import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  isHidden: { type: Boolean, default: false },
  points: { type: Number, default: 2 },
});

// renamed to questionSchema tom handle general questions as well
const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  topic: { type: String }, // Added from TS
  type: {
    type: String,
    enum: ["CODING", "MULTIPLE_CHOICE", "TRUE_FALSE", "SHORT_ANSWER"], // Maps to your QuestionType
    required: true,
  },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"] },
  pointsWeight: { type: Number, default: 10 },

  // Coding-specific fields (optional for non-coding questions)
  allowedLanguages: [{ type: String }],
  starterCode: {
    type: Map,
    of: String,
  },
  referenceSolution: { type: String }, // single source of truth that passes all test cases
  testCases: [testCaseSchema],
  timeLimitMs: { type: Number, default: 2000 },
  memoryLimitKb: { type: Number, default: 256000 },
});

// 1C. The Main Exam Wrapper
const examSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    instructions: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    durationInMinutes: { type: Number, required: true },
    // to allow exams to be open from a certain period
    availableFrom: { type: Date },
    availableUntil: { type: Date },
    // for agentic use
    aiProctoringEnabled: { type: Boolean, default: false },
    aiGradingEnabled: { type: Boolean, default: true },
    questions: [questionSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const examModel = mongoose.models.exam || mongoose.model("exam", examSchema);

export default examModel;
