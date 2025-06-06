import Joi from "joi";

const userSchema = Joi.object({
    email: Joi.string().email().required() // wajib diisi
    .messages({
        'string.empty': 'Email tidak boleh kosong.',
        'string.email': 'Format email tidak valid.',
        'any.required': 'Email wajib diisi.'
    }),
    username: Joi.string().required().pattern(/^[a-zA-Z\s]+$/) //berupa huruf (kecil dan besar) dan spasi. wajib diisi
    .messages({
        'string.empty': 'Username tidak boleh kosong.',
        'string.pattern.base': 'Username hanya boleh mengandung huruf dan spasi.',
        'any.required': 'Username wajib diisi.'
    }),
    password: Joi.string().required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/) //min 8 karakter, mengandung setidaknya 1 huruf kecil, 1 huruf besar, 1 digit angka. wajib diisi
    .messages({
        'string.empty': 'Password tidak boleh kosong.',
        'string.pattern.base': 'Password harus memiliki minimal 8 karakter, mengandung setidaknya 1 huruf kecil, 1 huruf besar, dan 1 digit angka.',
        'any.required': 'Password wajib diisi.'
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
        .messages({
            'string.empty': 'Konfirmasi Password tidak boleh kosong.',
            'any.only': 'Password dan Konfirmasi Password tidak cocok.',
            'any.required': 'Konfirmasi Password wajib diisi.'
    }),
});

function validateCreateUser(req, res, next) {
    const { email, username, password, confirmPassword } = req.body;

    const data = { email, username, password, confirmPassword };

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