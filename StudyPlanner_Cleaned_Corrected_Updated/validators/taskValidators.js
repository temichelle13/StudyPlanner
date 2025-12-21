const Joi = require('joi');

const baseTaskSchema = {
    title: Joi.string().trim().max(100).required(),
    description: Joi.string().allow('').trim().max(500).optional(),
    dueDate: Joi.alternatives().try(Joi.date().iso(), Joi.valid(null)).optional(),
    priority: Joi.string().valid('Low', 'Medium', 'High').default('Medium'),
    completed: Joi.boolean().default(false),
    tag: Joi.string().trim().max(50).optional(),
    estimatedMinutes: Joi.number().integer().min(0).max(1000).optional(),
};

const createTaskSchema = Joi.object(baseTaskSchema);

const updateTaskSchema = Joi.object({
    title: baseTaskSchema.title.optional(),
    description: baseTaskSchema.description,
    dueDate: baseTaskSchema.dueDate,
    priority: baseTaskSchema.priority.optional(),
    completed: baseTaskSchema.completed,
    tag: baseTaskSchema.tag,
    estimatedMinutes: baseTaskSchema.estimatedMinutes,
}).min(1);

module.exports = {
    createTaskSchema,
    updateTaskSchema,
};
