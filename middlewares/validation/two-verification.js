import prisma from "../../config/db.js";

export const otpVerify = async (req, res, next) => {
        try {
        const { email, otp } = req.body;

        const otpRecord = await prisma.otp.findFirst({
            where: {
                email,
                otp,
                expireat: {
                    gt: new Date()
                }
            }
        }); //cari otp di database

        if(!otpRecord) {
            return res
                .status(401)
                .json({
                    message: "Invalid OTP",
                }); 
        }

        await prisma.otp.deleteMany({ where: { email } }); //delete otp yang sudah kadaluarsa

        next();
        } catch (error) {
            return res
                .status(500)
                .json({
                    message: "Internal Server Error",
                })
        }
}

export default otpVerify;