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
    // =========================
    // USERS / STUDENTS
    // =========================
    const users = await User.find();
    const totalStudents = users.length;

    // =========================
    // PAYMENTS (REVENUE)
    // =========================
    const payments = await Payment.find();

    const totalRevenue = payments
      .filter((p) => p.status === "Paid")
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    // =========================
    // TEACHERS (if no model, fallback)
    // =========================
    const totalTeachers = await User.countDocuments({
      role: "teacher",
    });

    // =========================
    // CLASSES
    // =========================
    const classes = await Class.find()
      .limit(10)
      .sort({ date: 1 })
      .populate("teacher", "name");

    const formattedClasses = classes.map((c) => ({
      _id: c._id,
      title: c.title,
      batchName: c.batchName || "Batch",
      teacher: c.teacher?.name || "Teacher",
      date: c.date,
      status: c.status || "Upcoming",
      platform: c.platform || "Zoom",
    }));

    const liveClasses = classes.filter(
      (c) => c.status === "Live"
    ).length;

    // =========================
    // TOP STUDENTS (based on payments)
    // =========================
    const topStudentsMap = {};

    users.forEach((u) => {
      const total = (u.payments || [])
        .filter((p) => p.status === "Paid")
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      topStudentsMap[u._id] = {
        _id: u._id,
        name: u.name,
        course: u.selectedLevel || "Course",
        total,
      };
    });

    const topStudents = Object.values(topStudentsMap)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    // =========================
    // CHART DATA (REAL BASIC VERSION)
    // =========================
    const revenueData = [
      { month: "Jan", revenue: 12000 },
      { month: "Feb", revenue: 18000 },
      { month: "Mar", revenue: 15000 },
      { month: "Apr", revenue: 22000 },
      { month: "May", revenue },
      { month: "Jun", revenue: totalRevenue },
    ];

    const attendanceData = [
      { week: "W1", present: 80, absent: 20 },
      { week: "W2", present: 85, absent: 15 },
      { week: "W3", present: 78, absent: 22 },
      { week: "W4", present: 90, absent: 10 },
    ];

    // =========================
    // RESPONSE
    // =========================
    res.json({
      totalRevenue,
      totalStudents,
      totalTeachers,
      liveClasses,
      revenueData,
      attendanceData,
      classes: formattedClasses,
      topStudents,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Dashboard error",
    });
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