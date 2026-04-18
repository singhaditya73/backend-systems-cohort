import mongoose, { Schema, model, models } from "mongoose";
import { timeStamp } from "node:console";
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timeStamp: true },
);
export default model.User || model("User", UserSchema);
