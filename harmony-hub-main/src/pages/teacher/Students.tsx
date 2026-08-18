import { useEffect, useState } from "react";
import axios from "axios";

import {
  PageHeader,
  LevelBadge,
} from "@/components/dashboard/Primitives";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import { Progress } from "@/components/ui/progress";

import { useAuth } from "@/store/auth";

const API =
  "https://marcylmsdeploy-2.onrender.com/api";

export default function TeacherStudents() {
  const { user } = useAuth();

  const teacherId =
    user?.id || user?._id;

  const [students, setStudents] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [completingId, setCompletingId] =
    useState<string | null>(null);

  const [statusFilter, setStatusFilter] =
    useState<"all" | "paid" | "pending">(
      "all"
    );

  // =====================================================
  // FETCH STUDENTS
  // =====================================================

  useEffect(() => {
    if (!teacherId) return;

    fetchStudents();
  }, [teacherId, statusFilter]);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API}/student/teacher/${teacherId}?status=${statusFilter}`
      );

      console.log(
        "TEACHER STUDENTS:",
        res.data
      );

      setStudents(
        Array.isArray(res.data)
          ? res.data
          : res.data?.students || []
      );
    } catch (err: any) {
      console.log(
        "FETCH STUDENTS ERROR:",
        err.response?.data || err
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GET CURRENT GRADE
  // =====================================================

const getCurrentGrade = (student: any) => {
  if (
    Array.isArray(student?.levelHistory) &&
    student.levelHistory.length > 0
  ) {
    const latestHistory =
      student.levelHistory[
        student.levelHistory.length - 1
      ];

    if (latestHistory?.grade) {
      return latestHistory.grade;
    }
  }

  // Fallback only if levelHistory is unavailable
  if (student?.course?.grade) {
    return student.course.grade;
  }

  if (student?.grade) {
    return student.grade;
  }

  return "Not Assigned";
};

  // =====================================================
  // GET CURRENT LEVEL
  // =====================================================

  const getCurrentLevel = (student: any) => {
    // level field is the Main Level
    if (student?.level) {
      return student.level;
    }

    // Current course mainLevel
    if (student?.course?.mainLevel) {
      return student.course.mainLevel;
    }

    // Payment course mainLevel
    if (
      Array.isArray(student?.payments) &&
      student.payments.length > 0
    ) {
      const latestPayment =
        student.payments[
          student.payments.length - 1
        ];

      if (
        latestPayment?.course?.mainLevel
      ) {
        return latestPayment.course.mainLevel;
      }
    }

    return "Not Assigned";
  };

  // =====================================================
  // GET CURRENT COURSE NAME
  // =====================================================

  const getCurrentCourseName = (
    student: any
  ) => {
    if (student?.course?.name) {
      return student.course.name;
    }

    if (
      Array.isArray(student?.payments) &&
      student.payments.length > 0
    ) {
      const latestPayment =
        student.payments[
          student.payments.length - 1
        ];

      if (
        latestPayment?.course?.name
      ) {
        return latestPayment.course.name;
      }
    }

    return "Course not assigned";
  };

  // =====================================================
  // GET LATEST PAYMENT
  // =====================================================

  const getLatestPayment = (
    student: any
  ) => {
    if (
      !Array.isArray(student?.payments) ||
      student.payments.length === 0
    ) {
      return null;
    }

    return student.payments[
      student.payments.length - 1
    ];
  };

  // =====================================================
  // UPDATE PROGRESS
  // =====================================================

  const updateProgress = async (
    studentId: string,
    progress: number
  ) => {
    try {
      await axios.put(
        `${API}/student/progress/${studentId}`,
        {
          progress,
        }
      );

      await fetchStudents();
    } catch (err: any) {
      console.log(
        "UPDATE PROGRESS ERROR:",
        err.response?.data || err
      );

      alert(
        err.response?.data?.message ||
          "Failed to update progress"
      );
    }
  };

  // =====================================================
  // COMPLETE LEVEL
  // =====================================================

  const completeLevel = async (
    student: any
  ) => {
    try {
      setCompletingId(
        student._id
      );

      const currentGrade =
        getCurrentGrade(student);

      const currentLevel =
        getCurrentLevel(student);

      console.log(
        "COMPLETE LEVEL REQUEST:",
        {
          studentId: student._id,
          currentGrade,
          currentLevel,
          course: student.course,
          levelHistory:
            student.levelHistory,
          batch: student.batch,
        }
      );

      if (
        !currentGrade ||
        currentGrade === "Not Assigned"
      ) {
        alert(
          "Current grade is not assigned."
        );
        return;
      }

      const res = await axios.put(
        `${API}/student/complete-level/${student._id}`,
        {
          grade: currentGrade,
          level: currentLevel,
        }
      );

      console.log(
        "LEVEL COMPLETED:",
        res.data
      );

      alert(
        `Level completed successfully.\nGrade: ${currentGrade}`
      );

      await fetchStudents();
    } catch (err: any) {
      console.log(
        "COMPLETE LEVEL ERROR:",
        err.response?.data || err
      );

      alert(
        err.response?.data?.message ||
          "Failed to complete level"
      );
    } finally {
      setCompletingId(null);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="p-6">
        Loading students...
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div>
      <PageHeader
        title="My Students"
        subtitle="Filter by payment status"
      />

      {/* ================================================= */}
      {/* FILTERS */}
      {/* ================================================= */}

      <div className="mb-4 flex gap-2">
        {(
          [
            "all",
            "paid",
            "pending",
          ] as const
        ).map((status) => (
          <Button
            key={status}
            variant={
              statusFilter === status
                ? "default"
                : "outline"
            }
            onClick={() =>
              setStatusFilter(status)
            }
          >
            {status}
          </Button>
        ))}
      </div>

      {/* ================================================= */}
      {/* STUDENTS */}
      {/* ================================================= */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {students.length === 0 && (
          <div className="text-muted-foreground p-6">
            No students found
          </div>
        )}

        {students.map((student) => {
          const activePayment =
            getLatestPayment(student);

          const currentGrade =
            getCurrentGrade(student);

          const currentLevel =
            getCurrentLevel(student);

          const courseName =
            getCurrentCourseName(student);

          const progress =
            Number(student.progress) || 0;

          return (
            <Card
              key={student._id}
            >
              <CardContent className="p-5">

                {/* ================================================= */}
                {/* TOP */}
                {/* ================================================= */}

                <div className="flex items-start gap-3">

                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {student.name
                        ?.slice(0, 2)
                        ?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">

                    <div className="font-bold">
                      {student.name}
                    </div>

                    <div className="text-xs text-muted-foreground break-all">
                      {student.email}
                    </div>

                  </div>

                  <LevelBadge
                    level={
                      currentLevel
                    }
                  />

                </div>

                {/* ================================================= */}
                {/* CURRENT GRADE BADGE */}
                {/* ================================================= */}

                <div className="mt-3">
                  <span className="inline-flex rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold text-gold-foreground">
                    Grade:{" "}
                    {currentGrade}
                  </span>
                </div>

                {/* ================================================= */}
                {/* DETAILS */}
                {/* ================================================= */}

                <div className="mt-4 space-y-2 text-sm">

                  <div>
                    <span className="font-medium">
                      Course:
                    </span>{" "}
                    {courseName}
                  </div>

                  <div>
                    <span className="font-medium">
                      Level:
                    </span>{" "}
                    {currentLevel}
                  </div>

                  <div>
                    <span className="font-medium">
                      Grade:
                    </span>{" "}
                    {currentGrade}
                  </div>

                  <div>
                    <span className="font-medium">
                      Phone:
                    </span>{" "}
                    {student.phone ||
                      "Not provided"}
                  </div>

                  <div>
                    <span className="font-medium">
                      Payment:
                    </span>{" "}

                    <span
                      className={
                        student.paymentStatus ===
                        "Paid"
                          ? "text-green-600 font-semibold"
                          : "text-red-500 font-semibold"
                      }
                    >
                      {student.paymentStatus ||
                        "Pending"}
                    </span>
                  </div>

                </div>

                {/* ================================================= */}
                {/* CLASS TYPE */}
                {/* ================================================= */}

                <div className="mt-3 flex flex-wrap gap-2">

                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      student.classType ===
                      "Group"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {student.classType ===
                    "Group"
                      ? "👥 Group Student"
                      : "👤 Individual Student"}
                  </span>

                  {student.classType ===
                    "Group" &&
                    student.groupName && (
                      <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
                        {
                          student.groupName
                        }
                      </span>
                    )}

                </div>

                {/* ================================================= */}
                {/* CURRENT LEVEL */}
                {/* ================================================= */}

                <div className="mt-5 rounded-lg border bg-muted/30 p-4">

                  <div className="text-xs font-semibold text-muted-foreground">
                    Current Level
                  </div>

                  <div className="mt-2">

                    <div className="text-lg font-bold">
                      {currentLevel}
                    </div>

                    <div className="mt-1 text-sm font-medium">
                      Grade:{" "}
                      {currentGrade}
                    </div>

                    <div className="mt-1 text-sm text-muted-foreground">
                      {courseName}
                    </div>

                  </div>

                </div>

                {/* ================================================= */}
                {/* LEVEL HISTORY */}
                {/* ================================================= */}

                <div className="mt-4">

                  <div className="text-xs font-semibold text-muted-foreground">
                    Level History
                  </div>

                  <div className="mt-2 space-y-2">

                    {Array.isArray(
                      student.levelHistory
                    ) &&
                    student.levelHistory.length >
                      0 ? (

                      student.levelHistory
                        .slice()
                        .reverse()
                        .map(
                          (
                            history: any,
                            index: number
                          ) => (
                            <div
                              key={
                                history._id ||
                                `${history.grade}-${index}`
                              }
                              className="flex items-center justify-between rounded-md border px-3 py-2"
                            >

                              <div>
                                <div className="text-sm font-medium">
                                  {
                                    history.grade
                                  }
                                </div>

                                {history.course
                                  ?.name && (
                                  <div className="text-xs text-muted-foreground">
                                    {
                                      history
                                        .course
                                        .name
                                    }
                                  </div>
                                )}
                              </div>

                              <span className="text-xs font-semibold text-green-600">
                                ✓ Paid
                              </span>

                            </div>
                          )
                        )

                    ) : (

                      <div className="text-xs text-muted-foreground">
                        No level history
                      </div>

                    )}

                  </div>

                </div>

                {/* ================================================= */}
                {/* COMPLETED LEVELS */}
                {/* ================================================= */}

                <div className="mt-4">

                  <div className="text-xs font-semibold text-muted-foreground">
                    Completed Levels
                  </div>

                  <div className="mt-2 space-y-2">

                    {Array.isArray(
                      student.completedLevels
                    ) &&
                    student.completedLevels
                      .length > 0 ? (

                      student.completedLevels.map(
                        (
                          level: string,
                          index: number
                        ) => (
                          <div
                            key={`${level}-${index}`}
                            className="flex items-center justify-between rounded-md border px-3 py-2"
                          >

                            <span className="text-sm font-medium">
                              {level}
                            </span>

                            <span className="text-xs font-semibold text-green-600">
                              ✔ Completed
                            </span>

                          </div>
                        )
                      )

                    ) : (

                      <div className="text-xs text-muted-foreground">
                        No levels completed yet
                      </div>

                    )}

                  </div>

                </div>

                {/* ================================================= */}
                {/* PROGRESS */}
                {/* ================================================= */}

                <div className="mt-5">

                  <div className="flex justify-between text-xs">

                    <span>
                      Progress
                    </span>

                    <span>
                      {progress}%
                    </span>

                  </div>

                  <Progress
                    value={progress}
                    className="mt-2 h-2"
                  />

                </div>

                {/* ================================================= */}
                {/* BUTTONS */}
                {/* ================================================= */}

                <div className="mt-5 space-y-2">

                  {/* EVALUATE */}

                  <Button
                    className="w-full bg-gold text-black"
                    disabled={
                      progress >= 100
                    }
                    onClick={() =>
                      updateProgress(
                        student._id,
                        Math.min(
                          progress + 10,
                          100
                        )
                      )
                    }
                  >
                    {progress >= 100
                      ? "Evaluation Complete"
                      : "Evaluate +10%"}
                  </Button>

                  {/* COMPLETE LEVEL */}

                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={
                      progress < 100 ||
                      completingId ===
                        student._id
                    }
                    onClick={() =>
                      completeLevel(
                        student
                      )
                    }
                  >
                    {completingId ===
                    student._id
                      ? "Completing..."
                      : "Complete Current Level"}
                  </Button>

                </div>

              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}