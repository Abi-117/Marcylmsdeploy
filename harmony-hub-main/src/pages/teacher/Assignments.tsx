import { useEffect, useState } from "react";
import axios from "axios";

import AssignmentReviewPanel from "./AssignmentReviewPanel";
import NewAssignmentButton from "./NewAssignmentButton";

import { PageHeader } from "@/components/dashboard/Primitives";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ClipboardList,
  CheckCircle2,
  RefreshCcw,
  Users,
} from "lucide-react";

const API = "https://marcylmsdeploy.onrender.com/api";

type Assignment = {
  _id: string;
  title: string;
  due: string;
  status: "Pending" | "Submitted" | "Reviewed";
  studentIds: string[];
  submissions: any[];
};

export default function TeacherAssignments() {

  // =========================
  // AUTH
  // =========================
  const authData = JSON.parse(localStorage.getItem("ms-auth") || "{}");
  const teacher = authData?.state?.user;
  const teacherId = teacher?._id || teacher?.id;

  // =========================
  // STATE
  // =========================
  const [tasks, setTasks] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  // ✅ FIXED STATE (IMPORTANT)
  const [selectedStudent, setSelectedStudent] = useState("");

  // =========================
  // FETCH
  // =========================
  const fetchTasks = async () => {
    try {
      if (!teacherId) return;

      setLoading(true);

      const res = await axios.get(
        `${API}/assignments/teacher/${teacherId}`
      );

      const unique = res.data.filter(
        (item: any, index: number, self: any[]) =>
          index === self.findIndex((a) => a._id === item._id)
      );

      setTasks(unique);
    } catch (err) {
      console.log(err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teacherId) fetchTasks();
  }, [teacherId]);

  // =========================
  // STATUS UPDATE
  // =========================
  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.put(`${API}/assignments/status/${id}`, { status });

      setTasks((prev) =>
        prev.map((t) =>
          t._id === id
            ? { ...t, status: status as Assignment["status"] }
            : t
        )
      );
    } catch (err) {
      console.log(err);
      alert("Failed to update status");
    }
  };

  // =========================
  // FILTER
  // =========================
  const filteredTasks =
    statusFilter === "all"
      ? tasks
      : tasks.filter((t) => t.status === statusFilter);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="p-6 text-muted-foreground">
        Loading assignments...
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <PageHeader
        title="Assignments"
        subtitle="Manage student submissions"
      />

      {/* ACTION BAR */}
      <div className="flex flex-wrap gap-3 items-center">

        <NewAssignmentButton onRefresh={fetchTasks} />

        <Button variant="outline" onClick={fetchTasks}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Submitted">Submitted</SelectItem>
            <SelectItem value="Reviewed">Reviewed</SelectItem>
          </SelectContent>
        </Select>

      </div>

      {/* EMPTY */}
      {filteredTasks.length === 0 ? (
        <div className="border rounded-2xl p-10 text-center text-muted-foreground">
          No assignments found
        </div>
      ) : (
        <div className="space-y-5">

          {filteredTasks.map((t) => (

            <Card key={t._id} className="rounded-2xl border shadow-sm">

              <CardContent className="p-6 space-y-5">

                {/* TOP */}
                <div className="flex justify-between">

                  {/* LEFT */}
                  <div className="flex gap-4">

                    <div className="h-12 w-12 rounded-xl bg-gold-soft flex items-center justify-center">
                      <ClipboardList className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold">{t.title}</h2>

                      <div className="flex gap-2 mt-2 flex-wrap">

                        <Badge variant="outline">
                          Due: {t.due}
                        </Badge>

                        <Badge variant="secondary">
                          <Users className="h-3 w-3 mr-1" />
                          {t.studentIds?.length || 0}
                        </Badge>

                        <Badge variant="secondary">
                          {t.submissions?.length || 0} Submitted
                        </Badge>

                      </div>
                    </div>

                  </div>

                  {/* RIGHT */}
                  <div className="flex flex-col items-end gap-2">

                    <Badge
                      className={
                        t.status === "Reviewed"
                          ? "bg-green-600 text-white"
                          : t.status === "Submitted"
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-500 text-white"
                      }
                    >
                      {t.status}
                    </Badge>

                    <Select
                      value={t.status}
                      onValueChange={(v) => updateStatus(t._id, v)}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Submitted">Submitted</SelectItem>
                        <SelectItem value="Reviewed">Reviewed</SelectItem>
                      </SelectContent>

                    </Select>

                  </div>

                </div>

                {/* SUBMISSIONS */}
                {t.submissions?.length > 0 && (
                  <div className="border rounded-xl p-4 bg-gray-50 space-y-3">

                    <h3 className="text-sm font-medium">
                      📄 Submissions
                    </h3>

                    {t.submissions.map((s: any, i: number) => (
                      <div
                        key={i}
                        className="flex justify-between items-center border rounded-lg p-3 bg-white"
                      >

                        <div>

                          <div className="text-sm font-medium">
                            {s.studentId?.name}
                          </div>

                          <div className="text-xs text-muted-foreground">
                            {s.studentId?.email}
                          </div>

                          {s.marks && (
                            <div className="text-xs text-green-600">
                              Marks: {s.marks}
                            </div>
                          )}

                        </div>

                        <div className="flex gap-2 items-center">

                          {s.fileUrl && (
                            <a
                              href={s.fileUrl}
                              className="text-blue-600 text-sm underline"
                              target="_blank"
                            >
                              View
                            </a>
                          )}

                          <Button
                            size="sm"
                            onClick={() =>
  setSelectedStudent((prev) =>
    prev === s.studentId?._id ? "" : s.studentId?._id
  )
}
                          >
                            Review
                          </Button>

                        </div>

                      </div>
                    ))}

                  </div>
                )}

               {selectedStudent && (
  <div className="border rounded-xl p-4 bg-white shadow-sm relative">

    {/* CLOSE BUTTON */}
    <button
      onClick={() => setSelectedStudent("")}
      className="absolute top-2 right-3 text-sm text-gray-500 hover:text-red-500"
    >
      ✕ Close
    </button>

    <AssignmentReviewPanel assignment={t} />
  </div>
)}
              </CardContent>

            </Card>

          ))}

        </div>
      )}

    </div>
  );
}