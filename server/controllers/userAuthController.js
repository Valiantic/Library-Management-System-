import { updateUserService, toggleUserStatusService, getStudentInfoService } from '../services/userAuthServices.js';
// ADMIN UPDATE USER CONTROLLER
export const updateUserController = async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await updateUserService(userId, req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ADMIN TOGGLE USER STATUS CONTROLLER (Archive/Unarchive)
export const toggleUserStatusController = async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await toggleUserStatusService(userId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
import { addUserService } from '../services/userAuthServices.js';
import { getAllUsersService } from '../services/userAuthServices.js';
import { userRegistrationService, userRegisterCodeVerifyService, userLoginService, userForgotPasswordRequestService, userForgotPasswordVerificationService, userResetPasswordService, updateStudentPasswordService } from '../services/userAuthServices.js'
import Users from '../model/User.js';

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

// DISPLAY FIRSTNAME AND LASTNAME ON PAGES
export const userMeController = async (req, res) => {
    try {
        if (!req.user || !req.user.ID) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        // Fetch user from DB using ID from JWT
        const user = await Users.findByPk(req.user.ID, {
            attributes: ['firstName', 'lastName', 'role', 'emailAddress', 'userName']
        });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// GET ALL USERS CONTROLLER
export const getAllUsersController = async (req, res) => {
    try {
        // Optionally, add admin check here if needed: if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden' });
        const result = await getAllUsersService();
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ADMIN ADD USER CONTROLLER (no OTP)
export const addUserController = async (req, res) => {
    try {
        // Optionally, check if req.user.role is admin
        const result = await addUserService(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const updateStudentPasswordController = async (req, res) => {
    try {
        const { ID } = req.user;
        const {currentPassword, newPassword} = req.body;
        const result = await updateStudentPasswordService(ID, currentPassword, newPassword);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}


export const getStudentInfoController = async (req, res) => {
    try {
        const { ID } = req.user;
        const result = await getStudentInfoService(ID);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}