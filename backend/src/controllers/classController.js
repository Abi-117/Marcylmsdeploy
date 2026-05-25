import Class from "../models/Class.js";
import Attendance from "../models/Attendance.js";

export const getTeacherClasses = async (req, res) => {
  try {
    const { teacherId } = req.params;

    // ====================================
    // GET TEACHER CLASSES
    // ====================================

    const classes = await Class.find({
      teacherId,
    })
      .populate({
        path: "students",
        select: "name email phone",
      })
      .sort({ date: -1 });

    // ====================================
    // TODAY START + END
    // IMPORTANT FIX
    // ====================================

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // ====================================
    // ADD ATTENDANCE MAP
    // ====================================

    const updatedClasses = await Promise.all(
      classes.map(async (cls) => {

        // 🔥 FIXED DATE QUERY
        const attendance = await Attendance.find({
          classId: cls._id,

          date: {
            $gte: start,
            $lte: end,
          },
        });

        // ====================================
        // CREATE MAP
        // ====================================

        const attendanceMap = {};

        attendance.forEach((a) => {

          attendanceMap[
            a.studentId.toString()
          ] = a.status;

        });

        return {
          ...cls.toObject(),

          // 🔥 IMPORTANT
          attendanceMap,
        };
      })
    );

    // ====================================
    // SEND RESPONSE
    // ====================================

    res.json(updatedClasses);

  } catch (err) {

    console.log(
      "GET TEACHER CLASSES ERROR:",
      err
    );

    res.status(500).json({
      message: err.message,
    });

  }
};