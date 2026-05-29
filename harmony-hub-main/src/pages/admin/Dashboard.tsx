
import { useEffect, useState } from "react";

import axios from "axios";

import {
  Wallet,
  Users,
  GraduationCap,
  Video,
  BellRing,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

const API =
  "https://marcylmsdeploy-2.onrender.com/api";

export default function AdminOverview() {

  // =====================================
  // STATES
  // =====================================

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    dashboard,
    setDashboard,
  ] = useState({

    totalRevenue: 0,

    totalStudents: 0,

    totalTeachers: 0,

    liveClasses: 0,

  });

  const [
    pendingStudents,
    setPendingStudents,
  ] = useState<any[]>([]);

  // =====================================
  // FETCH DASHBOARD
  // =====================================

  useEffect(() => {

    fetchDashboard();

  }, []);

  const fetchDashboard =
    async () => {

      try {

        const res =
          await axios.get(
            `${API}/admin/dashboard`
          );

        setDashboard({

          totalRevenue:
            res.data.totalRevenue || 0,

          totalStudents:
            res.data.totalStudents || 0,

          totalTeachers:
            res.data.totalTeachers || 0,

          liveClasses:
            res.data.liveClasses || 0,

        });

        setPendingStudents(
          res.data.pendingStudents || []
        );

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }
    };

  // =====================================
  // SEND REMINDER
  // =====================================

  const sendReminder =
    async (id: string) => {

      try {

        await axios.post(
          `${API}/reminders/fees/${id}`
        );

        alert(
          "Reminder Sent Successfully"
        );

      } catch (err) {

        console.log(err);

        alert(
          "Reminder Failed"
        );
      }
    };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

      <div className="p-10 text-xl font-semibold">

        Loading Dashboard...

      </div>
    );
  }

  // =====================================
  // UI
  // =====================================

  return (

    <div className="min-h-screen bg-slate-100 p-6">

      {/* ===================================== */}
      {/* TITLE */}
      {/* ===================================== */}

      <div className="mb-8">

        <h1 className="text-4xl font-black">

          Admin Dashboard

        </h1>

        <p className="text-slate-500 mt-2">

          Manage academy overview,
          payments & reminders

        </p>

      </div>

      {/* ===================================== */}
      {/* STATS */}
      {/* ===================================== */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
        "
      >

        {/* REVENUE */}

        <Card className="rounded-3xl shadow-lg border-0">

          <CardContent className="p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-500 text-sm">
                  Total Revenue
                </p>

                <h2 className="text-3xl font-black mt-2">

                  ₹{dashboard.totalRevenue}

                </h2>

              </div>

              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-green-100
                  flex
                  items-center
                  justify-center
                "
              >

                <Wallet
                  className="text-green-600"
                />

              </div>

            </div>

          </CardContent>

        </Card>

        {/* STUDENTS */}

        <Card className="rounded-3xl shadow-lg border-0">

          <CardContent className="p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-500 text-sm">
                  Students
                </p>

                <h2 className="text-3xl font-black mt-2">

                  {dashboard.totalStudents}

                </h2>

              </div>

              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-indigo-100
                  flex
                  items-center
                  justify-center
                "
              >

                <GraduationCap
                  className="text-indigo-600"
                />

              </div>

            </div>

          </CardContent>

        </Card>

        {/* TEACHERS */}

        <Card className="rounded-3xl shadow-lg border-0">

          <CardContent className="p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-500 text-sm">
                  Teachers
                </p>

                <h2 className="text-3xl font-black mt-2">

                  {dashboard.totalTeachers}

                </h2>

              </div>

              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-orange-100
                  flex
                  items-center
                  justify-center
                "
              >

                <Users
                  className="text-orange-600"
                />

              </div>

            </div>

          </CardContent>

        </Card>

        {/* LIVE CLASSES */}

        <Card className="rounded-3xl shadow-lg border-0">

          <CardContent className="p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-500 text-sm">
                  Live Classes
                </p>

                <h2 className="text-3xl font-black mt-2">

                  {dashboard.liveClasses}

                </h2>

              </div>

              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-red-100
                  flex
                  items-center
                  justify-center
                "
              >

                <Video
                  className="text-red-600"
                />

              </div>

            </div>

          </CardContent>

        </Card>

      </div>

      {/* ===================================== */}
      {/* PENDING FEES */}
      {/* ===================================== */}

      <Card
        className="
          mt-8
          rounded-3xl
          shadow-lg
          border-0
        "
      >

        <CardHeader>

          <CardTitle
            className="
              text-2xl
              font-black
              flex
              items-center
              gap-3
            "
          >

            <BellRing />

            Pending Fee Students

          </CardTitle>

        </CardHeader>

        <CardContent className="space-y-4">

          {pendingStudents.length === 0 ? (

            <div
              className="
                text-center
                py-10
                text-slate-500
              "
            >

              No Pending Fees

            </div>

          ) : (

            pendingStudents.map(
              (student: any) => (

                <div
                  key={student._id}
                  className="
                    flex
                    flex-col
                    md:flex-row
                    md:items-center
                    md:justify-between
                    gap-4
                    border
                    rounded-2xl
                    p-5
                  "
                >

                  <div>

                    <h2
                      className="
                        text-xl
                        font-bold
                      "
                    >

                      {student.name}

                    </h2>

                    <p className="text-slate-500">

                      {student.course}

                    </p>

                    <p className="text-slate-400 text-sm mt-1">

                      {student.phone}

                    </p>

                  </div>

                  <Button
                    onClick={() =>
                      sendReminder(
                        student._id
                      )
                    }
                    className="
                      bg-black
                      hover:bg-slate-800
                      rounded-xl
                    "
                  >

                    Send Reminder

                  </Button>

                </div>

              )
            )

          )}

        </CardContent>

      </Card>

    </div>
  );
}
