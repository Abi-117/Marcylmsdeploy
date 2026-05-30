import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";

import {
  StatCard,
  PageHeader,
} from "@/components/dashboard/Primitives";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Flame,
  Music2,
  Video,
  Trophy,
  ExternalLink,
  Bell,
} from "lucide-react";

import { useAuth } from "@/store/auth";

function StudentOverview() {
  const { user } = useAuth();

  const [overview, setOverview] = useState<any>(null);
  const [classLinks, setClassLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentId = user?.id || user?._id || user?.user?._id;
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

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-muted-foreground animate-pulse">
        Loading your dashboard...
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-muted-foreground">
        No data found
      </div>
    );
  }

  const next = overview.nextClass;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* HEADER */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <PageHeader
          title={`Welcome back, ${overview.student?.name || ""}`}
          subtitle={`${overview.student?.course || "Course"} · ${
            overview.student?.level || "Beginner"
          }`}
        />
      </motion.div>

      {/* STATS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          {
            label: "Current level",
            value: overview.student?.level,
            icon: Music2,
          },
          {
            label: "Practice streak",
            value: `${overview.stats?.streak || 0} days`,
            icon: Flame,
          },
          {
            label: "Classes attended",
            value: `${overview.stats?.attended || 0}/${
              overview.stats?.totalClasses || 0
            }`,
            icon: Video,
          },
          {
            label: "Certificates",
            value: String(overview.stats?.certificates || 0),
            icon: Trophy,
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <StatCard {...item} accent />
          </motion.div>
        ))}
      </motion.div>

      {/* NEXT CLASS */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="border-0 shadow-xl rounded-2xl bg-gradient-to-br from-white to-slate-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-500 text-black shadow-sm">
                Next Class
              </Badge>
            </div>

            <div className="mt-4 text-2xl font-bold tracking-tight">
              {next?.title || "No upcoming class"}
            </div>

            <div className="text-sm text-muted-foreground mt-1">
              {next?.teacher} · {next?.batchName}
            </div>

            {next?.date && (
              <div className="text-xs text-muted-foreground mt-2">
                {format(new Date(next.date), "EEE, dd MMM · h:mm a")}
              </div>
            )}

            {next?.meetingLink && (
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button className="mt-5 rounded-xl shadow-md" asChild>
                  <a href={next.meetingLink} target="_blank" rel="noreferrer">
                    Join Live Class
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* TEACHER LINKS */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <Card className="rounded-2xl shadow-lg border">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 font-semibold text-lg">
              <Bell className="h-4 w-4" />
              Teacher Shared Links
            </div>

            <div className="mt-5 space-y-4">
              {classLinks.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No class links shared yet
                </div>
              ) : (
                classLinks.map((c: any, i: number) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 5 }}
                    className="border rounded-xl p-4 flex items-center justify-between bg-white shadow-sm"
                  >
                    <div>
                      <div className="font-medium text-sm">{c.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {c.teacher}
                      </div>
                      {c.date && (
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(c.date), "EEE, dd MMM · h:mm a")}
                        </div>
                      )}
                    </div>

                    {c.link && (
                      <Button size="sm" asChild className="rounded-lg">
                        <a href={c.link} target="_blank" rel="noreferrer">
                          Join <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default StudentOverview;