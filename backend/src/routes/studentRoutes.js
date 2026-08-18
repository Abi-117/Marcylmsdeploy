import express from "express";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Class from "../models/Class.js";
import Payment from "../models/Payment.js";

const router = express.Router();

// ======================================
// COMPLETE CURRENT GRADE
// ======================================

// ======================================
// COMPLETE CURRENT LEVEL
// ======================================

// ======================================
// COMPLETE CURRENT LEVEL
// ======================================

router.put(
  "/complete-level/:studentId",
  async (req, res) => {
    try {
      const { studentId } = req.params;

      const student = await User.findById(studentId)
        .populate("course");

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }

      if (student.role !== "student") {
        return res.status(400).json({
          success: false,
          message: "User is not a student",
        });
      }

      // ======================================
      // CURRENT COURSE
      // ======================================

      const currentCourse = student.course;

      if (!currentCourse) {
        return res.status(400).json({
          success: false,
          message: "Current course is not assigned",
        });
      }

      // ======================================
      // CURRENT GRADE
      // IMPORTANT:
      // Current course grade is the real grade
      // ======================================

      const currentGrade = currentCourse.grade;

      if (!currentGrade) {
        return res.status(400).json({
          success: false,
          message: "Current course grade is missing",
        });
      }

      console.log("CURRENT GRADE:", currentGrade);

      // ======================================
      // CHECK WHETHER THIS GRADE WAS PAID
      // ======================================

      const paidLevel = Array.isArray(
        student.levelHistory
      )
        ? student.levelHistory.find(
            (history) => {
              const historyCourseId =
                history.course?._id ||
                history.course;

              return (
                String(historyCourseId) ===
                  String(currentCourse._id) &&
                history.grade === currentGrade
              );
            }
          )
        : null;

      // ======================================
      // DO NOT COMPLETE UNPAID LEVEL
      // ======================================

      if (!paidLevel) {
        return res.status(400).json({
          success: false,
          message:
            `This level has not been paid for: ${currentGrade}`,
        });
      }

      // ======================================
      // ADD ONLY CURRENT PAID GRADE
      // ======================================

      if (
        !Array.isArray(student.completedLevels)
      ) {
        student.completedLevels = [];
      }

      if (
        !student.completedLevels.includes(
          currentGrade
        )
      ) {
        student.completedLevels.push(
          currentGrade
        );
      }

      // ======================================
      // GRADE ORDER
      // ======================================

      const gradeOrder = [
        "Beginner",
        "Initial",
        "Grade 1",
        "Grade 2",
        "Grade 3",
        "Grade 4",
        "Grade 5",
        "Grade 6",
        "Grade 7",
        "Grade 8",
      ];

      const currentIndex =
        gradeOrder.indexOf(currentGrade);

      if (currentIndex === -1) {
        return res.status(400).json({
          success: false,
          message:
            `Invalid grade format: ${currentGrade}`,
        });
      }

      const nextGrade =
        gradeOrder[currentIndex + 1];

      // ======================================
      // FINAL LEVEL
      // ======================================

      if (!nextGrade) {
        student.progress = 100;

        await student.save();

        return res.json({
          success: true,
          message:
            "Final level completed successfully",
          completedGrade: currentGrade,
          nextGrade: null,
        });
      }

      // ======================================
      // FIND NEXT COURSE
      // ======================================

      const nextCourse =
        await Course.findOne({
          name: currentCourse.name,
          mainLevel: currentCourse.mainLevel,
          grade: nextGrade,
        });

      // ======================================
      // NEXT COURSE NOT CREATED
      // ======================================

      if (!nextCourse) {
        // IMPORTANT:
        // Current level is completed,
        // but don't pretend next level is available.

        await student.save();

        return res.json({
          success: true,

          message:
            `${currentGrade} completed. Next level ${nextGrade} is not available yet.`,

          completedGrade:
            currentGrade,

          nextGrade,

          nextCourse: null,
        });
      }

      // ======================================
      // MOVE STUDENT TO NEXT COURSE
      // ======================================

      student.course =
        nextCourse._id;

      // selectedLevel = CURRENT GRADE
      student.selectedLevel =
        nextCourse.grade;

      // level = MAIN LEVEL
      student.level =
        nextCourse.mainLevel;

      // Reset evaluation
      student.progress = 0;

      // ======================================
      // SAVE
      // ======================================

      await student.save();

      // ======================================
      // GET UPDATED STUDENT
      // ======================================

      const updatedStudent =
        await User.findById(studentId)
          .select("-password")
          .populate(
            "course",
            "name mainLevel grade fee classMode maxStudents"
          );

      return res.json({
        success: true,

        message:
          "Level completed successfully",

        completedGrade:
          currentGrade,

        nextGrade:
          nextCourse.grade,

        nextCourse: {
          _id: nextCourse._id,
          name: nextCourse.name,
          mainLevel:
            nextCourse.mainLevel,
          grade:
            nextCourse.grade,
        },

        student:
          updatedStudent,
      });

    } catch (error) {
      console.error(
        "COMPLETE LEVEL ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to complete level",
        error: error.message,
      });
    }
  }
);

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

    const completedLevels =
      Array.isArray(s.completedLevels)
        ? s.completedLevels
        : [];

    // ======================================
    // CURRENT COURSE = STUDENT COURSE
    // ======================================

    const currentCourse = s.course;

    const currentLevel =
      currentCourse?.grade ||
      s.selectedLevel ||
      "Not Assigned";

    return {
      ...s.toObject(),

      payments,

      // CURRENT GRADE
      currentLevel,

      // CURRENT COURSE
      currentCourse: currentCourse || null,

      // COMPLETED GRADES
      completedLevels,

      // COUNT
      completedLevelCount:
        completedLevels.length,
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