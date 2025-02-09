import { Request, Response } from "express";
import * as authService from "../services/authService";
import { User } from "../models/userModel";

export async function register(req: Request, res: Response) {
    const { username, password } = req.body;
    if (password.length < 8) {
        res.status(400).json({
            error: "Password must be at least 8 characters long",
        });
        return;
    }
    try {
        const user = await authService.registerUser(username, password);
        res.status(201).json({ id: user.id, username: user.username });
    } catch (error) {
        console.log("error:", error);
        res.status(500).json({ error: "Registration failed" });
    }
}

export async function login(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;

    try {
        const token = await authService.loginUser(username, password);
        if (!token) {
            res.status(401).json({ error: "Invalid credentials" });
        }
        // res.json({ token });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600 * 1000,
            sameSite: "strict",
        });
        res.json({ message: "Login successful" });
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
}

export async function logout(req: Request, res: Response): Promise<void> {
    const token = req.cookies.token;
    if (!token) {
        res.status(400).json({ error: "Token is required" });
        return;
    }

    try {
        await authService.logoutUser(token);
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Logout failed" });
    }
}

export async function changePassword(
    req: Request,
    res: Response
): Promise<void> {
    const { oldPassword, newPassword } = req.body;

    if (newPassword.length < 8) {
        res.status(400).json({
            error: "Password must be at least 8 characters long",
        });
        return;
    }

    if (oldPassword === newPassword) {
        res.status(400).json({
            error: "Old and new passwords must be different",
        });
        return;
    }
    const userId = (req as Request & { user: Pick<User, "id"> }).user?.id;

    try {
        const success = await authService.changePassword(
            userId,
            oldPassword,
            newPassword
        );
        if (!success) {
            res.status(401).json({ error: "Invalid old password" });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Password change failed" });
    }
}
