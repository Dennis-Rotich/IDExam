import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    examCode: { type: String, required: true, unique: true }, // NEW
    courseCode: { type: String, required: true }, // NEW
    instructions: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", 
      required: true,
    },
    durationInMinutes: { type: Number, required: true },
    availableFrom: { type: Date },
    availableUntil: { type: Date },
    aiProctoringEnabled: { type: Boolean, default: false },
    aiGradingEnabled: { type: Boolean, default: true },
    
    // Stores a list of ID strings pointing to the Question collection
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "question", 
        required: true,
      },
    ],
    totalPoints: { type: Number, default: 70 },
    passMark: { type: Number, default: 50 },
    isActive: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft"
    },
    assignedCohorts: [{ type: String }],
  },
  { timestamps: true }
);

const examModel = mongoose.models.exam || mongoose.model("exam", examSchema);

export default examModel;