import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: String,
    teacherId: String,

    studentIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    due: String,

    status: {
      type: String,
      default: "Pending",
    },

    // ✅ NEW: submissions
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

        marks: Number,
        feedback: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Assignment", assignmentSchema);