import { useEffect, useState } from "react";

import {
  Search,
  Filter,
  Plus,
  X,
} from "lucide-react";

import {
  PageHeader,
  LevelBadge,
} from "@/components/dashboard/Primitives";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

function AdminStudents() {

  const [students, setStudents] =
    useState<any[]>([]);

  const [courses, setCourses] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState("");

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [selectedStudent, setSelectedStudent] =
    useState<any>(null);

  const [viewOpen, setViewOpen] =
    useState(false);

  const [filterCourse, setFilterCourse] =
    useState("");

  const [formData, setFormData] =
  useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    level: "",
    batch: "",
    classType: "Individual",
    groupName: "",
  });

  // =========================
  // FETCH STUDENTS
  // =========================

  const fetchStudents = async () => {

    try {

      setLoading(true);

      const response = await fetch(
        "https://marcylmsdeploy-2.onrender.com/api/admin/students"
      );

      const data =
        await response.json();

      console.log(data);

      if (Array.isArray(data)) {

        setStudents(data);

      } else {

        setStudents([]);

      }

    } catch (error) {

      console.log(error);

      setStudents([]);

    } finally {

      setLoading(false);

    }
  };

  // =========================
  // FETCH COURSES
  // =========================

  const fetchCourses = async () => {

    try {

      const response = await fetch(
        "https://marcylmsdeploy-2.onrender.com/api/courses"
      );

      const data =
        await response.json();

      setCourses(data);

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {

    fetchStudents();

    fetchCourses();

  }, []);

  // =========================
  // ADD STUDENT
  // =========================

  const addStudent = async () => {

    try {

      if (
        !formData.name ||
        !formData.email ||
        !formData.phone
      ) {

        alert(
          "Fill all required fields"
        );

        return;
      }

      const response = await fetch(
        "https://marcylmsdeploy-2.onrender.com/api/admin/students",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
  ...formData,
  role: "student",

  // Keep current level in both fields
  level: formData.level,
  selectedLevel: formData.level,

  // Group data
  classType: formData.classType,
  groupName:
    formData.classType === "Group"
      ? formData.groupName
      : "",
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
        "Student Added Successfully"
      );

      setOpen(false);

      setFormData({
  name: "",
  email: "",
  phone: "",
  course: "",
  level: "",
  batch: "",
  classType: "Individual",
  groupName: "",
});

      fetchStudents();

    } catch (error) {

      console.log(error);

      alert("Something went wrong");

    }
  };

  // =========================
  // GET COURSE NAME
  // =========================

  const getCourseName = (student: any) => {

    // if populated object
    if (
      student?.course &&
      typeof student.course === "object"
    ) {
      return student.course.name;
    }

    // if string id, look up name from courses
    if (
      typeof student?.course === "string"
    ) {
      const match = courses.find(
        (c: any) => String(c._id) === student.course
      );
      return match?.name || "-";
    }

    return "-";
  };

  // =========================
  // FILTER STUDENTS
  // =========================

  const filteredStudents =
    students.filter((s) => {

      const query =
        search.toLowerCase();

      const courseName =
        getCourseName(s)
          ?.toLowerCase();

      const matchesSearch =

        s?.name
          ?.toLowerCase()
          ?.includes(query) ||

        s?.email
          ?.toLowerCase()
          ?.includes(query) ||

        s?.phone
          ?.toLowerCase()
          ?.includes(query) ||

        s?.batch
          ?.toLowerCase()
          ?.includes(query) ||

        s?.level
          ?.toLowerCase()
          ?.includes(query) ||

        courseName?.includes(query);

      const matchesCourse =
        filterCourse === ""
          ? true
          : courseName ===
            filterCourse.toLowerCase();

      return (
        matchesSearch &&
        matchesCourse
      );
    });

  return (
    <div>

      {/* HEADER */}

      <PageHeader
        title="Students"
        subtitle={`${students.length}+ active learners`}
        actions={
          <>
            {/* FILTER */}

            <select
              value={filterCourse}
              onChange={(e) =>
                setFilterCourse(
                  e.target.value
                )
              }
              className="h-9 rounded-md border px-3 text-sm"
            >

              <option value="">
                All Courses
              </option>

              {[
                ...new Set(
                  students.map((s) =>
                    getCourseName(s)
                  )
                ),
              ].map((course: any) => (

                <option
                  key={course}
                  value={course}
                >
                  {course}
                </option>

              ))}

            </select>

            <Button
              size="sm"
              className="bg-gold text-gold-foreground hover:bg-gold/90"
              onClick={() =>
                setOpen(true)
              }
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />

              Add Student
            </Button>

          </>
        }
      />

      {/* ========================= */}
      {/* ADD STUDENT MODAL */}
      {/* ========================= */}

      {open && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-5 flex items-center justify-between">

              <h2 className="text-xl font-semibold">
                Add Offline Student
              </h2>

              <button
                onClick={() =>
                  setOpen(false)
                }
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            <div className="grid gap-4">

              <Input
                placeholder="Student Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name:
                      e.target.value,
                  })
                }
              />

              <Input
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email:
                      e.target.value,
                  })
                }
              />

              <Input
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone:
                      e.target.value,
                  })
                }
              />

              {/* COURSE */}

              <select
                value={formData.course}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    course:
                      e.target.value,
                    level: "",
                    batch: "",
                  })
                }
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >

                <option value="">
                  Select Course
                </option>

                {[
                  ...new Map(
                    courses.map(
                      (c: any) => [
                        c.name,
                        c,
                      ]
                    )
                  ).values(),
                ].map(
                  (course: any) => (

                    <option
                      key={course._id}
                      value={course.name}
                    >
                      {course.name}
                    </option>

                  )
                )}

              </select>

              {/* LEVEL */}

              <select
                value={formData.level}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    level:
                      e.target.value,
                    batch: "",
                  })
                }
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >

                <option value="">
                  Select Level
                </option>

                {[
                  ...new Set(
                    courses
                      .filter(
                        (c: any) =>
                          c.name ===
                          formData.course
                      )
                      .map(
                        (c: any) =>
                          c.mainLevel
                      )
                  ),
                ].map(
                  (level: any) => (

                    <option
                      key={level}
                      value={level}
                    >
                      {level}
                    </option>

                  )
                )}

              </select>

              {/* GRADE */}

              <select
                value={formData.batch}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    batch:
                      e.target.value,
                  })
                }
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >

                <option value="">
                  Select Grade
                </option>

                {courses
                  .filter(
                    (c: any) =>
                      c.name ===
                        formData.course &&
                      c.mainLevel ===
                        formData.level
                  )
                  .map((c: any) => (

                    <option
                      key={c._id}
                      value={c.grade}
                    >
                      {c.grade}
                    </option>

                  ))}

              </select>
              {/* CLASS TYPE */}

