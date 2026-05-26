import { useEffect, useState } from "react";
import axios from "axios";

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

import NewAssignmentButton from "./NewAssignmentButton";

import {
  ClipboardList,
  CheckCircle2,
  RefreshCcw,
} from "lucide-react";

const API = "https://marcylmsdeploy.onrender.com/api";

type Assignment = {
  _id: string;
  title: string;
  studentName: string;
  due: string;
  status: "Pending" | "Submitted" | "Reviewed";
};

export default function TeacherAssignments() {
  const teacherId = "teacher1";

  const [tasks, setTasks] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState("all");

  // ======================
  // FETCH TASKS
  // ======================
  const fetchTasks = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API}/assignments/teacher/${teacherId}`
      );

      setTasks(res.data || []);
    } catch (err) {
      console.log("Assignments error:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ======================
  // UPDATE STATUS
  // ======================
  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.put(`${API}/assignments/status/${id}`, {
        status,
      });

      fetchTasks();
    } catch (err) {
      console.log("Update error:", err);
      alert("Failed to update status");
    }
  };

  // ======================
  // FILTER SAFE DATA
  // ======================
  const filteredTasks =
    selectedStudent === "all"
      ? tasks
      : tasks.filter((t) => t.studentName === selectedStudent);

  // ======================
  // GET UNIQUE STUDENTS (FROM TASKS ONLY)
  // ======================
  const students = Array.from(
    new Set(tasks.map((t) => t.studentName))
  );

  // ======================
  // LOADING
  // ======================
  if (loading) {
    return (
      <div className="p-6 text-muted-foreground">
        Loading assignments...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <PageHeader
        title="Assignments"
        subtitle="Manage student assignments easily"
      />

      {/* ACTIONS */}
      <div className="flex items-center gap-3">
        <NewAssignmentButton onRefresh={fetchTasks} />

        <Button variant="outline" onClick={fetchTasks}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* FILTER */}
      <div className="flex gap-3">
        <Select onValueChange={setSelectedStudent}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filter by student" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Students</SelectItem>

            {students.map((name, idx) => (
              <SelectItem key={idx} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* LIST */}
      <div className="grid gap-4">
        {filteredTasks.length === 0 ? (
          <div className="p-6 border rounded-xl text-muted-foreground">
            No assignments found
          </div>
        ) : (
          filteredTasks.map((t) => (
            <Card key={t._id} className="hover:shadow-md transition">
              <CardContent className="p-5 flex items-center justify-between">

                {/* LEFT */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-gold-soft">
                    <ClipboardList className="h-4 w-4" />
                  </div>

                  <div>
                    <div className="font-medium">{t.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {t.studentName}
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3">

                  {/* DUE */}
                  <Badge variant="outline">{t.due}</Badge>

                  {/* STATUS */}
                  <Badge
                    className={
                      t.status === "Reviewed"
                        ? "bg-green-100 text-green-700"
                        : t.status === "Submitted"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }
                  >
                    {t.status === "Reviewed" && (
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                    )}
                    {t.status}
                  </Badge>

                  {/* UPDATE STATUS */}
                  <Select
                    value={t.status}
                    onValueChange={(value) =>
                      updateStatus(t._id, value)
                    }
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
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}