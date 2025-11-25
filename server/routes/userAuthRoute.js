import express from 'express';
import { userRegistrationController, userRegisterCodeVerifyController, userLoginController, userLoginVerificationController } from '../controllers/userAuthController.js'


const userRouter = express.Router();

// REGISTRATION PROCESS
userRouter.post('/register', userRegistrationController);

// REGISTRATION VERIFICATION
userRouter.post('/register/verification', userRegisterCodeVerifyController);

// LOGIN PROCESS
userRouter.post('/login', userLoginController);

// LOGIN PROCESS
userRouter.post('/login/verification', userLoginVerificationController);

export default userRouter;