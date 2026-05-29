import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const API = "https://marcylmsdeploy-2.onrender.com/api";

type Props = {
  teacherId: string;
  teacherName?: string;
};

export default function StudentFeedback({ teacherId, teacherName }: Props) {
  const auth = JSON.parse(localStorage.getItem("ms-auth") || "{}");
  const student = auth?.state?.user;

  const studentId = student?._id || student?.id;

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendFeedback = async () => {
    try {
      if (!studentId) return alert("Student missing");
      if (!teacherId) return alert("Teacher missing");
      if (!message.trim()) return alert("Enter message");

      setLoading(true);

      await axios.post(`${API}/feedback/create`, {
        studentId,
        teacherId,
        message,
      });

      alert("Feedback sent");
      setMessage("");
    } catch (err: any) {
      console.log(err?.response?.data || err);
      alert("Failed to send feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl p-4 space-y-3 bg-white">

      <h2 className="font-semibold">
        Feedback {teacherName && `to ${teacherName}`}
      </h2>

      <Textarea
        placeholder="Write feedback..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <Button onClick={sendFeedback} disabled={loading}>
        {loading ? "Sending..." : "Send Feedback"}
      </Button>

    </div>
  );
}