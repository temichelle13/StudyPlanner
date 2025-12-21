const mongoose = require('mongoose');
const Task = require('../models/task');
const asyncHandler = require('../utils/asyncHandler');

const buildQuery = (userId, queryParams) => {
    const query = { owner: userId };
    const status = typeof queryParams.status === 'string' ? queryParams.status.toLowerCase() : undefined;
    if (status === 'completed') {
        query.completed = true;
    } else if (status === 'open') {
        query.completed = false;
    }
    const priorityMap = {
        low: 'Low',
        medium: 'Medium',
        high: 'High',
    };
    const requestedPriority =
        typeof queryParams.priority === 'string'
            ? priorityMap[queryParams.priority.toLowerCase()]
            : undefined;
    if (requestedPriority) {
        query.priority = requestedPriority;
    }
    return query;
};

const getTasks = asyncHandler(async (req, res) => {
    const page = Number.parseInt(req.query.page, 10) > 0 ? Number.parseInt(req.query.page, 10) : 1;
    const limit = Number.parseInt(req.query.limit, 10) > 0 ? Number.parseInt(req.query.limit, 10) : 25;

    const query = buildQuery(req.user._id, req.query);
    const [tasks, total] = await Promise.all([
        Task.find(query)
            .sort({ dueDate: 1, createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean({ virtuals: true }),
        Task.countDocuments(query),
    ]);

    res.set('X-Total-Count', total.toString());
    res.json(tasks);
});

const getTaskById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid task ID.' });
    }

    const task = await Task.findOne({ _id: id, owner: req.user._id });
    if (!task) {
        return res.status(404).json({ message: 'Task not found.' });
    }

    return res.json(task);
});

const createTask = asyncHandler(async (req, res) => {
    const task = await Task.create({
        ...req.body,
        owner: req.user._id,
    });
    res.status(201).json(task);
});

const updateTask = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid task ID.' });
    }

    const updatedTask = await Task.findOneAndUpdate(
        { _id: id, owner: req.user._id },
        req.body,
        { new: true, runValidators: true }
    );

    if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found.' });
    }

    return res.json(updatedTask);
});

const deleteTask = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid task ID.' });
    }

    const deletedTask = await Task.findOneAndDelete({ _id: id, owner: req.user._id });
    if (!deletedTask) {
        return res.status(404).json({ message: 'Task not found.' });
    }

    return res.status(204).send();
});

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
};
