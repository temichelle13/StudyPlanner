
const express = require('express');
const mongoose = require('mongoose');
const { body, param, query, validationResult } = require('express-validator');
const Task = require('../models/task');

const router = express.Router();

const asyncHandler = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

const validate = (validations) => [
    ...validations,
    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        const error = new Error('Validation failed');
        error.statusCode = 400;
        error.errors = errors.array();
        return next(error);
    }
];

// GET all tasks with pagination
router.get(
    '/',
    validate([
        query('page').optional().isInt({ min: 1 }).toInt(),
        query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
    ]),
    asyncHandler(async (req, res) => {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;

        const [tasks, totalItems] = await Promise.all([
            Task.find()
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            Task.countDocuments()
        ]);

        res.json({
            tasks,
            pagination: {
                page,
                limit,
                totalItems,
                totalPages: Math.max(Math.ceil(totalItems / limit), 1)
            }
        });
    })
);

// GET a single task by ID with validation
router.get(
    '/:id',
    validate([
        param('id').custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error('Invalid Task ID');
            }
            return true;
        })
    ]),
    asyncHandler(async (req, res) => {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    })
);

// Create a new task
router.post(
    '/',
    validate([
        body('title')
            .trim()
            .isLength({ min: 1, max: 100 })
            .withMessage('Title is required and must be less than or equal to 100 characters.'),
        body('description')
            .optional({ checkFalsy: true })
            .trim()
            .isLength({ max: 500 })
            .withMessage('Description must be less than or equal to 500 characters.'),
        body('dueDate')
            .optional({ checkFalsy: true })
            .isISO8601()
            .toDate()
            .withMessage('Due date must be a valid ISO 8601 date.'),
        body('completed').optional().isBoolean().toBoolean(),
        body('priority')
            .optional()
            .isIn(['Low', 'Medium', 'High'])
            .withMessage('Priority must be Low, Medium, or High.')
    ]),
    asyncHandler(async (req, res) => {
        const { title, description, dueDate, completed, priority } = req.body;
        const task = new Task({ title, description, dueDate, completed, priority });
        await task.save();
        res.status(201).json(task);
    })
);

// Update an existing task
router.patch(
    '/:id',
    validate([
        param('id').custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error('Invalid Task ID');
            }
            return true;
        }),
        body('title')
            .optional()
            .trim()
            .isLength({ min: 1, max: 100 })
            .withMessage('Title must be less than or equal to 100 characters.'),
        body('description')
            .optional({ checkFalsy: true })
            .trim()
            .isLength({ max: 500 })
            .withMessage('Description must be less than or equal to 500 characters.'),
        body('dueDate')
            .optional({ checkFalsy: true })
            .isISO8601()
            .toDate()
            .withMessage('Due date must be a valid ISO 8601 date.'),
        body('completed').optional().isBoolean().toBoolean(),
        body('priority')
            .optional()
            .isIn(['Low', 'Medium', 'High'])
            .withMessage('Priority must be Low, Medium, or High.')
    ]),
    asyncHandler(async (req, res) => {
        const allowedFields = ['title', 'description', 'dueDate', 'completed', 'priority'];
        const updates = allowedFields.reduce((acc, field) => {
            if (Object.prototype.hasOwnProperty.call(req.body, field)) {
                acc[field] = req.body[field];
            }
            return acc;
        }, {});

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No valid fields provided for update.' });
        }

        const task = await Task.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(task);
    })
);

// Delete a task
router.delete(
    '/:id',
    validate([
        param('id').custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error('Invalid Task ID');
            }
            return true;
        })
    ]),
    asyncHandler(async (req, res) => {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(204).send();
    })
);

module.exports = router;
