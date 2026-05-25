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

    // ====================================
    // TODAY START + END
    // ====================================

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

    // ====================================
    // CHECK EXISTING
    // ====================================

    let attendance =
      await Attendance.findOne({

        classId,

        studentId,

        date: {
          $gte: start,
          $lte: end,
        },

      });

    // ====================================
    // UPDATE
    // ====================================

    if (attendance) {

      attendance.status =
        status;

      await attendance.save();

    } else {

      attendance =
        await Attendance.create({

          classId,

          studentId,

          status,

          date: new Date(),

        });

    }

    res.json(attendance);

  } catch (err) {

    console.log(
      "MARK ATTENDANCE ERROR:",
      err
    );

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