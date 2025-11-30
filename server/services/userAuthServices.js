import bcrypt from 'bcrypt';
import Users from '../model/User.js';
import { generateVerificationCode } from '../utils/codeGenerator.js';
import { sendMail } from '../utils/mailer.js';
import { validateEmail, validatePassword } from '../validators/userValidator.js';
import { registrationEmailTemplate, resetPasswordEmailTemplate } from '../views/emailTemplates.js';
import { createToken, generatePasswordResetToken } from '../utils/token.js'
 

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


// USER FORGOT PASSWORD REQUEST
export const userForgotPasswordRequestService = async (emailAddress) => {
    try {

        const user = await Users.findOne({ where: { emailAddress } });


        if (!user) {
            return {
                success: false,
                message: 'Please try again with another email.'
            }
        }

        const verificationCode = generateVerificationCode();
        const expirationTime = new Date(Date.now() + 30 * 60 * 1000); 

        // Send email verification code
        await sendMail({
            to: user.emailAddress,
            subject: 'Reset Password Verification',
            html: resetPasswordEmailTemplate(user.userName, verificationCode),
        });

        // Update User Data
        await user.update({
            verificationCode,
            codeExpiresAt: expirationTime
        })

        // SUCCESSFULLY SENT
        return { 
            success: true, 
            message: `A verification code has been sent to your email address. Please check your inbox.`,
        };

    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

// USER FORGOT PASSWORD VERIFICATION 
export const userForgotPasswordVerificationService = async (verificationCode) => {
    try {

        const user = await Users.findOne({where: {verificationCode}});

        if (!user) {
            return {
                success: false,
                message: 'Invalid verification code.'
            };
        }

        if (new Date() > user.codeExpiresAt) {
            await user.update({ 
                verificationCode: null,
                codeExpiresAt: null
            });
            return { 
                success: false,
                message: 'Verification code has expired. Please request a new one.',
                codeExpired: true
            };
        }

        const passwordResetSessionToken = generatePasswordResetToken();

        await user.update({
            passwordResetSessionToken
        });

        return { 
            success: true, 
            message: 'Code verified successfully!',
            passwordResetSessionToken 
        };

    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

// RESET FORGOT PASSWORD 
export const userResetPasswordService = async (newPassword, passwordResetSessionToken) => {
    try {
        if (!passwordResetSessionToken) {
            return {
                success: false,
                message: 'Forgot password session has expired. Please restart the process.'
            }
        }

        const user = await Users.findOne({where: { passwordResetSessionToken }});
        if (!user) {
            return {
                success: false,
                message: 'Forgot password session has expired. Please restart the process.',
            }
        }

        if (new Date() > user.codeExpiresAt) {
            await user.update({ 
                verificationCode: null,
                codeExpiresAt: null,
                passwordResetSessionToken: null
            });
            return { 
                success: false,
                message: 'Verification code has expired. Please request a new one.',
            };
        }

         const passwordError = validatePassword(newPassword);
        if (passwordError) {
            return { 
                success: false,
                message: passwordError
            };
        }

        // HASHING NEW PASSWORD
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await user.update({
            password: hashedPassword,
            verificationCode: null,
            codeExpiresAt: null,
            passwordResetSessionToken: null
        })

        return { 
            success: true, 
            message: 'Password updated successfully!' 
        };

    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}