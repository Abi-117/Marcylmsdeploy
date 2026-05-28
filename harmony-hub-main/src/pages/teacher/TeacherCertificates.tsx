import { useEffect, useState } from "react";

import axios from "axios";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import {
  CheckCircle2,
  Send,
  Loader2,
} from "lucide-react";

const API =
  "https://your-api.com/api";

export default function
TeacherCertificates() {

  const [
    students,
    setStudents,
  ] = useState<any[]>([]);

  const [
    loadingId,
    setLoadingId,
  ] = useState("");

  // =========================
  // FETCH COMPLETED STUDENTS
  // =========================

  useEffect(() => {

    fetchStudents();

  }, []);

  const fetchStudents =
    async () => {

      try {

        const res =
          await axios.get(
            `${API}/teacher/completed-students`
          );

        setStudents(
          res.data
        );

      } catch (err) {

        console.log(err);

      }
    };

  // =========================
  // SEND CERTIFICATE REQUEST
  // =========================

  const sendCertificate =
    async (
      student: any
    ) => {

      try {

        setLoadingId(
          student._id
        );

        await axios.post(
          `${API}/certificates/create`,
          {
            student:
              student._id,

            teacher:
              student.teacherId,

            studentName:
              student.name,

            course:
              student.course,

            level:
              student.level,

            completionDate:
              new Date()
                .toLocaleDateString(),
          }
        );

        alert(
          "Certificate request sent"
        );

      } catch (err) {

        console.log(err);

      } finally {

        setLoadingId("");

      }
    };

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Certificate Requests
      </h1>

      <div className="grid gap-4">

        {students.map(
          (student) => (

            <Card
              key={
                student._id
              }
            >

              <CardContent
                className="p-5 flex items-center justify-between"
              >

                <div>

                  <h2 className="font-semibold text-lg">
                    {student.name}
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    {student.course}
                  </p>

                  <div className="mt-2">

                    <Badge>
                      {student.level}
                    </Badge>

                  </div>

                </div>

                <Button
                  onClick={() =>
                    sendCertificate(
                      student
                    )
                  }
                >

                  {loadingId ===
                  student._id ? (

                    <Loader2 className="w-4 h-4 animate-spin" />

                  ) : (

                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Request
                    </>

                  )}

                </Button>

              </CardContent>

            </Card>

          )
        )}

      </div>

    </div>
  );
}