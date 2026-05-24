import { useEffect, useState } from "react";

import axios from "axios";

import { format } from "date-fns";

import { motion } from "framer-motion";

import { PageHeader } from "@/components/dashboard/Primitives";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

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

const API =
  "https://marcylmsdeploy.onrender.com/api";

export default function TeacherClasses() {

  // ====================================
  // AUTH USER
  // ====================================

  const user = JSON.parse(
    localStorage.getItem("ms-auth") || "{}"
  )?.state?.user;

  const teacherId = user?.id;

  // ====================================
  // STATES
  // ====================================

  const [classes, setClasses] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  // ====================================
  // LOAD CLASSES
  // ====================================

  useEffect(() => {

    if (!teacherId) return;

    fetchClasses();

  }, [teacherId]);

  // ====================================
  // FETCH CLASSES
  // ====================================

  const fetchClasses = async () => {

    try {

      setLoading(true);

      const res = await axios.get(

        `${API}/classes/teacher/${teacherId}`

      );

      setClasses(res.data);

    } catch (err) {

      console.log(
        "Fetch error:",
        err
      );

    } finally {

      setLoading(false);

    }

  };

  // ====================================
  // MARK ATTENDANCE
  // ====================================

  const markAttendance = async (
    id: string
  ) => {

    try {

      await axios.put(

        `${API}/classes/attendance/${id}`

      );

      alert(
        "Attendance marked successfully"
      );

      fetchClasses();

    } catch (err) {

      console.log(err);

      alert(
        "Failed to mark attendance"
      );

    }

  };

  // ====================================
  // UPDATE STATUS
  // ====================================

  const updateStatus = async (
    id: string,
    currentStatus: string
  ) => {

    try {

      let nextStatus = "Completed";

      if (
        currentStatus === "Upcoming"
      ) {

        nextStatus = "Live";

      } else if (
        currentStatus === "Live"
      ) {

        nextStatus = "Completed";

      }

      await axios.put(

        `${API}/classes/status/${id}`,

        {
          status: nextStatus,
        }

      );

      alert(
        `Class marked as ${nextStatus}`
      );

      fetchClasses();

    } catch (err) {

      console.log(err);

      alert(
        "Failed to update status"
      );

    }

  };

  // ====================================
  // STATUS COLOR
  // ====================================

  const getStatusClass = (
    status: string
  ) => {

    switch (status) {

      case "Live":
        return "bg-green-500 text-white";

      case "Completed":
        return "bg-gray-200 text-black";

      default:
        return "bg-gold text-black";

    }

  };

  // ====================================
  // LOADING
  // ====================================

  if (loading) {

    return (

      <div className="p-6 text-muted-foreground">

        Loading classes...

      </div>

    );

  }

  // ====================================
  // UI
  // ====================================

  return (

    <div>

      <PageHeader
        title="My Classes"
        subtitle="Manage all your scheduled sessions"
      />

      {/* NO CLASSES */}

      {classes.length === 0 && (

        <Card>

          <CardContent className="p-10 text-center">

            <Video className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />

            <div className="text-lg font-semibold">

              No Classes Found

            </div>

            <div className="mt-1 text-sm text-muted-foreground">

              Scheduled classes will appear here

            </div>

          </CardContent>

        </Card>

      )}

      {/* CLASSES */}

      <div className="grid gap-5 md:grid-cols-2">

        {classes.map((c) => (

          <motion.div
            key={c._id}
            whileHover={{
              y: -3,
            }}
          >

            <Card className="border-border/60 transition-all hover:shadow-lg">

              <CardContent className="p-5">

                {/* HEADER */}

                <div className="flex items-start justify-between">

                  <div>

                    <Badge
                      className={getStatusClass(
                        c.status
                      )}
                    >

                      {c.status}

                    </Badge>

                    <div className="mt-3 font-display text-xl font-semibold">

                      {c.title}

                    </div>

                    <div className="mt-1 text-sm text-muted-foreground">

                      {c.courseName}

                    </div>

                  </div>

                  {/* DATE */}

                  <div className="text-right">

                    <div className="text-xs uppercase text-muted-foreground">

                      {format(
                        new Date(c.date),
                        "MMM"
                      )}

                    </div>

                    <div className="font-display text-3xl">

                      {format(
                        new Date(c.date),
                        "dd"
                      )}

                    </div>

                    <div className="text-xs text-muted-foreground">

                      {format(
                        new Date(c.date),
                        "h:mm a"
                      )}

                    </div>

                  </div>

                </div>

                {/* INFO */}

                <div className="mt-5 flex flex-wrap gap-2">

                  <Badge variant="outline">

                    <Video className="mr-1 h-3 w-3" />

                    {c.platform}

                  </Badge>

                  <Badge variant="outline">

                    <Clock3 className="mr-1 h-3 w-3" />

                    {c.duration || 60} min

                  </Badge>

                  <Badge variant="outline">

                    <Users className="mr-1 h-3 w-3" />

                    Students

                  </Badge>

                </div>

                {/* NOTES */}

                {c.notes && (

                  <div className="mt-4 rounded-xl bg-muted p-3">

                    <div className="flex gap-2 text-sm text-muted-foreground">

                      <FileText className="mt-0.5 h-4 w-4" />

                      <span>

                        {c.notes}

                      </span>

                    </div>

                  </div>

                )}

                {/* ATTENDANCE STATUS */}

                <div className="mt-4 flex items-center gap-2 text-sm">

                  <CheckCircle2
                    className={`h-4 w-4 ${
                      c.attendanceMarked
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }`}
                  />

                  <span>

                    {c.attendanceMarked
                      ? "Attendance Completed"
                      : "Attendance Pending"}

                  </span>

                </div>

                {/* ACTIONS */}

                <div className="mt-5 flex flex-wrap gap-2">

                  {/* OPEN MEETING */}

                  {c.meetingLink && (

                    <Button
                      size="sm"
                      className="bg-gold text-black hover:bg-gold/90"
                      asChild
                    >

                      <a
                        href={c.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                      >

                        Open Class

                        <ExternalLink className="ml-1 h-3 w-3" />

                      </a>

                    </Button>

                  )}

                  {/* ATTENDANCE */}

                  <Button
                    size="sm"
                    variant="outline"
                    disabled={
                      c.attendanceMarked
                    }
                    onClick={() =>
                      markAttendance(
                        c._id
                      )
                    }
                  >

                    {c.attendanceMarked
                      ? "Attendance Done"
                      : "Mark Attendance"}

                  </Button>

                  {/* STATUS */}

                  {c.status !==
                    "Completed" && (

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        updateStatus(
                          c._id,
                          c.status
                        )
                      }
                    >

                      {c.status ===
                      "Upcoming"
                        ? "Start Class"
                        : "Complete Class"}

                    </Button>

                  )}

                </div>

              </CardContent>

            </Card>

          </motion.div>

        ))}

      </div>

    </div>

  );

}