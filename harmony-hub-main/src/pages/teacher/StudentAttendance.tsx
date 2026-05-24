import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/Primitives";
import { CheckCircle2, XCircle, Calendar } from "lucide-react";
import { useAuth } from "@/store/auth";

const API = "https://marcylmsdeploy.onrender.com/api";

type Attendance = {
  _id: string;
  classTitle: string;
  courseName: string;
  date: string;
  status: "Present" | "Absent";
  teacherName?: string;
};

export default function StudentAttendance() {
  const { user } = useAuth();
  const studentId = user?._id;

  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  // ====================================
  // FETCH ATTENDANCE
  // ====================================
  const fetchAttendance = async () => {
    if (!studentId) return;

    try {
      setLoading(true);

      const res = await axios.get(
        `${API}/attendance/student/${studentId}`
      );

      setAttendance(res.data || []);
    } catch (err) {
      console.log("Attendance fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [studentId]);

  // ====================================
  // LOADING
  // ====================================
  if (loading) {
    return (
      <div className="p-6 text-muted-foreground">
        Loading attendance...
      </div>
    );
  }

  // ====================================
  // UI
  // ====================================
  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="My Attendance"
        subtitle="Track your class participation"
      />

      {attendance.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <Calendar className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <div className="text-lg font-semibold">
              No Attendance Records
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Your attendance will appear here
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {attendance.map((a) => (
            <Card key={a._id} className="hover:shadow-md transition">
              <CardContent className="p-5 space-y-3">
                {/* HEADER */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">
                      {a.classTitle}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {a.courseName}
                    </div>
                  </div>

                  {/* STATUS */}
                  <Badge
                    className={
                      a.status === "Present"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }
                  >
                    {a.status}
                  </Badge>
                </div>

                {/* DATE */}
                <div className="text-xs text-muted-foreground">
                  {format(new Date(a.date), "dd MMM yyyy • h:mm a")}
                </div>

                {/* ICON */}
                <div className="flex items-center gap-2 text-sm">
                  {a.status === "Present" ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}

                  <span>
                    {a.status === "Present"
                      ? "You attended this class"
                      : "You missed this class"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}