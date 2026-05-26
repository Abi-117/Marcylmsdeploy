import { useEffect, useState } from "react";
import axios from "axios";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  ClipboardList,
} from "lucide-react";

import SubmitAssignment from "./SubmitAssignment";

const API =
  "https://marcylmsdeploy.onrender.com/api";

export default function StudentAssignments() {

  // =========================
  // GET LOGGED STUDENT
  // =========================

  const authData = JSON.parse(
    localStorage.getItem("ms-auth") || "{}"
  );

  const student =
    authData?.state?.user;

  const studentId =
    student?._id || student?.id;

  // =========================
  // STATES
  // =========================

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

        if (!studentId) {

          console.log(
            "NO STUDENT ID"
          );

          return;

        }

        console.log(
          "FETCHING STUDENT:",
          studentId
        );

        const res =
          await axios.get(
            `${API}/assignments/student/${studentId}`
          );

        console.log(
          "STUDENT ASSIGNMENTS:",
          res.data
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

    fetchAssignments();

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

  // =========================
  // EMPTY
  // =========================

  if (
    assignments.length === 0
  ) {

    return (
      <div className="border rounded-2xl p-10 text-center text-muted-foreground">
        No assignments available
      </div>
    );

  }

  // =========================
  // UI
  // =========================

  return (
    <div className="space-y-5">

      {assignments.map((a) => (

        <Card
          key={a._id}
          className="rounded-2xl"
        >

          <CardContent className="p-5 space-y-4">

            {/* HEADER */}

            <div className="flex items-start justify-between">

              <div className="flex items-center gap-3">

                <div className="h-12 w-12 rounded-xl bg-gold-soft flex items-center justify-center">

                  <ClipboardList className="h-5 w-5" />

                </div>

                <div>

                  <h2 className="font-semibold text-lg">
                    {a.title}
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Due: {a.due}
                  </p>

                </div>

              </div>

              <Badge>

                {a.status || "Pending"}

              </Badge>

            </div>

            {/* SUBMIT */}

            <SubmitAssignment
              assignment={a}
              studentId={studentId}
            />

          </CardContent>

        </Card>

      ))}

    </div>
  );

}