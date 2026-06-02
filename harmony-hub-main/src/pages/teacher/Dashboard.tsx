import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import { format } from "date-fns";

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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import {
  Video,
  GraduationCap,
  ClipboardList,
  Award,
  Plus,
  ExternalLink,
} from "lucide-react";

const API =
  "https://marcylmsdeploy-2.onrender.com/api";

function TeacherOverview() {

  // =====================================
  // AUTH
  // =====================================

  const user = JSON.parse(
    localStorage.getItem("ms-auth") || "{}"
  )?.state?.user;

  const teacherId = user?._id || user?.id;

  const teacherCourse =
    user?.courseName || "";

  // =====================================
  // STATES
  // =====================================

  const [classes, setClasses] =
    useState<any[]>([]);

  const [students, setStudents] =
    useState<any[]>([]);

  const [stats, setStats] =
  useState({
    todayClasses: 0,
    students: 0,
    pendingReviews: 0,
    completedClasses: 0,
    certificates: 0,
    totalClasses: 0,
  });

  // =====================================
  // FETCH
  // =====================================

  useEffect(() => {

    fetchDashboard();

  }, []);

  const fetchDashboard =
    async () => {

      try {

        const response =
          await fetch(
            `${API}/teacher/dashboard/${teacherId}`
          );

        const data =
          await response.json();

        setClasses(
          data.classes || []
        );

        setStudents(
          data.students || []
        );

        setStats(
          data.stats
        );

      } catch (error) {

        console.log(error);

      }

    };

  // =====================================
  // UI
  // =====================================

  return (

    <div>

      <PageHeader
        title={`Welcome ${
          user?.name || "Teacher"
        }`}
        subtitle={`Teaching ${teacherCourse}`}
        actions={
          <ScheduleClassButton
            students={students}
            teacherId={teacherId}
            teacherCourse={teacherCourse}
          />
        }
      />

      {/* ===================================== */}
      {/* STATS */}
      {/* ===================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <StatCard
          label="Today's Classes"
          value={stats.todayClasses.toString()}
          icon={Video}
          accent
        />

        <StatCard
          label="My Students"
          value={stats.students.toString()}
          icon={GraduationCap}
        />

        <StatCard
          label="Pending Reviews"
          value={stats.pendingReviews.toString()}
          icon={ClipboardList}
        />

        <StatCard
  label="Completed Classes"
  value={String(
    stats.completedClasses
  )}
  icon={Award}
/>

<StatCard
  label="Certificates"
  value={String(
    stats.certificates
  )}
  icon={Award}
/>

<StatCard
  label="Total Classes"
  value={String(
    stats.totalClasses
  )}
  icon={Video}
/>

        
      </div>

      {/* ===================================== */}
      {/* MAIN CONTENT */}
      {/* ===================================== */}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">

        {/* ===================================== */}
        {/* UPCOMING CLASSES */}
        {/* ===================================== */}

        <Card className="lg:col-span-2">

          <CardContent className="p-6">

            <div className="mb-5 flex items-center justify-between">

              <div>

                <div className="font-display text-xl">

                  Upcoming Classes

                </div>

                <div className="text-sm text-muted-foreground">

                  Scheduled student sessions

                </div>

              </div>

              <Badge className="bg-gold text-black">

                {classes.length} Classes

              </Badge>

            </div>

            <div className="space-y-4">

              {classes.length === 0 && (

                <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">

                  No classes scheduled

                </div>

              )}

              {classes.map((c) => (

                <motion.div
                  key={c._id}
                  whileHover={{ y: -2 }}
                  className="rounded-2xl border border-border bg-card p-5"
                >

                  <div className="flex flex-wrap items-start justify-between gap-4">

                    {/* LEFT */}

                    <div className="flex items-start gap-3">

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-soft text-gold-foreground">

                        <Video className="h-5 w-5" />

                      </div>

                      <div>

                        <div className="font-semibold text-base">

                          {c.title}

                        </div>

                        <div className="mt-1 text-sm text-muted-foreground">

                          {c.courseName}

                        </div>

                        <div className="mt-2 flex flex-wrap gap-2">

                          <Badge variant="outline">

                            {c.platform}

                          </Badge>

                          <Badge variant="outline">

                            {c.status}

                          </Badge>

                        </div>

                      </div>

                    </div>

                    {/* RIGHT */}

                    <div className="text-right">

                      <div className="rounded-xl bg-gold-soft px-4 py-2 text-sm font-semibold text-black">

                        {format(
                          new Date(c.date),
                          "h:mm a"
                        )}

                      </div>

                      <div className="mt-2 text-xs text-muted-foreground">

                        {format(
                          new Date(c.date),
                          "EEEE"
                        )}

                      </div>

                      <div className="text-xs text-muted-foreground">

                        {format(
                          new Date(c.date),
                          "MMM d, yyyy"
                        )}

                      </div>

                    </div>

                  </div>

                  {/* STUDENTS */}

                  <div className="mt-5">

                    <div className="mb-2 text-xs font-medium text-muted-foreground">

                      Students

                    </div>

                    <div className="flex flex-wrap gap-2">

                      {c.students?.map((s: any) => (

                        <div
                          key={s._id}
                          className="rounded-full border border-border bg-muted px-3 py-1 text-xs"
                        >

                          {s.name}

                        </div>

                      ))}

                    </div>

                  </div>

                  {/* NOTES */}

                  {c.notes && (

                    <div className="mt-4 rounded-xl bg-muted p-3 text-sm text-muted-foreground">

                      {c.notes}

                    </div>

                  )}

                  {/* BUTTON */}

                  {c.meetingLink && (

                    <a
                      href={c.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex items-center rounded-xl bg-black px-4 py-2 text-sm font-medium text-white"
                    >

                      Open Class

                      <ExternalLink className="ml-2 h-4 w-4" />

                    </a>

                  )}

                </motion.div>

              ))}

            </div>

          </CardContent>

        </Card>

        {/* ===================================== */}
        {/* STUDENTS */}
        {/* ===================================== */}

        <Card>

          <CardContent className="p-6">

            <div className="mb-5">

              <div className="font-display text-xl">

                Paid Students

              </div>

              <div className="text-sm text-muted-foreground">

                Active enrolled students

              </div>

            </div>

            <div className="space-y-3">

              {students.map((s) => (

                <motion.div
                  key={s._id}
                  whileHover={{ x: 2 }}
                  className="rounded-xl border border-border p-4"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div>

                      <div className="font-medium">

                        {s.name}

                      </div>

                      <div className="mt-1 text-xs text-muted-foreground">

                        {s.selectedLevel}

                      </div>

                    </div>

                    <Badge variant="outline">

                      {s.mode}

                    </Badge>

                  </div>

                  <div className="mt-3 text-xs text-muted-foreground">

                    {s.availableDays?.join(", ")}

                  </div>

                  <div className="mt-1 text-xs text-muted-foreground">

                    {s.fromTime} - {s.toTime}

                  </div>

                  <Dialog>

  <DialogTrigger asChild>

    <Button
      size="sm"
      variant="outline"
      className="mt-4 w-full"
    >

      View

    </Button>

  </DialogTrigger>

<DialogContent className="w-[95vw] max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl p-0 flex flex-col">  
  <DialogHeader className="px-6 pt-6">
    <DialogTitle>Student Details</DialogTitle>
  </DialogHeader>

  {/* 👇 THIS IS THE SCROLL AREA */}
  <div className="max-h-[75vh] overflow-y-auto px-6 pb-6 custom-scroll space-y-4">
    
    {/* NAME */}
    <div className="rounded-xl border border-border p-4">
      <div className="text-xs text-muted-foreground">Student Name</div>
      <div className="mt-1 font-semibold">{s.name}</div>
    </div>

    {/* COURSE */}
    <div className="rounded-xl border border-border p-4">
      <div className="text-xs text-muted-foreground">Course</div>
      <div className="mt-1 font-semibold">
        {s.courseName || s.course || "No Course"}
      </div>
    </div>

    {/* LEVEL */}
    <div className="rounded-xl border border-border p-4">
      <div className="text-xs text-muted-foreground">Level</div>
      <div className="mt-1 font-semibold">{s.selectedLevel}</div>
    </div>

    {/* DAYS */}
    <div className="rounded-xl border border-border p-4">
      <div className="text-xs text-muted-foreground">Available Days</div>
      <div className="mt-1 font-semibold">
        {s.availableDays?.join(", ")}
      </div>
    </div>

    {/* TIME */}
    <div className="rounded-xl border border-border p-4">
      <div className="text-xs text-muted-foreground">Available Time</div>
      <div className="mt-1 font-semibold">
        {s.fromTime} - {s.toTime}
      </div>
    </div>

    {/* MODE */}
    <div className="rounded-xl border border-border p-4">
      <div className="text-xs text-muted-foreground">Class Mode</div>
      <div className="mt-1 font-semibold">{s.mode}</div>
    </div>

    {/* PAYMENT */}
    <div className="rounded-xl border border-border p-4">
      <div className="text-xs text-muted-foreground">Payment Status</div>
      <div className="mt-1">
        <Badge className="bg-green-600 text-white">
          {s.paymentStatus}
        </Badge>
      </div>
    </div>

  </div>
</DialogContent>

</Dialog>

                </motion.div>

              ))}

            </div>

          </CardContent>

        </Card>

      </div>

    </div>

  );

}

// =====================================
// SCHEDULE CLASS BUTTON
// =====================================

function ScheduleClassButton({
  students,
  teacherId,
  teacherCourse,
}: any) {

  const [selectedStudents, setSelectedStudents] =
    useState<string[]>([]);

  const [platform, setPlatform] =
    useState<
      "Google Meet" | "Zoom"
    >("Google Meet");

  const [form, setForm] =
    useState({

      title: `${teacherCourse} Class`,

      date: "",

      time: "",

      platform: "Google Meet",

      meetingLink: "",

      notes: "",

    });

  // =====================================
  // CREATE CLASS
  // =====================================

  const createClass =
    async () => {

      try {

        if (
          selectedStudents.length === 0
        ) {

          alert(
            "Select students"
          );

          return;

        }

        const response =
          await fetch(
            `${API}/classes`,
            {

              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({

                title:
                  form.title,

                teacherId,

                courseName:
                  teacherCourse,

                date: new Date(
                  `${form.date}T${form.time}`
                ),

                platform:
                  form.platform,

                meetingLink:
                  form.meetingLink,

                notes:
                  form.notes,

                status:
                  "Upcoming",

                students:
                  selectedStudents,

              }),

            }
          );

        const data =
          await response.json();

        if (!response.ok) {

          alert(
            data.message
          );

          return;

        }

        alert(
          "Class Scheduled"
        );

        window.location.reload();

      } catch (error) {

        console.log(error);

      }

    };

  return (

    <Dialog>

      <DialogTrigger asChild>

        <Button className="bg-gold text-black">

          <Plus className="mr-2 h-4 w-4" />

          Schedule Class

        </Button>

      </DialogTrigger>

      <DialogContent className="max-w-lg">

        <DialogHeader>

          <DialogTitle>

            Schedule Class

          </DialogTitle>

        </DialogHeader>

        <div className="space-y-4">

          {/* TITLE */}

          <div>

            <Label>
              Class Title
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

          {/* STUDENTS */}

          <div>

            <Label>
              Select Students
            </Label>

            <div className="mt-2 max-h-52 overflow-y-auto rounded-lg border border-border p-3 space-y-2">

              {students.map(
                (s: any) => (

                  <label
                    key={s._id}
                    className="flex items-center justify-between rounded-md border border-border p-2 text-sm"
                  >

                    <div>

                      <div className="font-medium">

                        {s.name}

                      </div>

                      <div className="text-xs text-muted-foreground">

                        {s.selectedLevel}

                      </div>

                    </div>

                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(
                        s._id
                      )}
                      onChange={(e) => {

                        if (
                          e.target.checked
                        ) {

                          setSelectedStudents([
                            ...selectedStudents,
                            s._id,
                          ]);

                        } else {

                          setSelectedStudents(
                            selectedStudents.filter(
                              (id) =>
                                id !== s._id
                            )
                          );

                        }

                      }}
                    />

                  </label>

                )
              )}

            </div>

          </div>

          {/* DATE */}

          <div className="grid grid-cols-2 gap-4">

            <div>

              <Label>
                Date
              </Label>

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

            <div>

              <Label>
                Time
              </Label>

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

          <div>

            <Label>
              Platform
            </Label>

            <div className="mt-2 grid grid-cols-2 gap-2">

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
                  className={`rounded-lg border p-3 text-sm ${
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

          <div>

            <Label>
              Meeting Link
            </Label>

            <Input
              placeholder="https://meet.google.com/..."
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

          <div>

            <Label>
              Notes
            </Label>

            <Textarea
              rows={3}
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
            className="w-full bg-gold text-black"
          >

            Schedule Class

          </Button>

        </div>

      </DialogContent>

    </Dialog>

  );

}

export default TeacherOverview;