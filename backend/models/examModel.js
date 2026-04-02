import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },     
  expectedOutput: { type: String, required: true },
  isHidden: { type: Boolean, default: false },     
  points: { type: Number, default: 10 }
})

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },  
  difficulty: { type: String, enum: ['Easy', 'Intermediate', 'Hard'] },
  
  allowedLanguages: [{ type: String }],             
  
  starterCode: {
    type: Map,
    of: String,
  },
  
  testCases: [testCaseSchema],
  timeLimitMs: { type: Number, default: 2000 },     
  memoryLimitKb: { type: Number, default: 256000 } 
});

// 1C. The Main Exam Wrapper
const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  durationInMinutes: { type: Number, required: true },
  problems: [problemSchema],                    
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

const examModel = mongoose.models.exam || mongoose.model('exam',examSchema)

export default examModel