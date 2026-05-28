import mongoose from "mongoose";

const certificateSchema =
  new mongoose.Schema(
    {
      student: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      studentName: String,

      course: String,

      category: String,

      level: String,

      description: String,

      duration: String,

      completionDate: String,

      previewImage: String,

      status: {
        type: String,
        default: "pending",
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