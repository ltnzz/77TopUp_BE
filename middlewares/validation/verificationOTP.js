import prisma from "../../config/db.js";

export const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email dan OTP wajib diisi" });
        }

        const saveOTP = await prisma.otp.findFirst({
            where: { email },
            orderBy: { createdat: "desc" },
        });

        if (!saveOTP) {
            return res.status(400).json({ message: "OTP tidak ditemukan atau kadaluarsa." });
        }

        if (saveOTP.cooldownuntil && new Date() < saveOTP.cooldownuntil) {
            const diff = saveOTP.cooldownuntil - new Date();
            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            return res.status(403).json({
                message: `Terlalu banyak percobaan. Coba lagi setelah ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
            });
        }

        if (saveOTP.isVerified) {
            return res.status(400).json({ message: "OTP sudah digunakan" });
        }

        if (new Date() > saveOTP.expireat) {
            return res.status(400).json({ message: "OTP sudah kadaluarsa" });
        }

        if (otp !== saveOTP.otp) {
            const attempt = saveOTP.attempt + 1;
            const cooldown = attempt >= 3 ? new Date(Date.now() + 60 * 60 * 1000) : null;

            await prisma.otp.update({
                where: { id_otp: saveOTP.id_otp },
                data: {
                    attempt,
                    cooldownuntil: cooldown
                }
            });

            if (attempt >= 3) {
                return res.status(403).json({ message: "Terlalu banyak percobaan. Coba lagi setelah 1 jam" });
            }

            return res.status(401).json({ message: `OTP salah. Percobaan ke-${attempt} dari 3` });
        }

        await prisma.otp.delete({ where: { id_otp: saveOTP.id_otp } });

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default verifyOTP;
