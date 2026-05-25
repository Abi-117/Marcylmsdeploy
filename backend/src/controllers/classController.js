import Class from "../models/Class.js";
import Attendance from "../models/Attendance.js";

export const getTeacherClasses = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const classes = await Class.find({
      teacherId,
    })
      .populate({
        path: "students",
        select: "name email phone",
      })
      .sort({ date: -1 });

    const today = new Date()
      .toISOString()
      .split("T")[0];

    const updatedClasses = await Promise.all(
      classes.map(async (cls) => {

        const attendance =
          await Attendance.find({
            classId: cls._id,
            date: today,
          });

        const attendanceMap = {};

        attendance.forEach((a) => {
          attendanceMap[
            a.studentId.toString()
          ] = a.status;
        });

        return {
          ...cls.toObject(),
          attendanceMap,
        };
      })
    );

    res.json(updatedClasses);

  } catch (err) {

    console.log("CLASS ERROR:", err);

    res.status(500).json({
      message: err.message,
    });

  }
};