<select
  value={formData.classType}
  onChange={(e) =>
    setFormData({
      ...formData,
      classType: e.target.value,
      groupName:
        e.target.value === "Individual"
          ? ""
          : formData.groupName,
    })
  }
  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
>
  <option value="Individual">
    Individual
  </option>

  <option value="Group">
    Group
  </option>
</select>

{/* GROUP NAME */}

{formData.classType === "Group" && (
  <Input
    placeholder="Group Name"
    value={formData.groupName}
    onChange={(e) =>
      setFormData({
        ...formData,
        groupName: e.target.value,
      })
    }
  />
)}

              <Button
                onClick={addStudent}
                className="bg-gold text-gold-foreground hover:bg-gold/90"
              >
                Save Student
              </Button>

            </div>
          </div>
        </div>
      )}

      {/* ========================= */}
      {/* TABLE */}
      {/* ========================= */}

      <Card>

        <CardContent className="p-0">

          {/* SEARCH */}

          <div className="border-b border-border p-4">

            <div className="relative max-w-sm">

              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                placeholder="Search students..."
                className="pl-9"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>
          </div>

          {/* TABLE */}

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="border-b border-border bg-muted/30 text-left text-xs uppercase tracking-wider text-muted-foreground">

                <tr>

                  <th className="px-5 py-3">
                    Student
                  </th>

                  <th className="px-5 py-3">
                    Course
                  </th>

                  <th className="px-5 py-3">
                    Level
                  </th>

                  <th className="px-5 py-3">
                    Grade
                  </th>
                  <th className="px-5 py-3">
  Type
