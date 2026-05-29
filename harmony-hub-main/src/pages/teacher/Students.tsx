import { useEffect, useState } from "react";

import axios from "axios";

import {
  PageHeader,
  LevelBadge,
} from "@/components/dashboard/Primitives";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import { Progress } from "@/components/ui/progress";

import { useAuth } from "@/store/auth";

const API =
  "https://marcylmsdeploy-2.onrender.com/api";

export default function TeacherStudents() {

  // ====================================
  // AUTH
  // ====================================

  const { user } = useAuth();

  const teacherId = user?.id || user?._id; // FIX FOR BOTH TEACHER AND ADMIN LOGIN STRUCTURE

  // ====================================
  // STATES
  // ====================================

  const [students, setStudents] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [statusFilter, setStatusFilter] =
    useState<
      "all" | "paid" | "pending"
    >("all");

  // ====================================
  // LOAD STUDENTS
  // ====================================

  useEffect(() => {

    if (!teacherId) return;

    fetchStudents();

  }, [teacherId, statusFilter]);

  // ====================================
  // FETCH STUDENTS
  // ====================================

  const fetchStudents = async () => {

    try {

      setLoading(true);

      const res = await axios.get(

        `${API}/student/teacher/${teacherId}?status=${statusFilter}`

      );

      setStudents(res.data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  // ====================================
  // UPDATE PROGRESS
  // ====================================

  const updateProgress =
    async (
      id: string,
      progress: number
    ) => {

      try {

        await axios.put(

          `${API}/student/progress/${id}`,

          {
            progress,
          }

        );

        fetchStudents();

      } catch (err) {

        console.log(err);

      }

    };

  // ====================================
  // LOADING
  // ====================================

  if (loading) {

    return (

      <div className="p-6">

        Loading students...

      </div>

    );

  }

  // ====================================
  // UI
  // ====================================

  return (

    <div>

      <PageHeader
        title="My Students"
        subtitle="Filter by payment status"
      />

      {/* FILTERS */}

      <div className="mb-4 flex gap-2">

        {(
          [
            "all",
            "paid",
            "pending",
          ] as const
        ).map((s) => (

          <Button
            key={s}
            variant={
              statusFilter === s
                ? "default"
                : "outline"
            }
            onClick={() =>
              setStatusFilter(s)
            }
            className={
              statusFilter === s
                ? "bg-gold text-black"
                : ""
            }
          >

            {s === "all"
              ? "All"
              : s === "paid"
              ? "Paid"
              : "Unpaid"}

          </Button>

        ))}

      </div>

      {/* STUDENTS */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {students.length === 0 && (

          <div className="text-muted-foreground p-6">

            No students found

          </div>

        )}

        {students.map((s) => (

          <Card
            key={s._id}
          >

            <CardContent className="p-5">

              {/* TOP */}

              <div className="flex items-center gap-3">

                <Avatar className="h-12 w-12">

                  <AvatarFallback>

                    {s.name
                      ?.split(" ")
                      ?.map(
                        (p: any) => p[0]
                      )
                      ?.join("")
                      ?.slice(0, 2)}

                  </AvatarFallback>

                </Avatar>

                <div className="flex-1">

                  <div className="font-bold">

                    {s.name}

                  </div>

                  <div className="text-xs text-muted-foreground">

                    {s.email}

                  </div>

                </div>

                <LevelBadge
                  level={
                    s.selectedLevel
                  }
                />

              </div>

              {/* DETAILS */}

              <div className="mt-4 space-y-2 text-sm">

                {/* COURSE */}

                <div>

                  <span className="font-medium">

                    Course:

                  </span>{" "}

                  {s.course?.name} • {s.batch}

                </div>

                {/* PHONE */}

                <div>

                  <span className="font-medium">

                    Phone:

                  </span>{" "}

                  {s.phone}

                </div>

                {/* MODE */}

                <div>

                  <span className="font-medium">

                    Mode:

                  </span>{" "}

                  {s.mode}

                </div>

                {/* TIME */}

                <div>

                  <span className="font-medium">

                    Available:

                  </span>{" "}

                  {s.fromTime} - {s.toTime}

                </div>

                {/* DAYS */}

                <div>

                  <span className="font-medium">

                    Days:

                  </span>{" "}

                  {s.availableDays?.join(", ")}

                </div>

                {/* PAYMENT */}

                <div>

                  <span className="font-medium">

                    Payment:

                  </span>{" "}

                  <span
                    className={
                      s.paymentStatus ===
                      "Paid"
                        ? "text-green-600 font-semibold"
                        : "text-red-500 font-semibold"
                    }
                  >

                    {s.paymentStatus}

                  </span>

                </div>

              </div>

              {/* PROGRESS */}

              <div className="mt-5">

                <div className="flex justify-between text-xs">

                  <span>

                    Progress

                  </span>

                  <span>

                    {s.progress || 0}%

                  </span>

                </div>

                <Progress
                  value={
                    s.progress || 0
                  }
                  className="mt-2 h-2"
                />

              </div>

              {/* BUTTON */}

              <Button
                className="mt-5 w-full bg-gold text-black"
                onClick={() =>

                  updateProgress(

                    s._id,

                    Math.min(
                      (s.progress || 0) + 10,
                      100
                    )

                  )

                }
              >

                Evaluate +10%

              </Button>

            </CardContent>

          </Card>

        ))}

      </div>

    </div>

  );

}