import express from "express";

import User from "../models/User.js";
import Class from "../models/Class.js";
import Course from "../models/Course.js";
import CertificateRequest from "../models/CertificateRequest.js";

const router = express.Router();

// ======================================
// TEACHER DASHBOARD
// ======================================

router.get("/dashboard/:teacherId", async (req, res) => {
  try {
    const teacherId = req.params.teacherId;

    // ======================================
    // FIND TEACHER
    // ======================================

    const teacher = await User.findById(teacherId);

    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    // ======================================
    // TEACHER SUBJECT
    // ======================================

    const subject = teacher.subject || "";

    // ======================================
    // FIND TEACHER COURSE
    // ======================================

    const matchingCourses = await Course.find({
      name: subject,
    }).select("_id name");

    const courseIds = matchingCourses.map(
      (course) => course._id
    );

    // ======================================
    // FIND TEACHER'S STUDENTS
    // ======================================

    const students = await User.find({
      role: "student",
      course: {
        $in: courseIds,
      },
    })
      .select("-password")
      .populate("course", "name");

    // ======================================
    // FORMAT STUDENTS
    // ======================================

    const formattedStudents = students.map((s) => ({
      ...s.toObject(),

      courseName:
        s.course?.name || "No Course",

      selectedLevel:
        s.selectedLevel ||
        s.level ||
        "Not Assigned",
    }));

    // ======================================
    // UPCOMING CLASSES
    // ======================================

    const classes = await Class.find({
      teacherId: teacherId,
      status: {
        $ne: "Completed",
      },
    })
      .populate(
        "students",
        "name email selectedLevel level course mode paymentStatus"
      )
      .sort({
        date: 1,
      });

    // ======================================
    // TODAY CLASSES
    // ======================================

    const today = new Date().toDateString();

    const todayClasses = classes.filter(
      (c) =>
        c.date &&
        new Date(c.date).toDateString() === today
    );

    // ======================================
    // COMPLETED CLASSES
    // ======================================

    const completedClasses =
      await Class.countDocuments({
        teacherId: teacherId,
        status: "Completed",
      });

    // ======================================
    // TOTAL CLASSES
    // ======================================

    const totalClasses =
      await Class.countDocuments({
        teacherId: teacherId,
      });

    // ======================================
    // CERTIFICATES
    // ======================================

    const certificates =
      await CertificateRequest.countDocuments({
        teacher: teacherId,
      });

    // ======================================
    // PENDING REVIEWS
    // ======================================

    const pendingReviews = 0;

    // ======================================
    // RESPONSE
    // ======================================

    return res.json({
      students: formattedStudents,

      classes,

      stats: {
        todayClasses: todayClasses.length,

        students: formattedStudents.length,

        pendingReviews,

        completedClasses,

        certificates,

        totalClasses,
      },
    });
  } catch (err) {
    console.log("Dashboard error:", err);

    return res.status(500).json({
      message: "Dashboard fetch failed",
      error: err.message,
    });
  }
});

// ======================================
// GET TEACHER STUDENTS
// ======================================

router.get("/:teacherId/students", async (req, res) => {
  try {
    const teacherId = req.params.teacherId;

    const teacher = await User.findById(teacherId);

    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    const course = await Course.findOne({
      name: teacher.subject,
    });

    if (!course) {
      return res.json([]);
    }

    const students = await User.find({
      role: "student",
      course: course._id,
      paymentStatus: "Paid",
    })
      .select(
        "_id name email course selectedLevel level mode paymentStatus"
      )
      .populate("course", "name");

    const formattedStudents = students.map((student) => ({
      ...student.toObject(),

      courseName:
        student.course?.name || "No Course",

      selectedLevel:
        student.selectedLevel ||
        student.level ||
        "Not Assigned",
    }));

    res.json(formattedStudents);
  } catch (err) {
    console.log("GET TEACHER STUDENTS ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// ======================================
// COMPLETE COURSE
// ======================================

router.post("/complete-course", async (req, res) => {
  try {
    const {
      userId,
      course,
      level,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const certificate = {
      certificateId: "CERT-" + Date.now(),

      title: "Certificate of Completion",

      course,

      level,

      completedAt: new Date(),
    };

    user.certificates.push(certificate);

    user.completedLevels.push(level);

    await user.save();

    res.json({
      success: true,
      certificates: user.certificates,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ======================================
// GET ALL STUDENTS
// ======================================

router.get("/students", async (req, res) => {
  try {
    const students = await User.find({
      role: "student",
    }).select("name");

    res.json(students);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});


// ======================================
// COMPLETE CURRENT LEVEL
// ======================================

router.put("/complete-level/:studentId", async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId);

    if (!student || student.role !== "student") {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const currentLevel =
      student.selectedLevel ||
      student.level ||
      "Beginner";

    // ======================================
    // CHECK ALREADY COMPLETED
    // ======================================

    const alreadyCompleted =
      Array.isArray(student.completedLevels) &&
      student.completedLevels.includes(currentLevel);

    if (!alreadyCompleted) {
      student.completedLevels.push(currentLevel);
    }

    // ======================================
    // NEXT LEVEL
    // ======================================

    const levelOrder = [
      "Beginner",
      "Intermediate",
      "Advanced",
    ];

    const currentIndex =
      levelOrder.indexOf(currentLevel);

    if (
      currentIndex === -1 ||
      currentIndex === levelOrder.length - 1
    ) {
      // Advanced is already the final level
      student.progress = 100;

      await student.save();

      return res.json({
        success: true,
        message: "Final level completed",
        currentLevel,
        completedLevels: student.completedLevels,
        progress: student.progress,
      });
    }

    const nextLevel =
      levelOrder[currentIndex + 1];

    // ======================================
    // MOVE TO NEXT LEVEL
    // ======================================

    student.selectedLevel = nextLevel;
    student.level = nextLevel;

    // Reset progress for new level
    student.progress = 0;

    await student.save();

    res.json({
      success: true,

      message: `${currentLevel} completed`,

      completedLevel: currentLevel,

      currentLevel: nextLevel,

      completedLevels: student.completedLevels,

      progress: student.progress,
    });
  } catch (err) {
    console.log(
      "COMPLETE LEVEL ERROR:",
      err
    );

    res.status(500).json({
      message: "Failed to complete level",
      error: err.message,
    });
  }
});

export default router;