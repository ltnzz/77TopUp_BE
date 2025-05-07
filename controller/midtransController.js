// import snap from "../utils/midtrans.js";
import prisma from "../config/db.js";

export const createTransaction = async (req, res) => {
    try {
        const { gameid, packageid } = req.body;
        const transaction = await snap.createTransaction({
            transaction_details: {
                order_id: `TRX-${Date.now()}`,
                gross_amount: packageid.price,
            },
            item_details: [
                {
                    id: packageid.id,
                    price: packageid.price,
                    quantity: 1,
                    name: packageid.name,
                },
            ],
        });
        await prisma.transaction.create({
            data: {
                id: transaction.order_id,
                gameid,
                packageid: packageid.id,
                status: transaction.status_code,
            },
        });
        res.json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create transaction" });
    }
};