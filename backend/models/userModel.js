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
  cohort: {type: String, default: "Unassigned"},
  avatarUrl: { type: String },
  bio: {
    type: String,
    default: function() {
      // 1. Check if the user is a student
      if (this.role === 'student') {
        // 2. Dynamically inject their course if it exists, otherwise fallback to "Student"
        return this.course ? `${this.course} Student` : 'Student';
      }
      // 3. Same dynamic logic for instructors
      if (this.role === 'instructor') {
        return this.department ? `${this.department} Instructor` : 'Instructor';
      }
      
      // 4. Static fallback for admins
      if (this.role === 'admin') return 'Platform Administrator';
      
      return '';
    }
  },
  // --- Student Specific Fields ---
  studentId: { 
    type: String, 
    // Only required if the user is a student
    required: function() { return this.role === 'student'; },
    sparse: true 
  },
  course: { type: String },
  cohort: { type: String },
  assignedExams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }],
  completedExams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }],
  // --- Instructor Specific Fields ---
  createdExams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }],
  department: { type: String },

  preferences: {
    // Accessibility
    highContrast: { type: Boolean, default: false },
    extendedTime: { type: Boolean, default: false },
    // Exam Experience
    showProgressBar: { type: Boolean, default: true },
    confirmSubmit: { type: Boolean, default: true },
    // Results Display
    defaultResultsView: { 
      type: String, 
      enum: ['score', 'breakdown', 'comparison'], 
      default: 'score' 
    }
  },
  
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