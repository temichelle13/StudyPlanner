const jwt = require('jsonwebtoken');
const User = require('../models/user');
const asyncHandler = require('../utils/asyncHandler');

const getSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        const error = new Error('JWT secret not configured. Set JWT_SECRET in your environment.');
        error.statusCode = 500;
        throw error;
    }
    return secret;
};

const signToken = (userId) =>
    jwt.sign({ sub: userId }, getSecret(), {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

const registerUser = asyncHandler(async (req, res, next) => {
    try {
        const user = await User.create(req.body);
        const token = signToken(user._id);
        res.status(201).json({ user: user.toJSON(), token });
    } catch (error) {
        if (error.code === 11000) {
            error.statusCode = 409;
            error.message = 'An account with that email already exists.';
        }
        next(error);
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await user.isPasswordMatch(password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signToken(user._id);
    return res.json({ user: user.toJSON(), token });
});

const getProfile = asyncHandler(async (req, res) => {
    res.json({ user: req.user });
});

module.exports = {
    registerUser,
    loginUser,
    getProfile,
};
