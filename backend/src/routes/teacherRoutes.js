import express from "express";

import User from "../models/User.js";
import Class from "../models/Class.js";
import Course from "../models/Course.js";
import CertificateRequest from "../models/CertificateRequest.js";

// OPTIONAL
// import Assignment from "../models/Assignment.js";

const router = express.Router();

// ======================================
// TEACHER DASHBOARD
// ======================================
router.get("/teacher/dashboard/:teacherId", async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.teacherId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const students = await Student.find({
      teacher: teacher._id,
      paymentStatus: "Paid",
      classType: teacher.classType,
    }).populate("payments");

    const classes = await Class.find({
  teacherId,
  status: {
    $ne: "Completed",
  },
})
  .populate("students", "name email selectedLevel level mode")
  .sort({
    date: 1,
  });

    res.json({
      students,
      classes,
      stats: {
        students: students.length,
        totalClasses: classes.length,
        todayClasses: classes.filter(
          (c) =>
            new Date(c.date).toDateString() ===
            new Date().toDateString()
        ).length,
        completedClasses: classes.filter(
          (c) => c.status === "Completed"
        ).length,
        pendingReviews: 0,
        certificates: 0,
      },
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/student/teacher/:teacherId", async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.teacherId);

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    const query = {
      teacher: teacher._id,
      classType: teacher.classType,
    };

    if (
      req.query.status &&
      req.query.status !== "all"
    ) {
      query.paymentStatus =
        req.query.status === "paid"
          ? "Paid"
          : "Pending";
    }

    const students = await Student.find(query)
      .populate({
        path: "payments",
        populate: {
          path: "course",
        },
      });

    res.json(students);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/classes/teacher/:teacherId", async (req, res) => {
  try {
    const teacher = await Teacher.findById(
      req.params.teacherId
    );

    let classes = await Class.find({
      teacher: teacher._id,
    })
      .populate("teacher")
      .populate("students");

    classes = classes.map((cls) => ({
      ...cls.toObject(),
      students: cls.students.filter(
        (s) =>
          s.classType === teacher.classType &&
          s.paymentStatus === "Paid"
      ),
    }));

    res.json(classes);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/teacher-attendance/:teacherId", async (req, res) => {
  try {
    const teacher = await Teacher.findById(
      req.params.teacherId
    );

    const attendance = await Attendance.find({
      teacher: teacher._id,
      classType: teacher.classType,
    });

    res.json(attendance);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get(
  "/dashboard/:teacherId",
  async (req, res) => {

    try {

      const teacherId =
        req.params.teacherId;

      const teacher =
        await User.findById(
          teacherId
        );

      if (
        !teacher ||
        teacher.role !== "teacher"
      ) {

        return res
          .status(404)
          .json({
            message:
              "Teacher not found",
          });

      }

      const subject =
        teacher.subject || "";

      // ======================================
      // FIND STUDENTS
      // ======================================

      const matchingCourses =
        await Course.find({
          name: subject,
        }).select("_id");

      const courseIds =
        matchingCourses.map(
          (c) =>
            c._id.toString()
        );

      const students =
        await User.find({
          role: "student",
          course: {
            $in: courseIds,
          },
        }).select(
          "-password"
        );

      const formattedStudents =
        await Promise.all(

          students.map(
            async (s) => {

              const course =
                await Course.findById(
                  s.course
                );

              return {
                ...s.toObject(),

                courseName:
                  course?.name ||
                  "No Course",
              };

            }
          )
        );

      // ======================================
      // UPCOMING CLASSES ONLY
      // ======================================

      const classes =
        await Class.find({
          teacherId,

          status: {
            $ne: "Completed",
          },
        }).sort({
          date: 1,
        });

      // ======================================
      // TODAY CLASSES
      // ======================================

      const today =
        new Date().toDateString();

      const todayClasses =
        classes.filter(
          (c) =>
            c.date &&
            new Date(
              c.date
            ).toDateString() ===
              today
        );

      // ======================================
      // COMPLETED CLASSES
      // ======================================

      const completedClasses =
        await Class.countDocuments({
          teacherId,
          status:
            "Completed",
        });

      // ======================================
      // TOTAL CLASSES
      // ======================================

      const totalClasses =
        await Class.countDocuments({
          teacherId,
        });

      // ======================================
      // CERTIFICATES
      // ======================================

      const certificates =
        await CertificateRequest.countDocuments(
          {
            teacher:
              teacherId,
          }
        );

      // ======================================
      // PENDING REVIEWS
      // ======================================

      let pendingReviews =
        0;

      /*
      If Assignment model exists:

      pendingReviews =
        await Assignment.countDocuments({
          teacherId,
          status: "Pending",
        });
      */

      // ======================================
      // RESPONSE
      // ======================================

      return res.json({

        students:
          formattedStudents,

        classes,

        stats: {

          todayClasses:
            todayClasses.length,

          students:
            formattedStudents.length,

          pendingReviews,

          completedClasses,

          certificates,

          totalClasses,
        },
      });

    } catch (err) {

      console.log(
        "Dashboard error:",
        err
      );

      return res
        .status(500)
        .json({

          message:
            "Dashboard fetch failed",

          error:
            err.message,
        });

    }

  }
);

router.get("/:teacherId/students", async (req, res) => {
  try {
    const teacher = await User.findById(req.params.teacherId);

    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    // Teacher subject-க்கு match ஆகும் course
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
    }).select("_id name email course");

    res.json(students);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
});

// ======================================
// COMPLETE COURSE
// ======================================

router.post(
  "/complete-course",
  async (req, res) => {

    try {

      const {
        userId,
        course,
        level,
      } = req.body;

      const user =
        await User.findById(
          userId
        );

      if (!user) {

        return res
          .status(404)
          .json({
            message:
              "User not found",
          });

      }

      const certificate = {

        certificateId:
          "CERT-" +
          Date.now(),

        title:
          "Certificate of Completion",

        course,

        level,

        completedAt:
          new Date(),
      };

      user.certificates.push(
        certificate
      );

      user.completedLevels.push(
        level
      );

      await user.save();

      res.json({

        success: true,

        certificates:
          user.certificates,
      });

    } catch (err) {

      res
        .status(500)
        .json({
          message:
            err.message,
        });

    }

  }
);

// ======================================
// GET ALL STUDENTS
// ======================================

router.get(
  "/students",
  async (req, res) => {

    try {

      const students =
        await User.find({
          role:
            "student",
        }).select(
          "name"
        );

      res.json(
        students
      );

    } catch (err) {

      res
        .status(500)
        .json({
          message:
            err.message,
        });

    }

  }
);

export default router;