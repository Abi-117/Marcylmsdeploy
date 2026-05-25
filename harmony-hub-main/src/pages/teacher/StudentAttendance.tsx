import { useEffect, useState } from "react";
import axios from "axios";

import { useAuth } from "@/store/auth";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const API =
  "https://marcylmsdeploy.onrender.com/api";

export default function StudentAttendance() {

  const { user } = useAuth();

  const studentId = user?.id;

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] =
    useState(true);

  // =========================
  // FETCH ATTENDANCE
  // =========================

  useEffect(() => {

    if (!studentId) return;

    fetchAttendance();

  }, [studentId]);

  const fetchAttendance = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        `${API}/attendance/student/${studentId}`
      );

      console.log("Attendance:", res.data);

      setData(res.data);

    } catch (err) {

      console.log(
        "Attendance fetch error:",
        err
      );

    } finally {

      setLoading(false);

    }

  };

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div className="p-6">
        Loading attendance...
      </div>
    );

  }

  // =========================
  // UI
  // =========================

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-5">
        My Attendance
      </h1>

      {/* EMPTY */}

      {data.length === 0 && (

        <Card>

          <CardContent className="p-6 text-center text-muted-foreground">

            No attendance records found

          </CardContent>

        </Card>

      )}

      {/* DATA */}

      <div className="space-y-4">

        {data.map((a: any) => (

          <Card key={a._id}>

            <CardContent className="p-4">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="font-semibold text-lg">

                    {a.classTitle}

                  </h2>

                  <p className="text-sm text-muted-foreground">

                    {a.courseName}

                  </p>

                  <p className="text-xs mt-1 text-muted-foreground">

                    {a.date}

                  </p>

                </div>

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

            </CardContent>

          </Card>

        ))}

      </div>

    </div>

  );

}