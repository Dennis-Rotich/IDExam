import express from 'express';
import {login, register} from '../controllers/teacherController.js';

const teacherRouter = express.Router()

teacherRouter.post('/register',register)
teacherRouter.post('/login',login);

export default teacherRouter