import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function createJWT(payload) {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
    return token;
}

export function verifyJWT(token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
}