</th>

<th className="px-5 py-3">
  Group
</th>

                  <th className="px-5 py-3">
                    Phone
                  </th>

                  <th className="px-5 py-3 text-right">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan={8}
                      className="px-5 py-10 text-center text-muted-foreground"
                    >
                      Loading students...
                    </td>

                  </tr>

                ) : filteredStudents.length === 0 ? (

                  <tr>

                    <td
                      colSpan={8}
                      className="px-5 py-10 text-center text-muted-foreground"
                    >
                      No students found
                    </td>

                  </tr>

                ) : (

                  filteredStudents.map(
                    (s) => (

                      <tr
                        key={s._id}
                        className="border-b border-border last:border-0 transition-colors hover:bg-muted/30"
                      >

                        {/* STUDENT */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

<Avatar className="h-10 w-10">
  {s?.profileImage ? (
    <img
      src={s.profileImage}
      alt={s.name}
      className="h-full w-full rounded-full object-cover"
    />
  ) : (
    <AvatarFallback className="bg-gold-soft text-xs">
      {s?.name
        ?.split(" ")
        ?.map((p: string) => p[0])
        ?.join("")}
    </AvatarFallback>
  )}
</Avatar>

                            <div>

                              <div className="font-medium">
                                {s.name}
                              </div>

                              <div className="text-xs text-muted-foreground">
                                {s.email}
                              </div>

                            </div>

                          </div>
                        </td>

                        {/* COURSE */}

                        <td className="px-5 py-4">
                          {getCourseName(s)}
                        </td>

                        {/* LEVEL */}

                        <td className="px-5 py-4">

                          {s.level ? (
                            <LevelBadge
                              level={s.level}
                            />
                          ) : (
                            "-"
                          )}

                        </td>

                        {/* GRADE */}

                        <td className="px-5 py-4 text-muted-foreground">
                          {s.batch || "-"}
                        </td>
                        {/* CLASS TYPE */}

<td className="px-5 py-4">
  <span
    className={`rounded-full px-3 py-1 text-xs font-semibold ${
      s.classType === "Group"
        ? "bg-blue-100 text-blue-700"
        : "bg-green-100 text-green-700"
    }`}
  >
    {s.classType || "Individual"}
  </span>
</td>

{/* GROUP */}

<td className="px-5 py-4">
  {s.classType === "Group"
    ? s.groupName || "-"
    : "-"}
</td>

                        {/* PHONE */}

                        <td className="px-5 py-4 text-muted-foreground">
                          {s.phone || "-"}
                        </td>

                        {/* ACTION */}

                        <td className="px-5 py-4 text-right">

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {

                              setSelectedStudent(s);

                              setViewOpen(true);

                            }}
                          >
                            View
                          </Button>

                        </td>

                      </tr>
                    )
                  )
                )}

              </tbody>

            </table>
          </div>
        </CardContent>
      </Card>

     {/* ========================= */}
{/* VIEW MODAL */}
{/* ========================= */}

