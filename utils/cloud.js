import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const deleteImageFromCloudinary = async (publicId) => {
    if (!publicId) {
        console.warn("Cloudinary Deletion: No public ID provided. Skipping deletion.");
        return;
    }
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Cloudinary Deletion Result for", publicId, ":", result);
    } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
    }
};

export const streamUpload = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
            if (result) resolve(result.secure_url);
            else reject(error);
        });
    streamifier.createReadStream(buffer).pipe(stream);
    });
};

export default { streamUpload, deleteImageFromCloudinary };