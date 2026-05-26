import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const API = "https://marcylmsdeploy.onrender.com/api";

type Props = {
  teacherId?: string;
  teacherName?: string;
};

export default function StudentFeedback({
  teacherId,
  teacherName,
}: Props) {
  const auth = JSON.parse(localStorage.getItem("ms-auth") || "{}");
  const student = auth?.state?.user;

  const studentId = student?._id || student?.id;

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submitFeedback = async () => {
    try {
      console.log("DEBUG PAYLOAD:", {
        studentId,
        teacherId,
        message,
      });

      if (!studentId) return alert("Student missing");

      if (!teacherId) {
        return alert("Teacher missing (PASS teacherId from parent)");
      }

      if (!message.trim()) {
        return alert("Enter feedback message");
      }

      setLoading(true);

      const res = await axios.post(`${API}/feedback/create`, {
        studentId,
        teacherId,
        message,
        rating: 5,
      });

      console.log("SUCCESS:", res.data);

      alert("Feedback sent successfully");

      setMessage("");
    } catch (err: any) {
      console.log("ERROR:", err?.response?.data || err);
      alert(err?.response?.data?.message || "Failed to send feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl p-4 space-y-3 bg-white shadow-sm">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg">
          Send Feedback {teacherName && `to ${teacherName}`}
        </h2>

        {!teacherId && (
          <span className="text-red-500 text-xs">
            Teacher ID missing
          </span>
        )}
      </div>

      {/* TEXTAREA */}
      <Textarea
        placeholder="Write your feedback..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {/* BUTTON */}
      <Button onClick={submitFeedback} disabled={loading || !teacherId}>
        {loading ? "Sending..." : "Send Feedback"}
      </Button>

    </div>
  );
}