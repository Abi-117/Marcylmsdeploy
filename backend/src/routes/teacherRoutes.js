import express from "express";

import User from "../models/User.js";
import Class from "../models/Class.js";
import Course from "../models/Course.js";

const router = express.Router();

// ======================================
// TEACHER DASHBOARD
// ======================================
router.get("/dashboard/:teacherId", async (req, res) => {
  try {
    const teacherId = req.params.teacherId;

    const teacher = await User.findById(teacherId);

    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const subject = teacher.subject || "";

   const matchingCourses = await Course.find({
  name: subject,
}).select("_id");

const courseIds = matchingCourses.map(
  (c) => c._id.toString()
);

const students = await User.find({
  role: "student",
  course: { $in: courseIds },
}).select("-password");

const formattedStudents = await Promise.all(
  students.map(async (s) => {
    const course = await Course.findById(s.course);

    return {
      ...s.toObject(),
      courseName: course?.name || "No Course",
    };
  })
);
    // ✅ FIXED QUERY

    const classes = await Class.find({ teacherId }).sort({ date: 1 });

    const today = new Date().toDateString();

    const todayClasses = classes.filter(
      (c) =>
        c.date &&
        new Date(c.date).toDateString() === today
    );

    return res.json({
  students: formattedStudents,
  classes,
  stats: {
    todayClasses: todayClasses.length,
    students: formattedStudents.length,
    pendingReviews: 0,
    rating: 4.9,
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

router.post("/complete-course", async (req, res) => {
  const { userId, course, level } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
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
});
router.get(
  "/completed-students",
  async (
    req,
    res
  ) => {

    try {

      const students =
        await Enrollment.find({
          completed: true,
        })

        .populate(
          "student",
          "name"
        )

        .populate(
          "course",
          "title level"
        );

      // FORMAT

      const formatted =
        students.map(
          (item) => ({
            _id:
              item.student._id,

            name:
              item.student.name,

            course:
              item.course.title,

            level:
              item.course.level,

            teacherId:
              item.teacher,
          })
        );

      res.json(
        formatted
      );

    } catch (err) {

      res.status(500).json({
        message:
          err.message,
      });

    }
  }
);
router.get(
  "/students",

  async (
    req,
    res
  ) => {

    try {

      const students =
        await User.find({
          role:
            "student",
        })

        .select(
          "name"
        );

      res.json(
        students
      );

    } catch (err) {

      res.status(500).json({
        message:
          err.message,
      });

    }
  }
);
export default router;