import express from "express";
import dotenv from "dotenv";
import authRouter from "./route/authRouter.js";
import gameRouter from "./route/gameRouter.js";
import adminRouter from "./route/adminRouter.js";
import searchBarRouter from "./route/searchBarRouter.js";

dotenv.config();
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRouter);
app.use(gameRouter);
app.use(adminRouter);
app.use(searchBarRouter);


app.listen(PORT, async () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});