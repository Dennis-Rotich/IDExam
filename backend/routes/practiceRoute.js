import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { getPracticeDashboard } from '../controllers/practiceController.js';

const practiceRouter = express.Router();

// GET /api/practice
practiceRouter.get('/', verifyToken, getPracticeDashboard);

export default practiceRouter;