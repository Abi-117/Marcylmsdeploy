import express from "express";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Class from "../models/Class.js";
import Payment from "../models/Payment.js";

const router = express.Router();

// ======================================
// COMPLETE CURRENT GRADE
// ======================================

router.put("/complete-level/:studentId", async (req, res) => {
  try {
    // ======================================
    // GET STUDENT
    // ======================================

    const student = await User.findById(
      req.params.studentId
    );

    if (!student || student.role !== "student") {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // ======================================
    // GET CURRENT COURSE FROM USER
    // ======================================

    if (!student.course) {
      return res.status(400).json({
        success: false,
        message: "Current course not assigned",
      });
    }

    const currentCourse = await Course.findById(
      student.course
    );

    if (!currentCourse) {
      return res.status(400).json({
        success: false,
        message: "Current course not found",
      });
    }

    // ======================================
    // CURRENT LEVEL + GRADE
    // ======================================

    const currentMainLevel =
      String(currentCourse.mainLevel || "").trim();

    const currentGrade =
      String(currentCourse.grade || "").trim();

    const currentCourseName =
      String(currentCourse.name || "").trim();

    console.log("========== COMPLETE LEVEL ==========");
    console.log("Student:", student._id.toString());
    console.log("Course ID:", currentCourse._id.toString());
    console.log("Course:", currentCourseName);
    console.log("Main Level:", currentMainLevel);
    console.log("Current Grade:", currentGrade);
    console.log("====================================");

    // ======================================
    // VALIDATE CURRENT GRADE
    // ======================================

    if (!currentGrade) {
      return res.status(400).json({
        success: false,
        message: "Current course grade is empty",
      });
    }

    // ======================================
    // FIND NEXT GRADE
    // ======================================

  let nextGrade = "";

const normalizedGrade =
  currentGrade.toLowerCase().trim();

// ======================================
// BEGINNER -> INITIAL
// ======================================

if (normalizedGrade === "beginner") {
  nextGrade = "Initial";
}

// ======================================
// INITIAL -> GRADE 1
// ======================================

else if (normalizedGrade === "initial") {
  nextGrade = "Grade 1";
}

// ======================================
// GRADE X -> GRADE X + 1
// ======================================

else {
  const match =
    currentGrade.match(
      /^Grade\s*(\d+)$/i
    );

  if (!match) {
    return res.status(400).json({
      success: false,
      message:
        `Invalid grade format: ${currentGrade}`,
    });
  }

  const currentNumber =
    Number(match[1]);

  nextGrade =
    `Grade ${currentNumber + 1}`;
}

console.log(
  "CURRENT GRADE:",
  currentGrade
);

console.log(
  "NEXT GRADE:",
  nextGrade
);


    // ======================================
    // SAVE COMPLETED GRADE
    // ======================================

    if (
      !Array.isArray(
        student.completedLevels
      )
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
    // FIND NEXT COURSE
    // ======================================

    const nextCourse =
      await Course.findOne({
        name: currentCourseName,
        grade: nextGrade,
      });

    console.log(
      "Next Course:",
      nextCourse?._id || "NOT FOUND"
    );

    // ======================================
    // NO NEXT COURSE
    // ======================================

    if (!nextCourse) {

      student.progress = 100;

      await student.save();

      return res.json({
        success: true,

        message:
          `${currentGrade} completed successfully. No next grade found.`,

        completedLevel:
          currentGrade,

        currentLevel:
          currentMainLevel,

        currentGrade:
          currentGrade,

        completedLevels:
          student.completedLevels,

        progress: 100,

        finalLevel: true,
      });
    }

    // ======================================
    // MOVE TO NEXT COURSE
    // ======================================

    student.course =
      nextCourse._id;

    // Store current grade
    student.grade =
      nextCourse.grade;

    // Store main level
    student.level =
      nextCourse.mainLevel;

    // Keep selectedLevel compatible
    student.selectedLevel =
      nextCourse.grade;

    // Batch = current grade
    student.batch =
      nextCourse.grade;

    // Reset progress
    student.progress = 0;

    await student.save();

    // ======================================
    // RESPONSE
    // ======================================

    return res.json({
      success: true,

      message:
        `${currentGrade} completed successfully`,

      completedLevel:
        currentGrade,

      currentLevel:
        nextCourse.mainLevel,

      currentGrade:
        nextCourse.grade,

      completedLevels:
        student.completedLevels,

      progress: 0,

      finalLevel: false,

      nextCourse: {
        _id: nextCourse._id,
        name: nextCourse.name,
        mainLevel:
          nextCourse.mainLevel,
        grade:
          nextCourse.grade,
      },
    });

  } catch (err) {

    console.log(
      "COMPLETE LEVEL ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to complete grade",
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