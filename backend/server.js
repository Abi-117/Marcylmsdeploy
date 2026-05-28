import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
import "./cron/classReminder.js";

import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import batchRoutes from "./src/routes/batchRoutes.js";
import classRoutes from "./src/routes/classRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import reportRoutes from "./src/routes/reportRoutes.js";
import studentRoutes from "./src/routes/studentRoutes.js";
import practiceRoutes from "./src/routes/practice.js";
import teacherRoutes from "./src/routes/teacherRoutes.js";
import courseRoutes from "./src/routes/courseRoutes.js";
import assignmentRoutes from "./src/routes/assignmentRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import attendanceRoutes from "./src/routes/attendanceRoutes.js";
import teacherAttendanceRoutes
from "./src/routes/teacherAttendance.js";
import adminAttendanceRoutes from "./src/routes/adminAttendanceRoutes.js";
import feedbackRouter from "./src/routes/feedback.js";
import certificateRoutes from "./src/routes/certificate.routes.js";
import reminderRoutes
from "./src/routes/reminderRoutes.js";

import path from "path";




const app = express();

app.use(cors());
app.use(express.json());
connectDB();

app.get("/", (req, res) => {
  res.send("Marcy Academy Backend Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use(
  "/api/batches",
  batchRoutes
);
app.use("/api/classes", classRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/practice", practiceRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use(
  "/api/teacher-attendance",
  teacherAttendanceRoutes
);
app.use(
  "/api/admin-attendance",
  adminAttendanceRoutes
);
app.use("/api/feedback", feedbackRouter);
app.use(
  "/api/certificates",
  certificateRoutes
);


app.use(
  "/api/reminders",
  reminderRoutes
);
// serve uploaded videos
app.use("/uploads", express.static("uploads"));
app.use(
  express.json({
    limit: "50mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});