import { useEffect, useState } from "react";

import { PageHeader } from "@/components/dashboard/Primitives";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Badge } from "@/components/ui/badge";

import {
  Music,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

function AdminCourses() {

  const [courses, setCourses] =
    useState<any[]>([]);

  const [editId, setEditId] =
    useState("");

  const [isEdit, setIsEdit] =
    useState(false);

  const [data, setData] = useState({

    name: "",

    category: "Western Music",

    mainLevel: "Basic",

    grade: "Initial",

    fee: "",

    description: "",
  });

  // ====================================
  // GET COURSES
  // ====================================

  const fetchCourses = async () => {

    try {

      const response = await fetch(
        "https://marcylmsdeploy.onrender.com/api/courses"
      );

      const result =
        await response.json();

      setCourses(result);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchCourses();

  }, []);

  // ====================================
  // CREATE COURSE
  // ====================================

  const createCourse = async () => {

    try {

      const response = await fetch(
        "https://marcylmsdeploy.onrender.com/api/courses",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            ...data,
            fee: Number(data.fee),
          }),
        }
      );

      const result =
        await response.json();

      console.log(result);

      alert("Course Added");

      setData({
        name: "",
        category: "Western Music",
        mainLevel: "Basic",
        grade: "Initial",
        fee: "",
        description: "",
      });

      fetchCourses();

    } catch (error) {

      console.log(error);

    }

  };

  // ====================================
  // UPDATE COURSE
  // ====================================

  const updateCourse = async () => {

    try {

      const response = await fetch(
        `https://marcylmsdeploy.onrender.com/api/courses/${editId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            ...data,
            fee: Number(data.fee),
          }),
        }
      );

      const result =
        await response.json();

      console.log(result);

      alert("Course Updated");

      setIsEdit(false);

      setEditId("");

      setData({
        name: "",
        category: "Western Music",
        mainLevel: "Basic",
        grade: "Initial",
        fee: "",
        description: "",
      });

      fetchCourses();

    } catch (error) {

      console.log(error);

    }

  };

  // ====================================
  // DELETE COURSE
  // ====================================

  const deleteCourse = async (
    id: string
  ) => {

    const ok = confirm(
      "Delete this course?"
    );

    if (!ok) return;

    try {

      await fetch(
        `https://marcylmsdeploy.onrender.com/api/courses/${id}`,
        {
          method: "DELETE",
        }
      );

      alert("Deleted");

      fetchCourses();

    } catch (error) {

      console.log(error);

    }

  };

  // ====================================
  // EDIT COURSE
  // ====================================

  const editCourse = (c: any) => {

    setIsEdit(true);

    setEditId(c._id);

    setData({

      name: c.name,

      category: c.category,

      mainLevel: c.mainLevel,

      grade: c.grade,

      fee: String(c.fee),

      description: c.description,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };

  return (

    <div>

      <PageHeader
        title="Courses"
        subtitle="Manage all academy programs"
      />

      {/* ADD / EDIT COURSE */}

      <Card className="mb-6">

        <CardContent className="p-6">

          <div className="mb-5 text-2xl font-semibold">

            {isEdit
              ? "Edit Course"
              : "Add Course"}

          </div>

          <div className="grid gap-4 md:grid-cols-2">

            {/* COURSE NAME */}

            <div className="space-y-1.5">

              <Label>
                Course Name
              </Label>

              <Input
                value={data.name}
                placeholder="Guitar"
                onChange={(e) =>
                  setData({
                    ...data,
                    name:
                      e.target.value,
                  })
                }
              />

            </div>

            {/* CATEGORY */}

            <div className="space-y-1.5">

              <Label>
                Category
              </Label>

              <select
                value={data.category}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                onChange={(e) =>
                  setData({
                    ...data,
                    category:
                      e.target.value,
                  })
                }
              >

                <option>
                  Western Music
                </option>

                <option>
                  Performance Arts
                </option>

              </select>

            </div>

            {/* LEVEL */}

            <div className="space-y-1.5">

              <Label>
                Main Level
              </Label>

              <select
                value={data.mainLevel}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                onChange={(e) =>
                  setData({
                    ...data,
                    mainLevel:
                      e.target.value,
                  })
                }
              >

                <option>
                  Basic
                </option>

                <option>
                  Intermediate
                </option>

                <option>
                  Advanced
                </option>

              </select>

            </div>

            {/* GRADE */}

            <div className="space-y-1.5">

              <Label>
                Grade
              </Label>

              <select
                value={data.grade}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                onChange={(e) =>
                  setData({
                    ...data,
                    grade:
                      e.target.value,
                  })
                }
              >

                <option>
                  Initial
                </option>

                <option>
                  Grade 1
                </option>

                <option>
                  Grade 2
                </option>

                <option>
                  Grade 3
                </option>

                <option>
                  Grade 4
                </option>

                <option>
                  Grade 5
                </option>

                <option>
                  Grade 6
                </option>

                <option>
                  Grade 7
                </option>

                <option>
                  Grade 8
                </option>

              </select>

            </div>

            {/* FEE */}

            <div className="space-y-1.5">

              <Label>
                Monthly Fee
              </Label>

              <Input
                value={data.fee}
                placeholder="3000"
                onChange={(e) =>
                  setData({
                    ...data,
                    fee:
                      e.target.value,
                  })
                }
              />

            </div>

          </div>

          {/* DESCRIPTION */}

          <div className="mt-4 space-y-1.5">

            <Label>
              Description
            </Label>

            <textarea
              value={data.description}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              rows={4}
              placeholder="Course description..."
              onChange={(e) =>
                setData({
                  ...data,
                  description:
                    e.target.value,
                })
              }
            />

          </div>

          <div className="mt-5 flex gap-3">

            <Button
              onClick={
                isEdit
                  ? updateCourse
                  : createCourse
              }
              className="bg-gold text-gold-foreground hover:bg-gold/90"
            >

              <Plus className="mr-2 h-4 w-4" />

              {isEdit
                ? "Update Course"
                : "Add Course"}

            </Button>

            {isEdit && (

              <Button
                variant="outline"
                onClick={() => {

                  setIsEdit(false);

                  setEditId("");

                  setData({
                    name: "",
                    category: "Western Music",
                    mainLevel: "Basic",
                    grade: "Initial",
                    fee: "",
                    description: "",
                  });

                }}
              >

                Cancel

              </Button>

            )}

          </div>

        </CardContent>

      </Card>

      {/* COURSE LIST */}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

        {courses.map((c: any) => (

          <Card
            key={c._id}
            className="border-border/60 transition-all hover:shadow-xl"
          >

            <CardContent className="p-5">

              <div className="flex items-start justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-soft">

                  <Music className="h-5 w-5 text-gold-foreground" />

                </div>

                <Badge variant="outline">
                  {c.mainLevel}
                </Badge>

              </div>

              {/* TITLE */}

              <div className="mt-4">

                <div className="text-2xl font-semibold">

                  {c.name}

                </div>

                <div className="text-sm text-muted-foreground">

                  {c.category}

                </div>

              </div>

              {/* DETAILS */}

              <div className="mt-5 space-y-3 rounded-xl border border-border bg-muted/20 p-4 text-sm">

                <div className="flex items-center justify-between">

                  <span className="text-muted-foreground">
                    Grade
                  </span>

                  <span className="font-medium">
                    {c.grade}
                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <span className="text-muted-foreground">
                    Level
                  </span>

                  <span className="font-medium">
                    {c.mainLevel}
                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <span className="text-muted-foreground">
                    Category
                  </span>

                  <span className="font-medium">
                    {c.category}
                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <span className="text-muted-foreground">
                    Monthly Fee
                  </span>

                  <span className="text-lg font-bold text-gold">
                    ₹{c.fee}
                  </span>

                </div>

              </div>

              {/* DESCRIPTION */}

              <div className="mt-4 rounded-xl bg-muted/40 p-4">

                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">

                  Description

                </div>

                <div className="text-sm leading-relaxed text-foreground">

                  {c.description}

                </div>

              </div>

              {/* BUTTONS */}

              <div className="mt-5 flex gap-2">

                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() =>
                    editCourse(c)
                  }
                >

                  <Pencil className="mr-1 h-4 w-4" />

                  Edit

                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                  onClick={() =>
                    deleteCourse(c._id)
                  }
                >

                  <Trash2 className="mr-1 h-4 w-4" />

                  Delete

                </Button>

              </div>

            </CardContent>

          </Card>

        ))}

      </div>

    </div>

  );

}

export default AdminCourses;