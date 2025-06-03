import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { openApiSpec } from "../swagger.js";

import authRouter from "../routes/authRouter.js";
import gameRouter from "../routes/gameRouter.js";
import adminRouter from "../routes/adminRouter.js";
import searchBarRouter from "../routes/searchBarRouter.js";
import cloudRouter from "../routes/cloudRouter.js";
import midtransRouter from "../routes/midtrans.js"

import cors from "cors";
import cron from "../utils/cleanOtp.js";

dotenv.config();
const app = express();
const PORT = 3000;

const allowedOrigin = process.env.FE_ORIGIN || "http://localhost:7700";

app.use(
    cors({
        origin: allowedOrigin,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type: multipart/form-data", "Authorization"],
        credentials: true
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.get("/", (req, res) => res.send("Hello, Vercel!"));

app.use('/', authRouter);
app.use('/', gameRouter);
app.use('/', adminRouter);
app.use('/', searchBarRouter);
app.use(cloudRouter);
app.use('/', midtransRouter);

console.log("Swagger spec loaded:", !!openApiSpec);
console.log("Type of spec:", typeof openApiSpec);
console.log("Is spec an object?", typeof openApiSpec === 'object' && openApiSpec !== null);

app.listen(PORT, async () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    console.log(`Swagger UI tersedia di http://localhost:${PORT}/api-docs`);
});
