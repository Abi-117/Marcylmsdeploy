import { useEffect, useState } from "react";
import axios from "axios";

import { PageHeader } from "@/components/dashboard/Primitives";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  ClipboardList,
  CheckCircle2,
  User,
  Calendar,
} from "lucide-react";

const API = "https://marcylmsdeploy.onrender.com/api";

export default function TeacherAssignments() {
  const teacherId = "teacher1";

  const [tasks, setTasks] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    studentId: "",
    due: "",
  });

  // =========================
  // FETCH
  // =========================
  const fetchTasks = async () => {
    const res = await axios.get(
      `${API}/assignments/teacher/${teacherId}`
    );
    setTasks(res.data);
  };

  const fetchStudents = async () => {
    const res = await axios.get(`${API}/students`);
    setStudents(res.data);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchTasks(), fetchStudents()]);
      setLoading(false);
    })();
  }, []);

  // =========================
  // CREATE
  // =========================
  const createAssignment = async () => {
    if (!form.title || !form.studentId || !form.due) return;

    await axios.post(`${API}/assignments/create`, {
      title: form.title,
      studentId: form.studentId,
      teacherId,
      due: form.due,
    });

    setForm({ title: "", studentId: "", due: "" });
    fetchTasks();
  };

  // =========================
  // STATUS UPDATE
  // =========================
  const updateStatus = async (id: string, status: string) => {
    await axios.put(`${API}/assignments/status/${id}`, { status });
    fetchTasks();
  };

  if (loading) {
    return (
      <div className="p-6 text-muted-foreground">
        Loading assignments...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <PageHeader
        title="Assignments"
        subtitle="Create, assign and track student work"
      />

      {/* =========================
          CREATE PANEL (PREMIUM CARD)
      ========================= */}
      <Card className="rounded-2xl border shadow-sm">
        <CardContent className="p-6 space-y-4">

          <div className="grid md:grid-cols-2 gap-4">

            {/* TITLE */}
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">
                Assignment Title
              </label>
              <Input
                placeholder="e.g. Practice Scales"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />
            </div>

            {/* STUDENT */}
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">
                Select Student
              </label>

              <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
                <User className="h-4 w-4 text-muted-foreground" />

                <select
                  className="w-full outline-none bg-transparent text-sm"
                  value={form.studentId}
                  onChange={(e) =>
                    setForm({ ...form, studentId: e.target.value })
                  }
                >
                  <option value="">Choose student</option>
                  {students.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* DUE DATE */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs text-muted-foreground">
                Due Date
              </label>

              <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  className="border-0 focus-visible:ring-0"
                  value={form.due}
                  onChange={(e) =>
                    setForm({ ...form, due: e.target.value })
                  }
                />
              </div>
            </div>

          </div>

          {/* BUTTON */}
          <Button
            onClick={createAssignment}
            className="w-full bg-black text-white hover:bg-black/90"
          >
            Assign to Student
          </Button>

        </CardContent>
      </Card>

      {/* =========================
          LIST HEADER
      ========================= */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">
          Recent Assignments
        </h2>
        <Badge variant="outline">
          {tasks.length} total
        </Badge>
      </div>

      {/* =========================
          TASK LIST (CLEAN CARDS)
      ========================= */}
      <div className="grid gap-4">

        {tasks.map((t) => (
          <Card
            key={t._id}
            className="rounded-2xl hover:shadow-md transition"
          >
            <CardContent className="p-5 flex flex-wrap items-center gap-4">

              {/* ICON */}
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-100">
                <ClipboardList className="h-4 w-4" />
              </div>

              {/* INFO */}
              <div className="flex-1 min-w-[200px]">
                <div className="font-medium">
                  {t.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t.studentName}
                </div>
              </div>

              {/* DUE */}
              <Badge variant="outline">
                {t.due}
              </Badge>

              {/* STATUS */}
              <Badge
                className={
                  t.status === "Reviewed"
                    ? "bg-green-100 text-green-700"
                    : t.status === "Submitted"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100"
                }
              >
                {t.status === "Reviewed" && (
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                )}
                {t.status}
              </Badge>

              {/* ACTION */}
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  updateStatus(
                    t._id,
                    t.status === "Pending"
                      ? "Submitted"
                      : "Reviewed"
                  )
                }
              >
                Review
              </Button>

            </CardContent>
          </Card>
        ))}

      </div>

    </div>
  );
}