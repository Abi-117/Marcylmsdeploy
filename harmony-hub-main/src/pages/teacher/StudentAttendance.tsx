import { useEffect, useState } from "react";
import axios from "axios";

import { useAuth } from "@/store/auth";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const API =
  "https://marcylmsdeploy.onrender.com/api";

export default function StudentAttendance() {

  const { user } = useAuth();

  // 🔥 FINAL FIX
  const studentId =
    user?._id || user?.id;

  console.log(
    "Logged Student ID:",
    studentId
  );

  const [data, setData] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

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

      console.log(
        "Attendance Data:",
        res.data
      );

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

  if (loading) {

    return (
      <div className="p-6">
        Loading attendance...
      </div>
    );

  }

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-5">
        My Attendance
      </h1>

      {data.length === 0 ? (

        <Card>

          <CardContent className="p-6 text-center">

            No attendance records found

          </CardContent>

        </Card>

      ) : (

        <div className="space-y-4">

          {data.map((a: any) => (

            <Card key={a._id}>

              <CardContent className="p-4 flex justify-between items-center">

                <div>

                  <h2 className="font-bold">
                    {a.classTitle}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {a.courseName}
                  </p>

                  <p className="text-xs text-gray-400">
                    {new Date(a.date)
                      .toLocaleDateString()}
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

              </CardContent>

            </Card>

          ))}

        </div>

      )}

    </div>

  );

}