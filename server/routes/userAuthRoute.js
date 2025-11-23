import express from 'express';
import { userRegistrationController, userRegisterCodeVerifyController } from '../controllers/userAuthController.js'


const userRouter = express.Router();

// REGISTRATION PROCESS
userRouter.post('/register', userRegistrationController);

// REGISTRATION PROCESS
userRouter.post('/register/verification', userRegisterCodeVerifyController);

export default userRouter;