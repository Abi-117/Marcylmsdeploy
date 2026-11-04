
import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    mainLevel: {
      type: String,
      required: true,
    },

    grade: {
      type: String,
      required: true,
    },

    // India course price
    fee: {
      type: Number,
      required: true,
    },

    // Future use: separate international USD price
    feeUSD: {
      type: Number,
      default: null,
      min: 0,
    },

    icon: String,

    description: String,

    classMode: {
      type: String,
      enum: ["Individual", "Group"],
      default: "Individual",
      required: true,
    },

    maxStudents: {
      type: Number,
      default: 1,
      min: 1,
    },

    courseName: String,

    courseLevel: String,

    batch: String,
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
