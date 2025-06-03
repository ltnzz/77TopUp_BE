import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { openApiSpec } from "../docs/swagger.js";

import path from "path"; 
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
const PORT = process.env.PORT || 3000;

const allowedOrigin = process.env.FE_ORIGIN || "http://localhost:7700";

app.use(
    cors({
        origin: allowedOrigin,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const publicPath = path.join(__dirname, '..', 'public'); 
app.use(express.static(publicPath));

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.get("/", (req, res) => res.send("Hello, Vercel!"));

app.use(
    "/api-docs", 
    swaggerUi.serve,
    swaggerUi.setup(openApiSpec, {
        // Arahkan Swagger UI ke aset di folder public
        customCssUrl: '/swagger-ui.css',
        customJs: [
            '/swagger-ui-bundle.js',
            '/swagger-ui-standalone-preset.js',
        ],
        customJsLoader: '/swagger-ui-init.js',
    })
);


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
