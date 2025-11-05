
require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const connectDB = require('./db');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.disable('x-powered-by');

const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
    : undefined;

const corsOptions = allowedOrigins
    ? {
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            const corsError = new Error('Not allowed by CORS');
            corsError.statusCode = 403;
            return callback(corsError);
        },
        credentials: true,
    }
    : {
        origin: true,
        credentials: true,
    };

// Helmet for security by setting various HTTP headers
app.use(helmet());

// Enable CORS for all routes
app.use(cors(corsOptions));

// Middleware for parsing JSON and urlencoded data
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Morgan for logging HTTP requests
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'tiny'));

// Rate limit authentication related routes to reduce brute force risk
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many authentication attempts. Please try again later.'
});
app.use('/api/users', authLimiter);

// Register application routes
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Serve the static client assets
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch 404 and respond consistently
app.use((req, res) => {
    res.status(404).json({ message: 'Resource not found' });
});

// Centralised error handler
app.use((err, req, res, next) => {
    console.error(err);

    if (res.headersSent) {
        return next(err);
    }

    const statusCode = err.statusCode || 500;
    const response = {
        message: statusCode === 500 ? 'An unexpected error occurred' : err.message
    };

    if (err.errors && process.env.NODE_ENV !== 'production') {
        response.errors = err.errors;
    }

    res.status(statusCode).json(response);
});

// Global error handler for uncaught exceptions and unhandled promise rejections
process.on('uncaughtException', (error) => {
    console.error(`Uncaught Exception: ${error.message}`);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    console.error(`Unhandled Rejection: ${error?.message || error}`);
});

const startServer = async () => {
    if (process.env.MONGODB_URI) {
        await connectDB();
    } else {
        console.warn('MONGODB_URI environment variable is not set. Database features will be unavailable until it is configured.');
    }

    return app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

if (require.main === module) {
    startServer().catch((error) => {
        console.error('Failed to start the server', error);
        process.exit(1);
    });
}

module.exports = { app, startServer };
