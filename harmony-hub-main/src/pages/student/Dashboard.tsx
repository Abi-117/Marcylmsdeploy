import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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
  Lock,
  ExternalLink,
  Bell,
  CheckCircle2,
} from "lucide-react";

import { format } from "date-fns";
import { useAuth } from "@/store/auth";

function StudentOverview() {
  const { user } = useAuth();

  const [overview, setOverview] = useState<any>(null);
  const [practiceLogs, setPracticeLogs] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) {
      fetchOverview(user.id);
    }
  }, [user]);

  const fetchOverview = async (studentId: string) => {
    try {
      const response = await fetch(
        `https://marcylmsdeploy.onrender.com/api/student/overview/${studentId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch overview");
      }

      const data = await response.json();
      setOverview(data);

      setPracticeLogs([
        { date: "Mon", minutes: 30 },
        { date: "Tue", minutes: 40 },
        { date: "Wed", minutes: 55 },
        { date: "Thu", minutes: 35 },
        { date: "Fri", minutes: 50 },
        { date: "Sat", minutes: 70 },
        { date: "Sun", minutes: 45 },
      ]);
    } catch (error) {
      console.log("Overview error:", error);
    }
  };

  if (!overview) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        Loading...
      </div>
    );
  }

  const next = overview.nextClass;

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${overview.student?.name}`}
        subtitle={`${overview.student?.course || "Course"} · ${overview.student?.level} · ${overview.batch?.name || "No Batch"}`}
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
        <Card className="lg:col-span-2 overflow-hidden border-gold/30 bg-gradient-to-br from-card to-gold-soft/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Badge className="bg-gold text-gold-foreground border-gold animate-pulse">
                Next class
              </Badge>

              {next?.date && <CountdownTimer target={next.date} />}
            </div>

            <div className="mt-4 font-display text-3xl">
              {next?.title || "No upcoming class"}
            </div>

            <div className="mt-1 text-sm text-muted-foreground">
              {next?.teacher} · {next?.batchName}
            </div>

            {next?.date && (
              <div className="mt-2 text-xs text-muted-foreground">
                {format(new Date(next.date), "EEEE, dd MMM · h:mm a")}
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              {next?.meetingLink && (
                <Button asChild className="bg-gold text-gold-foreground">
                  <a href={next.meetingLink} target="_blank" rel="noreferrer">
                    Join class <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              )}

              <Button variant="outline">View schedule</Button>
            </div>
          </CardContent>
        </Card>

        {/* PRACTICE GRAPH */}
        <Card>
          <CardContent className="p-6">
            <div className="font-display text-lg">Practice this week</div>

            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={practiceLogs}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="minutes"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* LEARNING PATH */}
      <div className="mt-6">
        <Card>
          <CardContent className="p-6">
            <div className="font-display text-lg mb-4">
              Your learning path
            </div>

            <div className="space-y-3">
              {overview.progress?.map((s: any, i: number) => (
                <motion.div
                  key={s.level}
                  initial={{ opacity: 0, x: 8 }}
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* REMINDERS */}
      <div className="mt-6">
        <Card>
          <CardContent className="p-6">
            <div className="font-display text-lg flex items-center gap-2">
              <Bell className="h-4 w-4 text-gold" />
              Reminders
            </div>

            <div className="mt-3 space-y-2">
              {overview.reminders?.map((r: any, i: number) => (
                <div key={i} className="border p-3 rounded-lg">
                  <div className="font-medium text-sm">{r.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.subtitle}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CountdownTimer({ target }: { target: string }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);

  const diff = Math.max(0, new Date(target).getTime() - now);

  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  return (
    <div className="flex gap-1 text-xs">
      {[{ v: h, l: "H" }, { v: m, l: "M" }, { v: s, l: "S" }].map((p) => (
        <div key={p.l} className="bg-black text-white px-2 py-1 rounded">
          {String(p.v).padStart(2, "0")} {p.l}
        </div>
      ))}
    </div>
  );
}

export default StudentOverview;