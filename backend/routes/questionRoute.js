import express from "express";
import {
  createQuestion,
  getInstructorQuestions, 
  updateQuestion,
  deleteQuestion,
  getQuestion
} from "../controllers/questionController.js";
import { verifyToken, isAdmin, isTeacher } from "../middlewares/auth.js";

const questionRouter = express.Router();

questionRouter.post("/new", verifyToken, isTeacher, createQuestion);

questionRouter.get(
  "/instructor",
  verifyToken,
  isTeacher,
  getInstructorQuestions,
);

questionRouter.get("/:id", verifyToken, isTeacher, getQuestion);

questionRouter.put("/:id", verifyToken, isTeacher, updateQuestion);

questionRouter.delete("/:id", verifyToken, isTeacher, deleteQuestion);

export default questionRouter;
