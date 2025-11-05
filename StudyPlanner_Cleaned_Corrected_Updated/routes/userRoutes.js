
const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');

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

const generateToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        const error = new Error('JWT secret is not configured.');
        error.statusCode = 500;
        throw error;
    }

    return jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// User registration with request body validation
router.post(
    '/register',
    validate([
        body('username')
            .trim()
            .isLength({ min: 3, max: 30 })
            .withMessage('Username must be between 3 and 30 characters long.'),
        body('username')
            .matches(/^[A-Za-z0-9_\-\s]+$/)
            .withMessage('Username may only contain letters, numbers, spaces, underscores, and hyphens.'),
        body('email')
            .trim()
            .normalizeEmail()
            .isEmail()
            .withMessage('A valid email address is required.'),
        body('password')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long.')
    ]),
    asyncHandler(async (req, res) => {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { username }]
        });

        if (existingUser) {
            return res.status(409).json({ message: 'An account with that email or username already exists.' });
        }

        const user = new User({ username, email, password });
        await user.save();

        const token = generateToken(user.id);
        res.status(201).json({ user, token });
    })
);

// User login with request body validation
router.post(
    '/login',
    validate([
        body('email')
            .trim()
            .normalizeEmail()
            .isEmail()
            .withMessage('A valid email address is required.'),
        body('password')
            .notEmpty()
            .withMessage('Password is required.')
    ]),
    asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);
        const token = generateToken(user.id);
        res.json({ user, token });
    })
);

module.exports = router;
