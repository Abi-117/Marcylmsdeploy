import mongoose from "mongoose";
import Class from "../models/Class.js";
import Attendance from "../models/Attendance.js";

// ====================================
// MARK ATTENDANCE (SAFE + NO CRASH)
// ====================================

export const markAttendance = async (req, res) => {
  try {
    const {
      classId,
      studentId,
      status,
    } = req.body;

    // =========================
    // VALIDATION
    // =========================

    if (!classId || !studentId) {
      return res.status(400).json({
        message:
          "classId and studentId are required",
      });
    }

    // =========================
    // FIND CLASS
    // =========================

    const cls =
      await Class.findById(classId);

    if (!cls) {
      return res.status(404).json({
        message: "Class not found",
      });
    }

    // =========================
    // GET COURSE NAME
    // =========================

    const courseName =
      cls.courseName ||
      cls.course ||
      "No Course";

    // =========================
    // DATE RANGE
    // =========================

    const start = new Date();

    start.setHours(
      0,
      0,
      0,
      0
    );

    const end = new Date();

    end.setHours(
      23,
      59,
      59,
      999
    );

    // =========================
    // UPSERT ATTENDANCE
    // =========================

    const attendance =
      await Attendance.findOneAndUpdate(
        {
          classId,
          studentId,
          date: {
            $gte: start,
            $lte: end,
          },
        },

        {
          classId,
          studentId,

          status:
            status || "Present",

          courseName,

          date: new Date(),
        },

        {
          upsert: true,
          new: true,
        }
      );

    res.json({
      success: true,
      data: attendance,
    });

  } catch (err) {

    console.log(
      "MARK ATTENDANCE ERROR:",
      err
    );

    res.status(500).json({
      message:
        err.message ||
        "Server error",
    });
  }
};

// ====================================
// GET STUDENT ATTENDANCE
// ====================================

export const getStudentAttendance = async (
  req,
  res
) => {
  try {

    const { studentId } =
      req.params;

    if (!studentId) {
      return res.status(400).json({
        message:
          "studentId required",
      });
    }

    const data =
      await Attendance.find({
        studentId,
      })
        .populate(
          "classId",
          "title courseName date"
        )
        .sort({
          createdAt: -1,
        });

    const result =
      data.map((a) => ({
        _id: a._id,

        classTitle:
          a.classId?.title ||
          "Untitled Class",

        // IMPORTANT
        courseName:
          a.courseName ||
          a.classId?.courseName ||
          "No Course",

        date: a.date,

        status: a.status,
      }));

    res.json(result);

  } catch (err) {

    console.log(
      "GET STUDENT ATTENDANCE ERROR:",
      err
    );

    res.status(500).json({
      message:
        err.message ||
        "Server error",
    });
  }
};

// ====================================
// TEACHER - VIEW ALL ATTENDANCE
// ====================================

export const getAllAttendance = async (req, res) => {
  try {
    const data = await Attendance.find()
      .populate("studentId", "name email")
      .populate("classId", "title courseName")
      .sort({ createdAt: -1 });

    const result = data.map((a) => ({
      _id: a._id,
      studentName: a.studentId?.name || "Unknown",
      studentEmail: a.studentId?.email || "",
      classTitle: a.classId?.title || "",
      courseName:
  a.courseName ||
  a.classId?.courseName ||
  "No Course", // FIX HERE
      status: a.status,
      date: a.date,
    }));

    res.json(result);
  } catch (err) {
    console.log("GET ALL ATTENDANCE ERROR:", err);
    res.status(500).json({
      message: err.message || "Server error",
    });
  }
};