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
  Users,
} from "lucide-react";

const API =
  "https://marcylmsdeploy.onrender.com/api";

type Assignment = {
  _id: string;
  title: string;
  due: string;
  status: "Pending" | "Submitted" | "Reviewed";

  studentIds: string[];

  submissions: any[];
};

export default function TeacherAssignments() {

  const teacherId = "teacher1";

  const [tasks, setTasks] =
    useState<Assignment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [statusFilter, setStatusFilter] =
    useState("all");

  // =====================================
  // FETCH ASSIGNMENTS
  // =====================================

  const fetchTasks = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        `${API}/assignments/teacher/${teacherId}`
      );

      // REMOVE DUPLICATES

      const unique =
        res.data.filter(
          (
            item: any,
            index: number,
            self: any[]
          ) =>
            index ===
            self.findIndex(
              (a) => a._id === item._id
            )
        );

      setTasks(unique);

    } catch (err) {

      console.log(
        "Assignments error:",
        err
      );

      setTasks([]);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchTasks();

  }, []);

  // =====================================
  // UPDATE STATUS
  // =====================================

  const updateStatus = async (
    id: string,
    status: string
  ) => {

    try {

      await axios.put(
        `${API}/assignments/status/${id}`,
        {
          status,
        }
      );

      setTasks((prev) =>
        prev.map((t) =>
          t._id === id
            ? {
                ...t,
                status:
                  status as Assignment["status"],
              }
            : t
        )
      );

    } catch (err) {

      console.log(err);

      alert(
        "Failed to update status"
      );

    }

  };

  // =====================================
  // FILTER
  // =====================================

  const filteredTasks =
    statusFilter === "all"
      ? tasks
      : tasks.filter(
          (t) =>
            t.status === statusFilter
        );

  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (
      <div className="p-6 text-muted-foreground">
        Loading assignments...
      </div>
    );

  }

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <PageHeader
        title="Assignments"
        subtitle="Manage all assignments"
      />

      {/* ACTION BAR */}

      <div className="flex flex-wrap items-center gap-3">

        <NewAssignmentButton
          onRefresh={fetchTasks}
        />

        <Button
          variant="outline"
          onClick={fetchTasks}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />

          Refresh
        </Button>

        {/* FILTER */}

        <Select
          value={statusFilter}
          onValueChange={
            setStatusFilter
          }
        >

          <SelectTrigger className="w-48">

            <SelectValue placeholder="Filter status" />

          </SelectTrigger>

          <SelectContent>

            <SelectItem value="all">
              All
            </SelectItem>

            <SelectItem value="Pending">
              Pending
            </SelectItem>

            <SelectItem value="Submitted">
              Submitted
            </SelectItem>

            <SelectItem value="Reviewed">
              Reviewed
            </SelectItem>

          </SelectContent>

        </Select>

      </div>

      {/* EMPTY */}

      {filteredTasks.length === 0 ? (

        <div className="border rounded-2xl p-10 text-center text-muted-foreground">

          No assignments found

        </div>

      ) : (

        <div className="grid gap-5">

          {filteredTasks.map((t) => (

            <Card
              key={t._id}
              className="rounded-2xl border shadow-sm hover:shadow-md transition"
            >

              <CardContent className="p-5">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                  {/* LEFT */}

                  <div className="flex items-start gap-4">

                    <div className="h-12 w-12 rounded-xl bg-gold-soft flex items-center justify-center">

                      <ClipboardList className="h-5 w-5" />

                    </div>

                    <div>

                      <h2 className="font-semibold text-lg">
                        {t.title}
                      </h2>

                      <div className="mt-2 flex flex-wrap gap-2">

                        <Badge variant="outline">
                          Due: {t.due}
                        </Badge>

                        <Badge
                          variant="secondary"
                        >
                          <Users className="h-3 w-3 mr-1" />

                          {
                            t.studentIds
                              ?.length
                          }{" "}
                          Students
                        </Badge>

                        <Badge
                          variant="secondary"
                        >
                          {
                            t.submissions
                              ?.length || 0
                          }{" "}
                          Submitted
                        </Badge>

                      </div>

                    </div>

                  </div>

                  {/* RIGHT */}

                  <div className="flex flex-col gap-3">

                    {/* STATUS */}

                    <Badge
                      className={
                        t.status ===
                        "Reviewed"
                          ? "bg-green-100 text-green-700"
                          : t.status ===
                            "Submitted"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }
                    >

                      {t.status ===
                        "Reviewed" && (
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                      )}

                      {t.status}

                    </Badge>

                    {/* STATUS UPDATE */}

                    <Select
                      value={t.status}
                      onValueChange={(
                        value
                      ) =>
                        updateStatus(
                          t._id,
                          value
                        )
                      }
                    >

                      <SelectTrigger className="w-40">

                        <SelectValue />

                      </SelectTrigger>

                      <SelectContent>

                        <SelectItem value="Pending">
                          Pending
                        </SelectItem>

                        <SelectItem value="Submitted">
                          Submitted
                        </SelectItem>

                        <SelectItem value="Reviewed">
                          Reviewed
                        </SelectItem>

                      </SelectContent>

                    </Select>

                  </div>

                </div>

              </CardContent>

            </Card>

          ))}

        </div>

      )}

    </div>
  );

}