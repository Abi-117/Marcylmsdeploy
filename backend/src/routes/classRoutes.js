import express from "express";
import mongoose from "mongoose";

import Class from "../models/Class.js";
import User from "../models/User.js";

const router = express.Router();


// =====================================
// GET ALL CLASSES
// =====================================

router.get("/", async (req, res) => {

  try {

    const classes = await Class.find()
      .populate("students", "name email")
      .sort({ date: 1 });

    res.json(classes);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Fetch failed",
    });

  }

});


// =====================================
// GET SINGLE CLASS
// =====================================

router.get("/:id", async (req, res) => {

  try {

    const classItem = await Class.findById(
      req.params.id
    ).populate(
      "students",
      "name email phone"
    );

    if (!classItem) {

      return res.status(404).json({
        message: "Class not found",
      });

    }

    res.json(classItem);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Fetch failed",
    });

  }

});


// =====================================
// GET TEACHER CLASSES
// =====================================

router.get(
  "/teacher/:teacherId",
  async (req, res) => {

    try {

      const classes = await Class.find({

        teacherId:
          req.params.teacherId,

      })

        .populate(
          "students",
          "name email phone paymentStatus"
        )

        .sort({ date: -1 });

      res.json(classes);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: "Fetch failed",
      });

    }

  }
);


// =====================================
// CREATE CLASS
// =====================================

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

    const teacher =
      await User.findById(
        teacherId
      );

    if (!teacher) {

      return res.status(404).json({
        message: "Teacher not found",
      });

    }

    // =========================
    // FIND STUDENTS
    // SAME COURSE ONLY
    // =========================

    const students =
      await User.find({

        role: "student",

        paymentStatus: "Paid",

        courseName:
          teacher.courseName,

      });

    // =========================
    // CREATE CLASS
    // =========================

    const newClass =
      await Class.create({

        title,

        teacherId,

        teacher:
          teacher.name,

        batchName:
          teacher.courseName,

        date: new Date(
          `${date}T${time}`
        ),

        platform,

        meetingLink,

        notes,

        duration: 60,

        status: "Upcoming",

        courseName:
          teacher.courseName,

        students: students.map(
          (s) => s._id
        ),

      });

    res.status(201).json({

      message:
        "Class created successfully",

      class: newClass,

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message:
        "Create class failed",
    });

  }

});


// =====================================
// UPDATE CLASS
// =====================================

router.put("/:id", async (req, res) => {

  try {

    const updated =
      await Class.findByIdAndUpdate(

        req.params.id,

        req.body,

        {
          new: true,
        }

      );

    if (!updated) {

      return res.status(404).json({
        message: "Class not found",
      });

    }

    res.json(updated);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Update failed",
    });

  }

});


// =====================================
// DELETE CLASS
// =====================================

router.delete("/:id", async (req, res) => {

  try {

    const deleted =
      await Class.findByIdAndDelete(
        req.params.id
      );

    if (!deleted) {

      return res.status(404).json({
        message: "Class not found",
      });

    }

    res.json({
      message:
        "Deleted successfully",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Delete failed",
    });

  }

});


// =====================================
// MARK ATTENDANCE
// =====================================

router.put(
  "/attendance/:id",
  async (req, res) => {

    try {

      const updated =
        await Class.findByIdAndUpdate(

          req.params.id,

          {
            attendanceMarked: true,
          },

          {
            new: true,
          }

        );

      res.json(updated);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          "Attendance update failed",
      });

    }

  }
);


// =====================================
// UPDATE STATUS
// =====================================

router.put(
  "/status/:id",
  async (req, res) => {

    try {

      const updated =
        await Class.findByIdAndUpdate(

          req.params.id,

          {
            status:
              req.body.status,
          },

          {
            new: true,
          }

        );

      res.json(updated);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          "Status update failed",
      });

    }

  }
);

export default router;