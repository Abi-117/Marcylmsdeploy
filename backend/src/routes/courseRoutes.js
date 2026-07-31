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

// CREATE COURSE

router.post("/", async (req, res) => {
  try {
    const courseData = {
      ...req.body,
    };

    // Individual course = only 1 student
    if (courseData.classMode === "Individual") {
      courseData.maxStudents = 1;
    }

    const newCourse = new Course(courseData);

    await newCourse.save();

    res.json({
      message: "Course Added",
      course: newCourse,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// UPDATE COURSE

router.put("/:id", async (req, res) => {
  try {
    const updateData = {
      ...req.body,
    };

    // Individual course = only 1 student
    if (updateData.classMode === "Individual") {
      updateData.maxStudents = 1;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedCourse);
  } catch (error) {
    console.log(error);

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