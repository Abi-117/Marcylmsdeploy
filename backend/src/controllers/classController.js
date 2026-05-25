import Class from "../models/Class.js";
import Attendance from "../models/Attendance.js";

export const getTeacherClasses = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const classes = await Class.find({ teacherId })
      .populate("students", "name email")
      .populate("courseId", "name");

    const today = new Date().toISOString().split("T")[0];

    // attach attendance status
    const updated = await Promise.all(
      classes.map(async (cls) => {
        const attendance = await Attendance.find({
          classId: cls._id,
          date: today,
        });

        const attendanceMap = {};
        attendance.forEach((a) => {
          attendanceMap[a.studentId.toString()] = a.status;
        });

        return {
          ...cls.toObject(),
          attendanceMap,
        };
      })
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};