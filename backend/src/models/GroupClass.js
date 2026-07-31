import mongoose from "mongoose";

const groupClassSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    level: String,

    grade: String,

    mode: String,

    fromTime: String,

    toTime: String,

    availableDays: [String],

    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    maxStudents: {
      type: Number,
      default: 3,
    },

    status: {
      type: String,
      enum: ["Available", "Full"],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "GroupClass",
  groupClassSchema
);