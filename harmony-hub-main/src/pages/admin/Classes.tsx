import { useEffect, useState } from "react";

import { PageHeader } from "@/components/dashboard/Primitives";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { format } from "date-fns";

import {
  Video,
  ExternalLink,
  FileText,
} from "lucide-react";

type ClassType = {

  _id: string;

  title: string;

  batchName: string;

  teacher: string;

  status: "Live" | "Upcoming" | "Completed";

  platform: string;

  date: string;

  meetingLink?: string;

  notes?: string;
};

function AdminClasses() {

  const [classes, setClasses] =
    useState<ClassType[]>([]);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // FETCH CLASSES
  // =========================

  const fetchClasses = async () => {

    try {

      const response = await fetch(
        "https://marcylmsdeploy.onrender.com/api/classes"
      );

      const data = await response.json();

      setClasses(data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchClasses();

  }, []);

  return (
    <div>

      <PageHeader
        title="Online classes"
        subtitle="Monitor all scheduled & live sessions"
      />

      {loading ? (

        <div className="mt-10 text-center text-muted-foreground">
          Loading classes...
        </div>

      ) : (

        <div className="grid gap-6 lg:grid-cols-3">

          {(
            [
              "Live",
              "Upcoming",
              "Completed",
            ] as const
          ).map((status) => (

            <Card key={status}>

              <CardContent className="p-5">

                <div className="mb-4 flex items-center justify-between">

                  <div className="font-display text-lg flex items-center gap-2">

                    {status === "Live" && (
                      <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
                    )}

                    {status}

                  </div>

                  <Badge variant="outline">

                    {
                      classes.filter(
                        (c) =>
                          c.status === status
                      ).length
                    }

                  </Badge>

                </div>

                <div className="space-y-3">

                  {classes
                    .filter(
                      (c) =>
                        c.status === status
                    )
                    .map((c) => (

                      <div
                        key={c._id}
                        className="rounded-xl border border-border p-3.5"
                      >

                        <div className="flex items-center gap-2">

                          <Video className="h-3.5 w-3.5 text-gold" />

                          <div className="text-sm font-medium">

                            {c.title}

                          </div>

                        </div>

                        <div className="mt-1 text-xs text-muted-foreground">

                          {c.batchName} · {c.teacher}

                        </div>

                        <div className="mt-2 flex items-center justify-between text-xs">

                          <span className="text-muted-foreground">

                            {format(
                              new Date(c.date),
                              "dd MMM h:mm a"
                            )}

                          </span>

                          <Badge
                            variant="outline"
                            className="text-[10px]"
                          >
                            {c.platform}
                          </Badge>

                        </div>

                        {c.meetingLink && (

                          <Button
                            size="sm"
                            variant="ghost"
                            className="mt-2 h-7 w-full justify-start text-xs"
                            asChild
                          >

                            <a
                              href={c.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                            >

                              <ExternalLink className="mr-1 h-3 w-3" />

                              Open link

                            </a>

                          </Button>
                        )}

                        {c.notes && (

                          <div className="mt-2 flex items-start gap-1.5 text-[11px] text-muted-foreground">

                            <FileText className="mt-0.5 h-3 w-3" />

                            {c.notes}

                          </div>
                        )}

                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminClasses;