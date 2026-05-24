import express from "express";
import {
  markAttendance,
  getStudentAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

// 👩‍🏫 TEACHER
router.put("/mark", markAttendance);

// 👨‍🎓 STUDENT
router.get("/student/:studentId", getStudentAttendance);

export default router;