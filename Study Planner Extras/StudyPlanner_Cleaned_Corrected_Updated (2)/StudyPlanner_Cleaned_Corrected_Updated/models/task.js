
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    dueDate: {
        type: Date,
        default: Date.now,
        validate: {
            validator: function(value) {
                return value > Date.now();
            },
            message: 'Due date must be in the future.'
        }
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
