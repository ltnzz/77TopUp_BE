import Joi from "joi";

const gameValidation = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(500).optional(),
    image: Joi.string().optional(),
    type: Joi.string().valid("Mobile", "PC").required(),
});

const gameUpdateValidation = Joi.object({
    id_game: Joi.string().required(),
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(500).optional(),
    image: Joi.string().optional(),
    type: Joi.string().valid("Mobile", "PC").required(),
});

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

export default { validateAddGame, validateUpdateGame };