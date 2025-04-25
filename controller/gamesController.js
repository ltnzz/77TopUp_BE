import prisma from "../config/db.js";

export const getAllGames = async (req, res) => {
    try {
        const games = await prisma.games.findMany({
            select: {
                name: true,
                image: true,
            }
        });

        return res
            .status(200)
            .json({
                games
            });
    } catch(error) {
        return res
            .status(500)
            .json({
                message: "Internal Server Error"
            });
    }
}

export const getDetailGame = async (req, res) => {
    const { slug } = req.params;
    try {
        const game = await prisma.games.findUnique({
            where: { slug },
            include: {
              packages: true,
              game_payments: {
                include: {
                    payments: true
                }
              }
            }
          });
          

        if(!game) {
            return res
                .status(404)
                .json({
                    message: "Sedang dalam Maintanance"
                });
        }
        return res
            .status(200)
            .json({
                game: {
                    name: game.name,
                    slug: game.slug,
                    image: game.image,
                },
                packages: game.packages,
                payments: game.game_payments.map(gp => gp.payments)
            });
    } catch(error) {
        return res
            .status(500)
            .json({
                message: "Internal Server Error",
                error: error.message
            });
    }
}

export const getAllPayment = async (req, res) => {
    try {
        const methodPayment = await prisma.payment.findMany({
            where: {
                isactive: true,
            },
            select:{
                name: true,
                code: true,
                image: true
            }
        });

        return res
            .status(200)
            .json({
                payment: methodPayment
            })
    } catch(error) {
        return res
            .status(500)
            .json({
                message: "Internal Server Error",
                error: error.message
            })
    }
}

// export const transactions = async (req, res) => {
//     try {
//         const { order_id, amount, email } = req.body;

//         const params = {
//             transaction_details: {
//                 order_id: order_id,
//                 gross_amount: amount
//             },
//             customer_details: {
//                 email
//             }
//         };

//         const transaction = await snap.createTransaction(params);

//         return res
//             .status(200)
//             .json({
//                 message: "Transaksi sedang diproses",
//                 redirect_url: transaction.redirect_url
//             });
//     } catch(error) {
//         console.error(error);
//         return res
//             .status(500)
//             .json({
//                 message: "Internal Server Error",
//                 error: error.message || error
//             });
//     }
// }

export default { getAllGames, getDetailGame, getAllPayment };