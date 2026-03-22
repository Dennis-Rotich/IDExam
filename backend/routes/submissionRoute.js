import express from 'express';
import { studentSubmit } from "../controllers/submissionController.js";
import {verifyToken} from "../middlewares/auth.js"

const submissionRouter = express.Router()

submissionRouter.post('/submit-exam/:examId/problem/:problemId',verifyToken, studentSubmit)

export default submissionRouter