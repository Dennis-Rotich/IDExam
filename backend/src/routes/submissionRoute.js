import express from 'express';
import { studentSubmit, runCode } from "../controllers/submissionController.js";
import {verifyToken} from "../middlewares/auth.js"

const submissionRouter = express.Router()

submissionRouter.post('/submit/:examId/problem/:problemId', verifyToken, studentSubmit)
submissionRouter.post('/test', runCode)
 
export default submissionRouter