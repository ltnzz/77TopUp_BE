import client from "../../config/redis.js";

export const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        
        const isBlocked = await client.get(`otp-blocked:${email}`);
        if (isBlocked) {
            return res.status(403).json({
                message: "Terlalu banyak percobaan gagal."
            });
        }

        const saveOTP = await client.get(`otp:${email}`) ;
        if (!saveOTP) {
            return res.status(400).json({
                message: "OTP tidak ditemukan atau sudah kadaluarsa."
            });
        }

        if (otp !== saveOTP) {
            const key  = `otp=attempt:${email}`;
            const attempt = await client.incr(key);

        if (attempt === 1) {
            await client.expire(key, 3600);
        }
        if (attempt >= 3) {
            await client.set(`otp-blocked:${email}`, "true", { EX: 3600 });
            await client.del(key);
            return res.status(403).json({                    
                message: "Terlalu banyak percobaan gagal."
            })
        }
        return res.status(401).json({
                message: `OTP invalid. Percobaan ke-${attempt} dari 3 kali.`
            });
        }

        await client.del(`otp:${email}`);
        await client.del(`otp-attempt:${email}`);

        next();
    } catch (error) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

export default verifyOTP;