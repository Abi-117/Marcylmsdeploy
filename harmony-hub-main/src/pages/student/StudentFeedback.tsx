import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const API = "https://marcylmsdeploy.onrender.com/api";

export default function StudentFeedback({ teacherId }: any) {
  const auth = JSON.parse(localStorage.getItem("ms-auth") || "{}");
  const student = auth?.state?.user;
  const studentId = student?._id || student?.id;

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submitFeedback = async () => {
    try {
      if (!message) return alert("Enter feedback");

      setLoading(true);

      await axios.post(`${API}/feedback/create`, {
        studentId,
        teacherId,
        message,
      });

      alert("Feedback sent to teacher & admin");
      setMessage("");
    } catch (err) {
      console.log(err);
      alert("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl p-4 space-y-3">
      <h2 className="font-semibold">Send Feedback</h2>

      <Textarea
        placeholder="Write your feedback..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <Button onClick={submitFeedback} disabled={loading}>
        {loading ? "Sending..." : "Send Feedback"}
      </Button>
    </div>
  );
}