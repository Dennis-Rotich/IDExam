import express from 'express';
import {
  register,
  login,
  getUserProfile,
  getAllUsers,
  updateUser,
  deleteUser,
  undeleteUser,
  deleteUserById,
} from '../controllers/userController.js';

// Assuming you have these middleware functions based on your previous context
import { verifyToken, isAdmin } from '../middlewares/auth.js'; 

const userRouter = express.Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================
userRouter.post('/register', register);
userRouter.post('/login', login);

// ==========================================
// PROTECTED ROUTES (Requires Login)
// ==========================================
// Fetch or update own profile (No ID in URL)
userRouter.get('/profile', verifyToken, getUserProfile);
userRouter.put('/profile', verifyToken, updateUser);

// Soft delete own account
userRouter.delete('/deactivate', verifyToken, deleteUser);

// ==========================================
// ADMIN / INSTRUCTOR ROUTES
// ==========================================
// Get all users
userRouter.get('/all', verifyToken, getAllUsers);

// Soft delete another user
userRouter.delete('/deactivate/:id', verifyToken, deleteUser);

// Restore a soft-deleted user
userRouter.patch('/restore/:id', verifyToken, undeleteUser);

// Hard delete a user permanently (Requires isAdmin to prevent abuse)
userRouter.delete('/permanent/:id', verifyToken, isAdmin, deleteUserById);

export default userRouter;