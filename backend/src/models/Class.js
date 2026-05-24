import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    title: String,
    batchName: String,

    date: Date,

    platform: {
      type: String,
      enum: ["Google Meet", "Zoom"],
    },

    duration: Number, // minutes

    meetingLink: String,

    notes: String,

    status: {
      type: String,
      enum: ["Upcoming", "Live", "Completed"],
      default: "Upcoming",
    },

    teacherId: String,

    attendanceMarked: {
      type: Boolean,
      default: false,
    },
    courseName: {
  type: String,
},
students: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],
  },
  { timestamps: true }
);

export default mongoose.model("Class", classSchema);