import express from 'express'
import { loginUser, registerUser } from '../controllers/userController';

const userRouter = express.Router();

userRouter.post('/auth/register',registerUser);
userRouter.post('/auth/login',loginUser);
userRouter.post('/logout', (req, res) => {
    res.clearCookie('token'); // Clear the cookie with the name 'authToken'
    res.status(200).json({ message: 'Logged out successfully' });
  });

export default userRouter