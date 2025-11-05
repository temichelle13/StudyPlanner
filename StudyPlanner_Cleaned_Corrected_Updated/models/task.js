
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
        default: null,
        validate: {
            validator(value) {
                if (!value) {
                    return true;
                }

                const dueDate = new Date(value);
                const today = new Date();
                dueDate.setHours(0, 0, 0, 0);
                today.setHours(0, 0, 0, 0);

                return dueDate >= today;
            },
            message: 'Due date must be today or a future date.'
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

taskSchema.set('toJSON', {
    transform: (_document, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Task', taskSchema);
