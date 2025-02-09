import { Request, Response, NextFunction } from "express";
import * as authRepository from "../repositories/authRepository";
import { User } from "../models/userModel";

export async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const token = req.cookies?.token;
    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    const userId = await authRepository.findSession(token);
    if (!userId) {
        res.status(401).json({ error: "Invalid token" });
        return;
    }

    (req as Request & { user: Pick<User, "id"> }).user = {
        id: parseInt(userId),
    };
    next();
}
