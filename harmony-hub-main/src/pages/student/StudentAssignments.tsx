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
  <div className="space-y-6">

    {assignments.map((a) => {

      const isSubmitted = a.status === "Submitted";
      const isGraded = a.status === "Reviewed";

      return (
        <Card
          key={a._id}
          className="rounded-2xl shadow-sm hover:shadow-md transition-all border"
        >
          <CardContent className="p-6 space-y-4">

            {/* HEADER */}
            <div className="flex items-start justify-between">

              {/* LEFT */}
              <div className="flex items-center gap-4">

                <div className="h-12 w-12 rounded-xl bg-gold-soft flex items-center justify-center">
                  <ClipboardList className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold">
                    {a.title}
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Due Date:{" "}
                    <span className="font-medium text-black">
                      {a.due}
                    </span>
                  </p>
                </div>

              </div>

              {/* STATUS BADGE */}
              <Badge
                className={
                  isGraded
                    ? "bg-green-600 text-white"
                    : isSubmitted
                    ? "bg-blue-600 text-white"
                    : "bg-gray-400 text-white"
                }
              >
                {a.status || "Pending"}
              </Badge>

            </div>

            {/* STATUS INFO BOX */}
            <div className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">

              {isGraded && (
                <div className="text-green-700 font-medium">
                  ✔ Assignment Reviewed
                </div>
              )}

              {isSubmitted && !isGraded && (
                <div className="text-blue-700 font-medium">
                  ⏳ Submitted - Waiting for review
                </div>
              )}

              {!isSubmitted && (
                <div>
                  ❗ Not submitted yet
                </div>
              )}

            </div>

           {a.submissions?.map((s: any) => (
  s.studentId?._id === studentId && (
    <div key={s._id} className="space-y-1 mt-2">
      
      {s.marks !== undefined && s.marks !== null && (
        <div className="text-green-700 font-semibold">
          Marks: {s.marks}
        </div>
      )}

      {s.feedback && (
        <div className="text-muted-foreground text-sm">
          Feedback: {s.feedback}
        </div>
      )}

      {s.status && (
        <div className="text-xs text-blue-600">
          Status: {s.status}
        </div>
      )}

    </div>
  )
))}

            {/* SUBMIT SECTION */}
            <div className="pt-2">
              <SubmitAssignment
                assignment={a}
                studentId={studentId}
              />
            </div>

          </CardContent>
        </Card>
      );
    })}

  </div>
);

}