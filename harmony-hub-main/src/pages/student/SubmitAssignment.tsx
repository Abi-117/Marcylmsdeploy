import { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  FileUp,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";

const API = "https://marcylmsdeploy.onrender.com/api";

type Props = {
  assignment?: any;
  studentId?: string;
};

export default function SubmitAssignment({
  assignment,
  studentId,
}: Props) {

  const [file, setFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  // =========================
  // SAFETY CHECK
  // =========================

  if (!assignment) {
    return (
      <div className="border rounded-xl p-4 text-sm text-muted-foreground">
        Assignment not found
      </div>
    );
  }

  // =========================
  // FAKE FILE UPLOAD
  // =========================

  const uploadFile = async (
    file: File
  ) => {

    return new Promise<string>(
      (resolve) => {

        setTimeout(() => {

          resolve(
            "https://fake-upload.com/" +
              file.name
          );

        }, 1000);

      }
    );

  };

  // =========================
  // SUBMIT
  // =========================

  const submit = async () => {

    try {

      if (!file) {
        return alert("Upload file");
      }

      setLoading(true);

      const fileUrl =
        await uploadFile(file);

      await axios.post(
        `${API}/assignments/submit`,
        {
          assignmentId:
            assignment._id,

          studentId,

          fileUrl,
        }
      );

      alert(
        "Assignment submitted successfully"
      );

      setFile(null);

    } catch (err) {

      console.log(err);

      alert("Submit failed");

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="rounded-2xl border bg-background p-5 shadow-sm space-y-5">

      {/* HEADER */}

      <div className="flex items-start justify-between">

        <div>

          <h2 className="text-lg font-bold">
            {assignment.title}
          </h2>

          <p className="text-sm text-muted-foreground mt-1">
            Submit your assignment file
          </p>

        </div>

        <Badge variant="outline">
          Pending
        </Badge>

      </div>

      {/* DETAILS */}

      <div className="grid gap-3 sm:grid-cols-2">

        <div className="rounded-xl border p-3">
          <div className="text-xs text-muted-foreground">
            Due Date
          </div>

          <div className="mt-1 flex items-center gap-2 text-sm font-medium">
            <CalendarDays className="h-4 w-4" />

            {assignment.due || "No due date"}
          </div>
        </div>

        <div className="rounded-xl border p-3">
          <div className="text-xs text-muted-foreground">
            Teacher
          </div>

          <div className="mt-1 text-sm font-medium">
            {assignment.teacherName ||
              "Teacher"}
          </div>
        </div>

      </div>

      {/* FILE PICKER */}

      <div className="space-y-2">

        <label className="text-sm font-medium">
          Upload File
        </label>

        <Input
          type="file"
          onChange={(e) =>
            setFile(
              e.target.files?.[0] || null
            )
          }
        />

        {file && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            {file.name}
          </div>
        )}

      </div>

      {/* BUTTON */}

      <Button
        onClick={submit}
        disabled={loading}
        className="w-full"
      >

        <FileUp className="mr-2 h-4 w-4" />

        {loading
          ? "Submitting..."
          : "Submit Assignment"}

      </Button>

    </div>
  );
}