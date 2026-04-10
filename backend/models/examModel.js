import mongoose from "mongoose";

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
    availableFrom: { type: Date },
    availableUntil: { type: Date },
    aiProctoringEnabled: { type: Boolean, default: false },
    aiGradingEnabled: { type: Boolean, default: true },
    
    // The Exam simply stores a list of ID strings pointing to the Question collection
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "question", 
        required: true,
      },
    ],
    
    isActive: { type: Boolean, default: true },
    assignedCohorts: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true },
);

const examModel = mongoose.models.exam || mongoose.model("exam", examSchema);

export default examModel;