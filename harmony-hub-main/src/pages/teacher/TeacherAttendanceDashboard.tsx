import { useEffect, useState } from "react";

import axios from "axios";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

const API =
  "https://marcylmsdeploy.onrender.com/api";

export default function TeacherMyAttendance() {

  const user = JSON.parse(
    localStorage.getItem("ms-auth") || "{}"
  )?.state?.user;

  const teacherId = user?.id;

  const [data, setData] =
    useState<any[]>([]);

  useEffect(() => {

    if (!teacherId) return;

    fetchData();

  }, [teacherId]);

  const fetchData =
    async () => {

      try {

        const res =
          await axios.get(
            `${API}/teacher-attendance/${teacherId}`
          );

        setData(res.data);

      } catch (err) {

        console.log(err);

      }

    };

  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">

        My Attendance

      </h1>

      <div className="space-y-4">

        {data.map((a) => (

          <Card key={a._id}>

            <CardContent className="p-5">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="font-bold text-lg">

                    {a.classTitle}

                  </h2>

                  <p className="text-sm text-muted-foreground">

                    {a.courseName}

                  </p>

                  <p className="text-xs text-muted-foreground mt-1">

                    {new Date(
                      a.date
                    ).toLocaleDateString()}

                  </p>

                </div>

                <Badge className="bg-green-600 text-white">

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