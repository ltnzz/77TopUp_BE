import Joi from "joi";

const userSchema = Joi.object({
    email: Joi.string().email().required(), // wajib diisi
    username: Joi.string()
        .required()
        .pattern(/^[a-zA-Z\s]+$/), //berupa huruf (kecil dan besar) dan spasi. wajib diis
    password: Joi.string()
        .required()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/), //min 8 karakter, mengandung setidaknya 1 huruf kecil, 1 huruf besar, 1 digit. wajib diisi
});

function validateCreateUser(req, res, next) {
    const { email, username, password } = req.body;

    const data = { email, username, password };

    const { error } = userSchema.validate(data);

    if(error) {
        const details = error.details.map(err => err.message); //ambil detail error dan convert menjadi array string
        return res
            .status(400)
            .json({
                auth: false,
                message: `Data user tidak valid: ${details}.` //message error
            });
    }

    next();
}

export default validateCreateUser;