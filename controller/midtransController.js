import snap from "../utils/midtrans.js";
import prisma from "../config/db.js";

export const createTransaction = async (req, res) => {
    try {
        const { id_packages, username, email } = req.body;

        const selectedPackage = await prisma.packages.findUnique({ where: { id_packages: id_packages } })

        const selectedUsername = await prisma.users.findFirst({ where: { username: username } })

        const selectedEmail = await prisma.users.findFirst({ where: { email: email } })

        if(!selectedPackage) {
            return res.status(404).json({ message: "Package not found" })
        }
        
        if (!email || !email.includes("@")) {
            return res.status(400).json({ error: "Email tidak valid" });
        }

        const customerEmail = email && email.includes("@") ? email : "guest@example.com";

        const basePrice = selectedPackage.price;
        const tax = Math.round(basePrice * 0.12);
        const total = basePrice + tax;

        const itemDetails = [
            {
                id: selectedPackage.id,
                name: selectedPackage.name,
                price: basePrice,
                quantity: 1
            },
            {
                id: "PPN",
                name: "PPN 12%",
                price: tax,
                quantity: 1
            }
        ];

        const parameter = {
            transaction_details: {
                order_id: `ORDER-${Date.now()}`,
                gross_amount: total,
            },
            customer_details: {
                first_name: selectedUsername || "Guest",
                email: email || selectedEmail || customerEmail
            },
            item_details: itemDetails,
        };
    // const saveTransactions = await prisma.packages.create({
    //     data: {
    //         id: id_packages,

    //     }
    // })
    const transaction = await snap.createTransaction(parameter);

    console.log(transaction);
        res.json({
            // token: transaction.token,
            redirect_url: transaction.redirect_url,
            message: `Transaction created successfully`
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        })
    }
};

export default {createTransaction};