import { useEffect, useState } from "react";

import {
  Mail,
  Plus,
  X,
} from "lucide-react";

import { PageHeader } from "@/components/dashboard/Primitives";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { Input } from "@/components/ui/input";


function AdminTeachers() {

  const [teachers, setTeachers] = useState<any[]>([]);

  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    qualification: "",
    experience: "",
    fromTime: "",
    toTime: "",
    availableDays: "",
  });



  // ================= FETCH TEACHERS =================

  const fetchTeachers = async () => {

    try {

      const response = await fetch(
        "https://marcylmsdeploy-2.onrender.com/api/admin/teachers"
      );

      const data = await response.json();

      setTeachers(data);

    } catch (error) {

      console.log(error);
    }
  };


  useEffect(() => {
    fetchTeachers();
  }, []);



  // ================= ADD TEACHER =================

  const addTeacher = async () => {

    try {

      const response = await fetch(
        "https://marcylmsdeploy-2.onrender.com/api/admin/teachers",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ...formData,

            availableDays:
              formData.availableDays
                .split(",")
                .map((d) => d.trim()),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        alert(data.message);

        return;
      }

      alert("Teacher Added");

      setOpen(false);

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        qualification: "",
        experience: "",
        fromTime: "",
        toTime: "",
        availableDays: "",
      });

      fetchTeachers();

    } catch (error) {

      console.log(error);
    }
  };



  return (
    <div>

      <PageHeader
        title="Teachers"
        subtitle={`${teachers.length}+ certified mentors`}
        actions={
          <Button
            size="sm"
            className="bg-gold text-gold-foreground hover:bg-gold/90"
            onClick={() => setOpen(true)}
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Invite teacher
          </Button>
        }
      />


      {/* ================= MODAL ================= */}

      {open && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-5 flex items-center justify-between">

              <h2 className="text-xl font-semibold">
                Add Teacher
              </h2>

              <button onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>


            <div className="grid gap-4">

              <Input
                placeholder="Teacher Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subject: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Qualification"
                value={formData.qualification}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    qualification: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Experience"
                value={formData.experience}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    experience: e.target.value,
                  })
                }
              />

              <div className="grid grid-cols-2 gap-3">

                <Input
                  placeholder="From Time"
                  value={formData.fromTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fromTime: e.target.value,
                    })
                  }
                />

                <Input
                  placeholder="To Time"
                  value={formData.toTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      toTime: e.target.value,
                    })
                  }
                />

              </div>

              <Input
                placeholder="Available Days (Mon,Tue,Fri)"
                value={formData.availableDays}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    availableDays: e.target.value,
                  })
                }
              />

              <Button
                onClick={addTeacher}
                className="bg-gold text-gold-foreground hover:bg-gold/90"
              >
                Save Teacher
              </Button>

            </div>
          </div>
        </div>
      )}



      {/* ================= TEACHERS GRID ================= */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {teachers.map((t: any) => (

          <Card
            key={t._id}
            className="border-border/60"
          >
            <CardContent className="p-6">

              <div className="flex items-start gap-4">

                <Avatar className="h-14 w-14 ring-2 ring-gold/30">

                  <AvatarFallback className="bg-gold-soft font-display">

                    {t.name
                      ?.split(" ")
                      .map((p: any) => p[0])
                      .join("")
                      .slice(0, 2)}

                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">

                  <div className="font-display text-lg">
                    {t.name}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {t.subject}
                  </div>

                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">

                    <Mail className="h-3 w-3" />

                    {t.email}

                  </div>
                </div>
              </div>


              <div className="mt-5 flex flex-wrap gap-2">

                <Badge
                  variant="outline"
                  className="bg-gold-soft border-gold/30 text-gold-foreground"
                >
                  Certified
                </Badge>

                <Badge variant="outline">
                  {t.experience}
                </Badge>

              </div>


              <div className="mt-4 text-sm text-muted-foreground space-y-1">

                <div>
                  Qualification: {t.qualification}
                </div>

                <div>
                  Time:
                  {" "}
                  {t.fromTime}
                  {" - "}
                  {t.toTime}
                </div>

                <div>
                  Days:
                  {" "}
                  {t.availableDays?.join(", ")}
                </div>

                <div>
                  Phone:
                  {" "}
                  {t.phone}
                </div>

              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AdminTeachers;