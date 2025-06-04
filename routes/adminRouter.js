import express from "express";
import  { addGame, disableGame, updateGame, enablePackages, deleteGame, addPackageGame, updatePackage, enableGame, disablePackages, deletePackages } from "../controller/adminControlller.js";
import { validateAddGame, validateUpdateGame } from "../middlewares/validation/validation-game.js";
import { getAllGames } from "../controller/gamesController.js";
import upload from "../middlewares/multer.js";
// import multer from "multer";

const router = express.Router();
// const upload = multer({ storage: multer.memoryStorage() });

router.get("/77topup/admin/homepage", getAllGames);
router.post("/77topup/admin/add", upload.single('image'), validateAddGame, addGame);
router.put("/77topup/admin/game/edit", upload.single('image'), validateUpdateGame, updateGame);
router.put("/77topup/admin/edit/game/disable", disableGame);
router.put("/77topup/admin/edit/game/enable", enableGame);
router.delete("/77topup/admin/delete", deleteGame);
router.post("/77topup/admin/package/add", upload.single('image'), addPackageGame);
router.put("/77topup/admin/package/edit", updatePackage);
router.put("/77topup/admin/package/enable", enablePackages);
router.put("/77topup/admin/package/disable", disablePackages);
router.delete("/77topup/admin/package/delete", deletePackages);

export default router;