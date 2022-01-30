import mongoose from "mongoose";

export const TaskSchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String},
  completeBefore: {type: Date, required: true},
  notifyAt: {type: Date, required: true},
  isComplete: {type: Boolean, default: false},
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, { timestamps: true });

const Task = mongoose.model("Task", TaskSchema);

export default Task;
