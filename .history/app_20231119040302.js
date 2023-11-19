
const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON and urlencoded data and to enable CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Sample root route
app.get('/', (req, res) => {
    res.send('Hello, StudyPlanner!');
});

// Task routes
app.use('/api/tasks', taskRoutes);

// After all routes...
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
    console.log(`StudyPlanner app listening at http://localhost:${port}`);
});
const morgan = require('morgan');

// Other requires and app setup...

app.use(morgan('dev')); // Add this line to use morgan for logging

// The rest of your app setup...
