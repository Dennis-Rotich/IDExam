import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  programme: { type: String, default: " " },
  studentId: { type: String, required: true, unique: true },
  completedExams: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Exam' 
  }]
}, { timestamps: true })

const studentModel = mongoose.models.student || mongoose.model('student',studentSchema)

export default studentModel