
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

// User registration with request body validation
router.post('/register', async (req, res) => {
    // Validate request body here
    try {
        const user = new User(req.body);
        await user.save();
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).send({ user, token });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(400).send({ message: "An error occurred. Please try again later." });
    }
});

// User login with request body validation
router.post('/login', async (req, res) => {
    // Validate request body here
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.send({ user, token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(400).send({ message: "An error occurred. Please try again later." });
    }
});

module.exports = router;
