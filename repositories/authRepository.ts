import pool from "../config/db";
import redisClient from "../config/redis";
import { User } from "../models/userModel";

export async function createUser(
    username: string,
    passwordHash: string
): Promise<User> {
    const query = `
        INSERT INTO users (username, password_hash)
        VALUES ($1, $2)
        RETURNING id, username
    `;
    const values = [username, passwordHash];

    const { rows } = await pool.query(query, values);
    return rows[0];
}

export async function saveSession(userId: number,
    token: string): Promise<void> {
    await redisClient.set(`session:${token}`, userId.toString(), {
        EX: +(process.env.SESSION_EXPIRATION || '3600'),
    });
}

export async function deleteSession(token: string): Promise<void> {
    await redisClient.del(`session:${token}`);
}

export async function findSession(token: string): Promise<string | null> {
    return await redisClient.get(`session:${token}`);
}

export async function findUserByUsername(
    username: string
): Promise<User | null> {
    const query = `
        SELECT * FROM users WHERE username = $1
    `;
    const values = [username];

    const { rows } = await pool.query(query, values);
    return rows[0] || null;
}

export async function findUserById(
    id: number
): Promise<User | null> {
    const query = `
        SELECT * FROM users WHERE id = $1
    `;
    const values = [id];

    const { rows } = await pool.query(query, values);
    return rows[0] || null;
}

export const updatePassword = async (
    userId: number,
    newPasswordHash: string
): Promise<void> => {
    const query = `
        UPDATE users SET password_hash = $1 WHERE id = $2
    `;
    const values = [newPasswordHash, userId];

    await pool.query(query, values);
};
