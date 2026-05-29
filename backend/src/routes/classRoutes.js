import express from "express";
import mongoose from "mongoose";

import Class from "../models/Class.js";
import User from "../models/User.js";
import { getTeacherClasses } from "../controllers/classController.js";
import TeacherAttendance from "../models/TeacherAttendance.js";

const router = express.Router();


// =====================================
// GET ALL CLASSES
// =====================================

router.get("/", async (req, res) => {

  try {

    const classes = await Class.find({
  teacher: req.params.teacherId,
})
.populate({
  path: "students",
  select:
    "name email phone course selectedLevel paymentStatus progress",
})
.sort({ createdAt: -1 });

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

// router.get(
//   "/teacher/:teacherId",
//   async (req, res) => {

//     try {

//       const classes = await Class.find({

//         teacherId:
//           req.params.teacherId,

//       })

//         .populate({
//   path: "students",
//   select:
//     "name email phone paymentStatus selectedLevel availableDays fromTime toTime mode course",
//   populate: {
//     path: "course",
//     model: "Course",
//   },
// })

//         .sort({ date: -1 });

//       res.json(classes);

//     } catch (err) {

//       console.log(err);

//       res.status(500).json({
//         message: "Fetch failed",
//       });

//     }

//   }
// );


// =====================================
// CREATE CLASS
// =====================================
router.post("/", async (req, res) => {

  try {

    console.log(req.body);

    const {
      title,
      teacherId,
      courseName,
      courseLevel,
      date,
      platform,
      meetingLink,
      notes,
      students,
    } = req.body;

    // =========================
    // VALIDATION
    // =========================

    if (!teacherId) {
      return res.status(400).json({
        message: "Teacher ID missing",
      });
    }

    if (!students || students.length === 0) {
      return res.status(400).json({
        message: "Students missing",
      });
    }

    // =========================
    // FIND TEACHER
    // =========================

    const teacher = await User.findById(
      teacherId
    );

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    // =========================
    // CREATE CLASS
    // =========================

    const newClass = new Class({
      title,
      teacher: teacher.name,
      teacherId,
      batchName: courseName,
      courseName,
      date,
      platform,
      meetingLink,
      notes,
      duration: 60,
      status: "Upcoming",
      courseLevel,
      students,
    });

    await newClass.save();

    res.status(201).json({
      message: "Class created successfully",
      class: newClass,
    });

  } catch (err) {

    console.log("CLASS CREATE ERROR:", err);

    res.status(500).json({
      message: err.message,
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
// GET STUDENT CLASSES
// =====================================
router.get("/student/:studentId", async (req, res) => {
  try {
    const classes = await Class.find({
      students: req.params.studentId,
    })
      .populate("students", "name email")
      .sort({ date: -1 });

    // 🔥 ADD THIS MAPPING FIX
    const result = classes.map((c) => ({
      _id: c._id,
      title: c.title,
      teacher: c.teacher,
      date: c.date,
      platform: c.platform,
      status: c.status,
      meetingLink: c.meetingLink,
      recordingUrl: c.recordingUrl,

      // 🔥 IMPORTANT FIX
      courseName: c.courseName || c.batchName || "No Course",
      courseLevel: c.courseLevel || "Basic",
    }));

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Fetch failed",
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

// router.put(
//   "/status/:id",
//   async (req, res) => {

//     try {

//       const updated =
//         await Class.findByIdAndUpdate(

//           req.params.id,

//           {
//             status:
//               req.body.status,
//           },

//           {
//             new: true,
//           }

//         );

//       res.json(updated);

//     } catch (err) {

//       console.log(err);

//       res.status(500).json({
//         message:
//           "Status update failed",
//       });

//     }

//   }
// );

// GET CLASSES
router.get("/teacher/:teacherId", getTeacherClasses);
router.put(
  "/status/:id",
  async (req, res) => {

    try {

      const cls =
        await Class.findById(
          req.params.id
        );

      if (!cls) {

        return res.status(404).json({
          message: "Class not found",
        });

      }

      // UPDATE STATUS
      cls.status = req.body.status;

      await cls.save();

      // ===================================
      // AUTO TEACHER ATTENDANCE
      // ===================================

      if (
        req.body.status ===
        "Completed"
      ) {

        const exists =
          await TeacherAttendance.findOne({
            teacherId:
              cls.teacherId,
            classId: cls._id,
          });

        if (!exists) {

          await TeacherAttendance.create({

            teacherId:
              cls.teacherId,

            classId:
              cls._id,

            status:
              "Present",

            classTitle:
              cls.title,

            courseName:
              cls.courseName,

            date:
              cls.date,

          });

        }

      }

      res.json(cls);

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