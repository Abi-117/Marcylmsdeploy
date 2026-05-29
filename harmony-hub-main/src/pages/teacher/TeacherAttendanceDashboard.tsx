import { useEffect, useMemo, useState } from "react";

import axios from "axios";

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
  Search,
  CalendarDays,
  BookOpen,
  CheckCircle2,
  BarChart3,
} from "lucide-react";

const API =
  "https://marcylmsdeploy-2.onrender.com/api";

export default function TeacherMyAttendance() {

  // =====================================
  // USER
  // =====================================

  const user = JSON.parse(
    localStorage.getItem("ms-auth") || "{}"
  )?.state?.user;

  const teacherId = user?.id;

  // =====================================
  // STATES
  // =====================================

  const [data, setData] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [courseFilter, setCourseFilter] =
    useState("all");

  // =====================================
  // FETCH
  // =====================================

  useEffect(() => {

    if (!teacherId) return;

    fetchData();

  }, [teacherId]);

  const fetchData =
    async () => {

      try {

        setLoading(true);

        const res =
          await axios.get(
            `${API}/teacher-attendance/${teacherId}`
          );

        console.log(
          "Teacher Attendance:",
          res.data
        );

        setData(res.data || []);

      } catch (err) {

        console.log(
          "Teacher Attendance Error:",
          err
        );

      } finally {

        setLoading(false);

      }

    };

  // =====================================
  // COURSES
  // =====================================

  const courses = useMemo(() => {

    return [
      ...new Set(
        data
          .map((d) => d.courseName)
          .filter(Boolean)
      ),
    ];

  }, [data]);

  // =====================================
  // FILTERED DATA
  // =====================================

  const filteredData = useMemo(() => {

    return data.filter((item) => {

      const matchesSearch =

        item.classTitle
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        item.courseName
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesCourse =

        courseFilter === "all"
          ? true
          : item.courseName ===
            courseFilter;

      return (
        matchesSearch &&
        matchesCourse
      );

    });

  }, [
    data,
    search,
    courseFilter,
  ]);

  // =====================================
  // STATS
  // =====================================

  const totalClasses =
    filteredData.length;

  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (
      <div className="p-6">
        Loading attendance...
      </div>
    );

  }

  // =====================================
  // UI
  // =====================================

  return (

    <div className="p-6 space-y-6">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">

            My Attendance

          </h1>

          <p className="text-muted-foreground mt-1">

            Track completed classes attendance

          </p>

        </div>

      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-3 gap-4">

        <Card>

          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-muted-foreground">

                  Completed Classes

                </p>

                <h2 className="text-3xl font-bold mt-1">

                  {totalClasses}

                </h2>

              </div>

              <BarChart3 className="h-10 w-10 text-blue-500" />

            </div>

          </CardContent>

        </Card>

      </div>

      {/* FILTERS */}

      <Card>

        <CardContent className="p-4">

          <div className="grid md:grid-cols-2 gap-4">

            {/* SEARCH */}

            <div className="relative">

              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

              <Input
                placeholder="Search class..."
                className="pl-9"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>

            {/* COURSE FILTER */}

            <Select
              value={courseFilter}
              onValueChange={
                setCourseFilter
              }
            >

              <SelectTrigger>

                <BookOpen className="mr-2 h-4 w-4" />

                <SelectValue placeholder="Course" />

              </SelectTrigger>

              <SelectContent>

                <SelectItem value="all">

                  All Courses

                </SelectItem>

                {courses.map((c) => (

                  <SelectItem
                    key={c}
                    value={c}
                  >

                    {c}

                  </SelectItem>

                ))}

              </SelectContent>

            </Select>

          </div>

        </CardContent>

      </Card>

      {/* EMPTY */}

      {filteredData.length === 0 && (

        <Card>

          <CardContent className="p-10 text-center">

            <h2 className="text-xl font-bold">

              No Attendance Found

            </h2>

            <p className="text-muted-foreground mt-2">

              Complete a class to generate attendance

            </p>

          </CardContent>

        </Card>

      )}

      {/* LIST */}

      <div className="grid gap-4">

        {filteredData.map((a) => (

          <Card
            key={a._id}
            className="hover:shadow-lg transition-all"
          >

            <CardContent className="p-5">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                {/* LEFT */}

                <div>

                  <h2 className="text-lg font-bold">

                    {a.classTitle}

                  </h2>

                  <p className="text-sm text-muted-foreground mt-1">

                    {a.courseName}

                  </p>

                  <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">

                    <CalendarDays className="h-4 w-4" />

                    {new Date(
                      a.date
                    ).toLocaleDateString()}

                  </div>

                </div>

                {/* STATUS */}

                <Badge className="bg-green-600 text-white px-4 py-2">

                  <CheckCircle2 className="h-4 w-4 mr-1" />

                  {a.status}

                </Badge>

              </div>

            </CardContent>

          </Card>

        ))}

      </div>

    </div>

  );

}