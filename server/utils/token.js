import jwt from 'jsonwebtoken';

export const createToken = (ID) => {
    return jwt.sign({ID}, process.env.JWT_SECRET)
}