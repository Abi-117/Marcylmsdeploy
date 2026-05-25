import { useEffect, useState } from "react";

import axios from "axios";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

const API =
  "https://marcylmsdeploy.onrender.com/api";

export default function TeacherAttendance() {

  const [data, setData] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // FETCH
  // =========================

  useEffect(() => {

    fetchAttendance();

  }, []);

  const fetchAttendance = async () => {

    try {

      const res = await axios.get(
        `${API}/attendance/all`
      );

      setData(res.data);

    } catch (err) {

      console.log(err);

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

        Attendance Details

      </h1>

      {data.length === 0 && (

        <Card>

          <CardContent className="p-6 text-center">

            No attendance found

          </CardContent>

        </Card>

      )}

      <div className="space-y-4">

        {data.map((a) => (

          <Card key={a._id}>

            <CardContent className="p-4">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="font-semibold text-lg">

                    {a.studentName}

                  </h2>

                  <p className="text-sm text-muted-foreground">

                    {a.studentEmail}

                  </p>

                  <p className="mt-2 font-medium">

                    {a.classTitle}

                  </p>

                  <p className="text-sm text-muted-foreground">

                    {a.courseName}

                  </p>

                  <p className="text-xs text-muted-foreground mt-1">

                    {new Date(
                      a.date
                    ).toLocaleDateString()}

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