
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const emailRegex = /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function(email) {
                return emailRegex.test(email);
            },
            message: 'Please enter a valid email address.'
        }
    },
    password: {
        type: String,
        required: true
    }
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

// NOTE: Implement rate limiting or account lockout strategies for enhanced security
// Consider using middleware or a library for this purpose

module.exports = mongoose.model('User', userSchema);
