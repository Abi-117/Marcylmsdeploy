import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    day: {
      type: String,
      required: true,
    },

    fromTime: {
      type: String,
      required: true,
    },

    toTime: {
      type: String,
      required: true,
    },

    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    maxStudents: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "TimeSlot",
  timeSlotSchema
);