const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 500,
        },
        dueDate: {
            type: Date,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium',
        },
        tag: {
            type: String,
            trim: true,
            maxlength: 50,
            default: 'General',
        },
        estimatedMinutes: {
            type: Number,
            min: 0,
            max: 1000,
        },
    },
    { timestamps: true }
);

taskSchema.virtual('isOverdue').get(function isOverdue() {
    return Boolean(this.dueDate) && !this.completed && this.dueDate < new Date();
});

taskSchema.index({ owner: 1, dueDate: 1 });
taskSchema.index({ owner: 1, completed: 1 });

taskSchema.set('toJSON', {
    virtuals: true,
    transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

module.exports = mongoose.model('Task', taskSchema);
