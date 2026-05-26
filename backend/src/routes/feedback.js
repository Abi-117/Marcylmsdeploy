import express from "express";
import Feedback from "../models/Feedback.js";

const router = express.Router();

//
// ===============================
// STUDENT SEND FEEDBACK
// ===============================
//
router.post("/create", async (req, res) => {
  try {
    const { studentId, teacherId, message, rating } = req.body;

    // ✅ VALIDATION (IMPORTANT)
    if (!studentId || !teacherId || !message) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const feedback = await Feedback.create({
      studentId,
      teacherId,
      message,
      rating: rating || 5,
    });

    res.status(201).json({
      message: "Feedback sent successfully",
      feedback,
    });
  } catch (err) {
    console.log("FEEDBACK ERROR:", err); // 👈 VERY IMPORTANT
    res.status(500).json({
      message: err.message,
    });
  }
});
//
// ===============================
// ADMIN GET ALL FEEDBACK
// ===============================
//
router.get("/all", async (req, res) => {
  try {
    const data = await Feedback.find()
      .populate("studentId", "name email")
      .populate("teacherId", "name email")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Fetch failed" });
  }
});


// ===============================
// GET FEEDBACK FOR TEACHER
// ===============================
router.get("/teacher/:teacherId", async (req, res) => {
  try {
    const data = await Feedback.find({
      teacherId: req.params.teacherId,
    })
      .populate("studentId", "name email")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Fetch failed" });
  }
});
export default router;