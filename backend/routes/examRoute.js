import express from 'express'
import { getExam, createExam } from "../controllers/examController.js";

const examRouter = express.Router()

examRouter.get('/get-exam/:examId',getExam)
examRouter.post('/create-exam',createExam)

export default examRouter