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

    // ✅ START OF TODAY
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    // ✅ END OF TODAY
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const updatedClasses = await Promise.all(
      classes.map(async (cls) => {

        // ✅ FIXED QUERY
        const attendance = await Attendance.find({
          classId: cls._id,
          date: {
            $gte: start,
            $lte: end,
          },
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