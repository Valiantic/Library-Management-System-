import bcrypt from 'bcrypt';
import Users from '../model/User.js';
import { generateVerificationCode } from '../utils/codeGenerator.js';
import { sendMail } from '../utils/mailer.js';
import { validateEmail, validatePassword } from '../validators/userValidator.js';
import { registrationEmailTemplate, loginEmailTemplate, resetPasswordEmailTemplate } from '../views/emailTemplates.js';
import { createToken } from '../utils/token.js'
 

// USER REGISTRATION INPUT
let tempUserData = {};
export const userRegistrationService = async (firstName, lastName, emailAddress, userName, password) => {
    try {
        const passwordError = validatePassword(password);

        if (!firstName || !lastName || !emailAddress || !userName || !password) {
            return { 
                success: false, 
                message: "Please complete all fields to proceed with account creation." 
            };
        }

        if (!validateEmail(emailAddress)) {
            return { 
                success: false, 
                message: "Invalid email format." 
            };
        }

        if (passwordError) {
            return { 
                success: false, 
                message: passwordError 
            };
        }

        // Check existing email
        const existingEmail = await Users.findOne({ where: { emailAddress } });
        if (existingEmail) {
            return { 
                success: false, 
                message: "This email is already registered."
            };
        }


        // Check existing username
        const existingUserName = await Users.findOne({ where: { userName } });
        if (existingUserName) {
            return { 
                success: false, 
                message: "This username is already in use! Please try another one." 
            };
        }
        
        
        // Generate verification code
        const verificationCode = generateVerificationCode();
        const codeExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

        // Registration Key
        const registerKey = emailAddress;

        tempUserData[registerKey] = {
            firstName, 
            lastName, 
            emailAddress, 
            userName, 
            password,
            verificationCode,
            codeExpiresAt
        }

        // Send email verification code
        await sendMail({
            to: emailAddress,
            subject: 'Account Verification',
            html: registrationEmailTemplate(verificationCode),
        });
        
        return {
            success: true,
            message: "Verification code sent to your email",
            registerKey,
        };
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }

}

// USER REGISTRATION VERIFICATION CODE
export const userRegisterCodeVerifyService = async (registerKey, verificationCode) => {
    try {
        const userData = tempUserData[registerKey];
        if (!userData) {
            return { 
                success: false, 
                message: "Verification expired or not initiated. Please try again." 
            };
        }

        if (userData.verificationCode !== verificationCode) {
            return { 
                success: false, 
                message: "Invalid verification code." 
            };
        }

        if (new Date() > userData.codeExpiresAt) {
            delete tempUserData[registerKey];
            return { 
                success: false, 
                message: "Verification code expired. Please register again." 
            };
        }

        // HASH PASSWORD
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        // SAVE NEW USER
        const newUser = await Users.create({
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: "student",
            emailAddress: userData.emailAddress,
            userName: userData.userName,
            password: hashedPassword,
            verifiedUser: true,
            verificationCode: null,       
            codeExpiresAt: null   
        });

        // CREATE TOKEN
        const authToken = createToken(newUser.userId);

        // CLEAN TEMP DATA
        delete tempUserData[registerKey];

        return {
            success: true,
            message: "Account created successfully. You may now log in.",
            token: authToken
        };

    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
};
