import express from "express";

import {
  getTeacherAttendance,
} from "../controllers/teacherAttendanceController.js";

const router = express.Router();

router.get(
  "/:teacherId",
  getTeacherAttendance
);

export default router;