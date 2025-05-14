import express from "express";
import multer from "multer";
import uploadImage from "../utils/cloud.js";

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // upload settings

router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const filePath = req.file.path;
        const imageURL = await uploadImage(filePath);

        res.json({ success: true, url: imageURL });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

export default router;