import prisma from "../config/db.js";

export const searchBar = async (req, res) => {
    const { keyword } = req.query;

    if (!keyword || keyword.trim() === "") {
        return res.status(400).json({
            message: "Keyword tidak boleh kosong."
        })
    }

    try {
        console.log(keyword)
        const games = await prisma.games.findMany({
            where: {
                name: {
                    contains: keyword,
                    mode: "insensitive"
                }
            }
        })

        console.log(games)
        // const packages = await prisma.packages.findMany({
        //     where: {
        //         name: {
        //             contains: keyword,
        //             mode: "insensitive"
        //         }
        //     }
        // })

        // console.log(packages);
        return res.status(200).json({ games });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error", error
        })
    }
}

export default searchBar;