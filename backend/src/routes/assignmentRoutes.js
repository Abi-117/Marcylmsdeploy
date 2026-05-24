import express from "express";
import Assignment from "../models/Assignment.js";

const router = express.Router();

//
// 📌 GET TEACHER ASSIGNMENTS
//
router.get("/teacher/:teacherId", async (req, res) => {
  try {
    const data = await Assignment.find({
      teacherId: req.params.teacherId,
    }).sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

//
// 📌 CREATE ASSIGNMENT
//
router.post("/create", async (req, res) => {
  try {
    const newTask = await Assignment.create(req.body);
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: "Create failed" });
  }
});

//
// 📌 UPDATE STATUS (Review / Submit)
//
router.put("/status/:id", async (req, res) => {
  try {
    const updated = await Assignment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

router.post("/create", async (req, res) => {
  try {
    const data = await Assignment.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;