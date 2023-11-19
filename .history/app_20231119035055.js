const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello, StudyPlanner!');
});

app.listen(port, () => {
    console.log(`StudyPlanner app listening at http://localhost:${port}`);
});
const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);
const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON and urlencoded data and to enable CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Use your task routes with the base path '/api/tasks'
app.use('/api/tasks', taskRoutes);

// Start the server
app.listen(port, () => {
    console.log(`StudyPlanner app listening at http://localhost:${port}`);
});
