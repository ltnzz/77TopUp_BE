import express from "express";
import validateCreateUser from "../middlewares/validation/create-user-validation.js";
import verifyToken from "../middlewares/validation/verify-token.js";
import verifyOTP from "../middlewares/validation/verificationOTP.js";
import sendOTP from "../middlewares/validation/two-verification.js";
import { addNewUser, login, admin, adminVerify } from "../controller/authController.js";

const router = express.Router();

router.post("/77topup/sign-up", validateCreateUser, addNewUser);
router.post("/77topup/sign-in", login);
router.post("/77topup/admin/login", sendOTP, admin);
router.post("/77topup/admin/verify", verifyOTP, adminVerify, verifyToken);

export default router;