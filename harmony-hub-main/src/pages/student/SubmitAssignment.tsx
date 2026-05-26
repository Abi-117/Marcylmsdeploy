import { useEffect, useState } from "react";
import axios from "axios";

import SubmitAssignment from "./SubmitAssignment";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { ClipboardList } from "lucide-react";

import { useAuth } from "@/store/auth";

const API =
  "https://marcylmsdeploy.onrender.com/api";

export default function StudentAssignments() {

  const user =
    useAuth((s) => s.user);

  const studentId =
    user?.id || user?._id;

  const [assignments, setAssignments] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // FETCH ASSIGNMENTS
  // =========================

  const fetchAssignments =
    async () => {

      try {

        setLoading(true);

        const res =
          await axios.get(

            `${API}/assignments/student/${studentId}`

          );

        setAssignments(
          res.data || []
        );

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }

    };

  useEffect(() => {

    if (studentId) {

      fetchAssignments();

    }

  }, [studentId]);

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div className="p-6">
        Loading assignments...
      </div>
    );

  }

  return (
    <div className="space-y-5">

      <div>

        <h1 className="text-2xl font-bold">
          My Assignments
        </h1>

        <p className="text-sm text-muted-foreground">
          Submit your tasks here
        </p>

      </div>

      {assignments.length === 0 ? (

        <div className="border rounded-xl p-6 text-muted-foreground">
          No assignments available
        </div>

      ) : (

        assignments.map(
          (assignment) => (

            <Card
              key={assignment._id}
            >

              <CardContent className="p-5 space-y-4">

                {/* TOP */}

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="h-10 w-10 rounded-lg bg-gold-soft flex items-center justify-center">

                      <ClipboardList className="h-4 w-4" />

                    </div>

                    <div>

                      <div className="font-semibold">
                        {assignment.title}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Due:
                        {" "}
                        {assignment.due}
                      </div>

                    </div>

                  </div>

                  <Badge>
                    {assignment.status}
                  </Badge>

                </div>

                {/* SUBMIT */}

                <SubmitAssignment
                  assignment={
                    assignment
                  }
                  studentId={
                    studentId
                  }
                />

              </CardContent>

            </Card>

          )
        )

      )}

    </div>
  );
}