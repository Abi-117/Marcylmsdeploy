import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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

import { format } from "date-fns";
import { useAuth } from "@/store/auth";

function StudentOverview() {
  const { user } = useAuth();

  const [overview, setOverview] = useState<any>(null);
  const [classLinks, setClassLinks] = useState<any[]>([]);
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
        `https://marcylmsdeploy-2.onrender.com/api/student/overview/${studentId}`
      );

      const data = await response.json();

      setOverview(data);

      // Backend-ilirundhu varum class links inge set aagirum
      setClassLinks(data.classLinks || []);
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
      {/* HEADER */}
      <PageHeader
        title={`Welcome back, ${overview.student?.name || ""}`}
        subtitle={`${overview.student?.course || "Course"} · ${overview.student?.level || "Beginner"}`}
      />

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Current level" value={overview.student?.level} icon={Music2} accent />
        <StatCard label="Practice streak" value={`${overview.stats?.streak || 0} days`} icon={Flame} />
        <StatCard label="Classes attended" value={`${overview.stats?.attended || 0}/${overview.stats?.totalClasses || 0}`} icon={Video} />
        <StatCard label="Certificates" value={String(overview.stats?.certificates || 0)} icon={Trophy} />
      </div>

      {/* NEXT CLASS */}
      <div className="mt-6">
        <Card>
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
                <a href={next.meetingLink} target="_blank" rel="noreferrer">
                  Join Class <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* TEACHER CLASS LINKS */}
      <div className="mt-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 font-semibold">
              <Bell className="h-4 w-4" />
              Teacher Shared Class Links
            </div>

            <div className="mt-4 space-y-3">
              {classLinks.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No class links shared yet
                </div>
              ) : (
                classLinks.map((c: any, i: number) => (
                  <div
                    key={i}
                    className="border rounded-xl p-4 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-sm">
                        {c.title || "Class Link"}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {c.teacher || "Teacher"}
                      </div>

                      {c.date && (
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(c.date), "EEE, dd MMM · h:mm a")}
                        </div>
                      )}
                    </div>

                    {c.link && (
                      <Button size="sm" asChild>
                        <a href={c.link} target="_blank" rel="noreferrer">
                          Join <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default StudentOverview;