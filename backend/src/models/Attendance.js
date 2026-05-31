import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    status: {
      type: String,
      enum: ["Present", "Absent"],
      default: "Present",
    },

    date: {
      type: Date,
      default: Date.now,
    },
    courseName: {
  type: String,
  required: true
},
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);