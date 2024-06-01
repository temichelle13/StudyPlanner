
const express = require('express');
const router = express.Router();
const Task = require('../models/task'); // Adjust the path as per your project structure
const mongoose = require('mongoose');

// GET all tasks with pagination
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const tasks = await Task.find()
                                .limit(limit * 1)
                                .skip((page - 1) * limit)
                                .exec();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET a single task by ID with validation
router.get('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send('Invalid Task ID');
    }
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).send('Task not found');
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
