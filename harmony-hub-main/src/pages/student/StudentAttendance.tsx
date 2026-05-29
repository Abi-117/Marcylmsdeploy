import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

import { useAuth } from "@/store/auth";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
  CheckCircle2,
  XCircle,
  CalendarDays,
  BookOpen,
} from "lucide-react";

const API =
  "https://marcylmsdeploy-2.onrender.com/api";

export default function StudentAttendance() {

  // ====================================
  // AUTH
  // ====================================

  const { user } = useAuth();

  const studentId = user?.id || user?._id; // FIX FOR BOTH TEACHER AND ADMIN LOGIN STRUCTURE

  // ====================================
  // STATES
  // ====================================

  const [data, setData] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  // ====================================
  // FETCH ATTENDANCE
  // ====================================

  useEffect(() => {

    if (!studentId) return;

    fetchAttendance();

  }, [studentId]);

  const fetchAttendance = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        `${API}/attendance/student/${studentId}`
      );

      console.log(
        "Attendance:",
        res.data
      );

      setData(res.data);

    } catch (err) {

      console.log(
        "Attendance fetch error:",
        err
      );

    } finally {

      setLoading(false);

    }

  };

  // ====================================
  // COUNTS
  // ====================================

  const presentCount =
    data.filter(
      (a) => a.status === "Present"
    ).length;

  const absentCount =
    data.filter(
      (a) => a.status === "Absent"
    ).length;

  // ====================================
  // LOADING
  // ====================================

  if (loading) {

    return (
      <div className="p-6 text-muted-foreground">
        Loading attendance...
      </div>
    );

  }

  // ====================================
  // UI
  // ====================================

  return (

    <div className="p-6">

      {/* HEADER */}

      <div className="mb-6">

        <h1 className="text-3xl font-bold">
          My Attendance
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          Track your class participation
        </p>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-2 gap-4 mb-6">

        {/* PRESENT */}

        <Card>

          <CardContent className="p-5 flex items-center justify-between">

            <div>

              <p className="text-sm text-muted-foreground">
                Present
              </p>

              <h2 className="text-3xl font-bold text-green-600">
                {presentCount}
              </h2>

            </div>

            <CheckCircle2 className="h-10 w-10 text-green-600" />

          </CardContent>

        </Card>

        {/* ABSENT */}

        <Card>

          <CardContent className="p-5 flex items-center justify-between">

            <div>

              <p className="text-sm text-muted-foreground">
                Absent
              </p>

              <h2 className="text-3xl font-bold text-red-600">
                {absentCount}
              </h2>

            </div>

            <XCircle className="h-10 w-10 text-red-600" />

          </CardContent>

        </Card>

      </div>

      {/* EMPTY */}

      {data.length === 0 && (

        <Card>

          <CardContent className="p-10 text-center">

            <div className="text-lg font-semibold">
              No Attendance Records
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              Attendance records will appear here
            </p>

          </CardContent>

        </Card>

      )}

      {/* ATTENDANCE LIST */}

      <div className="space-y-4">

        {data.map((a: any) => (

          <Card
            key={a._id}
            className="hover:shadow-md transition-all"
          >

            <CardContent className="p-5">

              <div className="flex items-center justify-between">

                {/* LEFT */}

                <div>

                  {/* CLASS TITLE */}

                  <h2 className="text-lg font-semibold">
                    {a.classTitle || "Untitled Class"}
                  </h2>

                  {/* COURSE */}

                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">

                    <BookOpen className="h-4 w-4" />

                    <span>
                      {a.courseName || "No Course"}
                    </span>

                  </div>

                  {/* DATE */}

                  <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">

                    <CalendarDays className="h-4 w-4" />

                    <span>
                      {a.date
                        ? format(
                            new Date(a.date),
                            "dd MMM yyyy"
                          )
                        : "No Date"}
                    </span>

                  </div>

                </div>

                {/* STATUS */}

                <Badge
                  className={
                    a.status === "Present"
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }
                >

                  {a.status}

                </Badge>

              </div>

            </CardContent>

          </Card>

        ))}

      </div>

    </div>

  );

}