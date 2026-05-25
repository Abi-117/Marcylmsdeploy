import Attendance from "../models/Attendance.js";
import TeacherAttendance from "../models/TeacherAttendance.js";

// ==========================================
// GET ADMIN ATTENDANCE DASHBOARD
// ==========================================

export const getAdminAttendance =
  async (req, res) => {

    try {

      // ======================================
      // STUDENT ATTENDANCE
      // ======================================

      const studentAttendance =
        await Attendance.find()

          .populate(
            "studentId",
            "name email"
          )

          .populate(
            "classId",
            "title courseName"
          )

          .sort({
            createdAt: -1,
          });

      // ======================================
      // TEACHER ATTENDANCE
      // ======================================

      const teacherAttendance =
        await TeacherAttendance.find()

          .populate(
            "teacherId",
            "name email"
          )

          .sort({
            createdAt: -1,
          });

      // ======================================
      // FORMAT STUDENT DATA
      // ======================================

      const students =
        studentAttendance.map((a) => ({

          _id: a._id,

          type: "Student",

          name:
            a.studentId?.name ||
            "Unknown",

          email:
            a.studentId?.email ||
            "No Email",

          classTitle:
            a.classId?.title ||
            "No Class",

          courseName:
            a.classId?.courseName ||
            "No Course",

          status: a.status,

          date: a.date,

        }));

      // ======================================
      // FORMAT TEACHER DATA
      // ======================================

      const teachers =
        teacherAttendance.map((a) => ({

          _id: a._id,

          type: "Teacher",

          name:
            a.teacherId?.name ||
            "Unknown",

          email:
            a.teacherId?.email ||
            "No Email",

          classTitle:
            a.classTitle ||
            "No Class",

          courseName:
            a.courseName ||
            "No Course",

          status: a.status,

          date: a.date,

        }));

      // ======================================
      // MERGE
      // ======================================

      const result = [
        ...students,
        ...teachers,
      ].sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      );

      res.json(result);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          "Admin attendance fetch failed",
      });

    }

  };