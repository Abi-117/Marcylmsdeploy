import mongoose from "mongoose";

const groupClassSchema = new mongoose.Schema(
  {
    // =========================
    // GROUP NAME
    // =========================

    groupName: {
      type: String,
      required: true,
    },

    // =========================
    // COURSE
    // =========================

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    // =========================
    // TEACHER
    // =========================

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // =========================
    // CLASS DETAILS
    // =========================

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

    // =========================
    // STUDENTS
    // =========================

    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // =========================
    // MAX STUDENTS
    // =========================

    maxStudents: {
      type: Number,
      default: 3,
    },

    // =========================
    // STATUS
    // =========================

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