import express from "express";
import mongoose from "mongoose";

import Assignment from "../models/Assignment.js";

const router = express.Router();

//
// =========================================
// 📌 GET TEACHER ASSIGNMENTS
// =========================================
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

          .sort({
            createdAt: -1,
          });

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

      const data =
        await Assignment.find({

          studentIds: {
            $in: [
              req.params.studentId,
            ],
          },

        }).sort({
          createdAt: -1,
        });

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
      } = req.body;

      const newTask =
        await Assignment.create({

          title,

          description,

          due,

          teacherId,

          teacherName,

          studentIds,

          status:
            "Pending",

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

      // ============================
      // CHECK ALREADY SUBMITTED
      // ============================

      const already =
        assignment.submissions.find(
          (s) =>
            s.studentId.toString() ===
            studentId
        );

      if (already) {

        already.fileUrl =
          fileUrl;

        already.submittedAt =
          new Date();

      } else {

        assignment.submissions.push({

          studentId,

          fileUrl,

          submittedAt:
            new Date(),

          marks: "",

          feedback: "",

          reviewed:
            false,
        });

      }

      assignment.status =
        "Submitted";

      await assignment.save();

      res.json({
        message:
          "Assignment submitted",
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
            s.studentId.toString() ===
            studentId
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

      submission.reviewed =
        true;

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