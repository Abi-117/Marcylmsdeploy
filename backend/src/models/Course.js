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

    fee: {
      type: Number,
      required: true,
    },

    icon: String,

    description: String,

    classMode: {
      type: String,
      enum: ["Individual", "Group"], // Removed "Both"
      default: "Individual",
      required: true,
    },

    maxStudents: {
      type: Number,
      default: 1,
      min: 1,
    },

    // students: {
    //   type: Number,
    //   default: 0,
    // },

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