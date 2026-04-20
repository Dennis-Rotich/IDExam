import express from 'express';
import { 
    register, 
    login, 
    deleteUser, 
    undeleteUser, 
    getAllUsers, 
    getUserProfile, 
    updateUser, 
    deleteUserById,
    updatePreferences,
    getTeacherDashboard
} from '../controllers/userController.js';
import { verifyToken, isAdmin, isTeacher } from "../middlewares/auth.js";

const userRouter = express.Router();

// Public Routes
userRouter.post('/register', register);
userRouter.post('/login', login);
// Protected Routes (Require Login)
// ==========================================
// Get the currently logged-in user's profile
userRouter.get('/profile', verifyToken, getUserProfile);
userRouter.get('/instructor/dashboard', verifyToken, isTeacher, getTeacherDashboard);
// Update a user's details by ID 
userRouter.put('/profile', verifyToken, updateUser);

userRouter.put('/preferences', verifyToken, updatePreferences);

// Administrative Routes 
// ==========================================
// Get all users (Useful for managing the platform)
userRouter.get('/all', verifyToken, isAdmin, getAllUsers);

// Soft Delete Own Account (No ID in URL needed)
userRouter.delete('/deactivate', verifyToken, deleteUser);
// Soft Delete Another User (Admin/System only)
userRouter.delete('/deactivate/:id', verifyToken, isAdmin, deleteUser);
// Hard Delete (Strictly Admin only)
userRouter.delete('/permanent/:id', verifyToken, isAdmin, deleteUserById);
// Restore a soft-deleted user
userRouter.patch('/restore/:id', verifyToken, isAdmin, undeleteUser);

export default userRouter;