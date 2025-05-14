import prisma from '../config/db.js';
import generateUniqueSlug from '../utils/slugify.js';
import uploadImage from '../utils/cloud.js';

export const addGame = async (req, res) => {
    try {
        const { name, description, image, type } = req.body;
    
        const checkGame = await prisma.games.findFirst({ where: {name} });
        if(checkGame) {
            return res.status(400).json({
                message: "Game already exists",
            })
        }

        const slug = await generateUniqueSlug(name, "games");

        let imageURL = "";
        if(req.file) {
            imageURL = await uploadImage(req.file.path, "games");
        }
        
        const game = await prisma.games.create({
            data: {
                name, 
                slug, 
                description: description || "", 
                image: imageURL  || "", 
                type
            }
        })

        res.status(201).json(game);
    } catch(err) {
        console.error(err);
        res.status(500).json({
            message: 'Internal Server Error', error: err
        })
    }
}

export const updateGame = async (req, res) => {
    try {
        const { id_game, name, description, image, type } = req.body;

        const game = await prisma.games.findUnique({ where: { id_game } });
        if (!game) {
            return res.status(404).json({
                message: "Game tidak ditemukan."
            })
        }

        if(
            game.name === name &&
            game.description === description &&
            game.image === image &&
            game.type === type
        ) {
            return res.status(400).json({
                message: "Tidak ada perubahan data."
            })
        }

        const updateGame = await prisma.games.update({
            where: { id_game },
            data: {
                name,  
                description: description || "", 
                image: image  || "", 
                type,
                updatedat: new Date()
            }
        });

        res.status(200).json({
            message: "Game updated successfully",
            updateGame
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({
            message: 'Internal Server Error', error: err
        })
    }   
}

export const disableGame = async (req, res) => {
    try {
        const { id_game } = req.body;

        if(!id_game) {
            return res.status(400).json({
                message: "Harap isi ID Game."
            })
        }

        const game = await prisma.games.findUnique({ where: { id_game } });
        if (!game) {
            return res.status(404).json({
                message: "Game tidak ditemukan."
            })
        }

        
        if (game.isactive === false) {
            return res.status(400).json({
                message: "Game sudah dinonaktifkan"
            })
        }

        const disableGame = await prisma.games.update({
            where: { id_game },
            data: { isactive: false, updatedat: new Date() }
        })

        return res.status(200).json({
            message: "Game berhasil dinonaktifkan.",
            disableGame
        })
    } catch(err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error",
            error: err
        })
    }
}

export const enableGame = async (req, res) => {
    try {
        const { id_game } = req.body;

        if(!id_game) {
            return res.status(400).json({
                message: "Harap isi ID Game."
            })
        }

        const game = await prisma.games.findUnique({ where: { id_game } });
        if (!game) {
            return res.status(404).json({
                message: "Game tidak ditemukan."
            })
        }

        if (game.isactive === true) {
            return res.status(400).json({
                message: "Game sudah diaktifkan"
            })
        }

        const sableGame = await prisma.games.update({
            where: { id_game },
            data: { isactive: true, updatedat: new Date() }
        })

        return res.status(200).json({
            message: "Game berhasil diaktifkan.",
            sableGame
        })
    } catch(err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error",
            error: err
        })
    }
}

export const deleteGame = async (req, res) => {
    try {
        const { id_game } = req.body;

        if(!id_game) {
            return res.status(400).json({
                message: "Harap isi ID Game."
            })
        }

        const game = await prisma.games.findUnique({ where: { id_game } });
        if (!game) {
            return res.status(404).json({
                message: "Game tidak ditemukan."
            })
        }

        const deleteGame = await prisma.games.delete({
            where: { id_game },
        });

        return res.status(200).json({
            message: "Game berhasil dihapus.",
            deleteGame
        })
    } catch(err) {
        console.error(req.body.games);
        return res.status(500).json({
            message: "Internal Server Error",
            error: err
        })
    }
}

