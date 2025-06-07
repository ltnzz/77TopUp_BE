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
import midtransRouter from "../routes/midtransRouter.js"

import cors from "cors";
import cron from "../utils/cleanOtp.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigin = ["https://77-top-up-fe.vercel.app", "http://localhost:7700"];

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

// app.get("/", (req, res) => res.send("Hello, Vercel!"));

app.get("/", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>77TopUp Backend</title>
            <link rel="icon" href="/favicon.ico" type="image/x-icon">
            <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />
            <link rel="icon" type="image/png" href="/favicon-16x16.png" href="/favicon-16x16.png" sizes="16x16" />
            </head>
        <body>
            <h1>Hello, Vercel!</h1>
            <p>Your 77TopUp Backend is running.</p>
            <p>API Documentation: <a href="/api-docs">/api-docs</a></p>
            <img src="/favicon-32x32.png" alt="Gambar Contoh">
        </body>
        </html>
    `);
});

const swaggerUiDistPath = path.join(__dirname, '..', 'node_modules', 'swagger-ui-dist');
app.use('/swagger-assets-dist', express.static(swaggerUiDistPath));

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.use(
    "/api-docs", 
    swaggerUi.serve,
    swaggerUi.setup(openApiSpec, {
        customCssUrl: '/swagger-assets-dist/swagger-ui.css',
        customJs: [
            '/swagger-assets-dist/swagger-ui-bundle.js',
            '/swagger-assets-dist/swagger-ui-standalone-preset.js',
        ],
        customJsLoader: '/swagger-assets-dist/swagger-ui-init.js',
        favicon: '/swagger-assets-dist/favicon-32x32.png', 
    })
);

app.use('/', authRouter);
app.use('/', gameRouter);
app.use('/', adminRouter);
app.use('/', searchBarRouter);
app.use(cloudRouter);
app.use('/', midtransRouter);

// console.log("Swagger spec loaded:", !!openApiSpec);
// console.log("Type of spec:", typeof openApiSpec);
// console.log("Is spec an object?", typeof openApiSpec === 'object' && openApiSpec !== null);

app.listen(PORT, async () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    console.log(`Swagger UI tersedia di http://localhost:${PORT}/api-docs`);
});
