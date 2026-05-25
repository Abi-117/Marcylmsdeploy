import express from "express";
import {
  markAttendance,
  getStudentAttendance,
  getAllAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

// 👩‍🏫 TEACHER
router.put("/mark", markAttendance);

// TEACHER VIEW ALL
router.get("/all", getAllAttendance);

// 👨‍🎓 STUDENT
router.get("/student/:studentId", getStudentAttendance);

export default router;