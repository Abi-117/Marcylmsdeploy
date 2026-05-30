import Course from "../models/Course.js";
import bcrypt from "bcryptjs";
import express from "express";

import User from "../models/User.js";

import Payment from "../models/Payment.js";

import Attendance from "../models/Attendance.js";

import ClassModel from "../models/Class.js";


const router = express.Router();


router.get("/dashboard", async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTeachers = await User.countDocuments({ role: "teacher" });
    const liveClasses = await ClassModel.countDocuments({ status: "Live" });

    // ✅ FIX 1: safe revenue calculation
    const payments = await Payment.find();
    const recentPayments = await Payment.find()
  .populate("student", "name email")
  .populate("course", "name grade mainLevel")
  .sort({ createdAt: -1 })
  .limit(5);

    const totalRevenue = payments.reduce(
      (sum, p) => sum + (p.amount || 0),
      0
    );

    // ✅ FIX 2: revenue chart (IMPORTANT FIX)
    const revenueData = await Payment.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m",
              date: "$createdAt", // MUST exist
            },
          },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          month: "$_id",
          revenue: 1,
        },
      },
    ]);

    // ✅ FIX 3: attendance safe
    const attendanceRecords = await Attendance.find();

    const grouped = {};

    attendanceRecords.forEach((a) => {
      if (!a.date) return;

      const week = "W" + Math.ceil(new Date(a.date).getDate() / 7);

      if (!grouped[week]) grouped[week] = { present: 0, absent: 0 };

      if (a.status === "present") grouped[week].present++;
      else grouped[week].absent++;
    });

    const attendanceData = Object.keys(grouped).map((w) => ({
      week: w,
      ...grouped[w],
    }));

    // ✅ FIX 4: top students
    const topStudents = await User.find({ role: "student" })
      .limit(5)
      .select("name course");

    // ✅ FIX 5: classes safe
    const classes = await ClassModel.find({
      status: { $ne: "Completed" },
    }).sort({ date: 1 });

    res.json({
  totalRevenue,
  totalStudents,
  totalTeachers,
  liveClasses,
  revenueData,
  attendanceData,
  topStudents,
  classes,
  recentPayments,
});
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Dashboard error" });
  }
});

// GET STUDENTS
// GET STUDENTS
router.get("/students", async (req, res) => {

  try {

    const students = await User.find({
      role: "student",
    })
      .populate("course")
      .sort({ createdAt: -1 });

    res.json(students);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

});

// ADD OFFLINE STUDENT
router.post("/students", async (req, res) => {

  try {

    const {
      name,
      email,
      phone,
      course,
      level,
      batch,
    } = req.body;

    const existingUser =
      await User.findOne({
        email,
      });

    if (existingUser) {

      return res.status(400).json({
        message: "Email already exists",
      });

    }

    const selectedCourse =
      await Course.findOne({
        name: course,
      });

    const user = await User.create({

      name,
      email,
      phone,

      role: "student",

      password: "offline123",

      course:
        selectedCourse?._id,

      level,

      batch,

    });

    res.status(201).json(user);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

});

router.get("/teachers", async (req, res) => {
  try {

    const teachers = await User.find({
      role: "teacher",
    }).sort({ createdAt: -1 });

    res.status(200).json(teachers);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});


// =======================
// ADD TEACHER
// =======================

router.post("/teachers", async (req, res) => {
  try {

    const {
      name,
      email,
      phone,
      subject,
      qualification,
      experience,
      fromTime,
      toTime,
      availableDays,
    } = req.body;

    // EMAIL CHECK

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Teacher already exists",
      });
    }

    // DEFAULT PASSWORD

    const hashedPassword = await bcrypt.hash(
      "teacher123",
      10
    );

    // CREATE TEACHER

    const teacher = await User.create({
      name,
      email,
      password: hashedPassword,

      role: "teacher",

      phone,

      subject,

      qualification,

      experience,

      fromTime,
      toTime,

      availableDays,
    });

    res.status(201).json({
      message: "Teacher Added",
      teacher,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});
// GET COURSES

router.get("/courses", async (req, res) => {

  try {

    const courses =
      await Course.find().sort({
        createdAt: -1,
      });

    res.json(courses);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});
export default router;