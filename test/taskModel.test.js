const mongoose = require('mongoose');
const Task = require('../models/task');

describe('Task Model Validation', () => {
  it('should fail validation for past dueDate', async () => {
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // yesterday
    const task = new Task({ title: 'Past Due Task', dueDate: pastDate });

    try {
      await task.validate();
      // If validate does not throw, force fail
      throw new Error('Validation should have failed for past dueDate');
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors.dueDate).toBeDefined();
    }
  });

  it('should apply a default future dueDate when one is not provided', async () => {
    const task = new Task({ title: 'Default Due Date Task' });

    await task.validate();

    expect(task.dueDate).toBeInstanceOf(Date);
    expect(task.dueDate.getTime()).toBeGreaterThanOrEqual(Date.now());
  });

  it('should fail validation when dueDate is explicitly null', async () => {
    const task = new Task({ title: 'Null Due Date Task', dueDate: null });

    await expect(task.validate()).rejects.toBeInstanceOf(mongoose.Error.ValidationError);
  });
});
