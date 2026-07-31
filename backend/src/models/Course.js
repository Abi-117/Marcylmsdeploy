import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: String,

    category: String,

    mainLevel: String,

    grade: String,

    fee: Number,

    icon: String,

    description: String,
    classMode: {
  type: String,
  enum: ["Individual", "Group", "Both"],
  default: "Both",
},

maxStudents: {
  type: Number,
  required: true,
  min: 1,
  default: 1,
},

    students: {
      type: Number,
      default: 0,
    },
    courseName: {
  type: String,
},

courseLevel: {
  type: String,
},

batch: {
  type: String,
},
  },
  
  {
    timestamps: true,
  }
);

const Course = mongoose.model(
  "Course",
  courseSchema
);

export default Course;