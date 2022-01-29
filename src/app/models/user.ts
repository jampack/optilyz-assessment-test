import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, set: (e: string) => e.toLowerCase()},
  password: {type: String, required: true},
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

export default User;
