import express from "express";
import Practice from "../models/Practice.js";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();

/* ================= CLOUD STORAGE ================= */
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "practice_videos",
    resource_type: "video",
  },
});

const upload = multer({ storage });

/* ================= SAVE TIMER ================= */
router.post("/upload", async (req, res) => {
  try {
    const { studentId, duration, notes, bpm } = req.body;

    const data = await Practice.create({
      studentId,
      duration,
      notes,
      bpm,
    });

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Save failed" });
  }
});

/* ================= GET HISTORY ================= */
router.get("/:studentId", async (req, res) => {
  try {
    const data = await Practice.find({
      studentId: req.params.studentId,
    }).sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* ================= VIDEO UPLOAD ================= */
router.post("/video", upload.single("video"), async (req, res) => {
  try {
    const { studentId, notes } = req.body;

    const data = await Practice.create({
      studentId,
      notes,
      videoUrl: req.file.path,
    });

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Video upload failed" });
  }
});

export default router;