import mongoose from "mongoose";
import counter from "./counterModel.js"

// 1. Sub-schema for Coding Test Cases
const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  isHidden: { type: Boolean, default: false }, // Hide edge cases from students
  points: { type: Number, default: 2 },
}, { _id: false });

// 2. The Main Question Schema
const questionSchema = new mongoose.Schema({
  examId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'exam', 
    required: true 
  },
  displayId: { type: Number, unique: true }, // For LeetCode-style numbering (e.g., Question 1, 2, 3)
  title: { type: String, required: true },
  description: { type: String, required: true }, // The problem statement (supports Markdown/HTML)
  type: {
    type: String,
    enum: ["CODING", "MULTIPLE_CHOICE", "TRUE_FALSE", "SHORT_ANSWER"], 
    default: "CODING",
    required: true,
  },
  difficulty: { 
    type: String, 
    enum: ["Easy", "Medium", "Hard"],
    default: "Medium",
    required: true
  },
  // --- Practice Dashboard Sorting ---
  topic: { type: String, default: "Algorithms" }, // e.g., "Algorithms", "Database", "JavaScript"
  tags: [{ type: String }], // e.g., ["Array", "Dynamic Programming", "Two Pointers"]
  // --- Grading Rules ---
  pointsWeight: { type: Number, default: 10 },
  // TYPE A: CODING SPECIFIC FIELDS
  allowedLanguages: [{ type: String }], 
  starterCode: {
    type: Map,
    of: String, // Key: Language (e.g., "python"), Value: The starting function template
  },
  referenceSolution: { type: String }, // The instructor's perfect solution
  testCases: [testCaseSchema],
  timeLimitMs: { type: Number, default: 2000 },
  memoryLimitKb: { type: Number, default: 256000 },
  // ==========================================
  // TYPE B: MULTIPLE CHOICE / STANDARD FIELDS
  options: [{ type: String }], 
  // Mixed type so it can hold the string of a short answer, the index of an MCQ, or a boolean
  correctAnswer: { type: mongoose.Schema.Types.Mixed },
  isPracticeAvailable: {type: Boolean, default: true},
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", 
    required: true,
  },
}, { timestamps: true });

// Add a pre-save hook to auto-increment the `displayId` 
// so that questions can automatically number themselves like LeetCode.
questionSchema.pre('save', async function() {
  if (this.isNew && !this.displayId) {
    // Atomically find the counter and increment it by 1. 
    // upsert: true creates the document if it doesn't exist yet.
    const counterDoc = await counter.findByIdAndUpdate(
      { _id: 'question_display_id' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    
    this.displayId = counterDoc.seq;
  }
});

const questionModel = mongoose.models.question || mongoose.model("question", questionSchema);

export default questionModel;
