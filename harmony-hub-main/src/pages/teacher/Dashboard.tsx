import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  StatCard,
  PageHeader,
} from "@/components/dashboard/Primitives";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Video,
  GraduationCap,
  ClipboardList,
  Award,
  Plus,
  ExternalLink,
} from "lucide-react";

import { format } from "date-fns";

function TeacherOverview() {

  const user = JSON.parse(
    localStorage.getItem("ms-auth") || "{}"
  )?.state?.user;

  const teacherId = user?.id;

  const teacherCourse =
    user?.courseName || "";

  const [classes, setClasses] =
    useState<any[]>([]);

  const [students, setStudents] =
    useState<any[]>([]);

  const [stats, setStats] =
    useState({
      todayClasses: 0,
      students: 0,
      pendingReviews: 0,
      rating: 4.9,
    });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard =
    async () => {

      try {

        const response =
          await fetch(
            `https://marcylmsdeploy.onrender.com/api/teacher/dashboard/${teacherId}`
          );

        const data =
          await response.json();

        if (!response.ok) {
          console.log(data.message);
          return;
        }

        setClasses(
          data.classes || []
        );

        setStudents(
          data.students || []
        );

        setStats(data.stats);

      } catch (error) {

        console.log(error);

      }

    };

  return (

    <div>

      <PageHeader
        title={`Good morning, ${
          user?.name || "Teacher"
        }`}
        subtitle={`Teaching ${teacherCourse}`}
        actions={
          <ScheduleClassButton />
        }
      />

      {/* STATS */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <StatCard
          label="Today's classes"
          value={stats.todayClasses.toString()}
          icon={Video}
          accent
        />

        <StatCard
          label="My students"
          value={stats.students.toString()}
          icon={GraduationCap}
        />

        <StatCard
          label="Pending reviews"
          value={stats.pendingReviews.toString()}
          icon={ClipboardList}
        />

        <StatCard
          label="Average rating"
          value={stats.rating.toString()}
          icon={Award}
        />

      </div>

      {/* CLASSES */}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">

        <Card className="lg:col-span-2">

          <CardContent className="p-6">

            <div className="mb-4 flex items-center justify-between">

              <div className="font-display text-lg">
                Upcoming classes
              </div>

              <Button
                variant="ghost"
                size="sm"
              >
                Calendar
              </Button>

            </div>

            <div className="space-y-2">

              {classes.map((c) => (

                <motion.div
                  key={c._id}
                  whileHover={{ x: 2 }}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-border p-3.5"
                >

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-soft text-gold-foreground">

                    <Video className="h-4 w-4" />

                  </div>

                  <div className="flex-1 min-w-0">

                    <div className="font-medium text-sm">
                      {c.title}
                    </div>

                    <div className="text-xs text-muted-foreground truncate">
                      {c.courseName}
                    </div>

                  </div>

                  <div className="text-xs text-muted-foreground">

                    {format(
                      new Date(c.date),
                      "EEE h:mm a"
                    )}

                  </div>

                  <Badge variant="outline">
                    {c.platform}
                  </Badge>

                  {c.meetingLink && (

                    <Button
                      size="sm"
                      className="bg-foreground text-background hover:bg-foreground/90"
                      asChild
                    >

                      <a
                        href={c.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                      >

                        Open

                        <ExternalLink className="ml-1 h-3 w-3" />

                      </a>

                    </Button>

                  )}

                </motion.div>

              ))}

            </div>

          </CardContent>

        </Card>

        {/* STUDENTS */}

        <Card>

          <CardContent className="p-6">

            <div className="mb-4 font-display text-lg">
              Paid Students
            </div>

            <div className="space-y-2.5">

              {students.map((s) => (

                <div
                  key={s._id}
                  className="flex items-center justify-between rounded-lg border border-border p-2.5 text-sm"
                >

                  <div>

                    <div className="font-medium">
                      {s.name}
                    </div>

                    <div className="text-xs text-muted-foreground">

                      {s.selectedLevel} · {
  typeof s.course === "object"
    ? s.course?.name
    : s.course
}

                    </div>

                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                  >
                    View
                  </Button>

                </div>

              ))}

            </div>

          </CardContent>

        </Card>

      </div>

    </div>

  );

}

function ScheduleClassButton() {

  const user = JSON.parse(
    localStorage.getItem("ms-auth") || "{}"
  )?.state?.user;

  const teacherId = user?.id;

 const teacherCourse =
  user?.course || "";

  const [platform, setPlatform] =
    useState<
      "Google Meet" | "Zoom"
    >("Google Meet");

  const [form, setForm] =
    useState({

      title: `${teacherCourse} Master Class`,

      date: "",

      time: "",

      platform: "Google Meet",

      meetingLink: "",

      notes: "",

    });

  const createClass =
    async () => {

      try {

        const response =
          await fetch(
            "https://marcylmsdeploy.onrender.com/api/classes",
            {

              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({

                ...form,

                teacherId,

                courseName:
                  teacherCourse,

              }),

            }
          );

        const data =
          await response.json();

        if (!response.ok) {

          alert(data.message);

          return;

        }

        alert(
          "Class scheduled successfully"
        );

        window.location.reload();

      } catch (error) {

        console.log(error);

        alert(
          "Something went wrong"
        );

      }

    };

  return (

    <Dialog>

      <DialogTrigger asChild>

        <Button className="bg-gold text-gold-foreground hover:bg-gold/90 shadow-gold">

          <Plus className="mr-1.5 h-4 w-4" />

          Schedule class

        </Button>

      </DialogTrigger>

      <DialogContent className="max-w-lg">

        <DialogHeader>

          <DialogTitle className="font-display text-2xl">

            Schedule {teacherCourse} Class

          </DialogTitle>

        </DialogHeader>

        <div className="space-y-4">

          {/* CLASS TITLE */}

          <div className="space-y-1.5">

            <Label>
              Class title
            </Label>

            <Input
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title:
                    e.target.value,
                })
              }
            />

          </div>

          {/* DATE + TIME */}

          <div className="grid grid-cols-2 gap-4">

            <div className="space-y-1.5">

              <Label>Date</Label>

              <Input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm({
                    ...form,
                    date:
                      e.target.value,
                  })
                }
              />

            </div>

            <div className="space-y-1.5">

              <Label>Time</Label>

              <Input
                type="time"
                value={form.time}
                onChange={(e) =>
                  setForm({
                    ...form,
                    time:
                      e.target.value,
                  })
                }
              />

            </div>

          </div>

          {/* PLATFORM */}

          <div className="space-y-1.5">

            <Label>
              Platform
            </Label>

            <div className="grid grid-cols-2 gap-2">

              {(
                [
                  "Google Meet",
                  "Zoom",
                ] as const
              ).map((p) => (

                <button
                  key={p}
                  onClick={() => {

                    setPlatform(p);

                    setForm({
                      ...form,
                      platform: p,
                    });

                  }}
                  className={`rounded-lg border p-3 text-sm font-medium transition-all ${
                    platform === p
                      ? "border-gold bg-gold-soft"
                      : "border-border"
                  }`}
                >

                  {p}

                </button>

              ))}

            </div>

          </div>

          {/* LINK */}

          <div className="space-y-1.5">

            <Label>
              Meeting link
            </Label>

            <Input
              placeholder={
                platform === "Zoom"
                  ? "https://zoom.us/j/..."
                  : "https://meet.google.com/..."
              }
              value={form.meetingLink}
              onChange={(e) =>
                setForm({
                  ...form,
                  meetingLink:
                    e.target.value,
                })
              }
            />

          </div>

          {/* NOTES */}

          <div className="space-y-1.5">

            <Label>
              Notes
            </Label>

            <Textarea
              rows={3}
              placeholder="Today's topics..."
              value={form.notes}
              onChange={(e) =>
                setForm({
                  ...form,
                  notes:
                    e.target.value,
                })
              }
            />

          </div>

          {/* BUTTON */}

          <Button
            onClick={createClass}
            className="w-full bg-gold text-gold-foreground hover:bg-gold/90"
          >

            Schedule Class

          </Button>

        </div>

      </DialogContent>

    </Dialog>

  );

}

export default TeacherOverview;