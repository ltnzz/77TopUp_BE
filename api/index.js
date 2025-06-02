import express from "express";
import dotenv from "dotenv";

import authRouter from "../route/authRouter.js";
import gameRouter from "../route/gameRouter.js";
import adminRouter from "../route/adminRouter.js";
import searchBarRouter from "../route/searchBarRouter.js";
import cloudRouter from "../route/cloudRouter.js";
import midtransRouter from "../route/midtrans.js"

import cors from "cors";
import cron from "../utils/cleanOtp.js";

dotenv.config();
const app = express();
const PORT = 3000;

const allowedOrigin = process.env.FE_ORIGIN || "http://localhost:7700";

app.use(
    cors({
        origin: allowedOrigin,
        method: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type: multipart/form-data", "Authorization"],
        credentials: true
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Hello, Vercel!"));

app.use('/auth', authRouter);
app.use('/game', gameRouter);
app.use('/admin', adminRouter);
app.use('/search', searchBarRouter);
app.use(cloudRouter);
app.use('/pay', midtransRouter);

app.listen(PORT, async () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
