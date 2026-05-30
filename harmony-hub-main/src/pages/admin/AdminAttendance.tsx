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
  User,
  GraduationCap,
  Users,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const API =
  "https://marcylmsdeploy-2.onrender.com/api";

export default function AdminAttendance() {

  // =====================================
  // STATES
  // =====================================

  const [data, setData] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [typeFilter, setTypeFilter] =
    useState("all");

  const [statusFilter, setStatusFilter] =
    useState("all");

  // =====================================
  // FETCH
  // =====================================

  useEffect(() => {

    fetchAttendance();

  }, []);

  const fetchAttendance =
    async () => {

      try {

        const res =
          await axios.get(
            `${API}/admin-attendance`
          );

        setData(res.data || []);

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }

    };

  // =====================================
  // FILTER
  // =====================================

  const filteredData = useMemo(() => {

    return data.filter((item) => {

      const matchesSearch =

        item.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        item.classTitle
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesType =

        typeFilter === "all"
          ? true
          : item.type ===
            typeFilter;

      const matchesStatus =

        statusFilter === "all"
          ? true
          : item.status ===
            statusFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus
      );

    });

  }, [
    data,
    search,
    typeFilter,
    statusFilter,
  ]);

  // =====================================
  // STATS
  // =====================================

  const total =
    filteredData.length;

  const present =
    filteredData.filter(
      (d) => d.status === "Present"
    ).length;

  const absent =
    filteredData.filter(
      (d) => d.status === "Absent"
    ).length;

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

      <div>

        <h1 className="text-3xl font-bold">

          Attendance Dashboard

        </h1>

        <p className="text-muted-foreground mt-1">

          Monitor students and teachers attendance

        </p>

      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-3 gap-4">

        <Card>

          <CardContent className="p-5">

            <div className="text-sm text-muted-foreground">

              Total Records

            </div>

            <div className="text-3xl font-bold mt-1">

              {total}

            </div>

          </CardContent>

        </Card>

        <Card>

          <CardContent className="p-5">

            <div className="text-sm text-muted-foreground">

              Present

            </div>

            <div className="text-3xl font-bold text-green-600 mt-1">

              {present}

            </div>

          </CardContent>

        </Card>

        <Card>

          <CardContent className="p-5">

            <div className="text-sm text-muted-foreground">

              Absent

            </div>

            <div className="text-3xl font-bold text-red-600 mt-1">

              {absent}

            </div>

          </CardContent>

        </Card>

      </div>

      {/* FILTERS */}

      <Card>

        <CardContent className="p-4">

          <div className="grid md:grid-cols-3 gap-4">

            {/* SEARCH */}

            <div className="relative">

              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

              <Input
                placeholder="Search..."
                className="pl-9"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>

            {/* TYPE */}

            <Select
              value={typeFilter}
              onValueChange={
                setTypeFilter
              }
            >

              <SelectTrigger>

                <SelectValue placeholder="Type" />

              </SelectTrigger>

              <SelectContent>

                <SelectItem value="all">

                  All

                </SelectItem>

                <SelectItem value="Student">

                  Students

                </SelectItem>

                <SelectItem value="Teacher">

                  Teachers

                </SelectItem>

              </SelectContent>

            </Select>

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

          </div>

        </CardContent>

      </Card>

      {/* EMPTY */}

      {filteredData.length === 0 && (

        <Card>

          <CardContent className="p-10 text-center">

            No attendance records found

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

                  <div className="flex items-center gap-2 flex-wrap">

                    <h2 className="text-lg font-bold">

                      {a.name}

                    </h2>

                    <Badge variant="outline">

                      {a.type}

                    </Badge>

                  </div>

                  <p className="text-sm text-muted-foreground mt-1">

                    {a.email}

                  </p>

                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">

                    <div className="flex items-center gap-1">

                      {a.type ===
                      "Teacher" ? (

                        <GraduationCap className="h-4 w-4" />

                      ) : (

                        <Users className="h-4 w-4" />

                      )}

                      {a.classTitle}

                    </div>

                    <div className="flex items-center gap-1">

                      <CalendarDays className="h-4 w-4" />

                      {new Date(
                        a.date
                      ).toLocaleDateString()}

                    </div>

                  </div>

                </div>

                {/* RIGHT */}

                <div className="flex flex-col items-end gap-2">

                  <Badge variant="secondary">

                    {a.courseName || a.course?.name || a.course?.title || "No Course"}
                  </Badge>

                  <Badge
                    className={`px-4 py-2 ${
                      a.status ===
                      "Present"
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >

                    {a.status ===
                    "Present" ? (

                      <CheckCircle2 className="h-4 w-4 mr-1" />

                    ) : (

                      <XCircle className="h-4 w-4 mr-1" />

                    )}

                    {a.status}

                  </Badge>

                </div>

              </div>

            </CardContent>

          </Card>

        ))}

      </div>

    </div>

  );

}