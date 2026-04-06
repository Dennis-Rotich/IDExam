import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },     
  expectedOutput: { type: String, required: true },
  isHidden: { type: Boolean, default: false },
  points: { type: Number, default: 2 }, 
});

// questions schema
const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  topic: { type: String, required: true }, // Added from TS
  // allow regular questions to be tested as well
  type: { 
    type: String, 
    enum: ['CODING', 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER'], // Maps to your QuestionType
    required: true 
  },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
  description: { type: String },
  //to allow exam standardization by using both testcase and question points: (Passed Test Case Weight / Total Test Case Weight) * Question pointsWeight
  pointsWeight: { type: Number, default: 10 }, 
  
  // Coding-specific fields (optional for non-coding questions)
  allowedLanguages: [{ type: String }],             
  starterCode: { type: Map, of: String },
  // single source of truth for the correct solution/answer
  referenceSolution: { type: String }, 
  testCases: [testCaseSchema],
  timeLimitMs: { type: Number, default: 2000 },     
  memoryLimitKb: { type: Number, default: 256000 } 
});

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  instructions: { type: String }, 
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  durationInMinutes: { type: Number, required: true },
  availableFrom: { type: Date }, 
  availableUntil: { type: Date },
  // for agentic flow use
  aiProctoringEnabled: { type: Boolean, default: false },
  aiGradingEnabled: { type: Boolean, default: true },
  problems: [problemSchema], // Renamed from 'problems' to match your TS 'Question' interface
  status: { type: String, enum: ['Draft', 'Published', 'Archived'], default: 'Draft' } 
}, { timestamps: true });

export default mongoose.models.exam || mongoose.model('exam', examSchema);