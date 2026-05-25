import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Users,
  Search,
  CalendarDays,
  BookOpen,
  CheckCircle2,
  XCircle,
  UserCheck,
  BarChart3,
  Clock3,
} from "lucide-react";

const API =
  "https://marcylmsdeploy.onrender.com/api";

export default function TeacherAttendanceDashboard() {

  // =========================================
  // AUTH
  // =========================================

  const user = JSON.parse(
    localStorage.getItem("ms-auth") || "{}"
  )?.state?.user;

  const teacherId = user?.id;

  // =========================================
  // STATES
  // =========================================

  const [data, setData] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [courseFilter, setCourseFilter] =
    useState("all");

  // =========================================
  // FETCH
  // =========================================

  useEffect(() => {

    if (!teacherId) return;

    fetchAttendance();

  }, [teacherId]);

  const fetchAttendance = async () => {

    try {

      const res = await axios.get(
        `${API}/attendance/teacher/${teacherId}`
      );

      setData(res.data || []);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  // =========================================
  // COURSES
  // =========================================

  const courses = useMemo(() => {

    return [
      ...new Set(
        data
          .map((d) => d.courseName)
          .filter(Boolean)
      ),
    ];

  }, [data]);

  // =========================================
  // FILTER
  // =========================================

  const filteredData = useMemo(() => {

    return data.filter((item) => {

      const matchesSearch =

        item.studentName
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        item.classTitle
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesStatus =

        statusFilter === "all"
          ? true
          : item.status ===
            statusFilter;

      const matchesCourse =

        courseFilter === "all"
          ? true
          : item.courseName ===
            courseFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCourse
      );

    });

  }, [
    data,
    search,
    statusFilter,
    courseFilter,
  ]);

  // =========================================
  // STATS
  // =========================================

  const totalAttendance =
    filteredData.length;

  const totalPresent =
    filteredData.filter(
      (d) => d.status === "Present"
    ).length;

  const totalAbsent =
    filteredData.filter(
      (d) => d.status === "Absent"
    ).length;

  const attendancePercentage =
    totalAttendance > 0
      ? Math.round(
          (totalPresent /
            totalAttendance) *
            100
        )
      : 0;

  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (
      <div className="p-6">
        Loading attendance...
      </div>
    );

  }

  // =========================================
  // UI
  // =========================================

  return (

    <div className="p-6 space-y-6">

      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold">

            Teacher Attendance Dashboard

          </h1>

          <p className="text-muted-foreground mt-1">

            Monitor all attendance records and class activity

          </p>

        </div>

      </div>

      {/* ========================================= */}
      {/* STATS */}
      {/* ========================================= */}

      <div className="grid gap-4 md:grid-cols-4">

        {/* TOTAL */}

        <Card className="border-0 shadow-md">

          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-muted-foreground">
                  Total Records
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  {totalAttendance}
                </h2>

              </div>

              <BarChart3 className="h-10 w-10 text-blue-500" />

            </div>

          </CardContent>

        </Card>

        {/* PRESENT */}

        <Card className="border-0 shadow-md">

          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-muted-foreground">
                  Present
                </p>

                <h2 className="text-3xl font-bold text-green-600 mt-1">
                  {totalPresent}
                </h2>

              </div>

              <CheckCircle2 className="h-10 w-10 text-green-500" />

            </div>

          </CardContent>

        </Card>

        {/* ABSENT */}

        <Card className="border-0 shadow-md">

          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-muted-foreground">
                  Absent
                </p>

                <h2 className="text-3xl font-bold text-red-600 mt-1">
                  {totalAbsent}
                </h2>

              </div>

              <XCircle className="h-10 w-10 text-red-500" />

            </div>

          </CardContent>

        </Card>

        {/* PERCENT */}

        <Card className="border-0 shadow-md">

          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-muted-foreground">
                  Attendance %
                </p>

                <h2 className="text-3xl font-bold text-purple-600 mt-1">
                  {attendancePercentage}%
                </h2>

              </div>

              <UserCheck className="h-10 w-10 text-purple-500" />

            </div>

          </CardContent>

        </Card>

      </div>

      {/* ========================================= */}
      {/* FILTERS */}
      {/* ========================================= */}

      <Card className="border-0 shadow-md">

        <CardContent className="p-5">

          <div className="grid gap-4 md:grid-cols-3">

            {/* SEARCH */}

            <div className="relative">

              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

              <Input
                placeholder="Search student or class..."
                className="pl-9"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>

            {/* STATUS */}

            <Select
              value={statusFilter}
              onValueChange={
                setStatusFilter
              }
            >

              <SelectTrigger>

                <SelectValue placeholder="Status" />

              </SelectTrigger>

              <SelectContent>

                <SelectItem value="all">
                  All Status
                </SelectItem>

                <SelectItem value="Present">
                  Present
                </SelectItem>

                <SelectItem value="Absent">
                  Absent
                </SelectItem>

              </SelectContent>

            </Select>

            {/* COURSE */}

            <Select
              value={courseFilter}
              onValueChange={
                setCourseFilter
              }
            >

              <SelectTrigger>

                <SelectValue placeholder="Course" />

              </SelectTrigger>

              <SelectContent>

                <SelectItem value="all">
                  All Courses
                </SelectItem>

                {courses.map(
                  (
                    course: any,
                    index: number
                  ) => (

                    <SelectItem
                      key={index}
                      value={String(course)}
                    >
                      {course}
                    </SelectItem>

                  )
                )}

              </SelectContent>

            </Select>

          </div>

        </CardContent>

      </Card>

      {/* ========================================= */}
      {/* EMPTY */}
      {/* ========================================= */}

      {filteredData.length === 0 && (

        <Card>

          <CardContent className="p-10 text-center">

            <h2 className="text-xl font-bold">

              No Attendance Records

            </h2>

            <p className="text-muted-foreground mt-2">

              No matching attendance data found

            </p>

          </CardContent>

        </Card>

      )}

      {/* ========================================= */}
      {/* ATTENDANCE LIST */}
      {/* ========================================= */}

      <div className="grid gap-4">

        {filteredData.map((a: any) => (

          <motion.div
            key={a._id}
            whileHover={{
              y: -3,
            }}
          >

            <Card className="border-0 shadow-md hover:shadow-xl transition-all">

              <CardContent className="p-5">

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                  {/* LEFT */}

                  <div>

                    <div className="flex items-center gap-2 flex-wrap">

                      <h2 className="text-lg font-bold">

                        {a.studentName}

                      </h2>

                      <Badge variant="outline">

                        {a.courseName}

                      </Badge>

                    </div>

                    <p className="text-sm text-muted-foreground mt-1">

                      {a.studentEmail}

                    </p>

                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">

                      <div className="flex items-center gap-1">

                        <BookOpen className="h-4 w-4" />

                        {a.classTitle}

                      </div>

                      <div className="flex items-center gap-1">

                        <CalendarDays className="h-4 w-4" />

                        {new Date(
                          a.date
                        ).toLocaleDateString()}

                      </div>

                      <div className="flex items-center gap-1">

                        <Clock3 className="h-4 w-4" />

                        {new Date(
                          a.createdAt
                        ).toLocaleTimeString()}

                      </div>

                    </div>

                  </div>

                  {/* RIGHT */}

                  <Badge
                    className={`px-5 py-2 text-sm ${
                      a.status === "Present"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >

                    <div className="flex items-center gap-1">

                      {a.status ===
                      "Present" ? (

                        <CheckCircle2 className="h-4 w-4" />

                      ) : (

                        <XCircle className="h-4 w-4" />

                      )}

                      {a.status}

                    </div>

                  </Badge>

                </div>

              </CardContent>

            </Card>

          </motion.div>

        ))}

      </div>

    </div>

  );

}