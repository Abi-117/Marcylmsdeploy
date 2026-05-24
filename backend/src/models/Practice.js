import mongoose from "mongoose";

const practiceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    duration: Number,
    notes: String,
    bpm: Number,

    videoUrl: String,
    publicId: String,
  },
  { timestamps: true }
);

export default mongoose.model("Practice", practiceSchema);