import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // maps to frontend UserRole: "student" | "instructor" | "admin"
  role: { 
    type: String, 
    enum: ['student', 'instructor', 'admin'], 
    required: true 
  },
  institution: { type: String },
  avatarUrl: { type: String },
  // --- Student Specific Fields ---
  studentId: { 
    type: String, 
    // Only required if the user is a student
    required: function() { return this.role === 'student'; },
    sparse: true 
  },
  cohort: { type: String },
  isDeleted: {type: Boolean, default: false}, // determines if a user deleted their account - automatically deleted 6 years after modification if it's true
  deletedAt: { 
    type: Date, 
    default: null 
  },
  assignedExams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }],
  completedExams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }],
  // --- Instructor Specific Fields ---
  createdExams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }]
  
}, { timestamps: true });

// CREATE THE TTL INDEX: 
// 189216000 seconds = exactly 6 years (6 * 365 * 24 * 60 * 60)
// MongoDB will automatically delete the document 6 years after the date stored in 'deletedAt'
userSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 189216000 });

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
