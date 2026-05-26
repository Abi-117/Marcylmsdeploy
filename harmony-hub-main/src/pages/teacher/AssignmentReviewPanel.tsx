import { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const API = "https://marcylmsdeploy.onrender.com/api";

export default function AssignmentReviewPanel({
  assignment,
}: any) {

  const [selectedStudent, setSelectedStudent] =
    useState("");

  const [marks, setMarks] =
    useState("");

  const [feedback, setFeedback] =
    useState("");

  // ✅ SAFE GUARD
  if (!assignment) {
    return (
      <div className="border rounded-xl p-4 text-sm text-muted-foreground">
        No assignment selected
      </div>
    );
  }

  // =========================
  // REVIEW
  // =========================

  const review = async () => {

    try {

      if (!selectedStudent) {
        return alert("Select student");
      }

      await axios.put(
        `${API}/assignments/review`,
        {
          assignmentId: assignment._id,
          studentId: selectedStudent,
          marks,
          feedback,
        }
      );

      alert("Reviewed successfully");

    } catch (err) {

      console.log(err);

      alert("Failed");

    }

  };

  return (

    <div className="border rounded-xl p-4 space-y-4">

      <h2 className="font-semibold text-lg">
        Review Submissions
      </h2>

      {/* EMPTY */}
      {assignment?.submissions?.length === 0 && (
        <div className="text-sm text-muted-foreground">
          No submissions yet
        </div>
      )}

      {/* STUDENTS */}
      <div className="space-y-2">

        {assignment?.submissions?.map((s: any) => (

          <div
            key={s.studentId}
            className={`flex items-center justify-between border p-3 rounded-xl ${
              selectedStudent === s.studentId
                ? "border-gold bg-gold-soft"
                : ""
            }`}
          >

            <div>

              <div className="text-sm font-medium">
                Student: {s.studentId}
              </div>

              {s.fileUrl && (
                <a
                  href={s.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 text-xs"
                >
                  View File
                </a>
              )}

            </div>

            <Button
              size="sm"
              onClick={() =>
                setSelectedStudent(
                  s.studentId
                )
              }
            >
              Select
            </Button>

          </div>

        ))}

      </div>

      {/* MARKS */}
      <Input
        placeholder="Marks"
        value={marks}
        onChange={(e) =>
          setMarks(e.target.value)
        }
      />

      {/* FEEDBACK */}
      <Textarea
        placeholder="Feedback"
        value={feedback}
        onChange={(e) =>
          setFeedback(e.target.value)
        }
      />

      {/* SUBMIT */}
      <Button
        onClick={review}
        className="bg-gold text-black"
      >
        Submit Review
      </Button>

    </div>

  );

}