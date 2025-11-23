import { userRegistrationService, userRegisterCodeVerifyService, userLoginService, userLoginVerificationService } from '../services/userAuthServices.js'

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