export const addPackageGame = async (req, res) => {
    try {
        const { gameid, name, price, tag, image, description } = req.body;

        if (!gameid || !name || !price || !image) {
            return res.status(400).json({
                message: "Harap isi semua field yang diperlukan (gameid, name, price, image)."
            });
        }

        const existingPackage = await prisma.packages.findFirst({
            where: {
              name,
              gameid
            }
          });
          
          if (existingPackage) {
            return res.status(400).json({
              message: "Package dengan nama yang sama sudah ada di game ini."
            });
          }

        const game = await prisma.games.findUnique({ where: { id_game: gameid } });
        if (!game) {
            return res.status(400).json({
                message: "Game tidak ditemukan."
            });
        }

        const priceFloat = parseFloat(price);

        let imageURL = "";
        if(req.file) {
            imageURL = await uploadImage(req.file.path, "packages");
        }

        const newPackage = await prisma.packages.create({
            data: {
                gameid,
                name,
                price: priceFloat,
                image: imageURL,
                tag: tag || "",
                description: description || "",
            }
        });

        return res.status(201).json({
            message: `Package berhasil ditambahkan pada game ${gameid}.`,
            newPackage
        });
    } catch(err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error",
            error: err
        })
    }
}

export const updatePackage = async (req, res) => {
    try {
        const  {id_packages, name, price, tag, image, description } = req.body;

        const packages = await prisma.packages.findUnique({where: { id_packages }});
        if (!packages) {
            return res.status(400).json({
                message: "Packages tidak ditemukan."
            });
        }      
        
        const priceFloat = parseFloat(price);

        if(
            packages.name === name &&
            packages.price === priceFloat &&
            packages.tag === tag &&
            packages.image === image &&
            packages.description === description
        ) {
            return res.status(400).json({
                message: "Tidak ada perubahan pada package."
            })
        }


        const updatePackage = await prisma.packages.update({
            where: { id_packages },
            data: {
                name,
                price: priceFloat,
                image: image || "",
                tag: tag || "",
                description: description || "",
                updatedat: new Date()
            }
        })
        
        return res.status(200).json({
            message: "Package berhasil diupdate",
            updatePackage
        })
    } catch(err) {
        console.error(err);
        return res.status(400).json({
            message: "Internal Sever Error",
            error: err
        })
    }
}

export const enablePackages = async (req, res) => {
    try {
        const { id_packages } = req.body;

        if(!id_packages) {
            return res.status(400).json({
                message: "Harap isi ID Packages."
            })
        }

        const packages = await prisma.packages.findUnique({ where: { id_packages } });
        if (!packages) {
            return res.status(404).json({
                message: "Packages tidak ditemukan."
            })
        }

        if (packages.isactive === true) {
            return res.status(400).json({
                message: "Packages sudah diaktifkan"
            })
        }

        const sablePackages = await prisma.packages.update({
            where: { id_packages },
            data: { isactive: true, updatedat: new Date() }
        })

        return res.status(200).json({
            message: "Packages berhasil diaktifkan.",
            sablePackages
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error",
            error: err
        })
    }
}

export const disablePackages = async (req, res) => {
    try {
        const { id_packages } = req.body;

        if(!id_packages) {
            return res.status(400).json({
                message: "Harap isi ID Packages."
            })
        }

        const packages = await prisma.packages.findUnique({ where: { id_packages } });
        if (!packages) {
            return res.status(404).json({
                message: "Packages tidak ditemukan."
            })
        }

        if (packages.isactive === false) {
            return res.status(400).json({
                message: "Packages sudah dinonaktifkan"
            })
        }

        const sablePackages = await prisma.packages.update({
            where: { id_packages },
            data: { isactive: false, updatedat: new Date() }
        })

        return res.status(200).json({
            message: "Packages berhasil dinonaktifkan.",
            sablePackages
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error",
            error: err
        })
    }
}

export const deletePackages = async (req, res) => {
    try {
        const { id_packages } = req.body;

        if(!id_packages) {
            return res.status(400).json({
                message: "Harap isi ID Packages."
            })
        }

        const packages = await prisma.packages.findUnique({ where: { id_packages } });
        if (!packages) {
            return res.status(404).json({
                message: "Packages tidak ditemukan."
            })
        }

        const deletePackages = await prisma.packages.delete({
            where: { id_packages },
        });

        return res.status(200).json({
            message: "Packages berhasil dihapus.",
            deletePackages
        })
    } catch(err) {
        console.error(req.body);
        return res.status(500).json({
            message: "Internal Server Error",
            error: err
        })
    }
}

export default { addGame, updateGame, disableGame, enableGame, deleteGame, addPackageGame, updatePackage, disablePackages, enablePackages, deletePackages };