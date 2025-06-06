import prisma from "../../config/db.js";
import crypto from "crypto";

export const midtransWebhookHandler = async (req, res)  => {
    try {
        const { order_id, transaction_status, status_code, gross_amount, signature_key } = req.body;

        const serverKey = process.env.MIDTRANS_SERVER_KEY;
        const rawSignature = order_id + status_code + gross_amount + serverKey;
        const exceptedSignature = crypto
            .createHash("sha512")
            .update(rawSignature)
            .digest("hex");

            if (signature_key !== exceptedSignature) {
                return res.status(403).json({
                    error: "Invalid signature"
                })
            }
        
            let statusDB;
            switch (transaction_status) {
                case "settlement":
                    statusDB = "success";
                    break;
                case "deny":
                case "cancel":
                case "expire":
                    statusDB = "failed";
                    break;
                case "pending":
                default:
                    statusDB = "pending";
            }

        await prisma.transactions.update({
            where: { order_id: order_id },
            data: { status: statusDB }
        });

        res.status(200).send("Ok");
    } catch (error) {
        console.error("Midtrans webhook error:", error);
        res.status(500).send("Internal Server Error");
    }
}

export default midtransWebhookHandler;