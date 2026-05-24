import mongoose from "mongoose";

const practiceSchema = new mongoose.Schema({
  studentId: String,
  duration: Number, // seconds
  notes: String,
  bpm: Number,
  videoUrl: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Practice", practiceSchema);