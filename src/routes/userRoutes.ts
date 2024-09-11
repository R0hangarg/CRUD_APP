import express from 'express'
import { loginUser, registerUser, resendOtpToLogin, sendOtpToLogin, verifyOtpToLogin } from '../controllers/userController';

const userRouter = express.Router();

userRouter.post('/auth/register',registerUser);
userRouter.post('/auth/login',loginUser);
userRouter.post('/auth/login/send-otp',sendOtpToLogin);
userRouter.post('/auth/login/verify-otp',verifyOtpToLogin);
userRouter.post('/auth/login/resend-otp',resendOtpToLogin);
userRouter.post('/logout', (req, res) => {
    res.clearCookie('token'); // Clear the cookie with the name 'authToken'
    res.status(200).json({ message: 'Logged out successfully' });
  });

export default userRouter