import express from 'express';
import { 
    startSubmission,
    studentSubmit,
    updateAnswerScore, 
    runCode, 
    autosave, 
    getSubmission, 
    getStudentSubmissions,
    finalizeExam,
    updateSubmissionStatus
} from "../controllers/submissionController.js";
import { verifyToken } from "../middlewares/auth.js";

const submissionRouter = express.Router();

//Start or Resume an exam session
submissionRouter.post('/start', verifyToken, startSubmission);

// Fetch a specific submission session
submissionRouter.get('/:sessionId', verifyToken, getSubmission);

// fetch all the student's submissions
submissionRouter.get('/student/me', verifyToken, getStudentSubmissions);

submissionRouter.patch("/:sessionId/answer/:answerId/score", verifyToken, updateAnswerScore);

submissionRouter.patch('/submission/:sessionId/status', verifyToken, updateSubmissionStatus);

// Autosave progress during the exam
submissionRouter.post('/autosave/:sessionId', verifyToken, autosave);

// Submit a specific problem for evaluation
submissionRouter.post('/submit/:sessionId', verifyToken, studentSubmit);

submissionRouter.post('/finalize/:sessionId', verifyToken, finalizeExam);

// Run code without submitting/saving (Dry run)
submissionRouter.post('/run', verifyToken, runCode);
 
export default submissionRouter;
