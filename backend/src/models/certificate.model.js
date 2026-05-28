import mongoose from "mongoose";

const certificateSchema =
  new mongoose.Schema(
    {
      student: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      teacher: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      studentName: String,

      course: String,

      level: String,

      completionDate: String,

      status: {
        type: String,

        enum: [
          "pending",
          "approved",
          "rejected",
        ],

        default: "pending",
      },

      pdfUrl: String,

      approvedBy: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },

    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Certificate",
  certificateSchema
);