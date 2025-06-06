import express from "express";
import { createTransaction } from "../controller/midtransController.js";
import midtransWebhookHandler from "../middlewares/validation/midtransWebhook.js";

const router = express.Router();

router.post("/pay/:timestamp", createTransaction);
router.post("/midtrans-webhook", midtransWebhookHandler);

export default router;