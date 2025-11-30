import jwt from 'jsonwebtoken';
import crypto from 'crypto'

export const createToken = (ID) => {
    return jwt.sign({ID}, process.env.JWT_SECRET)
}

export const generatePasswordResetToken = () => {
    return crypto.randomBytes(32).toString('hex'); // passwordResetToken
} 
