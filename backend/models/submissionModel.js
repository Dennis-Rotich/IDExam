import mongoose from 'mongoose';

// 2A. Results of Individual Test Cases
const testResultSchema = new mongoose.Schema({
  testCaseId: { type: mongoose.Schema.Types.ObjectId, required: true },
  passed: { type: Boolean, required: true },
  actualOutput: { type: String },                  
  executionTimeMs: { type: Number },
  errorMessage: { type: String }                   
});

// 2B. The Code Submitted for a Single Problem
const codeSubmissionSchema = new mongoose.Schema({
  problemId: { type: mongoose.Schema.Types.ObjectId, required: true },
  language: { type: String, required: true },       
  code: { type: String, required: true },           
  
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
  teacherFeedback: { type: String }             
});

// 2C. The Main Submission Record
const submissionSchema = new mongoose.Schema({
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  
  // The student's code for each problem in the exam
  problemSubmissions: [codeSubmissionSchema],
  
  totalScore: { type: Number, default: 0 },
  isGraded: { type: Boolean, default: false },     
  startedAt: { type: Date, required: true },
  submittedAt: { type: Date }
}, { timestamps: true });

submissionSchema.index({exam: 1, student: 1}, {unique:true});

const submissionModel = mongoose.models.submission || mongoose.model('submission',submissionSchema)

export default submissionModel 