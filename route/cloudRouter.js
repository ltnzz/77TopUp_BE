import express from "express";
import upload from "../middlewares/multer.js";
import { streamUpload } from "../utils/cloud.js";

const router = express.Router();

router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const fileBuffer = req.file.buffer;
        const imageURL = await streamUpload(fileBuffer);

        res.json({ success: true, url: imageURL });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

export default router;