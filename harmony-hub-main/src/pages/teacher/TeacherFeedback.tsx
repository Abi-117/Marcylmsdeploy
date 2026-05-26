import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";

const API = "https://marcylmsdeploy.onrender.com/api";

export default function TeacherFeedback() {
  const auth = JSON.parse(localStorage.getItem("ms-auth") || "{}");
  const teacher = auth?.state?.user;
  const teacherId = teacher?._id || teacher?.id;

  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    if (teacherId) fetchFeedback();
  }, [teacherId]);

  const fetchFeedback = async () => {
    try {
      const res = await axios.get(
        `${API}/feedback/teacher/${teacherId}`
      );
      setFeedbacks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Student Feedback</h2>

      {feedbacks.length === 0 ? (
        <div className="text-muted-foreground">
          No feedback yet
        </div>
      ) : (
        feedbacks.map((f: any) => (
          <Card key={f._id} className="rounded-xl">
            <CardContent className="p-4 space-y-2">

              {/* STUDENT INFO */}
              <div className="font-semibold">
                👤 {f.studentId?.name}
              </div>

              <div className="text-sm text-muted-foreground">
                {f.studentId?.email}
              </div>

              {/* MESSAGE */}
              <div className="mt-2 text-gray-800">
                💬 {f.message}
              </div>

              {/* DATE */}
              <div className="text-xs text-gray-400">
                {new Date(f.createdAt).toLocaleString()}
              </div>

            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}