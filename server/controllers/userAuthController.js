import { userRegistrationService, userRegisterCodeVerifyService } from '../services/userAuthServices.js'

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

