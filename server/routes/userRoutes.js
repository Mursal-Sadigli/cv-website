import express from 'express';
import { getUserById, getUserResumes, loginUser, registerUser, getUserAnalytics, updateUserAnalytics, forgotPassword, resetPassword } from '../controllers/userController.js';
import protect from '../middlewares/authMiddleware.js';


const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);
userRouter.get('/data', protect, getUserById);
userRouter.get('/resumes', protect, getUserResumes);
userRouter.get('/analytics', protect, getUserAnalytics);
userRouter.put('/analytics', protect, updateUserAnalytics);

export default userRouter;