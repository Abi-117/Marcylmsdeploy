import mongoose from "mongoose";
import express from "express";
import User from "../models/User.js";
import Course from "../models/Course.js";

const router = express.Router();

// =======================================
// REPORT DATA
// =======================================

router.get("/", async (req, res) => {
  try {
    // =========================
    // COURSE ENROLLMENT
    // =========================

    const courseStats = await User.aggregate([
  {
    $match: {
      role: "student",
      course: { $ne: "" },
    },
  },

  {
    $addFields: {
      courseObjectId: {
        $toObjectId: "$course",
      },
    },
  },

  {
    $lookup: {
      from: "courses",
      localField: "courseObjectId",
      foreignField: "_id",
      as: "courseData",
    },
  },

  {
    $unwind: "$courseData",
  },

  {
    $group: {
      _id: "$courseData.name",
      students: {
        $sum: 1,
      },
    },
  },

  {
    $project: {
      _id: 0,
      name: "$_id",
      students: 1,
    },
  },

  {
    $sort: {
      students: -1,
    },
  },
]);

    // =========================
    // MONTHLY STUDENT GROWTH
    // =========================

    const growthStats = await User.aggregate([
      {
        $match: {
          role: "student",
        },
      },

      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
          },

          students: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    // =========================
    // MONTH NAMES
    // =========================

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const revenueData = growthStats.map((g) => ({
      month: months[g._id.month - 1],
      students: g.students,
    }));

    // =========================
    // RESPONSE
    // =========================

    res.json({
      courses: courseStats,
      revenueData,
    });
  } catch (error) {
    console.error("Report Error:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

export default router;