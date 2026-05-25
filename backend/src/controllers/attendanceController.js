import Attendance from "../models/Attendance.js";
import Class from "../models/Class.js";

// ================================
// TEACHER: MARK ATTENDANCE
// ================================
export const markAttendance = async (req, res) => {
  try {

    const {
      classId,
      studentId,
      status,
    } = req.body;

    // ✅ START OF TODAY
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    // ✅ END OF TODAY
    const tomorrow = new Date(today);

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );

    const attendance =
      await Attendance.findOneAndUpdate(
        {
          classId,
          studentId,

          date: {
            $gte: today,
            $lt: tomorrow,
          },
        },
        {
          classId,
          studentId,
          status,
          date: new Date(),
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

// ================================
// STUDENT: GET MY ATTENDANCE
// ================================
export const getStudentAttendance =
  async (req, res) => {

    try {

      const { studentId } =
        req.params;

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

      const result = data.map(
        (a) => ({
          _id: a._id,

          classTitle:
            a.classId?.title,

          courseName:
            a.classId?.courseName,

          date: new Date(
            a.date
          ).toLocaleDateString(),

          status: a.status,
        })
      );

      res.json(result);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: err.message,
      });

    }

  };

