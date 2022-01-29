import mongoose = require("mongoose");

interface ITask extends mongoose.Document {
  _id: string;
  title: string;
  description: string;
  completeBefore: string;
  notifyAt: string;
  creator: string;
  assignee: string;
  createdAt: string;
  updatedAt: string;
}

export default ITask;
