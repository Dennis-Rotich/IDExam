import express from 'express';
import { 
    getExam, 
    createExam, 
    getTeacherExams, 
    getExamForEdit, 
    updateExam, 
    deleteExam, 
    addQuestionToExam
} from "../controllers/examController.js";
import { verifyToken, isTeacher } from "../middlewares/auth.js";

const examRouter = express.Router();

// TEACHER ROUTES (Requires isTeacher)
// ==========================================
// Get all exams for the logged-in teacher's dashboard
examRouter.get('/teacher/all', verifyToken, isTeacher, getTeacherExams);
// Get a single exam with all hidden test cases for editing
examRouter.get('/teacher/:examId', verifyToken, isTeacher, getExamForEdit);
// Create a new exam
examRouter.post('/new', verifyToken, isTeacher, createExam);

// Update an existing exam
examRouter.put('/:examId', verifyToken, isTeacher, updateExam);

examRouter.put('/:examId/questions', verifyToken, isTeacher, addQuestionToExam);

// Delete an exam
examRouter.delete('/:examId', verifyToken, isTeacher, deleteExam);


// ==========================================
// STUDENT ROUTES 
// Get sanitized exam (Hidden test cases removed) - Must be at the bottom!
examRouter.get('/:examId', verifyToken, getExam);

export default examRouter;