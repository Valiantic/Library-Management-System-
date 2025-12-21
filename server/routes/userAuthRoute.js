import express from 'express';
import { userRegistrationController, userMeController, userRegisterCodeVerifyController, userLoginController, userForgotPasswordRequestController, userForgotPasswordVerificationController, userResetPasswordController, getAllUsersController, addUserController, updateUserController, toggleUserStatusController, updateStudentPasswordController } from '../controllers/userAuthController.js'
import userAuth from '../middleware/userAuth.js';

const userRouter = express.Router();
// ADMIN UPDATE USER
userRouter.put('/update/:id', userAuth, updateUserController);
// ADMIN TOGGLE USER STATUS (Archive/Unarchive)
userRouter.put('/toggle-status/:id', userAuth, toggleUserStatusController);
// GET ALL USERS (ADMIN ONLY)
userRouter.get('/all', userAuth, getAllUsersController);

// REGISTRATION PROCESS
userRouter.post('/register', userRegistrationController);

// REGISTRATION VERIFICATION
userRouter.post('/register/verification', userRegisterCodeVerifyController);

// LOGIN PROCESS
userRouter.post('/login', userLoginController);

// FORGOT PASSSORD REQUEST
userRouter.post('/forgot-password', userForgotPasswordRequestController);

// FORGOT PASSSORD VERIFICATION
userRouter.post('/forgot-password/verification', userForgotPasswordVerificationController);

// PASSWORD RESET
userRouter.post('/forgot-password/reset', userResetPasswordController);

// DISPLAY FIRSTNAME AND LASTNAME ON PAGES
userRouter.get('/me', userAuth, userMeController);

// ADMIN ADD USER (no OTP)
userRouter.post('/add', userAuth, addUserController);


// UPDATE STUDENT PASSWORD
userRouter.patch('/update/students/password', userAuth, updateStudentPasswordController);



export default userRouter;