import express from "express";
import * as purchaseController from "../controllers/purchaseController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authenticate, purchaseController.purchaseProduct);

export default router;
