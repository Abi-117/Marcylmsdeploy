import express from "express";
import Assignment from "../models/Assignment.js";
import upload from "../middleware/upload.js"; // ✅ multer-cloudinary middleware

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
    console.log(err);
    res.status(500).json({ message: "Fetch failed" });
  }
});

//
// 📌 CREATE ASSIGNMENT (WITH FILE UPLOAD)
//
router.post("/create", upload.single("file"), async (req, res) => {
  try {
    const { title, studentName, due, teacherId } = req.body;

    const newTask = await Assignment.create({
      title,
      studentName,
      due,
      teacherId,

      // ✅ Cloudinary file URL
      fileUrl: req.file ? req.file.path : null,

      status: "Pending",
    });

    res.status(201).json(newTask);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

//
// 📌 UPDATE STATUS (Review / Submitted / Pending)
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
    console.log(err);
    res.status(500).json({ message: "Update failed" });
  }
});

//
// 📌 DELETE ASSIGNMENT (optional but useful)
//
router.delete("/:id", async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;