import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { ExternalLink, Video, Lock } from "lucide-react";

import { useAuth } from "@/store/auth";
import { PageHeader } from "@/components/dashboard/Primitives";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type ClassItem = {
  _id: string;
  title: string;
  teacher: string;
  date: string;
  platform: string;
  status: "Upcoming" | "Live" | "Completed";
  meetingLink?: string;
  recordingUrl?: string;
  courseName: string;
  courseLevel: string;
};

function StudentClasses() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [lockedClasses, setLockedClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  const user = useAuth((s) => s.user);

  const fetchClasses = async () => {
    try {
      const res = await axios.get(
        "https://marcylmsdeploy.onrender.com/api/classes"
      );

      const allClasses = res.data;

      const unlockedLevels = user?.unlockedLevels || [];
      const userCourse = user?.courseName?.trim();

      // =========================
      // UNLOCKED CLASSES
      // =========================
      const unlocked = allClasses.filter((c: any) => {
        return (
          c.courseName?.trim() === userCourse &&
          unlockedLevels.includes(c.courseLevel)
        );
      });

      // =========================
      // LOCKED CLASSES
      // =========================
      const locked = allClasses.filter((c: any) => {
        return (
          c.courseName?.trim() === userCourse &&
          !unlockedLevels.includes(c.courseLevel)
        );
      });

      setClasses(unlocked);
      setLockedClasses(locked);
    } catch (err) {
      console.error("Failed to load classes", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Auto refresh when user changes
  useEffect(() => {
    fetchClasses();
  }, [user?.unlockedLevels, user?.courseName]);

  // 🔥 Optional: force refresh event listener (BEST PRACTICE)
  useEffect(() => {
    const handler = () => fetchClasses();

    window.addEventListener("user-updated", handler);
    return () => window.removeEventListener("user-updated", handler);
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-muted-foreground">
        Loading classes...
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Classes"
        subtitle="Your unlocked & locked sessions"
      />

      {/* ========================= */}
      {/* UNLOCKED CLASSES */}
      {/* ========================= */}
      <div className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">
          Unlocked Classes
        </h2>

        {classes.length === 0 ? (
          <div className="rounded-xl border p-6 text-muted-foreground">
            No unlocked classes found
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {classes.map((c) => (
              <Card key={c._id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <Badge>{c.status}</Badge>

                    <Badge variant="outline">
                      <Video className="mr-1 h-3 w-3" />
                      {c.platform}
                    </Badge>
                  </div>

                  <div className="mt-3 font-bold text-lg">
                    {c.title}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {c.teacher}
                  </div>

                  <div className="mt-2 text-xs text-muted-foreground">
                    {format(new Date(c.date), "EEE, dd MMM · h:mm a")}
                  </div>

                  <div className="mt-3">
                    <Badge>{c.courseLevel}</Badge>
                  </div>

                  {/* JOIN LINK */}
                  {c.meetingLink && c.status !== "Completed" && (
                    <Button className="mt-4 w-full" asChild>
                      <a
                        href={c.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Join Class
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}

                  {/* RECORDING */}
                  {c.status === "Completed" && c.recordingUrl && (
                    <Button className="mt-4 w-full" asChild>
                      <a
                        href={c.recordingUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Watch Recording
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ========================= */}
      {/* LOCKED CLASSES */}
      {/* ========================= */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">
          Locked Classes
        </h2>

        {lockedClasses.length === 0 ? (
          <div className="rounded-xl border p-6 text-muted-foreground">
            No locked classes
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lockedClasses.map((c) => (
              <Card
                key={c._id}
                className="opacity-70 border-dashed"
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Locked</Badge>
                    <Lock className="h-4 w-4" />
                  </div>

                  <div className="mt-4 font-bold text-lg">
                    {c.title}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {c.teacher}
                  </div>

                  <div className="mt-2 text-xs text-muted-foreground">
                    {format(new Date(c.date), "EEE, dd MMM · h:mm a")}
                  </div>

                  <div className="mt-3">
                    <Badge variant="secondary">
                      {c.courseLevel}
                    </Badge>
                  </div>

                  <Button disabled className="mt-5 w-full">
                    Unlock by Payment
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentClasses;