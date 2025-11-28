import express from 'express';
import { userRegistrationController, userMeController, userRegisterCodeVerifyController, userLoginController, userLoginVerificationController, userForgotPasswordRequestController, userForgotPasswordVerificationController, userResetPasswordController } from '../controllers/userAuthController.js'
import userAuth from '../middleware/userAuth.js';


const userRouter = express.Router();

// REGISTRATION PROCESS
userRouter.post('/register', userRegistrationController);

// REGISTRATION VERIFICATION
userRouter.post('/register/verification', userRegisterCodeVerifyController);

// LOGIN PROCESS
userRouter.post('/login', userLoginController);

// LOGIN PROCESS
userRouter.post('/login/verification', userLoginVerificationController);

// FORGOT PASSSORD REQUEST
userRouter.post('/forgot-password', userForgotPasswordRequestController);

// FORGOT PASSSORD VERIFICATION
userRouter.post('/forgot-password/verification', userForgotPasswordVerificationController);

// PASSWORD RESET
userRouter.post('/forgot-password/reset', userResetPasswordController);

// DISPLAY FIRSTNAME AND LASTNAME ON PAGES
userRouter.get('/me', userAuth, userMeController);


export default userRouter;