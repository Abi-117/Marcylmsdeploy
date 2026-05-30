import { useEffect, useState } from "react";

import axios from "axios";

import { format } from "date-fns";

import { PageHeader } from "@/components/dashboard/Primitives";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

const API =
  "https://marcylmsdeploy-2.onrender.com/api";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const hours = [
  "06:00 AM",
  "07:00 AM",
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
  "09:00 PM",
  "10:00 PM",
  "11:00 PM",
];

export default function TeacherSchedule() {

  const user = JSON.parse(
    localStorage.getItem("ms-auth") || "{}"
  )?.state?.user;

  const teacherId = user?.id || user?._id; // FIX FOR BOTH TEACHER AND ADMIN LOGIN STRUCTURE

  const [students, setStudents] =
    useState<any[]>([]);

  useEffect(() => {

    fetchStudents();

  }, []);

  const fetchStudents =
    async () => {

      try {

        const res =
          await axios.get(

            `${API}/student/teacher/${teacherId}?status=paid`

          );

        setStudents(res.data);

      } catch (err) {

        console.log(err);

      }

    };

  return (

    <div>

      <PageHeader
        title="Weekly Schedule"
        subtitle="Auto generated from student availability"
      />

      <Card>

        <CardContent className="overflow-x-auto p-0">

          <div className="grid min-w-[1200px] grid-cols-[100px_repeat(7,1fr)]">

            {/* HEADER */}

            <div className="border-b border-r border-border bg-muted/30 p-3" />

            {days.map((d) => (

              <div
                key={d}
                className="border-b border-r border-border bg-muted/30 p-3 text-center text-xs font-semibold uppercase"
              >

                {d}

              </div>

            ))}

            {/* TIME ROWS */}

            {hours.map((hour) => (

              <>

                {/* TIME */}

                <div
                  key={hour}
                  className="border-b border-r border-border p-3 text-xs text-muted-foreground"
                >

                  {hour}

                </div>

                {/* DAYS */}

                {days.map((day) => {

                  // MATCH STUDENT
                  const matchedStudents =
                    students.filter(

                      (s: any) =>

                        s.availableDays?.includes(
                          day
                        ) &&

                        s.fromTime === hour

                    );

                  return (

                    <div
                      key={`${day}-${hour}`}
                      className="min-h-[90px] border-b border-r border-border p-2"
                    >

                      <div className="space-y-2">

                        {matchedStudents.map(
                          (s: any) => (

                            <div
                              key={s._id}
                              className="rounded-lg border border-gold/30 bg-gold-soft p-2 text-[11px]"
                            >

                              <div className="font-semibold">

                                {s.name}

                              </div>

                              <div className="text-muted-foreground">

                                {s.courseName}

                              </div>

                              <div className="text-muted-foreground">

                                {s.selectedLevel}

                              </div>

                              <div className="mt-1 text-[10px]">

                                {s.fromTime} - {s.toTime}

                              </div>

                            </div>

                          )
                        )}

                      </div>

                    </div>

                  );

                })}

              </>

            ))}

          </div>

        </CardContent>

      </Card>

    </div>

  );

}