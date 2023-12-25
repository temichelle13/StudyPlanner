{
    "// FILEPATH"
:
    "/c:/Users/teami/StudyPlanner/app.js",
        "// BEGIN: ed8c6549bwf9"
:
    "",
        "dependencies"
:
    {
        "cors"
    :
        "^2.8.5"
    }
,
    "// END: ed8c6549bwf9"
:
    ""
}
const morgan = require('morgan');
const express = require('express'); // Add this line
const cors = require('cors'); // Add this line

const app = express();

const port = process.env.PORT || 3000;

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Enable CORS
app.use(cors());

// Morgan for logging HTTP requests
app.use(morgan('dev'));

// Load environment variables
require('dotenv').config();

// Sample root route for basic testing
app.get('/', (req, res) => {
    res.send('Hello, StudyPlanner!');
});

// Task routes
const taskRoutes = [
    // Define your task routes here
];

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




