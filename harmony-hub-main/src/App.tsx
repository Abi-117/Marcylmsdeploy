import { Routes, Route, Link } from "react-router-dom";

import Landing from "./pages/Landing";
// import About from "./pages/About";
// import Courses from "./pages/Courses";
// import Events from "./pages/Events";
// import Gallery from "./pages/Gallery";
// import Pricing from "./pages/Pricing";
// import FAQ from "./pages/FAQ";
// import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TeacherSignup from "./pages/TeacherSignup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import { DashboardLayout } from "./layouts/DashboardLayout";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminStudents from "./pages/admin/Students";
import AdminTeachers from "./pages/admin/Teachers";
import AdminAttendance from "./pages/admin/AdminAttendance";
import AdminBatches from "./pages/admin/Batches";
import AdminClasses from "./pages/admin/Classes";
import AdminPayments from "./pages/admin/Payments";
import AdminCourses from "./pages/admin/Courses";
import AdminEvents from "./pages/admin/Events";
import AdminReports from "./pages/admin/Reports";

import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherClasses from "./pages/teacher/Classes";
import TeacherStudents from "./pages/teacher/Students";
import TeacherAttendance from "./pages/teacher/TeacherAttendance";
import TeacherGrades from "./pages/teacher/TeacherAttendanceDashboard";
import TeacherAssignments from "./pages/teacher/Assignments";
import TeacherAssignmentReviews from "./pages/teacher/AssignmentReviewPanel";
import TeacherSchedule from "./pages/teacher/Schedule";

import StudentDashboard from "./pages/student/Dashboard";
import StudentClasses from "./pages/student/Classes";
import StudentPractice from "./pages/student/Practice";
import StudentProgress from "./pages/student/Progress";
import NotificationAssignments from "./pages/student/StudentAssignments";
import StudentAssignments from "./pages/student/SubmitAssignment";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentPayments from "./pages/student/Payments";
import StudentCertificates from "./pages/student/Certificates";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      {/* <Route path="/about" element={<About />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/events" element={<Events />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/contact" element={<Contact />} /> */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/teacher-signup" element={<TeacherSignup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      {/* Admin */}
      <Route path="/admin/*" element={<DashboardLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="teachers" element={<AdminTeachers />} />
        <Route path="attendance" element={<AdminAttendance />} />
        <Route path="batches" element={<AdminBatches />} />
        <Route path="classes" element={<AdminClasses />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>

      {/* Teacher */}
      <Route path="/teacher/*" element={<DashboardLayout />}>
        <Route index element={<TeacherDashboard />} />
        <Route path="classes" element={<TeacherClasses />} />
        <Route path="students" element={<TeacherStudents />} />
        <Route path="attendance" element={<TeacherAttendance />} />
        <Route path="grades" element={<TeacherGrades />} />
        <Route path="assignments" element={<TeacherAssignments />} />
        <Route path="assignmentreviews" element={<TeacherAssignmentReviews />} />
        <Route path="schedule" element={<TeacherSchedule />} />
      </Route>

      {/* Student */}
      <Route path="/student/*" element={<DashboardLayout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="classes" element={<StudentClasses />} />
        <Route path="practice" element={<StudentPractice />} />
        <Route path="progress" element={<StudentProgress />} />
        <Route path="notificationassignments" element={<NotificationAssignments />} />
        <Route path="assignments" element={<StudentAssignments />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="payments" element={<StudentPayments />} />
        <Route path="certificates" element={<StudentCertificates />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
