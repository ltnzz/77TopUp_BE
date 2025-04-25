import prisma from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function addNewUser(req, res) {
    try {
        const { email, username, password } = req.body;

        if(!email.endsWith("@gmail.com")) {
            return res.status(400).json({ auth: false, message: "Harap gunakan email dengan domain @gmail.com." });
        }

        const checkEmail = await prisma.users.findUnique({ where: { email } }); //cek email di database

        if(checkEmail) {
            throw new Error("Email ini sudah terdaftar. Silahkan gunakan email lain.");
        }

        const data = await prisma.users.create({ 
            data: { 
                email, 
                username, 
                password: bcrypt.hashSync(password, 10),
                createdat: new Date(),
            },
        }); //buat user baru di database

        if(!data) {
            throw new Error("Gagal memproses permintaan.");
        }

        return res
            .status(201)
            .json({
                auth: true,
                message: "Berhasil membuat akun.",
                data
            });

    } catch(error) {
        return res
            .status(400)
            .json({ 
                auth: false, 
                message: error.message || "Terjadi Kesalahan Server", 
            });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email.endsWith("@gmail.com")) {
            return res
                .status(400)
                .json({ 
                    auth: false, 
                    message: "Harap gunakan email dengan domain @gmail.com." 
                }); 
        }

        if(!email || !password) {
            return res
                .status(400)
                .json({
                    message: "email dan password harus terisi."
                });
        }

        const user = await prisma.users.findUnique({ where: { email } }); //cek email di database

        if(!user) {
            return res
                .status(400)
                .json({
                    message: "email tidak terdaftar."
                });
        }

        const validPassword = await bcrypt.compare(password, user.password); //cek password di database

        if(!validPassword) {
            return res
                .status(401)
                .json({
                    message: "kata sandi tidak valid."
                });
        }

        return res 
            .status(202)
            .json({
                auth: true,
                message: `Selamat Datang, ${user.username}!`,
                username: user.username,
            });

    } catch (error) {
        return res
            .status(500)
            .json({
                auth: false,
                message: "Terjadi kesalahan pada server.",
            });
    }
}

export const admin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email.endsWith("@gmail.com")) {
            return res
                .status(400)
                .json({ 
                    message: "Harap gunakan email dengan domain @gmail.com." 
                }); 
        }

        if(!email || !password) {
            return res
                .status(400)
                .json({
                    message: "email dan password harus terisi."
                });
        }

        const admin = await prisma.admin.findUnique({ where: { email } }); //cek email di database

        if(!admin) {
            return res
                .status(400)
                .json({
                    message: "email tidak terdaftar."
                });
        }

        const validPassword = await bcrypt.compare(password, admin.password); //cek password di database

        if(!validPassword) {
            return res
                .status(401)
                .json({
                    message: "kata sandi tidak valid."
                });
        }

        if(admin.role !== "admin") {
            throw new Error("Anda tidak memiliki akses untuk mengakses halaman ini.");
        }
        
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // generate OTP
        
        const expireat = new Date(Date.now() + 5 * 60 * 1000); // 5 menit

        await prisma.otp.create({
            data: { email, otp, expireat }
        }); //insert data database

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
            text: `Kode OTP Anda : ${otp}.\nKode ini Berlaku Selama 5 Menit.`,
          }); //send email

        return res
            .status(200)
            .json({
                message: "OTP telah dikirimkan ke email Anda."
            });    
    } catch(error) {
        return res
            .status(500)
            .json({
                auth: false,
                message: "Terjadi kesalahan pada server.",
                error
            });
    }
}

export const adminVerify = async (req, res) => {
    try {
        const { email } = req.body;

        const admin = await prisma.admin.findUnique({
            where: {
                email
            }
        }); //find admin by email

        const token = jwt.sign(
                { id: admin.id_admin, role: "admin" },
                process.env.JWT_SECRET,                
                { expiresIn: '12h' }
            ); //token untuk authorization admin (edit) kadaluarsan dalam 12 jam
            
        return res
            .status(202)
            .json({
                auth: true,
                message: `Selamat Datang, ${admin.username}!`,
                token,
            });
    } catch(error) {
        return res
            .status(500)
            .json({
                auth: false,
                message: "Terjadi kesalahan pada server.",
                error
            });
    }
}

export default { addNewUser, login, admin, adminVerify }