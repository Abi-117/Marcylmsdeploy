import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    teacherId: {
      type: String,
      required: true,
    },

    teacherName: {
      type: String,
      default: "",
    },

    courseName: {
      type: String,
      default: "",
    },

    studentIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    due: String,

    status: {
      type: String,
      enum: ["Pending", "Submitted", "Reviewed"],
      default: "Pending",
    },

    submissions: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        fileUrl: String,

        submittedAt: {
          type: Date,
          default: Date.now,
        },

        status: {
          type: String,
          default: "Submitted",
        },

        marks: {
          type: Number,
          default: 0,
        },

        feedback: {
          type: String,
          default: "",
        },

        reviewed: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model(
  "Assignment",
  assignmentSchema
);