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

    // ======================
    // GET STUDENT
    // ======================
    const student = await User.findById(studentId).populate("course");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // ======================
    // GET CLASSES
    // ======================
    const classes = await Class.find({
      students: studentId,
    }).sort({ date: 1 });

    const safeClasses = classes || [];

    const attended = safeClasses.filter(
      (c) => c.status === "Completed"
    ).length;

    const total = safeClasses.length;

    // ======================
    // NEXT CLASS
    // ======================
    const nextClass =
      safeClasses.find((c) => c.status !== "Completed") || null;

    // ======================
    // REAL COURSE DATA
    // ======================
    const course = student.course;

    // ======================
    // REAL LEARNING PATH
    // ======================
    let progress = [];

    if (course) {
      const percent =
        total === 0 ? 0 : Math.round((attended / total) * 100);

      progress = [
        {
          level: course.mainLevel || "Beginner",
          status: "active",
          progress: percent,
        },
        {
          level: "Intermediate",
          status: percent >= 60 ? "active" : "locked",
          progress: percent >= 60 ? percent - 60 : 0,
        },
        {
          level: "Advanced",
          status: percent >= 90 ? "active" : "locked",
          progress: percent >= 90 ? percent - 90 : 0,
        },
      ];
    }

    // ======================
    // RESPONSE
    // ======================
    res.json({
      student: {
        name: student.name || "",
        course: course?.name || student.courseName || "",
        level: course?.mainLevel || student.level || "Beginner",
      },

      stats: {
        attended,
        totalClasses: total,
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

      // 🔥 REAL LEARNING PATH (NO DUMMY)
      progress,

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