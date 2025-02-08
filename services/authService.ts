import * as authRepository from '../repositories/authRepository';
import { User } from '../models/userModel';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export async function registerUser(username: string, password: string): Promise<User> {
    const passwordHash = await hashPassword(password);
    const user = await authRepository.createUser(username, passwordHash);
    return user;
}

export async function loginUser(username: string, password: string): Promise<string | null> {
    const user = await authRepository.findUserByUsername(username);
    if (!user) return null;

    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) return null;

    const token = generateToken();
    await authRepository.saveSession(user.id, token);

    return token;
}

export async function logoutUser(token: string): Promise<void> {
    await authRepository.deleteSession(token);
}

export async function changePassword(userId: number, oldPassword: string, newPassword: string): Promise<boolean> {
    const user = await authRepository.findUserById(userId);
    if (!user) return false;

    const isPasswordValid = await comparePassword(oldPassword, user.password_hash);
    if (!isPasswordValid) return false;

    const newPasswordHash = await hashPassword(newPassword);
    await authRepository.updatePassword(user.id, newPasswordHash);

    return true;
}



async function hashPassword(password: string): Promise<string> {
    const saltRounds = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10;
    return await bcrypt.hash(password, saltRounds);
}

async function comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}

function generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
}