import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { motion } from "framer-motion";

import { PageHeader } from "@/components/dashboard/Primitives";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { ExternalLink, Users } from "lucide-react";

const API = "https://marcylmsdeploy-2.onrender.com/api";

export default function TeacherClasses() {
  const user = JSON.parse(
    localStorage.getItem("ms-auth") || "{}"
  )?.state?.user;

  const teacherId = user?.id || user?._id; // FIX FOR BOTH TEACHER AND ADMIN LOGIN STRUCTURE

  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<any>(null); // ✅ FIX

  // =========================
  // LOAD CLASSES
  // =========================
  useEffect(() => {
    if (!teacherId) return;
    fetchClasses();
  }, [teacherId]);

  const fetchClasses = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API}/classes/teacher/${teacherId}`
      );

      setClasses(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // OPEN STUDENTS
  // =========================
  const fetchStudents = (cls: any) => {
    setSelectedClassId(cls._id);
    setSelectedClass(cls); // ✅ FIX
    setStudents(cls.students || []);
  };

  // =========================
  // MARK ATTENDANCE
  // =========================
 const markAttendance = async (
  classId: string,
  studentId: string,
  status: "Present" | "Absent"
) => {
  try {
    await axios.put(`${API}/attendance/mark`, {
      classId,
      studentId,
      status,
    });

    // 🔥 ALWAYS REFRESH FROM SERVER (BEST PRACTICE)
    const res = await axios.get(
      `${API}/classes/teacher/${teacherId}`
    );

    setClasses(res.data);

    // 🔥 update selected class properly from fresh data
    const updatedClass = res.data.find(
      (c: any) => c._id === classId
    );

    setSelectedClass(updatedClass);
    setStudents(updatedClass?.students || []);

  } catch (err) {
    console.log(err);
  }
};
  // =========================
  // STATUS UPDATE
  // =========================
  const updateStatus = async (id: string, currentStatus: string) => {
    try {
      let nextStatus = "Completed";

      if (currentStatus === "Upcoming") {
        nextStatus = "Live";
      } else if (currentStatus === "Live") {
        nextStatus = "Completed";
      }

      await axios.put(`${API}/classes/status/${id}`, {
        status: nextStatus,
      });

      fetchClasses();
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // STATUS COLOR
  // =========================
  const getStatusClass = (status: string) => {
    switch (status) {
      case "Live":
        return "bg-green-500 text-white";
      case "Completed":
        return "bg-gray-200 text-black";
      default:
        return "bg-yellow-400 text-black";
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div>
      <PageHeader title="My Classes" subtitle="Manage sessions" />

      <div className="grid md:grid-cols-2 gap-4">
        {classes.map((c) => (
          <motion.div key={c._id} whileHover={{ y: -3 }}>
            <Card>
              <CardContent className="p-5">

                {/* CLASS INFO */}
                <Badge className={getStatusClass(c.status)}>
                  {c.status}
                </Badge>

                <h2 className="font-bold mt-2">{c.title}</h2>

                <p className="text-sm text-muted-foreground">
                  {c.courseName}
                </p>

                {/* ACTIONS */}
                <div className="mt-4 flex gap-2">

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fetchStudents(c)}
                  >
                    <Users className="w-4 h-4 mr-1" />
                    View Students
                  </Button>

                  {c.meetingLink && (
                    <Button size="sm" asChild>
                      <a href={c.meetingLink}>
                        Open Class <ExternalLink className="ml-1 w-3 h-3" />
                      </a>
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => updateStatus(c._id, c.status)}
                  >
                    {c.status === "Upcoming" ? "Start" : "Complete"}
                  </Button>
                </div>

                {/* STUDENTS */}
                  {selectedClassId === c._id && (
  <div className="mt-5 border-t pt-4">

    {students.length === 0 ? (
      <p>No students enrolled</p>
    ) : (
      students.map((s: any) => {

        const attendanceStatus =
          selectedClass?.attendanceMap?.[
            s._id?.toString()
          ];

        return (
          <div
            key={s._id}
            className="flex items-center justify-between mt-3"
          >
            {/* STUDENT NAME */}
           <div className="flex flex-col">

  {/* NAME */}
  <span className="font-semibold text-sm">
    {s.name}
  </span>

  {/* EMAIL */}
  <span className="text-xs text-muted-foreground">
    {s.email}
  </span>

  {/* PHONE */}
  <span className="text-xs text-muted-foreground">
    {s.phone || "No Phone"}
  </span>

  {/* LEVEL */}
  <span className="text-xs mt-1">
    Level:
    <span className="font-medium ml-1">
      {s.selectedLevel || "Not Started"}
    </span>
  </span>

  {/* PAYMENT */}
  <span
    className={`text-xs mt-1 font-medium ${
      s.paymentStatus === "Paid"
        ? "text-green-600"
        : "text-red-500"
    }`}
  >
    {s.paymentStatus || "Pending"}
  </span>

  {/* ATTENDANCE */}
  <span
    className={`text-xs mt-1 ${
      attendanceStatus === "Present"
        ? "text-green-600"
        : attendanceStatus === "Absent"
        ? "text-red-600"
        : "text-gray-400"
    }`}
  >
    Attendance:
    {" "}
    {attendanceStatus || "Not Marked"}
  </span>

</div>

            {/* BUTTONS */}
            <div className="flex gap-2">

              <Button
                type="button"
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() =>
                  markAttendance(
                    c._id,
                    s._id,
                    "Present"
                  )
                }
              >
                Present
              </Button>

              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() =>
                  markAttendance(
                    c._id,
                    s._id,
                    "Absent"
                  )
                }
              >
                Absent
              </Button>

            </div>
          </div>
        );
      })
    )}

  </div>
)}

              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}