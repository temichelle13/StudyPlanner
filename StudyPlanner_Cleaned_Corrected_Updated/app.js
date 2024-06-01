
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for all routes
app.use(cors());

// Helmet for security by setting various HTTP headers
app.use(helmet());

// Morgan for logging HTTP requests
app.use(morgan('tiny'));

// Global error handler for uncaught exceptions and unhandled promise rejections
process.on('uncaughtException', (error) => {
    console.error(`Uncaught Exception: ${error.message}`);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    console.error(`Unhandled Rejection: ${error.message}`);
});

// Starting the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
