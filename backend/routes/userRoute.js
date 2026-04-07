import express from 'express';
import { 
    register, 
    login, 
    deleteUser, 
    undeleteUser, 
    getAllUsers, 
    getUserProfile, 
    updateUser 
} from '../controllers/userController.js';
import { verifyToken, isAdmin } from "../middlewares/auth.js";

const userRouter = express.Router();

// Public Routes
userRouter.post('/register', register);
userRouter.post('/login', login);

// Protected Routes (Require Login)
// ==========================================
// Get the currently logged-in user's profile
userRouter.get('/profile', verifyToken, getUserProfile);
// Update a user's details by ID
userRouter.put('/:id', verifyToken, updateUser);

// Administrative Routes 
// ==========================================
// Get all users (Useful for managing the platform)
userRouter.get('/', verifyToken, isAdmin, getAllUsers);

// Soft delete a user (Sets isDeleted: true and deletedAt: Date)
userRouter.delete('/:id', verifyToken, deleteUser);
// Restore a soft-deleted user
userRouter.patch('/:id/restore', verifyToken, isAdmin, undeleteUser);

export default userRouter;