import bcrypt from 'bcrypt';
import Users from '../model/User.js';
import { generateVerificationCode } from '../utils/codeGenerator.js';
import { sendMail } from '../utils/mailer.js';
import { validateEmail, validatePassword } from '../validators/userValidator.js';
import { registrationEmailTemplate, loginEmailTemplate, resetPasswordEmailTemplate } from '../views/emailTemplates.js';
import { createToken, generateLoginToken } from '../utils/token.js'
 

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

// USER LOGIN PROCESS
export const userLoginService = async (userName, password) => {
    try {

        const user = await Users.findOne({where: { userName }})

        if (!user) {
            return {success: false, message: 'Your account and/or password is incorrect, please try again'};
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return {success: false, message: 'Your account and/or password is incorrect, please try again'};
        }
        
        // Generate Codes
        const loginSessionToken = generateLoginToken();
        const verificationCode = generateVerificationCode();
        const expirationTime = new Date(Date.now() + 10 * 60 * 1000); 
        await user.update({
            verificationCode,
            codeExpiresAt: expirationTime,
            loginSessionToken
        })

        // Send email (or SMS if phone)
        if (user.emailAddress) {
            await sendMail({
            to: user.emailAddress,
            subject: 'Login Verification Code',
            html: loginEmailTemplate(user.userName, verificationCode),
            });
        }

        return {
            success: true, 
            message: 'Verification code sent. Please enter the code to complete login.',
            loginSessionToken // Process this to frontend local storage
        };
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

// USER LOGIN VERIFICATON CODE
export const userLoginVerificationService = async (loginSessionToken, verificationCode) => {
    try {
        if (!loginSessionToken || !verificationCode) {
            return {
                success: false,
                message: 'Verification failed. Login session or verification code may have expired. Please try logging in again.'
            }
        }

        const user = await Users.findOne({ where: { loginSessionToken } });
        if (!user) {
            return {
                success: false,
                message: 'Expired login session. Please log in again.'
            }
        }

        if (user.verificationCode !== verificationCode) {
            return {
                success: false,
                message: 'Invalid verification code.'
            }
        }

        if (new Date() > user.codeExpiresAt) {
            await user.update({ 
                verificationCode: null, 
                codeExpiresAt: null,
                loginSessionToken: null,
            });
            return {
                success: false,
                message: 'Verification code expired. Please log in again.',
            }
        }

        // Clear all after sucessfully validated
        await user.update({ 
            verificationCode: null, 
            codeExpiresAt: null, 
            loginSessionToken: null 
        });

        // Create token
        const authToken = createToken(user.userId);

        return {
            success: true,
            message: 'Login successfully!',
            token: authToken,
        };
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}
