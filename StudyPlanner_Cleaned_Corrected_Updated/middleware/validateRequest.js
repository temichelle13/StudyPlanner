const validateRequest = (schema) => (req, res, next) => {
    const options = {
        abortEarly: false,
        stripUnknown: true,
        allowUnknown: false,
    };
    const { error, value } = schema.validate(req.body, options);
    if (error) {
        const details = error.details.map((detail) => detail.message.replace(/"/g, ''));
        return res.status(422).json({
            message: 'Validation failed.',
            details,
        });
    }
    req.body = value;
    return next();
};

module.exports = validateRequest;
