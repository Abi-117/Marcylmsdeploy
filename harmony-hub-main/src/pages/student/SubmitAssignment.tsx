import { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  FileUp,
  CheckCircle2,
} from "lucide-react";

const API =
  "https://marcylmsdeploy.onrender.com/api";

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
    <div className="space-y-4">

      {/* STATUS */}

      <div className="flex items-center justify-between">

        <div className="text-sm text-muted-foreground">
          Upload your assignment file
        </div>

        <Badge
          className={
            assignment.status ===
            "Reviewed"
              ? "bg-green-100 text-green-700"
              : assignment.status ===
                "Submitted"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-700"
          }
        >
          {assignment.status}
        </Badge>

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

      {/* SUBMIT BUTTON */}

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