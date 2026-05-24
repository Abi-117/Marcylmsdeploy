import express from "express";
import {
  markAttendance,
  getStudentAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

// Teacher marks attendance for student
router.put("/classes/attendance/:classId", markAttendance);

// Student view attendance
router.get("/student/:studentId", getStudentAttendance);

export default router;