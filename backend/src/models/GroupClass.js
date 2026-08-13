import mongoose from "mongoose";

const groupClassSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
    },

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

    level: {
      type: String,
      default: "",
    },

    grade: {
      type: String,
      default: "",
    },

    mode: {
      type: String,
      default: "Online",
    },

    fromTime: {
      type: String,
      default: "",
    },

    toTime: {
      type: String,
      default: "",
    },

    availableDays: {
      type: [String],
      default: [],
    },

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

export default mongoose.model("GroupClass", groupClassSchema);