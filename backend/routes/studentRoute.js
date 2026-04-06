import express from 'express';
import { register, login } from '../controllers/studentController.js';

const studentRouter = express.Router();

studentRouter.post('/register', register)
studentRouter.post('/login', login)

export default studentRouter;