import Class from "../models/Class.js";
import Attendance from "../models/Attendance.js";

export const getTeacherClasses = async (req, res) => {
  try {
    const { teacherId } = req.params;

    // GET CLASSES
    const classes = await Class.find({
      teacherId,
    })
      .populate("students", "name email")
      .populate("courseId", "name");

    // TODAY DATE
    const today = new Date()
      .toISOString()
      .split("T")[0];

    // ADD ATTENDANCE MAP
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
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};