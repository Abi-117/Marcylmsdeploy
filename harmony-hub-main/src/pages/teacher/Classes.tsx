import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { motion } from "framer-motion";

import { PageHeader } from "@/components/dashboard/Primitives";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  ExternalLink,
  FileText,
  Video,
  Users,
  Clock3,
  CheckCircle2,
} from "lucide-react";

const API = "https://marcylmsdeploy.onrender.com/api";

export default function TeacherClasses() {
  // =========================
  // AUTH
  // =========================
  const user = JSON.parse(
    localStorage.getItem("ms-auth") || "{}"
  )?.state?.user;

  const teacherId = user?.id;

  // =========================
  // STATES
  // =========================
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

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
      console.log("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD STUDENTS (IMPORTANT)
  // =========================
  const fetchStudents = async (classId: string) => {
    try {
      setSelectedClassId(classId);

      const res = await axios.get(
        `${API}/classes/${classId}/students`
      );

      setStudents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // MARK ATTENDANCE (FINAL FIXED)
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

      alert("Attendance marked");
      fetchStudents(classId);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // UPDATE STATUS
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

      alert(`Class marked as ${nextStatus}`);
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

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="p-6 text-muted-foreground">
        Loading classes...
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div>
      <PageHeader
        title="My Classes"
        subtitle="Manage all your scheduled sessions"
      />

      {/* CLASSES */}
      <div className="grid gap-5 md:grid-cols-2">
        {classes.map((c) => (
          <motion.div key={c._id} whileHover={{ y: -3 }}>
            <Card className="hover:shadow-lg">
              <CardContent className="p-5">

                {/* HEADER */}
                <div className="flex justify-between">
                  <div>
                    <Badge className={getStatusClass(c.status)}>
                      {c.status}
                    </Badge>

                    <h2 className="mt-2 font-bold text-xl">
                      {c.title}
                    </h2>

                    <p className="text-sm text-muted-foreground">
                      {c.courseName}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-xs">
                      {format(new Date(c.date), "MMM dd")}
                    </div>
                    <div className="text-xs">
                      {format(new Date(c.date), "h:mm a")}
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-4 flex gap-2 flex-wrap">

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fetchStudents(c._id)}
                  >
                    <Users className="w-4 h-4 mr-1" />
                    View Students
                  </Button>

                  {c.meetingLink && (
                    <Button size="sm" asChild>
                      <a href={c.meetingLink} target="_blank">
                        Open Class <ExternalLink className="ml-1 w-3 h-3" />
                      </a>
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => updateStatus(c._id, c.status)}
                  >
                    {c.status === "Upcoming"
                      ? "Start"
                      : "Complete"}
                  </Button>
                </div>

                {/* STUDENTS ATTENDANCE */}
                {selectedClassId === c._id && (
                  <div className="mt-5 border-t pt-4">
                    <h3 className="font-semibold mb-2">
                      Mark Attendance
                    </h3>

                    {students.map((s) => (
                      <div
                        key={s._id}
                        className="flex justify-between items-center mb-2"
                      >
                        <span>{s.name}</span>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              markAttendance(c._id, s._id, "Present")
                            }
                          >
                            Present
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              markAttendance(c._id, s._id, "Absent")
                            }
                          >
                            Absent
                          </Button>
                        </div>
                      </div>
                    ))}
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