import express from "express";

import {
  getAdminAttendance,
} from "../controllers/adminAttendanceController.js";

const router = express.Router();

router.get(
  "/",
  getAdminAttendance
);

export default router;