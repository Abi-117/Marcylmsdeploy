import { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const API =
  "https://marcylmsdeploy-2.onrender.com/api";

export default function AssignmentReviewPanel({
  assignment,
}: any) {

  const [selectedStudent, setSelectedStudent] =
    useState("");

  const [marks, setMarks] =
    useState("");

  const [feedback, setFeedback] =
    useState("");

  // =========================
  // SAFETY
  // =========================

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

        return alert(
          "Select student"
        );

      }

      await axios.put(
        `${API}/assignments/review`,
        {
          assignmentId:
            assignment._id,

          studentId:
            selectedStudent,

          marks,

          feedback,
        }
      );

      alert(
        "Reviewed successfully"
      );

      setMarks("");
      setFeedback("");

    } catch (err) {

      console.log(err);

      alert("Failed");

    }

  };

  // =========================
  // UI
  // =========================

  return (
  <div className="border rounded-2xl p-5 space-y-5 bg-white shadow-sm">

    {/* TITLE */}
    <h2 className="font-semibold text-xl">
      Review Submissions
    </h2>

    {/* EMPTY STATE */}
    {assignment?.submissions?.length === 0 && (
      <div className="text-sm text-muted-foreground p-4 border rounded-xl">
        No submissions yet
      </div>
    )}

    {/* SUBMISSIONS LIST */}
    <div className="space-y-3">

      {assignment?.submissions?.map((s: any) => {

        const isSelected = selectedStudent === s.studentId?._id;

        return (
          <div
            key={s.studentId?._id}
            className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
              isSelected
                ? "border-gold bg-gold-soft shadow-sm"
                : "hover:bg-gray-50"
            }`}
          >

            {/* LEFT INFO */}
            <div className="space-y-1">

              <div className="font-medium text-sm">
                👤 {s.studentId?.name || "Unknown Student"}
              </div>

              <div className="text-xs text-muted-foreground">
                {s.studentId?.email}
              </div>

              {/* FILE */}
              {s.fileUrl && (
                <a
                  href={s.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 text-xs underline"
                >
                  📎 View Submission
                </a>
              )}

              {/* EXISTING REVIEW */}
              {s.marks && (
                <div className="text-xs text-green-600 font-medium">
                  Marks: {s.marks}
                </div>
              )}

              {s.feedback && (
                <div className="text-xs text-muted-foreground">
                  Feedback: {s.feedback}
                </div>
              )}

            </div>

            {/* SELECT BUTTON */}
            <Button
              size="sm"
              variant={isSelected ? "default" : "outline"}
              onClick={() => setSelectedStudent(s.studentId?._id)}
            >
              {isSelected ? "Selected" : "Select"}
            </Button>

          </div>
        );
      })}

    </div>

    {/* GRADING PANEL */}
    <div className="border rounded-xl p-4 space-y-3 bg-gray-50">

      <h3 className="font-medium text-sm">
        Give Marks & Feedback
      </h3>

      <Input
        placeholder="Enter marks (e.g. 85)"
        value={marks}
        onChange={(e) => setMarks(e.target.value)}
      />

      <Textarea
        placeholder="Enter feedback..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />

      <Button
        onClick={review}
        disabled={!selectedStudent}
        className="w-full bg-gold text-black"
      >
        Submit Review
      </Button>

    </div>

  </div>
);

}