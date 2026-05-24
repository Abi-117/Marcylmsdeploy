import mongoose from "mongoose";

const practiceSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
    duration: {
      type: Number, // seconds
      default: 0,
    },
    bpm: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      enum: ["timer", "video"],
      default: "timer",
    },
  },
  { timestamps: true }
);

export default mongoose.model("PracticeSubmission", practiceSchema);