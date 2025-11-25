import express from 'express';
import { userRegistrationController, userRegisterCodeVerifyController, userLoginController, userLoginVerificationController, userForgotPasswordRequestController, userForgotPasswordVerificationController, userResetPasswordController } from '../controllers/userAuthController.js'


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



export default userRouter;