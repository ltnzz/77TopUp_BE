import express from "express";
import { getAllGames, getDetailGame, getAllPayment } from "../controller/gamesController.js";

const router = express.Router();

router.get("/77topup/homepage", getAllGames);
router.get("/77topup/:slug", getDetailGame, getAllPayment);

export default router;