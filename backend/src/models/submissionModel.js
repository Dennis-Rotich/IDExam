import mongoose from 'mongoose';

// Results of Individual Test Cases
const testResultSchema = new mongoose.Schema({
  testCaseId: { type: mongoose.Schema.Types.ObjectId, required: true },
  passed: { type: Boolean, required: true },
  actualOutput: { type: String },                  
  executionTimeMs: { type: Number },
  errorMessage: { type: String }                   
});

// The Code Submitted for a Single Problem
// renamed to answer to allow for general question submissions too
const answerSubmissionSchema = new mongoose.Schema({
  // questionId
  problemId: { type: mongoose.Schema.Types.ObjectId, required: true },
  language: { type: String, required: true },  

  // Mixed type to support string | string[] | number | boolean
  // Mongoose Mixed allows flexible structures for autosaving
  answer: { type: mongoose.Schema.Types.Mixed },  
  // Only relevant if it's a coding question
  language: { type: String },     
  // The overall status of this specific problem
  status: { 
    type: String, 
    enum: [
      'Pending', 
      'Accepted', 
      'Wrong Answer', 
      'Compilation Error', 
      'Runtime Error', 
      'Time Limit Exceeded'
    ],
    default: 'Pending'
  },
  testResults: [testResultSchema],                  
  score: { type: Number, default: 0 },
  // feedback on the test
  teacherFeedback: { type: String }             
});

// The Main Submission Record
const submissionSchema = new mongoose.Schema({
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  // Session tracking to match StartExamResponse
  sessionId: { type: String, required: true, unique: true }, 
  status: { type: String, enum: ['IN_PROGRESS', 'COMPLETED', 'ABANDONED'], default: 'IN_PROGRESS' },
  // The student's answer for each question/problem in the exam
  answers: [answerSubmissionSchema],
  
  totalScore: { type: Number, default: 0 },
  isGraded: { type: Boolean, default: false },     

  startedAt: { type: Date, required: true },
  submittedAt: { type: Date },
  // added endsAt for autosubmission
  endsAt: {type: Date} 
}, { timestamps: true });

submissionSchema.index({exam: 1, student: 1}, {unique:true});

const submissionModel = mongoose.models.submission || mongoose.model('submission',submissionSchema)

export default submissionModel 