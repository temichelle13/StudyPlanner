const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string().trim().min(3).max(40).required(),
    email: Joi.string().trim().email({ tlds: { allow: false } }).required(),
    password: Joi.string()
        .min(8)
        .max(128)
        .pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
        .message('Password must contain at least one letter and one number.')
        .required(),
});

const loginSchema = Joi.object({
    email: Joi.string().trim().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required(),
});

module.exports = {
    registerSchema,
    loginSchema,
};
