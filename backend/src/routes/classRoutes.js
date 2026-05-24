import express from "express";

import Class from "../models/Class.js";

const router = express.Router();


// =====================================
// GET ALL CLASSES
// =====================================

router.get("/", async (req, res) => {

  try {

    const classes = await Class.find()
      .sort({
        date: -1,
      });

    res.json(classes);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});


// =====================================
// CREATE CLASS
// =====================================

router.post("/", async (req, res) => {

  try {

    const {

      title,
      batchName,
      teacher,
      status,
      platform,
      date,
      meetingLink,
      notes,

    } = req.body;

    const newClass = await Class.create({

      title,
      batchName,
      teacher,
      status,
      platform,
      date,
      meetingLink,
      notes,

    });

    res.status(201).json({

      message: "Class created",

      class: newClass,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});


// =====================================
// UPDATE CLASS
// =====================================

router.put("/:id", async (req, res) => {

  try {

    const updatedClass =
      await Class.findByIdAndUpdate(

        req.params.id,

        req.body,

        {
          new: true,
        }
      );

    if (!updatedClass) {

      return res.status(404).json({
        message: "Class not found",
      });
    }

    res.json({

      message: "Class updated",

      class: updatedClass,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});


// =====================================
// DELETE CLASS
// =====================================

router.delete("/:id", async (req, res) => {

  try {

    const deletedClass =
      await Class.findByIdAndDelete(
        req.params.id
      );

    if (!deletedClass) {

      return res.status(404).json({
        message: "Class not found",
      });
    }

    res.json({
      message: "Class deleted",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const classes = await Class.find().sort({ date: 1 });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET single class
router.get("/:id", async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);
    if (!classItem) return res.status(404).json({ message: "Not found" });
    res.json(classItem);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE class (admin)
router.post("/", async (req, res) => {
  try {
    const newClass = await Class.create(req.body);
    res.status(201).json(newClass);
  } catch (err) {
    res.status(400).json({ message: "Invalid data" });
  }
});

// UPDATE class
router.put("/:id", async (req, res) => {
  try {
    const updated = await Class.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Update failed" });
  }
});

// DELETE class
router.delete("/:id", async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

// 📌 CREATE CLASS (Schedule Class Button)
//
router.post("/create", async (req, res) => {
  try {
    const newClass = await Class.create(req.body);
    res.status(201).json(newClass);
  } catch (err) {
    res.status(500).json({ message: "Class creation failed" });
  }
});

//
// 📌 GET ALL CLASSES (Teacher Dashboard)
//
router.get("/", async (req, res) => {
  try {
    const classes = await Class.find().sort({ date: 1 });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

//
// 📌 GET TEACHER CLASSES
//
router.get("/teacher/:teacherId", async (req, res) => {
  try {
    const classes = await Class.find({
      teacherId: req.params.teacherId,
    }).sort({ date: 1 });

    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
});
router.get("/teacher/:teacherId", async (req, res) => {
  try {
    const data = await Class.find({
      teacherId: req.params.teacherId,
    }).sort({ date: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
});
// 📌 CREATE CLASS
//
router.post("/create", async (req, res) => {
  try {
    const newClass = await Class.create(req.body);
    res.status(201).json(newClass);
  } catch (err) {
    res.status(500).json({ message: "Create failed" });
  }
});

// 📌 MARK ATTENDANCE
//
router.put("/attendance/:id", async (req, res) => {
  try {
    const updated = await Class.findByIdAndUpdate(
      req.params.id,
      { attendanceMarked: true },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Attendance update failed" });
  }
});

// 📌 UPDATE STATUS (Live / Completed)
//
router.put("/status/:id", async (req, res) => {
  try {
    const updated = await Class.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Status update failed" });
  }
});
router.post("/", async (req, res) => {
  try {

    const {
      title,
      date,
      time,
      platform,
      meetingLink,
      notes,
      teacherId,
    } = req.body;

    // =========================
    // FIND TEACHER
    // =========================

    const teacher = await User.findById(
      teacherId
    );

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    // =========================
    // FIND PAID STUDENTS
    // SAME COURSE ONLY
    // =========================

    const students = await User.find({
      role: "student",
      paymentStatus: "Paid",
      courseName: teacher.courseName,
    });

    // =========================
    // CREATE CLASS
    // =========================

    const newClass = await Class.create({

      title,

      teacher: teacher.name,

      teacherId,

      date: new Date(
        `${date}T${time}`
      ),

      platform,

      meetingLink,

      notes,

      status: "Upcoming",

      // AUTO COURSE
      courseName:
        teacher.courseName,

      // AUTO STUDENTS
      students: students.map(
        (s) => s._id
      ),

    });

    res.json(newClass);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Create class failed",
    });

  }
});

export default router;