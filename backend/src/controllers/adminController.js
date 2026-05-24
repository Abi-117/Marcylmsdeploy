import User from "../models/User.js";
import Payment from "../models/Payment.js";
import Class from "../models/Class.js";
import Attendance from "../models/Attendance.js";

export const getDashboard = async (req, res) => {
  try {

    // TOTAL STUDENTS
    const totalStudents = await User.countDocuments({
      role: "student",
    });

    // TOTAL TEACHERS
    const totalTeachers = await User.countDocuments({
      role: "teacher",
    });

    // LIVE CLASSES
    const liveClasses = await Class.countDocuments({
      status: "Live",
    });

    // TOTAL REVENUE
    const payments = await Payment.find({
      status: "paid",
    });

    const totalRevenue = payments.reduce(
      (acc, item) => acc + item.amount,
      0
    );

    // TOP STUDENTS
    const topStudents = await User.find({
      role: "student",
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // UPCOMING CLASSES
    const classes = await Class.find({
      status: {
        $ne: "Completed",
      },
    }).limit(5);

    // ATTENDANCE
    const attendance = await Attendance.find();

    const present = attendance.filter(
      (a) => a.status === "present"
    ).length;

    const absent = attendance.filter(
      (a) => a.status === "absent"
    ).length;

    res.status(200).json({
      totalStudents,
      totalTeachers,
      totalRevenue,
      liveClasses,

      attendance: {
        present,
        absent,
      },

      classes,

      topStudents,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};