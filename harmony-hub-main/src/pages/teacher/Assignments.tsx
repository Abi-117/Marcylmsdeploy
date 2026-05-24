import { useEffect, useState } from "react";
import axios from "axios";

import { PageHeader } from "@/components/dashboard/Primitives";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NewAssignmentButton from "./NewAssignmentButton";

import { ClipboardList, Upload, CheckCircle2 } from "lucide-react";

const API = "https://marcylmsdeploy.onrender.com/api";

export default function TeacherAssignments() {
  const teacherId = "teacher1";

  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API}/assignments/teacher/${teacherId}`
      );
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.put(`${API}/assignments/status/${id}`, {
        status,
      });

      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-muted-foreground">
        Loading assignments...
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Assignments"
        subtitle="Review submissions and assign tasks"
        actions={<NewAssignmentButton onRefresh={fetchTasks} />}
      />

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {tasks.map((t) => (
              <div
                key={t._id}
                className="flex flex-wrap items-center gap-3 p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-soft">
                  <ClipboardList className="h-4 w-4" />
                </div>

                {/* TITLE */}
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {t.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t.studentName}
                  </div>
                </div>

                {/* DUE */}
                <Badge variant="outline">{t.due}</Badge>

                {/* STATUS */}
                <Badge
                  className={
                    t.status === "Reviewed"
                      ? "bg-green-100"
                      : t.status === "Submitted"
                      ? "bg-yellow-100"
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
                  variant="ghost"
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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}