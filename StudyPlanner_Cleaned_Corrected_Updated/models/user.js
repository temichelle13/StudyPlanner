
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const emailRegex = /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator(email) {
                return emailRegex.test(email);
            },
            message: 'Please enter a valid email address.'
        }
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

const SALT_ROUNDS = 12;

// Password hashing middleware
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        if (this.password.length < 8) {
            const error = new Error('Password must be at least 8 characters long.');
            error.statusCode = 400;
            return next(error);
        }

        this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    }

    next();
});

userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    userObject.id = userObject._id.toString();
    delete userObject._id;
    delete userObject.__v;
    delete userObject.password;
    return userObject;
};

userSchema.statics.findByCredentials = async function(email, password) {
    const user = await this.findOne({ email: email.toLowerCase() });

    if (!user) {
        const error = new Error('Invalid email or password.');
        error.statusCode = 401;
        throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        const error = new Error('Invalid email or password.');
        error.statusCode = 401;
        throw error;
    }

    return user;
};

module.exports = mongoose.model('User', userSchema);
