import express from "express";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Class from "../models/Class.js";
import Payment from "../models/Payment.js";

const router = express.Router();

// ======================================
// COMPLETE CURRENT LEVEL
// ======================================

router.put("/complete-level/:studentId", async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId);

    if (!student || student.role !== "student") {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // ======================================
    // CURRENT LEVEL
    // ======================================

    const currentLevel =
      student.selectedLevel ||
      student.level ||
      "Beginner";

    // ======================================
    // EXISTING COMPLETED LEVELS
    // ======================================

    if (!Array.isArray(student.completedLevels)) {
      student.completedLevels = [];
    }

    // ======================================
    // PREVENT DUPLICATE
    // ======================================

    if (!student.completedLevels.includes(currentLevel)) {
      student.completedLevels.push(currentLevel);
    }

    // ======================================
    // LEVEL ORDER
    // ======================================

    const levels = [
      "Beginner",
      "Intermediate",
      "Advanced",
    ];

    const currentIndex = levels.indexOf(currentLevel);

    // ======================================
    // INVALID LEVEL
    // ======================================

    if (currentIndex === -1) {
      return res.status(400).json({
        success: false,
        message: `Invalid level: ${currentLevel}`,
      });
    }

    // ======================================
    // ADVANCED = FINAL LEVEL
    // ======================================

    if (currentIndex === levels.length - 1) {
      student.progress = 100;

      await student.save();

      return res.json({
        success: true,
        message: "Advanced level completed",
        currentLevel: "Advanced",
        completedLevels: student.completedLevels,
        progress: 100,
        finalLevel: true,
      });
    }

    // ======================================
    // NEXT LEVEL
    // ======================================

    const nextLevel = levels[currentIndex + 1];

    student.selectedLevel = nextLevel;
    student.level = nextLevel;

    // New level starts from 0%
    student.progress = 0;

    await student.save();

    return res.json({
      success: true,
      message: `${currentLevel} completed successfully`,
      completedLevel: currentLevel,
      currentLevel: nextLevel,
      completedLevels: student.completedLevels,
      progress: 0,
      finalLevel: false,
    });

  } catch (err) {
    console.log("COMPLETE LEVEL ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to complete level",
      error: err.message,
    });
  }
});


// ======================================
// GET TEACHER STUDENTS
// match by teacher.subject -> course name -> student.course id
// ======================================
router.get("/teacher/:teacherId", async (req, res) => {
  try {
    const teacher = await User.findById(req.params.teacherId);

    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    const matchingCourses = await Course.find({
      name: teacher.subject,
    }).select("_id");

    const courseIds = matchingCourses.map((c) => String(c._id));

    const status = (req.query.status || "all").toLowerCase();

    const query = {
      role: "student",
      course: { $in: courseIds },
    };

    if (status === "paid") {
      query.paymentStatus = "Paid";
    } else if (status === "pending") {
      query.paymentStatus = "Pending";
    }

    const students = await User.find(query)
      .populate("course")
      .select("-password");

    // 🔥 ADD PAYMENT HISTORY (THIS IS THE FIX)
   const enrichedStudents = await Promise.all(
  students.map(async (s) => {
    const payments = await Payment.find({
      student: s._id,
    })
      .populate("course")
      .sort({ createdAt: 1 });

    const completedLevels = Array.isArray(s.completedLevels)
      ? s.completedLevels
      : [];

    const currentLevel =
      s.selectedLevel ||
      s.level ||
      payments[payments.length - 1]?.course?.grade ||
      "Beginner";

    return {
      ...s.toObject(),

      payments,

      // CURRENT LEVEL
      currentLevel,

      // ACTUAL COMPLETED LEVELS
      completedLevels,

      // COUNT
      completedLevelCount: completedLevels.length,
    };
  })
);

res.json(enrichedStudents);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});


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
    const student = await User.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // ======================
    // GET REAL COURSE
    // ======================
    let course = null;

    if (student.course) {
      course = await Course.findById(student.course);
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
      safeClasses.find(
        (c) => c.status !== "Completed"
      ) || null;

    // ======================
    // LEARNING PROGRESS
    // ======================
    let progress = [];

    if (course) {
      const percent =
        total === 0
          ? 0
          : Math.round(
              (attended / total) * 100
            );

      progress = [
        {
          level:
            course.mainLevel ||
            "Beginner",
          status: "active",
          progress: percent,
        },
        {
          level: "Intermediate",
          status:
            percent >= 60
              ? "active"
              : "locked",
          progress:
            percent >= 60
              ? percent - 60
              : 0,
        },
        {
          level: "Advanced",
          status:
            percent >= 90
              ? "active"
              : "locked",
          progress:
            percent >= 90
              ? percent - 90
              : 0,
        },
      ];
    }

    // ======================
    // RESPONSE
    // ======================
    res.json({
      student: {
        _id: student._id,

        name: student.name || "",

        course:
          student.course || "",

        courseName:
          course?.name || "-",

        level:
          course?.mainLevel ||
          student.level ||
          "Beginner",

        batch:
          course?.grade ||
          student.batch ||
          "",
      },

      stats: {
        attended,
        totalClasses: total,
        streak: 0,
        certificates: 0,
      },

      nextClass: nextClass
        ? {
            title:
              nextClass.title || "",

            teacher:
              nextClass.teacher ||
              "",

            batchName:
              nextClass.batchName ||
              "",

            date:
              nextClass.date ||
              null,

            meetingLink:
              nextClass.meetingLink ||
              "",
          }
        : null,

      progress,

      reminders: [],
    });
  } catch (err) {
    console.log(
      "OVERVIEW ERROR:",
      err
    );

    res.status(500).json({
      message: "Overview failed",
      error: err.message,
    });
  }
});

export default router;