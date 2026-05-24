import express from "express";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Class from "../models/Class.js";

const router = express.Router();


// ======================================
// GET TEACHER STUDENTS
// match by teacher.subject -> course name -> student.course id
// ======================================

router.get(
  "/teacher/:teacherId",
  async (req, res) => {

    try {

      const teacher = await User.findById(
        req.params.teacherId
      );

      if (!teacher || teacher.role !== "teacher") {
        return res.status(404).json({
          message: "Teacher not found",
        });
      }

      const matchingCourses = await Course.find({
        name: teacher.subject,
      }).select("_id");

      const courseIds = matchingCourses.map(
        (c) => String(c._id)
      );

      // status filter: "paid" | "pending" | "all" (default: all)
      const status = (req.query.status || "all").toLowerCase();

      const query = {
        role: "student",
        course: { $in: courseIds },
      };

      if (status === "paid") {
        query.paymentStatus = "Paid";
      } else if (status === "pending" || status === "unpaid") {
        query.paymentStatus = "Pending";
      }

      const students = await User.find(query)

  .populate("course")

  .select("-password");

      res.json(students);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: "Server Error",
      });

    }

  }
);


// ======================================
// UPDATE PROGRESS
// ======================================

router.put(
  "/progress/:id",
  async (req, res) => {

    try {

      const updated =
        await User.findByIdAndUpdate(

          req.params.id,

          {
            progress:
              req.body.progress,
          },

          {
            new: true,
          }

        );

      res.json(updated);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: "Update failed",
      });

    }

  }
);

router.get("/overview/:studentId", async (req, res) => {
  try {
    const studentId = req.params.studentId;

    const student = await User.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const classes = await Class.find({
      students: studentId,
    }).sort({ date: 1 });

    const safeClasses = classes || [];

    const nextClass =
      safeClasses.find((c) => c.status !== "Completed") || null;

    res.json({
      student: {
        name: student.name || "",
        course: student.courseName || "",
        level: student.level || "Beginner",
      },

      stats: {
        attended: safeClasses.filter((c) => c.status === "Completed").length,
        totalClasses: safeClasses.length,
        streak: 0,
        certificates: 0,
      },

      nextClass: nextClass
        ? {
            title: nextClass.title || "",
            teacher: nextClass.teacher || "",
            batchName: nextClass.batchName || "",
            date: nextClass.date || null,
            meetingLink: nextClass.meetingLink || "",
          }
        : null,

      progress: [
        { level: "Beginner", status: "active", progress: 60 },
        { level: "Intermediate", status: "locked", progress: 0 },
        { level: "Advanced", status: "locked", progress: 0 },
      ],

      reminders: [],
    });

  } catch (err) {
    console.log("OVERVIEW ERROR:", err);
    res.status(500).json({
      message: "Overview failed",
      error: err.message,
    });
  }
});


export default router;