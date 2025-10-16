import mongoose, { Types } from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, //nếu có khoảng trắng ở trước/ sau thì tự động xóa đi.
    },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, //tự động thêm createdAt và updatedAt
  }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
