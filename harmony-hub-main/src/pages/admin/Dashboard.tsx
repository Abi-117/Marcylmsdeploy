import { useEffect, useState } from "react";

import {
  Wallet,
  Users,
  GraduationCap,
  Video,
  TrendingUp,
} from "lucide-react";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { StatCard } from "@/components/dashboard/Primitives";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function AdminOverview() {
  const [dashboard, setDashboard] = useState<any>({
    classes: [],
    topStudents: [],
    revenueData: [],
    attendanceData: [],
    totalRevenue: 0,
    totalStudents: 0,
    totalTeachers: 0,
    liveClasses: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://marcylmsdeploy.onrender.com/api/admin/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setDashboard({
          classes: data?.classes || [],
          topStudents: data?.topStudents || [],
          revenueData: data?.revenueData || [],
          attendanceData: data?.attendanceData || [],
          totalRevenue: data?.totalRevenue || 0,
          totalStudents: data?.totalStudents || 0,
          totalTeachers: data?.totalTeachers || 0,
          liveClasses: data?.liveClasses || 0,
        });

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const formatINR = (val: number) =>
    new Intl.NumberFormat("en-IN").format(val || 0);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div>

      {/* TOP CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <StatCard
          label="Total revenue"
          value={`₹${formatINR(dashboard.totalRevenue)}`}
          icon={Wallet}
          accent
        />

        <StatCard
          label="Students"
          value={dashboard.totalStudents}
          icon={GraduationCap}
        />

        <StatCard
          label="Teachers"
          value={dashboard.totalTeachers}
          icon={Users}
        />

        <StatCard
          label="Live classes"
          value={dashboard.liveClasses}
          icon={Video}
        />

      </div>

      {/* CHARTS */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">

        {/* REVENUE */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>

          <CardContent>
            {dashboard.revenueData?.length > 0 && (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={dashboard.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    dataKey="revenue"
                    stroke="#f59e0b"
                    fill="#fde68a"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* ATTENDANCE */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance</CardTitle>
          </CardHeader>

          <CardContent>
            {dashboard.attendanceData?.length > 0 && (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={dashboard.attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="present" fill="#22c55e" />
                  <Bar dataKey="absent" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

      </div>

      {/* CLASSES + TOP STUDENTS */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">

        {/* CLASSES */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Active Classes</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">

            {dashboard.classes?.length === 0 ? (
              <p className="text-sm text-gray-500">
                No active classes
              </p>
            ) : (
              dashboard.classes?.map((c: any) => (
                <div
                  key={c._id}
                  className="p-3 border rounded-lg"
                >
                  <div className="font-medium">
                    {c.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {c.teacher}
                  </div>

                  <Badge>{c.status}</Badge>
                </div>
              ))
            )}

          </CardContent>
        </Card>

        {/* TOP STUDENTS */}
        <Card>
          <CardHeader>
            <CardTitle>Top Students</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">

            {dashboard.topStudents?.map((s: any, i: number) => (
              <div
                key={s._id}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                  {i + 1}
                </div>

                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {s.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {s.course}
                  </div>
                </div>

                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
            ))}

          </CardContent>
        </Card>

      </div>
    </div>
  );
}

export default AdminOverview;