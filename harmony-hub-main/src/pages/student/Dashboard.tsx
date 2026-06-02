import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Flame,
  Music2,
  Video,
  Trophy,
  ExternalLink,
  Bell,
  CalendarClock,
  GraduationCap,
  Link2,
  Sparkles,
} from "lucide-react";

import { useAuth } from "@/store/auth";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

function StudentOverview() {
  const { user } = useAuth();

  const [overview, setOverview] = useState<any>(null);
  const [classLinks, setClassLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentId = user?.id || user?._id;
    if (studentId) fetchOverview(studentId);
  }, [user]);

  const fetchOverview = async (studentId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://marcylmsdeploy-2.onrender.com/api/student/overview/${studentId}`
      );
      const data = await response.json();
      setOverview(data);
      setClassLinks(data.classLinks || []);
    } catch (error) {
      console.log("Overview error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-56 w-full rounded-2xl" />
      </div>
    );
  }

  /* ---------------- EMPTY ---------------- */
  if (!overview) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Sparkles className="h-7 w-7 text-muted-foreground" />
        </div>
        <p className="text-lg font-semibold">No data found</p>
        <p className="text-sm text-muted-foreground">
          We couldn't load your dashboard right now.
        </p>
      </div>
    );
  }

  const next = overview.nextClass;
  const studentName = overview.student?.name || "Student";

  const stats = [
    { label: "Current level", value: overview.student?.level || "—", icon: Music2 },
    { label: "Course", value: overview.student?.courseName || "No Course", icon: GraduationCap },
    {
      label: "Classes attended",
      value: `${overview.stats?.attended || 0}/${overview.stats?.totalClasses || 0}`,
      icon: Video,
    },
    { label: "Certificates", value: String(overview.stats?.certificates || 0), icon: Trophy },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      {/* ---------------- HEADER ---------------- */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary to-primary/70 p-6 text-primary-foreground shadow-lg"
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <p className="text-sm/relaxed opacity-90">Welcome back 👋</p>
            <h1 className="mt-1 text-2xl font-bold md:text-3xl">{studentName}</h1>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <Flame className="h-3.5 w-3.5" />
              Keep your learning streak going
            </div>
          </div>
          <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur sm:flex">
            <GraduationCap className="h-7 w-7" />
          </div>
        </div>
      </motion.div>

      {/* ---------------- STATS ---------------- */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.05 * i }}
            >
              <Card className="group h-full transition-shadow hover:shadow-md">
                <CardContent className="flex flex-col gap-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="mt-0.5 truncate text-lg font-semibold">{item.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* ---------------- NEXT CLASS ---------------- */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.1 }}>
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Bell className="h-4 w-4" />
              Next Class
            </div>

            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <h2 className="text-xl font-bold">
                  {next?.title || "No upcoming class"}
                </h2>

                {(next?.teacher || next?.batchName) && (
                  <p className="text-sm text-muted-foreground">
                    {next?.teacher}
                    {next?.teacher && next?.batchName ? " · " : ""}
                    {next?.batchName}
                  </p>
                )}

                {next?.date && (
                  <Badge variant="secondary" className="gap-1.5">
                    <CalendarClock className="h-3.5 w-3.5" />
                    {format(new Date(next.date), "EEE, dd MMM · h:mm a")}
                  </Badge>
                )}
              </div>

              {next?.meetingLink && (
                <Button asChild size="lg" className="gap-2">
                  <a href={next.meetingLink} target="_blank" rel="noreferrer">
                    Join Live Class
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ---------------- TEACHER SHARED LINKS ---------------- */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.15 }}>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Link2 className="h-4 w-4 text-primary" />
              Teacher Shared Links
            </div>

            <div className="mt-4 space-y-3">
              {classLinks.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-10 text-center">
                  <Link2 className="h-6 w-6 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No class links shared yet
                  </p>
                </div>
              ) : (
                classLinks.map((c: any, i: number) => (
                  <div
                    key={i}
                    className="flex flex-col gap-3 rounded-xl border p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold">{c.title}</p>
                      <p className="text-sm text-muted-foreground">{c.teacher}</p>
                      {c.date && (
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(c.date), "EEE, dd MMM · h:mm a")}
                        </p>
                      )}
                    </div>

                    {c.link && (
                      <Button asChild variant="outline" size="sm" className="gap-1.5">
                        <a href={c.link} target="_blank" rel="noreferrer">
                          Join
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default StudentOverview;
