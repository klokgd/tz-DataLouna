import pool from '../config/db';
import { User } from '../models/userModel';

export async function findUserById(userId: number): Promise<User | null> {
    const query = "SELECT * FROM users WHERE id = $1";
    const values = [userId];
    const { rows } = await pool.query<User>(query, values);
    return rows[0] || null;
}

export async function updateUserBalance(
    userId: number,
    newBalance: number
): Promise<void> {
    const query = "UPDATE users SET balance = $1 WHERE id = $2";
    const values = [newBalance, userId];
    await pool.query(query, values);
}