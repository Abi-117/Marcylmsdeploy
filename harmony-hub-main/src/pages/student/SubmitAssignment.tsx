import { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  FileUp,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const API =
  "https://marcylmsdeploy-2.onrender.com/api";

type Props = {
  assignment: any;
  studentId: string;
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

  if (
    !assignment ||
    !assignment._id
  ) {

    return (
      <div className="border rounded-xl p-4 text-sm text-muted-foreground">
        Assignment not found
      </div>
    );

  }

  // =========================
  // CLOUDINARY UPLOAD
  // =========================

  const uploadFile = async (
    file: File
  ) => {

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    formData.append(
      "upload_preset",
      "marcy_unsigned"
    );

    const cloudName =
      "dza8um2ng";

    const res =
      await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        formData
      );

    return res.data.secure_url;

  };

  // =========================
  // SUBMIT ASSIGNMENT
  // =========================

  const submit = async () => {

    try {

      if (!file) {

        return alert(
          "Please upload file"
        );

      }

      if (!studentId) {

        return alert(
          "Student ID missing"
        );

      }

      setLoading(true);

      // ======================
      // UPLOAD FILE
      // ======================

      const fileUrl =
        await uploadFile(file);

      // ======================
      // SAVE TO DB
      // ======================

      const res =
        await axios.post(
          `${API}/assignments/submit`,
          {
            assignmentId:
              assignment._id,

            studentId,

            fileUrl,
          }
        );

      console.log(
        "SUBMIT RESPONSE:",
        res.data
      );

      alert(
        "Assignment submitted successfully"
      );

      setFile(null);

    } catch (err: any) {

      console.log(
        "SUBMIT ERROR:",
        err?.response?.data ||
          err
      );

      alert(
        err?.response?.data
          ?.message ||
          "Submit failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="space-y-4">

      {/* STATUS */}

      <div className="flex items-center justify-between">

        <div className="text-sm text-muted-foreground">
          Upload Assignment
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
          {assignment.status ||
            "Pending"}
        </Badge>

      </div>

      {/* TITLE */}

      <div className="font-medium">
        {assignment.title}
      </div>

      {/* FILE */}

      <div className="space-y-2">

        <label className="text-sm font-medium">
          Upload File / Video / PDF
        </label>

        <Input
          type="file"
          onChange={(e) =>
            setFile(
              e.target.files?.[0] ||
                null
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

        {loading ? (

          <Loader2 className="mr-2 h-4 w-4 animate-spin" />

        ) : (

          <FileUp className="mr-2 h-4 w-4" />

        )}

        {loading
          ? "Uploading..."
          : "Submit Assignment"}

      </Button>

    </div>
  );

}