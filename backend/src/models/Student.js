import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: String,
    course: String,
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    progress: {
      type: Number,
      default: 0,
    },
    teacherId: String,
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);