import { Request, Response } from "express";
import * as itemService from "../services/itemService";

export async function getMinPrices(req: Request, res: Response): Promise<void> {
    try {
        const items = await itemService.getMinPrices();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch items" });
    }
}
