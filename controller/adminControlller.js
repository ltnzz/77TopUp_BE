import prisma from '../config/db.js';
// import generateUniqueSlug from '../utils/slugify.js';
import { deleteImageFromCloudinary, streamUpload } from '../utils/cloud.js';

export const addGame = async (req, res) => {
    try {
        const { name, description, type, ihsangan_slug, is_using_server } = req.body;
        
        const checkGame = await prisma.games.findFirst({ where: {name} });
        if(checkGame) {
            return res.status(400).json({
                message: "Game already exists",
            })
        };

        // const slug = await generateUniqueSlug(name, "games");

        let imageURL = "";
        if(req.file) {
            const uploadResult = await streamUpload(req.file.buffer, "games");
            imageURL = uploadResult.secure_url;
        }
        
        const isUsingServerBoolean = is_using_server === "true"; 

        const game = await prisma.games.create({
            data: {
                name, 
                description, 
                image: imageURL, 
                type,
                ihsangan_slug,
                is_using_server: isUsingServerBoolean
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
        const { id_game, name, description, type } = req.body;

        const game = await prisma.games.findUnique({ where: { id_game } });
        if (!game) {
            return res.status(404).json({
                message: "Game tidak ditemukan."
            });
        }

        let newImageURL = game.image;
        let newImagePublicId = game.image_public_id;

        const hasChange = (
            game.name !== name ||
            game.description !== description ||
            game.type !== type ||
            game.image !== newImageURL
        );

        if (!hasChange) {
            return res.status(400).json({
                message: "Tidak ada perubahan data."
            })
        }

        if(req.file) {
            if (game.image_public_id) {
                await deleteImageFromCloudinary(game.image_public_id);
            }
            const uploadResult = await streamUpload(req.file.buffer, "games");
            newImageURL = uploadResult.secure_url;
            newImagePublicId = uploadResult.public_id;
        } else if (req.body.image === '') {
            if (game.image_public_id) {
                await deleteImageFromCloudinary(game.image_public_id);
            }
            newImageURL = null; 
            newImagePublicId = null;
        }

        const updateGame = await prisma.games.update({
            where: { id_game },
            data: {
                name,  
                description: description || "", 
                image: newImageURL,
                image_public_id: newImagePublicId,
                type,
                updatedat: new Date()
            }
        });
        
        res.status(200).json({
            message: `Game ${name} updated successfully.`,
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
        const { gameid, name, price, tag, description } = req.body;

        const existingPackage = await prisma.packages.findFirst({
            where: {
                name,
                gameid
            }
        });

        if (existingPackage) {
            return res.status(400).json({
                message: `Package dengan ${name} sudah ada di game ${gameid}.`
            });
        }

        const priceFloat = parseFloat(price);

        let imageURL = "";
        if(req.file) {
            const uploadResult = await streamUpload(req.file.buffer, "packages");
            imageURL = uploadResult.secure_url;
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
            message: `Package ${name} berhasil ditambahkan pada game ${gameid}.`,
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
        const  { gameid, id_packages, name, price, tag, description } = req.body;

        const packages = await prisma.packages.findUnique({where: { id_packages }});
        if (!packages) {
            return res.status(400).json({
                message: "Packages tidak ditemukan."
            });
        }      
        
        const game = await prisma.games.findUnique({ where: { id_game: gameid } });
        if (!game) {
            return res.status(400).json({
                message: "Game tidak ditemukan."
            });
        }

        let newImageURL = packages.image;
        let newImagePublicId = packages.image_public_id;
        const priceFloat = parseFloat(price);
        
        const hasChange = (
            packages.name !== name ||
            packages.price !== priceFloat ||
            packages.tag !== tag ||
            packages.description !== description ||
            packages.image !== newImageURL
        );
        
        if (!hasChange) {
            return res.status(400).json({
                message: `Tidak ada perubahan pada package ${name}.`
            })
        }

        if(req.file) {
            if (packages.image_public_id) {
                await deleteImageFromCloudinary(packages.image_public_id);
            }
            const uploadResult = await streamUpload(req.file.buffer, "packages");
            newImageURL = uploadResult.secure_url;
            newImagePublicId = uploadResult.public_id;
        } else if (req.body.image === '') {
            if (packages.image_public_id) {
                await deleteImageFromCloudinary(packages.image_public_id);
            }
            newImageURL = null; 
            newImagePublicId = null;
        }


        const updatePackage = await prisma.packages.update({
            where: { id_packages },
            data: {
                gameid: gameid,
                name,
                price: priceFloat,
                image: newImageURL,
                image_public_id: newImagePublicId,
                tag: tag || "",
                description: description || "",
                updatedat: new Date()
            }
        })
        
        return res.status(200).json({
            message: `Package ${name} berhasil diupdate`,
            updatePackage
        });
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