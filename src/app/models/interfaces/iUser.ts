import mongoose = require("mongoose");

interface IUser extends mongoose.Document {
  _id: string;
  name: string;
  email: string;
  password: string;
}

export default IUser;
