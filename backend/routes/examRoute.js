import express from 'express'
import { getExam, createExam } from "../controllers/examController.js";
import {verifyToken, isTeacher} from "../middlewares/auth.js"

const examRouter = express.Router()

examRouter.get('/get-exam/:examId',verifyToken,getExam)
examRouter.post('/create-exam',verifyToken,isTeacher,createExam)

export default examRouter