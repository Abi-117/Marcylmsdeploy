import Attendance from "../models/Attendance.js";
import Class from "../models/Class.js";

// ================================
// TEACHER: MARK ATTENDANCE
// ================================
export const markAttendance = async (req, res) => {
  try {

    console.log("BODY:", req.body);

    const {
      classId,
      studentId,
      status,
    } = req.body;

    const today =
      new Date()
        .toISOString()
        .split("T")[0];

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

    console.log("SAVED:", attendance);

    res.json(attendance);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message,
    });

  }
};

// ================================
// STUDENT: GET MY ATTENDANCE
// ================================
export const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;

    const data = await Attendance.find({ studentId })
      .populate("classId", "title courseName date")
      .sort({ createdAt: -1 });

    const result = data.map((a) => ({
      _id: a._id,
      classTitle: a.classId?.title,
      courseName: a.classId?.courseName,
      date: a.date,
      status: a.status,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};