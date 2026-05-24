import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: String,
    description: String,

    studentName: String,

    due: String,

    status: {
      type: String,
      enum: ["Pending", "Submitted", "Reviewed"],
      default: "Pending",
    },

    teacherId: String,

    submissionUrl: String, // video/pdf/image later
  },
  { timestamps: true }
);

export default mongoose.model("Assignment", assignmentSchema);