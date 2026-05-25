import Class from "../models/Class.js";

// GET TEACHER CLASSES (WITH STUDENTS + COURSE NAME)
export const getTeacherClasses = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const classes = await Class.find({ teacherId })
      .populate("students", "name email")
      .populate("courseId", "name")
      .sort({ date: 1 });

    res.json(classes);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};