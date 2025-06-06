import express from "express";
import { getAllGames, getDetailGame } from "../controller/gamesController.js";

const router = express.Router();

router.get("/77topup/homepage", getAllGames);
router.get("/77topup/:ihsangan_slug", getDetailGame);

export default router;