{viewOpen && selectedStudent && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
    
    <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-8 shadow-xl">

      {/* HEADER */}
      <div className="sticky top-0 z-10 mb-6 flex items-center justify-between border-b bg-white pb-4">

  <h2 className="text-2xl font-semibold">
    Student Details
  </h2>

  <button
    onClick={() => setViewOpen(false)}
    className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
  >
    <X className="h-5 w-5" />
  </button>

</div>
      {/* PROFILE */}
      <div className="mb-6 flex items-center gap-5 border-b pb-5">

        <Avatar className="h-24 w-24">
          {selectedStudent?.profileImage ? (
            <img
              src={selectedStudent.profileImage}
              alt={selectedStudent.name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <AvatarFallback className="bg-gold-soft text-lg">
              {selectedStudent?.name
                ?.split(" ")
                ?.map((p: string) => p[0])
                ?.join("")}
            </AvatarFallback>
          )}
        </Avatar>

        <div>
          <h3 className="text-xl font-semibold">
            {selectedStudent.name}
          </h3>

          <p className="text-sm text-muted-foreground">
            {selectedStudent.email}
          </p>
        </div>
      </div>

      {/* DETAILS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

        <div>
          <p className="text-xs text-muted-foreground">Phone Number</p>
          <p className="font-medium">
            {selectedStudent.phone || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Course</p>
          <p className="font-medium">
            {getCourseName(selectedStudent)}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Level</p>
          <p className="font-medium">
            {selectedStudent.level || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Grade</p>
          <p className="font-medium">
            {selectedStudent.batch || "-"}
          </p>
        </div>
        <div>
  <p className="text-xs text-muted-foreground">
    Student Type
  </p>

  <p className="font-medium">
    {selectedStudent.classType || "Individual"}
  </p>
</div>

<div>
  <p className="text-xs text-muted-foreground">
    Group Name
  </p>

  <p className="font-medium">
    {selectedStudent.classType === "Group"
      ? selectedStudent.groupName || "-"
      : "-"}
  </p>
</div>

        <div>
          <p className="text-xs text-muted-foreground">Parent Name</p>
          <p className="font-medium">
            {selectedStudent.parentName || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Address</p>
          <p className="font-medium">
            {selectedStudent.address || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Role</p>
          <p className="font-medium capitalize">
            {selectedStudent.role || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Payment Status</p>
          <p className="font-medium">
            {selectedStudent.payment?.status || "Pending"}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Fees Paid</p>
          <p className="font-medium">
            ₹{selectedStudent.feesPaid?.toLocaleString() || 0}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Remaining Fees</p>
          <p className="font-medium">
            ₹{selectedStudent.remainingFees || 0}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Learning Mode</p>
          <p className="font-medium">
            {selectedStudent.mode || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">From Time</p>
          <p className="font-medium">
            {selectedStudent.fromTime || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">To Time</p>
          <p className="font-medium">
            {selectedStudent.toTime || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Available Days</p>
          <p className="font-medium">
            {selectedStudent.availableDays?.join(", ") || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Current Level</p>
          <p className="font-medium">
            {selectedStudent.selectedLevel || selectedStudent.level || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Unlocked Levels</p>
          <p className="font-medium">
            {selectedStudent.unlockedLevels?.join(", ") || "-"}
          </p>
        </div>
<div>
  <p className="text-xs text-muted-foreground">
    Completed Levels
  </p>

  <div className="flex flex-wrap gap-2 mt-1">
    {Array.isArray(selectedStudent.completedLevels) &&
    selectedStudent.completedLevels.length > 0 ? (
      selectedStudent.completedLevels.map(
        (level: string, index: number) => (
          <span
            key={`${level}-${index}`}
            className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
          >
            {level}
          </span>
        )
      )
    ) : (
      <span className="text-sm">
        -
      </span>
    )}
  </div>
</div>

        <div>
          <p className="text-xs text-muted-foreground">Total Payments</p>
          <p className="font-medium">
            {selectedStudent.totalPayments || 0}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Last Payment</p>
         <p className="font-medium">
  ₹{selectedStudent.lastPayment?.amount || 0}
</p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Joined Date</p>
          <p className="font-medium">
            {selectedStudent.createdAt
              ? new Date(selectedStudent.createdAt).toLocaleDateString()
              : "-"}
          </p>
        </div>

      </div>

    </div>
  </div>
)}

    </div>
  );
}

export default AdminStudents;