import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const API = "https://marcylmsdeploy.onrender.com/api";

export default function SubmitAssignment({ assignmentId, studentId }: any) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // fake upload (you can replace with Cloudinary later)
  const uploadFile = async (file: File) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("https://fake-upload.com/" + file.name);
      }, 1000);
    });
  };

  const submit = async () => {
    try {
      if (!file) return alert("Upload file");

      setLoading(true);

      const fileUrl = await uploadFile(file);

      await axios.post(`${API}/assignments/submit`, {
        assignmentId,
        studentId,
        fileUrl,
      });

      alert("Submitted successfully");
    } catch (err) {
      console.log(err);
      alert("Submit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 border p-4 rounded-xl">
      
      <Input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <Button onClick={submit} disabled={loading}>
        {loading ? "Submitting..." : "Submit Assignment"}
      </Button>
    </div>
  );
}