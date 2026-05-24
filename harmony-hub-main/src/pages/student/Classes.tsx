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
  const [loading, setLoading] = useState(true);

  const user = useAuth((s) => s.user);

  const fetchClasses = async () => {
    try {
      setLoading(true);

      // ✅ IMPORTANT: backend handles unlocking logic
      const res = await axios.get(
        `https://marcylmsdeploy.onrender.com/api/classes/student/${user?._id}`
      );

      setClasses(res.data);
    } catch (err) {
      console.error("Failed to load classes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchClasses();
    }
  }, [user?._id]);

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading classes...</div>;
  }

  return (
    <div>
      <PageHeader title="Classes" subtitle="Your classes" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classes.length === 0 ? (
          <div className="p-6 text-muted-foreground border rounded-xl">
            No classes found
          </div>
        ) : (
          classes.map((c) => (
            <Card key={c._id}>
              <CardContent className="p-5">
                <div className="flex justify-between">
                  <Badge>{c.status}</Badge>
                  <Badge variant="outline">
                    <Video className="h-3 w-3 mr-1" />
                    {c.platform}
                  </Badge>
                </div>

                <h2 className="mt-3 font-bold text-lg">{c.title}</h2>

                <p className="text-xs text-muted-foreground">{c.teacher}</p>

                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(c.date), "EEE, dd MMM · h:mm a")}
                </p>

                <div className="mt-2">
                  <Badge>{c.courseLevel}</Badge>
                </div>

                {/* JOIN */}
                {c.meetingLink && c.status !== "Completed" && (
                  <Button className="mt-4 w-full" asChild>
                    <a href={c.meetingLink} target="_blank" rel="noreferrer">
                      Join Class
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}

                {/* RECORDING */}
                {c.status === "Completed" && c.recordingUrl && (
                  <Button className="mt-4 w-full" asChild>
                    <a href={c.recordingUrl} target="_blank">
                      Watch Recording
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default StudentClasses;