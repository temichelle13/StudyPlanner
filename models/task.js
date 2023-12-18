const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 500 },
    dueDate: { type: Date, default: Date.now },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Task", taskSchema);
