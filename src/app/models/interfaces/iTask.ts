import mongoose = require("mongoose");
import IUser from "./iUser";

interface ITask extends mongoose.Document {
  _id: string;
  title: string;
  description: string;
  completeBefore: string;
  notifyAt: string;
  isComplete: boolean;
  creator: IUser;
  assignee: IUser;
  createdAt: string;
  updatedAt: string;
}

export default ITask;
