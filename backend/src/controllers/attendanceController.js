import Attendance from "../models/Attendance.js";
import Class from "../models/Class.js";

export const markAttendance = async (req, res) => {
  try {
    const { classId } = req.params;
    const { studentId, status } = req.body;

    // prevent duplicate attendance for same class + student + date
    const existing = await Attendance.findOne({
      classId,
      studentId,
      date: {
        $gte: new Date(new Date().setHours(0, 0, 0)),
      },
    });

    if (existing) {
      return res.status(400).json({
        message: "Attendance already marked for today",
      });
    }

    const attendance = await Attendance.create({
      classId,
      studentId,
      status: status || "Present",
    });

    res.status(201).json(attendance);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;

    const data = await Attendance.find({ studentId })
      .populate("classId", "title courseName date")
      .sort({ createdAt: -1 });

    const formatted = data.map((a) => ({
      _id: a._id,
      classTitle: a.classId?.title,
      courseName: a.classId?.courseName,
      date: a.classId?.date,
      status: a.status,
    }));

    res.json(formatted);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};