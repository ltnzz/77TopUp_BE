import client from "../../config/redis.js";
import nodemailer from "nodemailer";

export const sendOTP = async (req, res, next) => {
    try {
        const { email } = req.body;

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // generate OTP

        await client.set(`otp:${email}`, otp, { EX: 300 }); //simpan di redis dan simpan selama 5 menit
    
        const transporter = nodemailer.createTransport({ 
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_FROM,
                pass: process.env.EMAIL_PASSWORD
            }
        }); //config send email
        
        await transporter.sendMail({
            from: `"77Topup" <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: 'Kode OTP',
            text: `Kode OTP Anda:\n\n${otp}\n\nKode ini Berlaku Selama 5 Menit.`,
        }); //send email
    
    next();
    } catch (error) {
        console.error(error)
        return res
        .status(500)
        .json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

export default sendOTP;
