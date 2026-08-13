import { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  FileUp,
  CheckCircle2,
  Loader2,
  Video,
  FileText,
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

  if (!assignment || !assignment._id) {
    return (
      <div className="border rounded-xl p-4 text-sm text-muted-foreground">
        Assignment not found
      </div>
    );
  }

  // =====================================
  // CLOUDINARY UPLOAD
  // =====================================

  const uploadFile = async (selectedFile: File) => {
    const formData = new FormData();

    formData.append("file", selectedFile);

    formData.append(
      "upload_preset",
      "marcy_unsigned"
    );

    const cloudName = "dza8um2ng";

    // Detect video
    const isVideo =
      selectedFile.type.startsWith("video/");

    const uploadType = isVideo
      ? "video"
      : "image";

    console.log(
      "Uploading:",
      selectedFile.name
    );

    console.log(
      "Type:",
      selectedFile.type
    );

    console.log(
      "Size:",
      (
        selectedFile.size /
        (1024 * 1024)
      ).toFixed(2),
      "MB"
    );

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/${uploadType}/upload`,
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },

        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;

          const percent = Math.round(
            (progressEvent.loaded * 100) /
              progressEvent.total
          );

          console.log(
            `Upload ${percent}%`
          );
        },
      }
    );

    console.log(
      "CLOUDINARY RESPONSE:",
      res.data
    );

    return res.data.secure_url;
  };

  // =====================================
  // SUBMIT
  // =====================================

  const submit = async () => {
    try {
      if (!file) {
        alert("Please upload a file");
        return;
      }

      if (!studentId) {
        alert("Student ID missing");
        return;
      }

      setLoading(true);

      console.log(
        "SELECTED FILE:",
        file
      );

      // =================================
      // CHECK FILE SIZE
      // =================================

      const fileSizeMB =
        file.size /
        (1024 * 1024);

      console.log(
        "FILE SIZE:",
        fileSizeMB.toFixed(2),
        "MB"
      );

      // Optional safety limit
      if (fileSizeMB > 100) {
        alert(
          "Video is too large. Please upload a video below 100 MB."
        );

        setLoading(false);
        return;
      }

      // =================================
      // UPLOAD TO CLOUDINARY
      // =================================

      const fileUrl =
        await uploadFile(file);

      if (!fileUrl) {
        throw new Error(
          "Cloudinary upload failed"
        );
      }

      console.log(
        "CLOUDINARY URL:",
        fileUrl
      );

      // =================================
      // SAVE URL TO DATABASE
      // =================================

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
      console.error(
        "SUBMIT ERROR:",
        err
      );

      console.error(
        "SERVER ERROR:",
        err?.response?.data
      );

      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Upload failed"
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // FILE SELECT
  // =====================================

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selected =
      e.target.files?.[0] || null;

    if (!selected) return;

    console.log(
      "FILE SELECTED:",
      selected.name
    );

    console.log(
      "MIME TYPE:",
      selected.type
    );

    console.log(
      "SIZE:",
      (
        selected.size /
        (1024 * 1024)
      ).toFixed(2),
      "MB"
    );

    setFile(selected);
  };

  const isVideo =
    file?.type.startsWith("video/");

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
          accept="
            video/*,
            application/pdf,
            image/*,
            .doc,
            .docx,
            .ppt,
            .pptx
          "
          onChange={handleFileChange}
        />

        {file && (
          <div className="rounded-xl border p-3">

            <div className="flex items-center gap-2 text-sm text-green-600">

              {isVideo ? (
                <Video className="h-4 w-4" />
              ) : (
                <FileText className="h-4 w-4" />
              )}

              <CheckCircle2 className="h-4 w-4" />

              <span className="truncate">
                {file.name}
              </span>

            </div>

            <div className="mt-1 text-xs text-muted-foreground">

              {(file.size / (1024 * 1024)).toFixed(2)}
              {" MB"}

              {" • "}

              {file.type || "Unknown type"}

            </div>

          </div>
        )}

      </div>

      {/* BUTTON */}

      <Button
        onClick={submit}
        disabled={loading || !file}
        className="w-full"
      >

        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <FileUp className="mr-2 h-4 w-4" />
            Submit Assignment
          </>
        )}

      </Button>

    </div>
  );
}