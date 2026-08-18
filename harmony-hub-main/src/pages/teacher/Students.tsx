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

const API = "https://marcylmsdeploy-2.onrender.com/api";

export default function TeacherStudents() {
  const { user } = useAuth();
  const teacherId = user?.id || user?._id;

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
const [completingId, setCompletingId] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<
    "all" | "paid" | "pending"
  >("all");

  // =========================
  // FETCH STUDENTS
  // =========================
  useEffect(() => {
    if (!teacherId) return;
    fetchStudents();
  }, [teacherId, statusFilter]);

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

  // =========================
  // UPDATE PROGRESS
  // =========================
  const updateProgress = async (id: string, progress: number) => {
    try {
      await axios.put(`${API}/student/progress/${id}`, {
        progress,
      });

      fetchStudents();
    } catch (err) {
      console.log(err);
    }
  };
  const completeLevel = async (studentId: string) => {
  try {
    setCompletingId(studentId);

    const res = await axios.put(
      `${API}/student/complete-level/${studentId}`
    );

    console.log("LEVEL COMPLETED:", res.data);

    await fetchStudents();

  } catch (err: any) {
    console.log(
      "COMPLETE LEVEL ERROR:",
      err.response?.data || err
    );

    alert(
      err.response?.data?.message ||
      "Failed to complete level"
    );
  } finally {
    setCompletingId(null);
  }
};

  if (loading) {
    return <div className="p-6">Loading students...</div>;
  }




  return (
    <div>
      <PageHeader
        title="My Students"
        subtitle="Filter by payment status"
      />

      {/* FILTERS */}
      <div className="mb-4 flex gap-2">
        {(["all", "paid", "pending"] as const).map((s) => (
          <Button
            key={s}
            variant={statusFilter === s ? "default" : "outline"}
            onClick={() => setStatusFilter(s)}
          >
            {s}
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

        {students.map((s) => {
          const payments = s.payments || [];
          const activePayment =
            payments.length > 0
              ? payments[payments.length - 1]
              : null;

          return (
            <Card key={s._id}>
              <CardContent className="p-5">

                {/* TOP */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {s.name?.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="font-bold">{s.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {s.email}
                    </div>
                  </div>

                  <LevelBadge
  level={
    s.currentLevel ||
    activePayment?.course?.grade ||
    s.selectedLevel ||
    "Not Assigned"
  }
/>
                </div>

                {/* DETAILS */}
                <div className="mt-4 space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Course:</span>{" "}
                    {s.payments?.length > 0
  ? s.payments[s.payments.length - 1]?.course?.name
  : s.course?.name || "Not Assigned"}
                  </div>

                  <div>
                    <span className="font-medium">Phone:</span>{" "}
                    {s.phone}
                  </div>

                  <div>
                    <span className="font-medium">Payment:</span>{" "}
                    <span
                      className={
                        s.paymentStatus === "Paid"
                          ? "text-green-600 font-semibold"
                          : "text-red-500 font-semibold"
                      }
                    >
                      {s.paymentStatus}
                    </span>
                  </div>
                </div>
                <div className="mt-1 flex flex-wrap gap-2">
  <span
    className={`rounded-full px-2 py-1 text-xs font-medium ${
      s.classType === "Group"
        ? "bg-blue-100 text-blue-700"
        : "bg-green-100 text-green-700"
    }`}
  >
    {s.classType === "Group"
      ? "👥 Group Student"
      : "👤 Individual Student"}
  </span>

  {s.classType === "Group" && s.groupName && (
    <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
      {s.groupName}
    </span>
  )}
</div>

                {/* ========================= */}
                {/* LEVEL HISTORY (REAL DATA) */}
                {/* ========================= */}
                {/* ========================= */}
{/* CURRENT LEVEL */}
{/* ========================= */}

<div className="mt-5 rounded-lg border bg-muted/30 p-4">
  <div className="text-xs font-semibold text-muted-foreground">
    Current Level
  </div>

  <div className="mt-2">
    <div className="text-lg font-bold">
      {s.currentLevel ||
        s.selectedLevel ||
        s.level ||
        "Beginner"}
    </div>

    <div className="text-sm text-muted-foreground">
      {activePayment?.course?.name ||
        s.course?.name ||
        "Course not assigned"}
    </div>
  </div>
</div>


{/* ========================= */}
{/* COMPLETED LEVELS */}
{/* ========================= */}

<div className="mt-4">
  <div className="text-xs font-semibold text-muted-foreground">
    Completed Levels
  </div>

  <div className="mt-2 space-y-2">

    {s.completedLevels?.length > 0 ? (
      s.completedLevels.map(
        (level: string, index: number) => (
          <div
            key={`${level}-${index}`}
            className="flex items-center justify-between rounded-md border px-3 py-2"
          >
            <span className="text-sm font-medium">
              {level}
            </span>

            <span className="text-xs font-semibold text-green-600">
              ✔ Completed
            </span>
          </div>
        )
      )
    ) : (
      <div className="text-xs text-muted-foreground">
        No levels completed yet
      </div>
    )}

  </div>
</div>
                {/* PROGRESS BAR */}
                <div className="mt-5">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{s.progress || 0}%</span>
                  </div>

                  <Progress
                    value={s.progress || 0}
                    className="mt-2 h-2"
                  />
                </div>

                {/* BUTTON */}
               <div className="mt-5 space-y-2">

  {/* EVALUATE */}
  <Button
    className="w-full bg-gold text-black"
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

  {/* COMPLETE LEVEL */}
<Button
  variant="outline"
  className="w-full"
  disabled={
    (s.progress || 0) < 100 ||
    completingId === s._id
  }
  onClick={() => completeLevel(s._id)}
>
  {completingId === s._id
    ? "Completing..."
    : "Complete Current Level"}
</Button>

</div>

              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}