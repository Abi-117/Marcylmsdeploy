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

  const [statusFilter, setStatusFilter] = useState<
    "all" | "paid" | "pending"
  >("all");

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

  if (loading) return <div className="p-6">Loading students...</div>;

  return (
    <div>
      <PageHeader
        title="My Students"
        subtitle="Filter by payment status"
      />

      {/* FILTER */}
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
        {students.map((s) => {

          // 🔥 ORDER FROM BACKEND (IMPORTANT)
          const levels = s.course?.levels || [
            { title: "Initial", order: 1 },
            { title: "Beginner", order: 2 },
            { title: "Intermediate", order: 3 },
            { title: "Advanced", order: 4 },
          ];

          const currentIndex = Math.floor((s.progress || 0) / (100 / levels.length));

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

                  <LevelBadge level={s.selectedLevel} />
                </div>

                {/* DETAILS */}
                <div className="mt-4 space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Course:</span>{" "}
                    {s.course?.name}
                  </div>

                  <div>
                    <span className="font-medium">Payment:</span>{" "}
                    <span
                      className={
                        s.paymentStatus === "Paid"
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    >
                      {s.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* 🔥 LEVELS (DYNAMIC ORDER) */}
                {/* LEVEL HISTORY */}
<div className="mt-5 space-y-2">
  <div className="text-xs font-semibold text-muted-foreground">
    Level Progress
  </div>

  {s.payments?.map((p: any, i: number) => (
    <div key={i} className="flex justify-between text-sm">

      <span>
        {p.course?.grade} ({p.course?.name})
      </span>

      <span
        className={
          i === s.payments.length - 1
            ? "text-gold font-bold"
            : "text-green-600"
        }
      >
        {i === s.payments.length - 1
          ? "🔥 Active"
          : "✔ Completed"}
      </span>

    </div>
  ))}
</div>
                {/* PROGRESS */}
                <div className="mt-5">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{s.progress || 0}%</span>
                  </div>

                  <Progress value={s.progress || 0} className="mt-2 h-2" />
                </div>

                {/* BUTTON */}
                <Button
                  className="mt-5 w-full bg-gold text-black"
                  onClick={() =>
                    updateProgress(
                      s._id,
                      Math.min((s.progress || 0) + 10, 100)
                    )
                  }
                >
                  Evaluate +10%
                </Button>

              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}