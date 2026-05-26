import { useEffect, useState } from "react";
import axios from "axios";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList } from "lucide-react";

import SubmitAssignment from "./SubmitAssignment";
import StudentFeedback from "./StudentFeedback";


const API = "https://marcylmsdeploy.onrender.com/api";

export default function StudentAssignments() {

  const authData = JSON.parse(localStorage.getItem("ms-auth") || "{}");
  const student = authData?.state?.user;
  const studentId = student?._id || student?.id;

  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const teacherId = assignments?.[0]?.teacherId;

  const fetchAssignments = async () => {
    try {
      if (!studentId) return;

      const res = await axios.get(
        `${API}/assignments/student/${studentId}`
      );

      setAssignments(res.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [studentId]);

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading assignments...</div>;
  }

  if (assignments.length === 0) {
    return (
      <div className="border rounded-2xl p-10 text-center text-muted-foreground">
        No assignments available
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <StudentFeedback teacherId={teacherId} />

      {assignments.map((a) => {

        // ✅ FIND ONLY THIS STUDENT SUBMISSION
        const mySubmission = a.submissions?.find(
          (s: any) =>
            String(s.studentId?._id || s.studentId) === String(studentId)
        );

        const isSubmitted = !!mySubmission;
        const isReviewed = mySubmission?.status === "Reviewed";

        return (
          <Card key={a._id} className="rounded-2xl border shadow-sm hover:shadow-md transition">

            <CardContent className="p-6 space-y-4">

              {/* HEADER */}
              <div className="flex items-start justify-between">

                <div className="flex items-center gap-4">

                  <div className="h-12 w-12 rounded-xl bg-gold-soft flex items-center justify-center">
                    <ClipboardList className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold">{a.title}</h2>

                    <p className="text-sm text-muted-foreground">
                      Due: <span className="text-black font-medium">{a.due}</span>
                    </p>
                  </div>

                </div>

                {/* STATUS BADGE (use assignment level only for color) */}
                <Badge
                  className={
                    isReviewed
                      ? "bg-green-600 text-white"
                      : isSubmitted
                      ? "bg-blue-600 text-white"
                      : "bg-gray-400 text-white"
                  }
                >
                  {isReviewed
                    ? "Reviewed"
                    : isSubmitted
                    ? "Submitted"
                    : "Pending"}
                </Badge>

              </div>

              {/* STATUS INFO */}
              <div className="rounded-xl bg-muted p-3 text-sm">

                {isReviewed && (
                  <div className="text-green-700 font-medium">
                    ✔ Reviewed by Teacher
                  </div>
                )}

                {isSubmitted && !isReviewed && (
                  <div className="text-blue-700 font-medium">
                    ⏳ Submitted - Waiting for review
                  </div>
                )}

                {!isSubmitted && (
                  <div className="text-gray-600">
                    ❗ Not submitted yet
                  </div>
                )}

              </div>

              {/* RESULT */}
              {mySubmission && (
                <div className="space-y-1 border rounded-xl p-3 bg-white">

                  {mySubmission.marks != null && (
                    <div className="text-green-700 font-semibold">
                      ✔ Marks: {mySubmission.marks}
                    </div>
                  )}

                  {mySubmission.feedback && (
                    <div className="text-sm text-muted-foreground">
                      💬 Feedback: {mySubmission.feedback}
                    </div>
                  )}

                  {mySubmission.status && (
                    <div className="text-xs text-blue-600">
                      Status: {mySubmission.status}
                    </div>
                  )}

                </div>
              )}

              {/* SUBMIT */}
              <SubmitAssignment assignment={a} studentId={studentId} />

            </CardContent>

          </Card>
        );
      })}

    </div>
  );
}