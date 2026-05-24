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

    fetchClasses();

  }, []);

  // ====================================
  // FETCH CLASSES
  // ====================================

  const fetchClasses = async () => {

    try {

      if (!teacherId) return;

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

      fetchClasses();

    } catch (err) {

      console.log(err);

    }

  };

  // ====================================
  // UPDATE STATUS
  // ====================================

  const updateStatus = async (
    id: string,
    status: string
  ) => {

    try {

      await axios.put(
        `${API}/classes/status/${id}`,
        {
          status,
        }
      );

      fetchClasses();

    } catch (err) {

      console.log(err);

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
        subtitle="Schedule, manage and review sessions"
      />

      <div className="grid gap-4 md:grid-cols-2">

        {classes.length === 0 && (

          <div className="text-muted-foreground p-6">

            No classes found

          </div>

        )}

        {classes.map((c) => (

          <motion.div
            key={c._id}
            whileHover={{ y: -2 }}
          >

            <Card className="border-border/60">

              <CardContent className="p-5">

                {/* TOP */}

                <div className="flex justify-between">

                  <div>

                    <Badge
                      className={
                        c.status === "Live"
                          ? "bg-gold text-black"
                          : c.status ===
                            "Completed"
                          ? "bg-gray-200"
                          : ""
                      }
                    >

                      {c.status}

                    </Badge>

                    <div className="mt-3 font-display text-lg">

                      {c.title}

                    </div>

                    <div className="text-xs text-muted-foreground">

                      {c.batchName}

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

                    <div className="text-2xl font-display">

                      {format(
                        new Date(c.date),
                        "dd"
                      )}

                    </div>

                    <div className="text-xs">

                      {format(
                        new Date(c.date),
                        "h:mm a"
                      )}

                    </div>

                  </div>

                </div>

                {/* PLATFORM */}

                <div className="mt-4 flex gap-2 text-xs">

                  <Badge variant="outline">

                    <Video className="mr-1 h-3 w-3" />

                    {c.platform}

                  </Badge>

                  <Badge variant="outline">

                    {c.duration || 60} min

                  </Badge>

                </div>

                {/* NOTES */}

                {c.notes && (

                  <div className="mt-3 flex gap-2 rounded bg-muted p-2 text-xs text-muted-foreground">

                    <FileText className="mt-0.5 h-3 w-3" />

                    {c.notes}

                  </div>

                )}

                {/* ACTIONS */}

                <div className="mt-4 flex flex-wrap gap-2">

                  {/* OPEN */}

                  {c.meetingLink && (

                    <Button
                      size="sm"
                      className="bg-gold text-black"
                      asChild
                    >

                      <a
                        href={c.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                      >

                        Open

                        <ExternalLink className="ml-1 h-3 w-3" />

                      </a>

                    </Button>

                  )}

                  {/* ATTENDANCE */}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      markAttendance(c._id)
                    }
                    disabled={
                      c.attendanceMarked
                    }
                  >

                    {c.attendanceMarked
                      ? "Attendance Done"
                      : "Mark Attendance"}

                  </Button>

                  {/* STATUS */}

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      updateStatus(
                        c._id,
                        c.status ===
                          "Upcoming"
                          ? "Live"
                          : "Completed"
                      )
                    }
                  >

                    Update Status

                  </Button>

                </div>

              </CardContent>

            </Card>

          </motion.div>

        ))}

      </div>

    </div>

  );

}