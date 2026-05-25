import { useEffect, useState } from "react";

import {
  Wallet,
  Users,
  GraduationCap,
  TrendingUp,
  Video,
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

import { format } from "date-fns";

import {
  StatCard,
  PageHeader,
} from "@/components/dashboard/Primitives";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function AdminOverview() {
  const [dashboard, setDashboard] = useState<any>(null);

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

  if (loading) {
    return (
      <div className="p-10 text-center text-lg">
        Loading Dashboard...
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="p-10 text-center text-red-500">
        Failed to load dashboard
      </div>
    );
  }

  return (
    <div>
      {/* <PageHeader
        title="Academy overview"
        subtitle="Welcome back — here's what's happening today."
        actions={
          <Button className="bg-gold text-gold-foreground hover:bg-gold/90">
            + New batch
          </Button>
        }
      /> */}

      {/* TOP CARDS */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total revenue"
          value={`₹${dashboard.totalRevenue}`}
          delta="+11.2% MoM"
          icon={Wallet}
          accent
        />

        <StatCard
          label="Active students"
          value={dashboard.totalStudents}
          delta="+24 this month"
          icon={GraduationCap}
        />

        <StatCard
          label="Teachers"
          value={dashboard.totalTeachers}
          icon={Users}
        />

        <StatCard
          label="Live classes today"
          value={dashboard.liveClasses}
          delta="3 ongoing"
          icon={Video}
        />
      </div>

      {/* CHARTS */}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">

        {/* REVENUE CHART */}

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="font-display">
                Revenue & enrolment
              </CardTitle>

              <div className="text-xs text-muted-foreground">
                Last 7 months
              </div>
            </div>

            <Badge
              className="bg-gold-soft text-gold-foreground border-gold/30"
              variant="outline"
            >
              +18% YoY
            </Badge>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={dashboard.revenueData}>
                <defs>
                  <linearGradient
                    id="gold"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="oklch(0.72 0.13 78)"
                      stopOpacity={0.4}
                    />

                    <stop
                      offset="100%"
                      stopColor="oklch(0.72 0.13 78)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="oklch(0.9 0.01 80)"
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  stroke="oklch(0.5 0.015 70)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  stroke="oklch(0.5 0.015 70)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="oklch(0.72 0.13 78)"
                  strokeWidth={2.5}
                  fill="url(#gold)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ATTENDANCE */}

        <Card>
          <CardHeader>
            <CardTitle className="font-display">
              Attendance
            </CardTitle>

            <div className="text-xs text-muted-foreground">
              Weekly average
            </div>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dashboard.attendanceData}>
                <CartesianGrid
                  stroke="oklch(0.9 0.01 80)"
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="week"
                  stroke="oklch(0.5 0.015 70)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  stroke="oklch(0.5 0.015 70)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip />

                <Bar
                  dataKey="present"
                  fill="oklch(0.72 0.13 78)"
                  radius={[6, 6, 0, 0]}
                />

                <Bar
                  dataKey="absent"
                  fill="oklch(0.9 0.01 80)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* CLASSES + TOP STUDENTS */}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">

        {/* CLASSES */}

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="font-display">
              Live & upcoming classes
            </CardTitle>

            <Button variant="ghost" size="sm">
              View all
            </Button>
          </CardHeader>

          <CardContent className="space-y-2">

            {dashboard.classes?.map((c: any) => (

              <div
                key={c._id}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3.5 hover:bg-muted/40"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    c.status === "Live"
                      ? "bg-gold text-gold-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <Video className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">
                    {c.title}
                  </div>

                  <div className="text-xs text-muted-foreground truncate">
                    {c.batchName} · {c.teacher}
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  {format(new Date(c.date), "EEE h:mm a")}
                </div>

                <Badge
                  variant="outline"
                  className={
                    c.status === "Live"
                      ? "bg-gold text-gold-foreground border-gold animate-pulse"
                      : ""
                  }
                >
                  {c.platform}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* TOP STUDENTS */}

        <Card>
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Trophy className="h-4 w-4 text-gold" />

              Top performers
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">

            {dashboard.topStudents.map((s: any, i: number) => (

              <div
                key={s._id}
                className="flex items-center gap-3"
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                    i < 3
                      ? "bg-gold text-gold-foreground"
                      : "bg-muted"
                  }`}
                >
                  {i + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {s.name}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {s.course}
                  </div>
                </div>

                <TrendingUp className="h-3.5 w-3.5 text-gold" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminOverview;