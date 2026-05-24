import express from "express";

import User from "../models/User.js";
import Class from "../models/Class.js";
import Course from "../models/Course.js";

const router = express.Router();

// ======================================
// TEACHER DASHBOARD
// ======================================

router.get(
  "/dashboard/:teacherId",

  async (req, res) => {

    try {

      const teacherId =
        req.params.teacherId;

      // resolve teacher's subject -> matching course ids
      const teacher = await User.findById(teacherId);

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

      // =========================
      // GET PAID STUDENTS (for this teacher's course)
      // =========================

      const students =
        await User.find({

          role: "student",

          course: { $in: courseIds },

          paymentStatus: "Paid",

        }).select("-password");

      // =========================
      // GET CLASSES
      // =========================

      const classes =
        await Class.find({

          teacherId,

        }).sort({ date: 1 });

      // =========================
      // TODAY CLASSES
      // =========================

      const today =
        new Date().toDateString();

      const todayClasses =
        classes.filter(

          (c) =>

            new Date(
              c.date
            ).toDateString() ===
            today

        );

      // =========================
      // RESPONSE
      // =========================

      res.json({

        students,

        classes,

        stats: {

          todayClasses:
            todayClasses.length,

          students:
            students.length,

          pendingReviews: 0,

          rating: 4.9,

        },

      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        message:
          "Dashboard fetch failed",

      });

    }

  }
);

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

export default router;