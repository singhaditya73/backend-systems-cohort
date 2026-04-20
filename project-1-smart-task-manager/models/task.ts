import mongoose, { Schema, models, model } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    discription: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);
export default models.task || model("task", taskSchema);
