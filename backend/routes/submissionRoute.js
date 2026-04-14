import express from 'express';
import { 
    startSubmission,
    studentSubmit, 
    runCode, 
    autosave, 
    getSubmission, 
    getStudentSubmissions,
    finalizeExam
} from "../controllers/submissionController.js";
import { verifyToken } from "../middlewares/auth.js";

const submissionRouter = express.Router();

//Start or Resume an exam session
submissionRouter.post('/start', verifyToken, startSubmission);

// Fetch a specific submission session
submissionRouter.get('/:sessionId', verifyToken, getSubmission);

// fetch all the student's submissions
submissionRouter.get('/student/me', verifyToken, getStudentSubmissions);

submissionRouter.patch("/:sessionId/answer/:answerId/score", updateAnswerScore);

// Autosave progress during the exam
submissionRouter.post('/autosave/:sessionId', verifyToken, autosave);

// Submit a specific problem for evaluation
submissionRouter.post('/submit/:sessionId', verifyToken, studentSubmit);

submissionRouter.post('/finalize/:sessionId', verifyToken, finalizeExam);

// Run code without submitting/saving (Dry run)
submissionRouter.post('/run', runCode);
 
export default submissionRouter;