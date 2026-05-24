import express from "express";
import User from "../models/User.js";
import Course from "../models/Course.js";

const router = express.Router();


// ======================================
// GET TEACHER STUDENTS
// match by teacher.subject -> course name -> student.course id
// ======================================

router.get(
  "/teacher/:teacherId",
  async (req, res) => {

    try {

      const teacher = await User.findById(
        req.params.teacherId
      );

      if (!teacher || teacher.role !== "teacher") {
        return res.status(404).json({
          message: "Teacher not found",
        });
      }

      const matchingCourses = await Course.find({
        name: teacher.subject,
      }).select("_id");

      const courseIds = matchingCourses.map(
        (c) => String(c._id)
      );

      // status filter: "paid" | "pending" | "all" (default: all)
      const status = (req.query.status || "all").toLowerCase();

      const query = {
        role: "student",
        course: { $in: courseIds },
      };

      if (status === "paid") {
        query.paymentStatus = "Paid";
      } else if (status === "pending" || status === "unpaid") {
        query.paymentStatus = "Pending";
      }

      const students = await User.find(query)

  .populate("course")

  .select("-password");

      res.json(students);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: "Server Error",
      });

    }

  }
);


// ======================================
// UPDATE PROGRESS
// ======================================

router.put(
  "/progress/:id",
  async (req, res) => {

    try {

      const updated =
        await User.findByIdAndUpdate(

          req.params.id,

          {
            progress:
              req.body.progress,
          },

          {
            new: true,
          }

        );

      res.json(updated);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: "Update failed",
      });

    }

  }
);

export default router;