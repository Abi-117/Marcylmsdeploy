import mongoose from "mongoose";

import Attendance from "../models/Attendance.js";

// ====================================
// MARK ATTENDANCE
// ====================================

export const markAttendance = async (
  req,
  res
) => {

  try {

    const {
      classId,
      studentId,
      status,
    } = req.body;

    // =========================
    // FIND CLASS
    // =========================

    const cls =
      await Class.findById(
        classId
      );

    if (!cls) {

      return res.status(404).json({
        message: "Class not found",
      });

    }

    // =========================
    // ONLY LIVE CLASS
    // =========================

    if (cls.status !== "Live") {

      return res.status(400).json({
        message:
          "Attendance allowed only during live class",
      });

    }

    // =========================
    // LOCK CHECK
    // =========================

    if (cls.attendanceLocked) {

      return res.status(400).json({
        message:
          "Attendance locked",
      });

    }

    // =========================
    // DATE
    // =========================

    const today =
      new Date()
        .toISOString()
        .split("T")[0];

    // =========================
    // UPSERT
    // =========================

    const attendance =
      await Attendance.findOneAndUpdate(

        {
          classId,
          studentId,
          date: today,
        },

        {
          classId,
          studentId,
          status,
          date: today,
        },

        {
          upsert: true,
          new: true,
        }

      );

    res.json(attendance);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message,
    });

  }

};

// ====================================
// GET STUDENT ATTENDANCE
// ====================================

export const getStudentAttendance =
  async (req, res) => {

    try {

      const {
        studentId,
      } = req.params;

      const data =
        await Attendance.find({

          studentId:
            new mongoose.Types.ObjectId(
              studentId
            ),

        })

          .populate(
            "classId",
            "title courseName date"
          )

          .sort({
            createdAt: -1,
          });

      // ====================================
      // FORMAT
      // ====================================

      const result =
        data.map((a) => ({

          _id: a._id,

          classTitle:
            a.classId?.title ||
            "Untitled Class",

          courseName:
            a.classId?.courseName ||
            "No Course",

          date: a.date,

          status: a.status,

        }));

      console.log(
        "ATTENDANCE RESULT:",
        result
      );

      res.json(result);

    } catch (err) {

      console.log(
        "GET ATTENDANCE ERROR:",
        err
      );

      res.status(500).json({
        message: err.message,
      });

    }

  };

  // ======================================
// TEACHER VIEW ALL ATTENDANCE
// ======================================

export const getAllAttendance = async (req, res) => {
  try {

    const data = await Attendance.find()

      .populate(
        "studentId",
        "name email"
      )

      .populate(
        "classId",
        "title courseName"
      )

      .sort({ createdAt: -1 });

    const result = data.map((a) => ({
      _id: a._id,

      studentName:
        a.studentId?.name,

      studentEmail:
        a.studentId?.email,

      classTitle:
        a.classId?.title,

      courseName:
        a.classId?.courseName,

      status:
        a.status,

      date:
        a.date,
    }));

    res.json(result);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message,
    });

  }
};