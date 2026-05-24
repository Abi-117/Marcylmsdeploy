import express from "express";

import Batch from "../models/Batch.js";

const router = express.Router();


// =====================================
// CREATE BATCH
// =====================================

router.post("/", async (req, res) => {

  try {

    const batch = await Batch.create(
      req.body
    );

    res.status(201).json(batch);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});


// =====================================
// GET ALL BATCHES
// =====================================

router.get("/", async (req, res) => {

  try {

    const batches = await Batch.find()
      .populate("teacher", "name")
      .populate(
        "enrolledStudents",
        "name email"
      );

    res.json(batches);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});


// =====================================
// JOIN BATCH
// =====================================

router.post("/:id/join", async (req, res) => {

  try {

    const { studentId } = req.body;

    const batch = await Batch.findById(
      req.params.id
    );

    if (!batch) {

      return res.status(404).json({
        message: "Batch not found",
      });
    }

    // ALREADY JOINED CHECK

    const alreadyJoined =
      batch.enrolledStudents.includes(
        studentId
      );

    if (alreadyJoined) {

      return res.status(400).json({
        message: "Already joined",
      });
    }

    // IF FULL -> WAITLIST

    if (
      batch.enrolledStudents.length >=
      batch.capacity
    ) {

      batch.waitlistStudents.push(
        studentId
      );

      await batch.save();

      return res.json({
        message:
          "Batch full. Added to waitlist",
      });
    }

    // NORMAL JOIN

    batch.enrolledStudents.push(
      studentId
    );

    await batch.save();

    res.json({
      message: "Batch joined",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

export default router;