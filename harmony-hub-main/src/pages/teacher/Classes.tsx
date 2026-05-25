import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { motion } from "framer-motion";

import { PageHeader } from "@/components/dashboard/Primitives";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { ExternalLink, Users } from "lucide-react";

const API = "https://marcylmsdeploy.onrender.com/api";

export default function TeacherClasses() {
  const user = JSON.parse(
    localStorage.getItem("ms-auth") || "{}"
  )?.state?.user;

  const teacherId = user?.id;

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

      await fetchClasses(); // refresh

      // also refresh selected class students
      const updated = classes.find((c) => c._id === classId);
      if (updated) {
        setSelectedClass(updated);
        setStudents(updated.students || []);
      }

      alert("Attendance updated");
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
                  {c.courseId?.name || c.courseName}
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
                      students.map((s: any) => (
                        <div
                          key={s._id}
                          className="flex justify-between items-center mt-2"
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
                      ))
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