import mongoose from 'mongoose';
//This schema maps exactly to the frontend User interface, keeping institution and avatarUrl optional, 
// and conditionally requiring role-specific fields like studentId.

// collapsed teacherSchema and StudentSchema into userSchema which handles all three types of users
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Maps to frontend UserRole: "student" | "instructor" | "admin"
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
  assignedExams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }],
  completedExams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }],
  // --- Instructor Specific Fields ---
  createdExams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }],
  
  //for soft deleting a user's profile 
  isDeleted: {type: Boolean, default: false},
  deletedAt: { 
    type: Date, 
    default: null 
  }
}, { timestamps: true });

// CREATE THE TTL INDEX: 
// 189216000 seconds = exactly 6 years (6 * 365 * 24 * 60 * 60)
// MongoDB will automatically delete the document 6 years after the date stored in 'deletedAt'
userSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 189216000 });

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;