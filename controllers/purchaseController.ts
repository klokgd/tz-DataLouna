import { Request, Response } from "express";
import * as purchaseService from "../services/purchaseService";
import { User } from "../models/userModel";

export async function purchaseProduct(req: Request, res: Response) {
    const { productId } = req.body;
    const userId = (req as Request & { user: Pick<User, "id"> }).user.id;

    try {
        const newBalance = await purchaseService.purchaseProduct(
            userId,
            productId
        );

        res.json({ balance: newBalance });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(400).json({ error: "Unknown error occurred" });
        }
    }    
}
