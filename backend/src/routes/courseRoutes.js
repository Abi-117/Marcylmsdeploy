import express from "express";

import Course from "../models/Course.js";

const router = express.Router();


// GET ALL COURSES

router.get("/", async (req, res) => {

  try {

    const courses = await Course.find();

    res.json(courses);

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
    });

  }

});


// CREATE COURSE

router.post("/", async (req, res) => {

  try {

    const newCourse = new Course(
      req.body
    );

    await newCourse.save();

    res.json({
      message: "Course Added",
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
    });

  }

});


// UPDATE COURSE

router.put("/:id", async (req, res) => {

  try {

    const updatedCourse =
      await Course.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(updatedCourse);

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
    });

  }

});


// DELETE COURSE

router.delete("/:id", async (req, res) => {

  try {

    await Course.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Course Deleted",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

});


export default router;