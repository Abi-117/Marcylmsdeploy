import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  StatCard,
  PageHeader,
  LevelBadge,
} from "@/components/dashboard/Primitives";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";

import {
  Flame,
  Music2,
  Video,
  Trophy,
  ExternalLink,
  Bell,
} from "lucide-react";

import { format } from "date-fns";
import { useAuth } from "@/store/auth";

function StudentOverview() {
  const { user } = useAuth();

  const [overview, setOverview] = useState<any>(null);
  const [practiceLogs, setPracticeLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentId = user?.id || user?._id || user?.user?._id;

    if (studentId) {
      fetchOverview(studentId);
    }
  }, [user]);

  const fetchOverview = async (studentId: string) => {
    try {
      setLoading(true);

      const response = await fetch(
        `https://marcylmsdeploy.onrender.com/api/student/overview/${studentId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch overview");
      }

      const data = await response.json();

      setOverview(data);

      // ✅ REAL PRACTICE LOGS FROM BACKEND ONLY
      setPracticeLogs(data.practiceLogs || []);
    } catch (error) {
      console.log("Overview error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        No data found
      </div>
    );
  }

  const next = overview.nextClass;

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${overview.student?.name || ""}`}
        subtitle={`${overview.student?.course || "Course"} · ${
  overview.student?.level || "Beginner"
}`}
      />

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Current level"
          value={overview.student?.level}
          icon={Music2}
          accent
        />

        <StatCard
          label="Practice streak"
          value={`${overview.stats?.streak || 0} days`}
          delta="🔥 keep going!"
          icon={Flame}
        />

        <StatCard
          label="Classes attended"
          value={`${overview.stats?.attended || 0}/${overview.stats?.totalClasses || 0}`}
          icon={Video}
        />

        <StatCard
          label="Certificates"
          value={String(overview.stats?.certificates || 0)}
          icon={Trophy}
        />
      </div>

      {/* NEXT CLASS */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <Badge className="bg-gold text-black">Next class</Badge>

            <div className="mt-4 text-2xl font-bold">
              {next?.title || "No upcoming class"}
            </div>

            <div className="text-sm text-muted-foreground">
              {next?.teacher} · {next?.batchName}
            </div>

            {next?.date && (
              <div className="text-xs text-muted-foreground mt-2">
                {format(new Date(next.date), "EEE, dd MMM · h:mm a")}
              </div>
            )}

            {next?.meetingLink && (
              <Button className="mt-4" asChild>
                <a href={next.meetingLink} target="_blank">
                  Join Class <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* PRACTICE GRAPH (REAL DATA ONLY) */}
        <Card>
          <CardContent className="p-6">
            <div className="font-semibold mb-2">Practice this week</div>

            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={practiceLogs}>
                <CartesianGrid />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="minutes"
                  stroke="#f59e0b"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

    
      {/* <div className="space-y-3">
  {overview.progress?.length ? (
    overview.progress.map((s: any, i: number) => (
      <motion.div
        key={s.level}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 }}
        className="border p-4 rounded-xl"
      >
        <div className="flex justify-between">
          <div>
            <div className="font-semibold">{s.level}</div>
            <div className="text-xs text-muted-foreground">
              {s.status === "active"
                ? `${s.progress}% complete`
                : "Locked"}
            </div>
          </div>

          <LevelBadge level={s.level} locked={s.status === "locked"} />
        </div>

        {s.status === "active" && (
          <Progress value={s.progress} className="mt-2" />
        )}
      </motion.div>
    ))
  ) : (
    <div className="text-sm text-muted-foreground">
      No learning path available
    </div>
  )}
</div> */}

      {/* REMINDERS */}
      <div className="mt-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 font-semibold">
              <Bell className="h-4 w-4" />
              Reminders
            </div>

            <div className="mt-3 space-y-2">
              {overview.reminders?.length ? (
                overview.reminders.map((r: any, i: number) => (
                  <div key={i} className="border p-3 rounded-lg">
                    <div className="font-medium text-sm">{r.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.subtitle}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">
                  No reminders
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default StudentOverview;