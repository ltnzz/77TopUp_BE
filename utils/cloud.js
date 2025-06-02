import cloudinary from "../config/cloudinary.js";

const uploadImage = async (path, folderName = "misc") => {
    try {
        const result = await cloudinary.uploader.upload(path, {
            folder: folderName
        })
        return result.secure_url;
    } catch (error) {
        console.error(error);
        throw new Error('Upload Failed');
    }
}

export default uploadImage
