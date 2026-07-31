import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import connectDB from "./src/config/db.js";

console.log("ENV PATH TEST");
console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log("EMAIL_PASS =", process.env.EMAIL_PASS);

import "./src/cron/paymentReminder.js";
import "./src/cron/classReminder.js";

// routes
import authRoutes from "./src/routes/authRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
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
import teacherAttendanceRoutes from "./src/routes/teacherAttendance.js";
import adminAttendanceRoutes from "./src/routes/adminAttendanceRoutes.js";
import feedbackRouter from "./src/routes/feedback.js";
import certificateRoutes from "./src/routes/certificate.routes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import timeSlotRoutes from "./src/routes/timeSlotRoutes.js";

const app = express();

// =====================
// DB CONNECT
// =====================
connectDB();

// =====================
// BODY PARSER
// =====================
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// =====================
// CORS (PRODUCTION SAFE)
// =====================
const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:5173",
  "https://marcylmsdeploy-3.onrender.com",
  "https://marcyslearn.com/",
  "https://marcyslearn.com"

];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman / server

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked by CORS:", origin);
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);

// IMPORTANT: preflight must pass
app.options(/.*/, cors());

// =====================
// TEST ROUTE
// =====================
app.get("/", (req, res) => {
  res.send("Marcy Academy Backend Running");
});
// app.post("/api/auth/send-otp", (req, res) => {
//   console.log("DIRECT TEST ROUTE");
//   res.json({
//     message: "DIRECT ROUTE OK"
//   });
// });

// =====================
// ROUTES
// =====================
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
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
app.use("/api/teacher-attendance", teacherAttendanceRoutes);
app.use("/api/admin-attendance", adminAttendanceRoutes);
app.use("/api/feedback", feedbackRouter);
app.use("/api/certificates", certificateRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/timeslots", timeSlotRoutes);

// static uploads
app.use("/uploads", express.static("uploads"));

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});