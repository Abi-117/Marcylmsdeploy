import express from "express";
import multer from "multer";
import path from "path";
import PracticeSubmission from "../models/PracticeSubmission.js";

const router = express.Router();

//
// 📦 FILE STORAGE
//
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

//
// 🎥 UPLOAD VIDEO + NOTES
//
router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const { studentId, notes } = req.body;

    const newEntry = await PracticeSubmission.create({
      studentId,
      notes,
      videoUrl: req.file ? `/uploads/${req.file.filename}` : null,
      type: "video",
    });

    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

//
// ⏱ SAVE TIMER SESSION
//
router.post("/timer", async (req, res) => {
  try {
    const { studentId, duration, bpm } = req.body;

    const entry = await PracticeSubmission.create({
      studentId,
      duration,
      bpm,
      type: "timer",
    });

    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: "Timer save failed" });
  }
});

//
// 📊 GET STUDENT PRACTICE HISTORY
//
router.get("/:studentId", async (req, res) => {
  try {
    const data = await PracticeSubmission.find({
      studentId: req.params.studentId,
    }).sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

export default router;