import prisma from "../config/db.js";

export const getAllGames = async (req, res) => {
    try {
        const games = await prisma.games.findMany({
            where: { isactive: true },
            select: {
                name: true,
                image: true,
                slug: true,
                type: true,
                isactive: true
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
        const game = await prisma.games.findFirst({
            where: { slug, isactive: true },
            include: {
              packages: true,
            }
          });
          

        if(!game) {
            return res
                .status(404)
                .json({
                    message: "Game sedang dalam maintanance"
                });
        }
        return res
            .status(200)
            .json({
                game: {
                    name: game.name,
                    slug: game.slug,
                    image: game.image,
                    isactive: game.isactive,
                },
                packages: game.packages,
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

export default { getAllGames, getDetailGame };