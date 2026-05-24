import express from "express";
import Practice from "../models/Practice.js";
import upload from "../config/upload.js";

const router = express.Router();

// ==========================
// GET PRACTICE HISTORY
// ==========================
router.get("/:studentId", async (req, res) => {
  try {
    const data = await Practice.find({
      studentId: req.params.studentId,
    }).sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Fetch failed" });
  }
});

// ==========================
// UPLOAD PRACTICE (VIDEO + TIMER)
// ==========================
router.post(
  "/upload",
  upload.single("video"),
  async (req, res) => {
    try {
      const { studentId, duration, notes, bpm } = req.body;

      const newPractice = new Practice({
        studentId,
        duration,
        notes,
        bpm,
        videoUrl: req.file?.path || null,
        publicId: req.file?.filename || null,
      });

      await newPractice.save();

      res.json({
        message: "Practice saved",
        data: newPractice,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

export default router;