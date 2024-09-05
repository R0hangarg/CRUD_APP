import express from 'express'
import { loginUser, registerUser } from '../controllers/userController';

const userRouter = express.Router();

userRouter.post('/auth/register',registerUser);
userRouter.post('/auth/login',loginUser);

export default userRouter