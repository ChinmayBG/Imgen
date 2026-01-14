import express from 'express'
import { userRegister,userLogin, userCredits, paymentRazorPay, verifyRazorpay } from '../controllers/userController.js'
import userAuth from '../middlewares/auth.js';

const userRouter = express.Router();

//creating endpoint path 
userRouter.post('/register', userRegister)
userRouter.post('/login', userLogin)
userRouter.get('/credits',userAuth,userCredits)
userRouter.post('/buy-razor', userAuth, paymentRazorPay)
userRouter.post('/verify', verifyRazorpay)

export default userRouter; 

// This is an API endpoint used by the frontend to register a new user through the backend.
//http://localhost:4000/api/user/register