import { userRegistrationService, userRegisterCodeVerifyService, userLoginService, userLoginVerificationService, userForgotPasswordRequestService, userForgotPasswordVerificationService, userResetPasswordService } from '../services/userAuthServices.js'

// USER REGISTRATION INPUT
export const userRegistrationController = async (req, res) => {
    try {
        const {firstName, lastName, emailAddress, userName, password} = req.body;
        const result = await userRegistrationService(firstName, lastName, emailAddress, userName, password);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}


// USER CODE VERIFICATOIN
export const userRegisterCodeVerifyController = async (req, res) => {
    try {
        const {registerKey, verificationCode} = req.body;
        const result = await userRegisterCodeVerifyService(registerKey, verificationCode);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}

// USER LOGIN PROCESS
export const userLoginController = async (req, res) => {
    try {
        const {userName, password} = req.body;
        const result = await userLoginService(userName, password);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}

// USER LOGIN VERIFICATION
export const userLoginVerificationController = async (req, res) => {
    try {
        const {loginSessionToken, verificationCode} = req.body;
        const result = await userLoginVerificationService(loginSessionToken, verificationCode);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}


// USER FORGOT PASSWORD REQUEST
export const userForgotPasswordRequestController = async (req, res) => {
    try {
        const {emailAddress} = req.body;
        const result = await userForgotPasswordRequestService(emailAddress);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}

// USER FORGOT PASSWORD VERIFICATION 
export const userForgotPasswordVerificationController = async (req, res) => {
    try {
        const {verificationCode} = req.body;
        const result = await userForgotPasswordVerificationService(verificationCode);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}

// RESET FORGOT PASSWORD 
export const userResetPasswordController = async (req, res) => {
    try {
        const {newPassword, passwordResetSessionToken} = req.body;
        const result = await userResetPasswordService(newPassword, passwordResetSessionToken);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}
