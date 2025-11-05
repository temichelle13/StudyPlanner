
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
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
        validate: {
            validator: function(value) {
                if (!value) {
                    return false;
                }
                const comparisonBase = this.createdAt instanceof Date
                    ? this.createdAt.getTime()
                    : Date.now();
                return value.getTime() >= comparisonBase;
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
