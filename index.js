import express from "express";
import dotenv from "dotenv";
import authRouter from "./route/authRouter.js";
import gameRouter from "./route/gameRouter.js";

dotenv.config();
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRouter);
app.use(gameRouter);

app.listen(PORT, async () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
