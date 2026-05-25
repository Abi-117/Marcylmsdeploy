import mongoose from "mongoose";

const teacherAttendanceSchema =
  new mongoose.Schema(
    {
      teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true,
      },

      status: {
        type: String,
        enum: [
          "Present",
          "Absent",
        ],
        default: "Present",
      },

      classTitle: String,

      courseName: String,

      date: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "TeacherAttendance",
  teacherAttendanceSchema
);