import { useEffect, useState } from "react";
import {
  Wallet,
  Users,
  GraduationCap,
  Video,
  TrendingUp,
  Trophy,
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
        setDashboard(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-4">

      {/* TOP CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <StatCard
          label="Total Revenue"
          value={`₹${dashboard.totalRevenue || 0}`}
          icon={Wallet}
        />

        <StatCard
          label="Students"
          value={dashboard.totalStudents || 0}
          icon={GraduationCap}
        />

        <StatCard
          label="Teachers"
          value={dashboard.totalTeachers || 0}
          icon={Users}
        />

        <StatCard
          label="Live Classes"
          value={dashboard.liveClasses || 0}
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
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={dashboard.revenueData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f59e0b"
                  fill="#fde68a"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ATTENDANCE */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance</CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dashboard.attendanceData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />

                <Bar dataKey="present" fill="#22c55e" />
                <Bar dataKey="absent" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>

      {/* CLASSES + STUDENTS */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">

        {/* CLASSES */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Classes</CardTitle>
          </CardHeader>

          <CardContent>
            {dashboard.classes?.length === 0 ? (
              <p>No classes</p>
            ) : (
              dashboard.classes.map((c: any) => (
                <div key={c._id} className="p-3 border rounded mb-2">
                  <div>{c.title}</div>
                  <div className="text-xs text-gray-500">{c.teacher}</div>
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

          <CardContent>
            {dashboard.topStudents?.map((s: any, i: number) => (
              <div key={s._id} className="flex justify-between p-2">
                <div>
                  {i + 1}. {s.name}
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