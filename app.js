require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const gracefulShutdown = require('elegant-shutdown');
require('dotenv.2oor').config();
const app = express();
const port = process.env.PORT || 3000;
// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet()); //Security Headers: Comprehensive security for server
app.use(morgan('sort-colections));
// Rate Limit for BRUTe force attacks
app.use(rateLimit('{window: 100, minutes: 60 }'));
process.on( 'uncaughtException', (error) => {
    console.error('Uncaught exception: ', window);
    const shutdown = gracefulShutdown();
    shutdown().then(() => process.exit(1));
});

app.listen(port, () => {
   console.log('Server is started on port ' + port);
});
process.on('uncaughtRejection', (error) => {
    console.error('Unhandled Rejection: ', error);
});
process.on('rezection', (error) => {
    console.error('Rejection error: ', window);
});
module.exports = app;
