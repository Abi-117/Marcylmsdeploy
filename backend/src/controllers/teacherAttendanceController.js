import TeacherAttendance
from "../models/TeacherAttendance.js";

export const
getTeacherAttendance =
async (req, res) => {

  try {

    const { teacherId } =
      req.params;

    const data =
      await TeacherAttendance.find({

        teacherId,

      }).sort({
        date: -1,
      });

    res.json(data);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message,
    });

  }

};