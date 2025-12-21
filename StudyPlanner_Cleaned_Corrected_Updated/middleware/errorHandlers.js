const notFoundHandler = (req, res, next) => {
    const error = new Error(`Resource not found: ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || err.status || 500;
    const isProduction = process.env.NODE_ENV === 'production';

    if (statusCode >= 500) {
        console.error(err);
    }

    res.status(statusCode).json({
        message: err.message || 'An unexpected error occurred.',
        ...(isProduction ? null : { stack: err.stack }),
    });
};

module.exports = {
    notFoundHandler,
    errorHandler,
};
