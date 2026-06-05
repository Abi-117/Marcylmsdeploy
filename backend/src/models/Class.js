import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    title: String,

    batchName: String,

    teacher: String,

    date: Date,

    platform: {
      type: String,
      enum: ["Google Meet", "Zoom"],
    },

    duration: Number,

    meetingLink: String,

    recordingUrl: String,

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

    courseLevel: {
      type: String,
    },
    attendanceLocked: {
  type: Boolean,
  default: false,
},

completedAt: {
  type: Date,
},
reminderSent: {
  type: Boolean,
  default: false,
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