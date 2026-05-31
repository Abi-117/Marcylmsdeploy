import express from "express";
import mongoose from "mongoose";

import Assignment from "../models/Assignment.js";
import User from "../models/User.js";


const router = express.Router();

//
// =========================================
// 📌 GET TEACHER ASSIGNMENTS
// =========================================

router.get("/admin/students", async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("name email");
    res.json(students);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});
//

router.get(
  "/teacher/:teacherId",
  async (req, res) => {

    try {

      const data =
        await Assignment.find({

          teacherId:
            req.params.teacherId,

        })

          .populate(
            "submissions.studentId",
            "name email"
          )

          .sort({
            createdAt: -1,
          });

      console.log(
        "TEACHER ASSIGNMENTS:",
        JSON.stringify(
          data,
          null,
          2
        )
      );

      res.json(data);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          "Fetch failed",
      });

    }

  }
);

//
// =========================================
// 📌 GET STUDENT ASSIGNMENTS
// =========================================
//

router.get(
  "/student/:studentId",
  async (req, res) => {

    try {

      const studentId =
        new mongoose.Types.ObjectId(
          req.params.studentId
        );

      console.log(
        "FETCH STUDENT:",
        studentId
      );

      const data =
        await Assignment.find({

          studentIds:
            studentId,

        }).sort({
          createdAt: -1,
        });

      console.log(
        "FOUND ASSIGNMENTS:",
        JSON.stringify(
          data,
          null,
          2
        )
      );

      res.json(data);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          "Student assignments fetch failed",
      });

    }

  }
);

//
// =========================================
// 📌 CREATE ASSIGNMENT
// =========================================
//

router.post(
  "/create",
  async (req, res) => {

    try {

      const {
        title,
        description,
        due,
        teacherId,
        teacherName,
        studentIds,
        courseName,
      } = req.body;

      const newTask =
        await Assignment.create({

          title,

          description,

          due,

          teacherId,

          teacherName,

          courseName,

          studentIds,

          status: "Pending",

          submissions: [],
        });

      res
        .status(201)
        .json(newTask);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          err.message,
      });

    }

  }
);

//
// =========================================
// 📌 SUBMIT ASSIGNMENT
// =========================================
//

router.post(
  "/submit",
  async (req, res) => {

    try {

      const {
        assignmentId,
        studentId,
        fileUrl,
      } = req.body;

      console.log(
        "SUBMIT BODY:",
        req.body
      );

      const assignment =
        await Assignment.findById(
          assignmentId
        );

      if (!assignment) {

        return res
          .status(404)
          .json({
            message:
              "Assignment not found",
          });

      }

      // ====================================
      // CHECK ALREADY SUBMITTED
      // ====================================

      const already =
        assignment.submissions.find(
          (s) =>
            String(
              s.studentId
            ) ===
            String(studentId)
        );

      // ====================================
      // UPDATE EXISTING
      // ====================================

      if (already) {

        already.fileUrl =
          fileUrl;

        already.submittedAt =
          new Date();

        already.status =
          "Submitted";

      }

      // ====================================
      // NEW SUBMISSION
      // ====================================

      else {

        assignment.submissions.push({

          studentId:
            new mongoose.Types.ObjectId(
              studentId
            ),

          fileUrl,

          submittedAt:
            new Date(),

          status:
            "Submitted",

          marks: null,

          feedback: "",
        });

      }

      // ====================================
      // UPDATE ASSIGNMENT STATUS
      // ====================================

      assignment.status =
        "Submitted";

      // ====================================
      // SAVE
      // ====================================

      await assignment.save();

      // ====================================
      // RETURN UPDATED
      // ====================================

      const updated =
        await Assignment.findById(
          assignmentId
        ).populate(
          "submissions.studentId",
          "name email"
        );

      console.log(
        "UPDATED ASSIGNMENT:",
        JSON.stringify(
          updated,
          null,
          2
        )
      );

      res.json({
        message:
          "Assignment submitted",
        assignment:
          updated,
      });

    } catch (err) {

      console.log(
        "SUBMIT ERROR:",
        err
      );

      res.status(500).json({
        message:
          err.message,
      });

    }

  }
);

//
// =========================================
// 📌 REVIEW ASSIGNMENT
// =========================================
//

router.put(
  "/review",
  async (req, res) => {

    try {

      const {
        assignmentId,
        studentId,
        marks,
        feedback,
      } = req.body;

      const assignment =
        await Assignment.findById(
          assignmentId
        );

      if (!assignment) {

        return res
          .status(404)
          .json({
            message:
              "Assignment not found",
          });

      }

      const submission =
        assignment.submissions.find(
          (s) =>
            String(
              s.studentId
            ) ===
            String(studentId)
        );

      if (!submission) {

        return res
          .status(404)
          .json({
            message:
              "Submission not found",
          });

      }

      submission.marks =
        marks;

      submission.feedback =
        feedback;

      submission.status =
        "Reviewed";

      assignment.status =
        "Reviewed";

      await assignment.save();

      res.json({
        message:
          "Reviewed successfully",
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          err.message,
      });

    }

  }
);

//
// =========================================
// 📌 UPDATE STATUS
// =========================================
//

router.put(
  "/status/:id",
  async (req, res) => {

    try {

      const updated =
        await Assignment.findByIdAndUpdate(

          req.params.id,

          {
            status:
              req.body.status,
          },

          {
            new: true,
          }

        );

      res.json(updated);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          "Update failed",
      });

    }

  }
);

export default router;