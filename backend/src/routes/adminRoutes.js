import Course from "../models/Course.js";
import bcrypt from "bcryptjs";
import express from "express";

import User from "../models/User.js";

import Payment from "../models/Payment.js";

import Attendance from "../models/Attendance.js";

import ClassModel from "../models/Class.js";
import MailLog from "../models/MailLog.js";
import CertificateRequest from "../models/CertificateRequest.js";
import { sendMail } from "../utils/mailer.js";



const router = express.Router();


router.get("/dashboard", async (req, res) => {
  try {

    // =========================
    // COUNTS
    // =========================

    const totalStudents =
      await User.countDocuments({
        role: "student",
      });

    const totalTeachers =
      await User.countDocuments({
        role: "teacher",
      });

    const liveClasses =
      await ClassModel.countDocuments({
        status: "Upcoming",
      });

    const totalCourses =
      await Course.countDocuments();

    // =========================
    // CERTIFICATES
    // =========================

    const pendingCertificates =
      await CertificateRequest.countDocuments({
        status: "pending",
      });

    // =========================
    // PAYMENTS
    // =========================

    const paidPayments =
      await Payment.find({
        status: "Paid",
      });

    const totalRevenue =
      paidPayments.reduce(
        (sum, p) =>
          sum + (p.amount || 0),
        0
      );

    const pendingPayments =
      await Payment.countDocuments({
        status: "Pending",
      });

    // =========================
    // MONTH REVENUE
    // =========================

    const startOfMonth =
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      );

    const monthlyPayments =
      await Payment.find({
        createdAt: {
          $gte: startOfMonth,
        },
        status: "Paid",
      });

    const monthRevenue =
      monthlyPayments.reduce(
        (sum, p) =>
          sum + (p.amount || 0),
        0
      );

    // =========================
    // RECENT PAYMENTS
    // =========================

    const recentPayments =
      await Payment.find()
        .populate(
          "student",
          "name email"
        )
        .populate(
          "course",
          "name grade mainLevel"
        )
        .sort({
          createdAt: -1,
        })
        .limit(5);

    // =========================
    // REVENUE CHART
    // =========================

    const revenueData =
      await Payment.aggregate([
        {
          $match: {
            status: "Paid",
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m",
                date: "$createdAt",
              },
            },
            revenue: {
              $sum: "$amount",
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
        {
          $project: {
            _id: 0,
            month: "$_id",
            revenue: 1,
          },
        },
      ]);

    // =========================
    // ATTENDANCE CHART
    // =========================

    const attendanceRecords =
      await Attendance.find();

    const grouped = {};

    attendanceRecords.forEach(
      (a) => {

        if (!a.date) return;

        const week =
          "W" +
          Math.ceil(
            new Date(
              a.date
            ).getDate() / 7
          );

        if (!grouped[week]) {

          grouped[week] = {
            present: 0,
            absent: 0,
          };

        }

        if (
          a.status === "present"
        ) {

          grouped[week]
            .present++;

        } else {

          grouped[week]
            .absent++;

        }

      }
    );

    const attendanceData =
      Object.keys(grouped).map(
        (week) => ({
          week,
          ...grouped[week],
        })
      );

    // =========================
    // TOP STUDENTS
    // =========================

    const topStudents =
      await User.find({
        role: "student",
      })
        .select(
          "name course"
        )
        .limit(5);

    // =========================
    // UPCOMING CLASSES
    // =========================

    const classes =
      await ClassModel.find({
        status: {
          $ne: "Completed",
        },
      }).sort({
        date: 1,
      });

    // =========================
    // RESPONSE
    // =========================

    res.json({

      totalRevenue,
      totalStudents,
      totalTeachers,
      liveClasses,

      totalCourses,
      pendingCertificates,
      pendingPayments,
      monthRevenue,

      recentPayments,

      revenueData,
      attendanceData,
      topStudents,
      classes,

    });

  } catch (err) {

    console.log(
      "Dashboard Error:",
      err
    );

    res.status(500).json({
      message:
        "Dashboard error",
      error:
        err.message,
    });

  }
});

// GET STUDENTS
// GET STUDENTS
router.get("/students", async (req, res) => {
  try {

    const students =
      await User.find({
        role: "student",
      })
      .populate("course")
      .sort({ createdAt: -1 })
      .lean();

    const formattedStudents =
      await Promise.all(

        students.map(async (student) => {

          const payments =
            await Payment.find({
              student: student._id,
              status: "Paid",
            }).sort({
              createdAt: 1,
            });

          const feesPaid =
            payments.reduce(
              (sum, p) =>
                sum + (p.amount || 0),
              0
            );

          const lastPayment =
            payments.length > 0
              ? payments[
                  payments.length - 1
                ]
              : null;

          return {

            ...student,

            totalPayments:
              payments.length,

            lastPayment:
              lastPayment || null,

            feesPaid,

            remainingFees: 0,

          };

        })

      );

    res.json(
      formattedStudents
    );

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message,
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
router.get(
  "/teacher/:teacherId/students",
  async (req, res) => {

    try {

      const teacher = await User.findById(
        req.params.teacherId
      );

      if (!teacher) {
        return res.status(404).json({
          message: "Teacher not found",
        });
      }

      const matchingCourses =
        await Course.find({
          name: teacher.subject,
        }).select("_id");

      const courseIds =
        matchingCourses.map(
          (c) => c._id
        );

      const students =
        await User.find({
          role: "student",
          course: {
            $in: courseIds,
          },
        }).select(
          "_id name email"
        );

      res.json(students);

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

  }
);



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

router.get(
  "/mail-logs",
  async (req, res) => {

    const logs =
      await MailLog.find()
        .populate(
          "student",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    res.json(logs);
  }
);


router.get("/test-mail", async (req, res) => {

  try {

    const info =
      await sendMail({
        to: process.env.EMAIL_USER,
        subject: "Reminder Test",
        html: `
          <h1>Mail Working ✅</h1>
          <p>Marcy LMS reminder system working.</p>
        `,
      });

    res.json({
      success: true,
      messageId: info.messageId,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message,
    });

  }

});

router.get(
  "/teacher/:teacherId/students",
  async (req, res) => {

    try {

      const teacher = await User.findById(
        req.params.teacherId
      );

      if (!teacher) {
        return res.status(404).json({
          message: "Teacher not found",
        });
      }

      const matchingCourses =
        await Course.find({
          name: teacher.subject,
        }).select("_id");

      const courseIds =
        matchingCourses.map(c => c._id);

      const students =
        await User.find({
          role: "student",
          course: {
            $in: courseIds,
          },
        }).select("_id name");

      res.json(students);

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

  }
);
export default router;