import express from 'express';
import { isAuthenticated, login, logout, register, resetOtp, resetPassword, sendverifyOtp, verifyOtp } from '../Controllers/authController.js';
import userAuth from '../Middleware/userauth.js';

const authRouter = express.Router();

authRouter.post('/register',register)
authRouter.post('/login',login)
authRouter.post('/logout',logout)
authRouter.post('/send-verify-otp',userAuth,sendverifyOtp)
authRouter.post('/verify-account',userAuth,verifyOtp)
authRouter.get('/is-auth',userAuth,isAuthenticated)
authRouter.post('/reset-otp',resetOtp)
authRouter.post('/reset-password',resetPassword)
export default authRouter;
