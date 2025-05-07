import slugify from "slugify";
import prisma from "../config/db.js";

export const generateUniqueSlug = async (name, model) => {
    let base = slugify(name, { lower: true, strict: true });
    let slug = base;
    let count = 1;

    while (await prisma[model].findUnique({where: { slug }})) {
        slug: `${base}-${count++}`;
    }

    return slug;
}

export default generateUniqueSlug;