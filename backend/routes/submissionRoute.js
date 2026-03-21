import express from 'express';
import { studentSubmit } from "../controllers/submissionController.js";

const submissionRouter = express.Router()

submissionRouter.post('/submit-exam/:examId/problem/:problemId', studentSubmit)

export default submissionRouter