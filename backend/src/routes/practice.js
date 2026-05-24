import express from "express";
import Practice from "../models/Practice.js";
import upload from "../config/multer.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

//
// ================= GET PRACTICE HISTORY
//
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

//
// ================= TIMER SAVE SESSION
//
router.post("/upload", async (req, res) => {
  try {
    const { studentId, duration, notes, bpm } = req.body;

    const practice = new Practice({
      studentId,
      duration,
      notes,
      bpm,
    });

    await practice.save();

    res.json({ message: "Saved", practice });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Save failed" });
  }
});

//
// ================= VIDEO UPLOAD (CLOUDINARY)
//
router.post("/video", upload.single("video"), async (req, res) => {
  try {
    const { studentId, notes, duration, bpm } = req.body;

    const practice = new Practice({
      studentId,
      notes,
      duration,
      bpm,
      videoUrl: req.file.path,
      publicId: req.file.filename,
    });

    await practice.save();

    res.status(201).json({
      message: "Video uploaded",
      practice,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

//
// ================= DELETE VIDEO (optional)
//
router.delete("/:id", async (req, res) => {
  try {
    const practice = await Practice.findById(req.params.id);

    if (!practice) {
      return res.status(404).json({ message: "Not found" });
    }

    if (practice.publicId) {
      await cloudinary.uploader.destroy(practice.publicId, {
        resource_type: "video",
      });
    }

    await Practice.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;