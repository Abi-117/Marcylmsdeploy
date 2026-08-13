import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

import {
  Search,
  Filter,
  CalendarDays,
  Users,
  CheckCircle2,
  XCircle,
  BarChart3,
} from "lucide-react";

import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API =
  "https://marcylmsdeploy-2.onrender.com/api";

export default function TeacherAttendance() {
  // =====================================
  // STATES
  // =====================================

  const [data, setData] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  // =====================================
  // FETCH ATTENDANCE
  // =====================================

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(
        `${API}/attendance/all`
      );

      setData(res.data || []);
    } catch (err) {
      console.log(
        "Attendance fetch error:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // FILTERED DATA
  // =====================================

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const searchText =
        search.toLowerCase();

      const matchesSearch =
        item.studentName
          ?.toLowerCase()
          .includes(searchText) ||
        item.classTitle
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "all"
          ? true
          : item.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    data,
    search,
    statusFilter,
  ]);

  // =====================================
  // STATS
  // =====================================

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

      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Attendance Dashboard
          </h1>

          <p className="text-muted-foreground mt-1">
            Monitor all student attendance records
          </p>
        </div>

      </div>

      {/* ===================================== */}
      {/* STATS */}
      {/* ===================================== */}

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

        {/* PERCENTAGE */}

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

              <Users className="h-10 w-10 text-purple-500" />
            </div>

          </CardContent>
        </Card>

      </div>

      {/* ===================================== */}
      {/* FILTERS */}
      {/* ===================================== */}

      <Card className="shadow-md border-0">

        <CardContent className="p-5">

          <div className="grid gap-4 md:grid-cols-2">

            {/* SEARCH */}

            <div className="relative">

              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

              <Input
                placeholder="Search student or class..."
                className="pl-9"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            {/* STATUS */}

            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >

              <SelectTrigger>

                <Filter className="mr-2 h-4 w-4" />

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

          </div>

        </CardContent>

      </Card>

      {/* ===================================== */}
      {/* EMPTY */}
      {/* ===================================== */}

      {filteredData.length === 0 && (

        <Card>

          <CardContent className="p-10 text-center">

            <h2 className="text-xl font-bold">
              No Attendance Found
            </h2>

            <p className="text-muted-foreground mt-2">
              Try changing filters
            </p>

          </CardContent>

        </Card>

      )}

      {/* ===================================== */}
      {/* ATTENDANCE LIST */}
      {/* ===================================== */}

      <div className="grid gap-4">

        {filteredData.map((a) => (

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

                    <h2 className="text-lg font-bold">
                      {a.studentName}
                    </h2>

                    <p className="text-sm text-muted-foreground mt-1">
                      {a.studentEmail}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">

                      {/* CLASS */}

                      <div className="flex items-center gap-1">

                        <Users className="h-4 w-4" />

                        {a.classTitle}

                      </div>

                      {/* DATE */}

                      <div className="flex items-center gap-1">

                        <CalendarDays className="h-4 w-4" />

                        {a.date
                          ? new Date(
                              a.date
                            ).toLocaleDateString()
                          : "No Date"}

                      </div>

                    </div>

                  </div>

                  {/* RIGHT - STATUS */}

                  <Badge
                    className={`px-5 py-2 text-sm ${
                      a.status === "Present"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >

                    <div className="flex items-center gap-1">

                      {a.status === "Present" ? (
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