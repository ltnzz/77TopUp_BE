import express from "express";
import { createTransaction } from "../controller/midtransController.js";

const router = express.Router();

router.post("/pay/:package", createTransaction);

export default router;