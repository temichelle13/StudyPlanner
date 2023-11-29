require('dotenv').config(); // Load environment variables

const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); // Ensure Morgan is required at the top
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Enable CORS
app.use(cors());

// Morgan for logging HTTP requests
app.use(morgan('dev'));

// Sample root route for basic testing
app.get('/', (req, res) => {
    res.send('Hello, StudyPlanner!');
});

// Task routes
app.use('/api/tasks', taskRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
    console.log(`StudyPlanner app listening at http://localhost:${process.env.PORT || 3000}`);
});
