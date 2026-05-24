import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["present", "absent"],
    },

    date: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Attendance",
  attendanceSchema
);