import Joi from "joi";

const gameValidation = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    description: Joi.string().min(10).max(500).optional(),
    image: Joi.string().optional(),
    type: Joi.string().valid("Mobile", "PC").required(),
    ihsangan_slug: Joi.string().required(),
    is_using_server: Joi.string().required()
});

const gameUpdateValidation = Joi.object({
    id_game: Joi.string().required(),
    name: Joi.string().min(3).max(30).required(),
    description: Joi.string().min(10).max(500).optional(),
    image: Joi.string().optional(),
    type: Joi.string().valid("Mobile", "PC").required(),
});

const packageUpdateValidation = Joi.object({
    gameid: Joi.string().required(),
    id_packages: Joi.string().required(),
    name: Joi.string().min(3).max(30).required(),
    price: Joi.number().min(1).required(),
    tag: Joi.string().allow('').optional(),
    description: Joi.string().allow('').min(10).max(500).optional()
})

const packageValidation = Joi.object({
    gameid: Joi.string().required(),
    name: Joi.string().min(3).max(30).required(),
    price: Joi.number().min(1).required(),
    tag: Joi.string().allow('').optional(),
    description: Joi.string().allow('').min(10).max(500).optional()
})

export const validateAddGame = (req, res, next) => {
    const { error } = gameValidation.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }
    next();
}

export const validateUpdateGame = (req, res, next) => {
    const { error } = gameUpdateValidation.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }
    next();
}

export const validateAddPackages = (req, res, next) => {
    const { error } = packageValidation.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }
    next();
}

export const validateUpdatePackages = (req, res, next) => {
    const { error } = packageUpdateValidation.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }
    next();
}

export default { validateAddGame, validateUpdateGame, packageUpdateValidation, packageValidation };