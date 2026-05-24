import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Upload, BookOpen, Clock, GraduationCap } from "lucide-react";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/store/auth";

const steps = ["Personal", "Teaching", "Schedule", "Experience", "Profile"];

function TeacherSignup() {
  const navigate = useNavigate();
  const login = useAuth((s) => s.login);

  const [step, setStep] = useState(0);
  const [courses, setCourses] =
  useState<any[]>([]);
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

useEffect(() => {

  fetchCourses();

}, []);

  const [data, setData] = useState({
  name: "",
  email: "",
  phone: "",
  password: "",

  subject: "Piano",

  fromTime: "06:00",
  toTime: "23:00",

  availableDays: [] as string[],

  experience: "1 Year",
  customExperience: "",

  qualification: "",
});

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const finish = async () => {

  try {

    const response = await fetch(
      "https://marcylmsdeploy.onrender.com/api/auth/register",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({

          // COMMON
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone,

          role: "teacher",

          // TEACHER
          subject: data.subject,
          experience: data.experience,
          customExperience: data.customExperience,
          qualification: data.qualification,

          // SCHEDULE
          fromTime: data.fromTime,
          toTime: data.toTime,
          availableDays: data.availableDays,

        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {

      alert(result.message);

      return;
    }

    // TOKEN SAVE
    localStorage.setItem(
      "token",
      result.token
    );

    // USER SAVE
    login(result.user);

    alert("Teacher Registration Success");

    navigate("/teacher");

  } catch (error) {

    console.log(error);

    alert("Something went wrong");
  }
};

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-3xl flex-col px-4 py-10 sm:px-6">
        <Logo />

        <div className="mt-10">

          {/* Progress */}
          <div className="mb-8 flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={s} className="flex flex-1 items-center gap-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                    i < step
                      ? "bg-gold text-gold-foreground"
                      : i === step
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>

                {i < steps.length - 1 && (
                  <div
                    className={`h-px flex-1 ${
                      i < step ? "bg-gold" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-border bg-card p-8 shadow-luxe">

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >

                {/* STEP 1 */}
                {step === 0 && (
                  <div className="space-y-5">

                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-gold">
                        Step 1 of 5
                      </div>

                      <h1 className="mt-2 font-display text-3xl">
                        Teacher Details
                      </h1>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">

                      <div className="space-y-1.5">
                        <Label>Full Name</Label>
                        <Input
                          placeholder="Arjun Kumar"
                          value={data.name}
                          onChange={(e) =>
                            setData({ ...data, name: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label>Phone</Label>
                        <Input
                          placeholder="+91 9876543210"
                          value={data.phone}
                          onChange={(e) =>
                            setData({ ...data, phone: e.target.value })
                          }
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          placeholder="teacher@email.com"
                          value={data.email}
                          onChange={(e) =>
                            setData({ ...data, email: e.target.value })
                          }
                        />
                      </div>
                      <div className="sm:col-span-2 space-y-1.5">
  <Label>Password</Label>

  <Input
    type="password"
    placeholder="Create password"
    value={data.password}
    onChange={(e) =>
      setData({
        ...data,
        password: e.target.value,
      })
    }
  />
</div>

                    </div>
                  </div>
                )}


{/* STEP 2 */}
{step === 1 && (
  <div className="space-y-5">

    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-gold">
        Step 2 of 5
      </div>

      <h1 className="mt-2 font-display text-3xl">
        What do you teach?
      </h1>
    </div>

    <div className="grid gap-3 sm:grid-cols-3">

  {[
    ...new Map(
      courses.map((c: any) => [
        c.name,
        c,
      ])
    ).values(),
  ].map((course: any) => (

    <button
      key={course._id}
      onClick={() =>
        setData({
          ...data,
          subject: course.name,
        })
      }
      className={`rounded-xl border p-5 text-left transition-all ${
        data.subject === course.name
          ? "border-gold bg-gold-soft"
          : "border-border hover:border-gold/40"
      }`}
    >

      <BookOpen className="mb-2 h-5 w-5" />

      <div className="font-medium">
        {course.name}
      </div>

    </button>

  ))}

</div>

  </div>
)}

{/* STEP 3 */}
{step === 2 && (
  <div className="space-y-6">

    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-gold">
        Step 3 of 5
      </div>

      <h1 className="mt-2 font-display text-3xl">
        Available Schedule
      </h1>

      <p className="text-sm text-muted-foreground">
        Available classes from 06:00 AM to 11:00 PM • Monday to Sunday
      </p>
    </div>

    {/* DAYS */}

    <div>
      <Label>
        Available Days
      </Label>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">

        {[
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ].map((day) => (

          <button
            key={day}
            type="button"
            onClick={() => {

              if (
                data.availableDays.includes(day)
              ) {

                setData({
                  ...data,
                  availableDays:
                    data.availableDays.filter(
                      (d) => d !== day
                    ),
                });

              } else {

                setData({
                  ...data,
                  availableDays: [
                    ...data.availableDays,
                    day,
                  ],
                });

              }

            }}
            className={`rounded-xl border p-4 text-sm transition-all ${
              data.availableDays.includes(day)
                ? "border-gold bg-gold-soft"
                : "border-border hover:border-gold/40"
            }`}
          >

            {day}

          </button>

        ))}

      </div>
    </div>

    {/* FROM TIME */}

    <div>
      <Label>
        Available From
      </Label>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">

        {Array.from(
          { length: 18 },
          (_, i) => {

            const hour = i + 6;

            const displayHour =
              hour > 12
                ? hour - 12
                : hour;

            const ampm =
              hour >= 12
                ? "PM"
                : "AM";

            return `${String(
              displayHour
            ).padStart(2, "0")}:00 ${ampm}`;

          }
        ).map((time) => (

          <button
            key={time}
            type="button"
            onClick={() =>
              setData({
                ...data,
                fromTime: time,
              })
            }
            className={`rounded-xl border p-4 text-sm transition-all ${
              data.fromTime === time
                ? "border-gold bg-gold-soft"
                : "border-border hover:border-gold/40"
            }`}
          >

            {time}

          </button>

        ))}

      </div>
    </div>

    {/* TO TIME */}

    <div>
      <Label>
        Available To
      </Label>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">

        {Array.from(
          { length: 18 },
          (_, i) => {

            const hour = i + 6;

            const displayHour =
              hour > 12
                ? hour - 12
                : hour;

            const ampm =
              hour >= 12
                ? "PM"
                : "AM";

            return `${String(
              displayHour
            ).padStart(2, "0")}:00 ${ampm}`;

          }
        ).map((time) => (

          <button
            key={time}
            type="button"
            onClick={() =>
              setData({
                ...data,
                toTime: time,
              })
            }
            className={`rounded-xl border p-4 text-sm transition-all ${
              data.toTime === time
                ? "border-gold bg-gold-soft"
                : "border-border hover:border-gold/40"
            }`}
          >

            {time}

          </button>

        ))}

      </div>
    </div>

  </div>
)}
                {/* STEP 3
                {step === 2 && (
                  <div className="space-y-5">

                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-gold">
                        Step 3 of 5
                      </div>

                      <h1 className="mt-2 font-display text-3xl">
                        Available Timing
                      </h1>
                    </div>

                    <div>
                      <Label>Preferred Timing</Label>

                      <div className="mt-3 grid grid-cols-3 gap-3">

                        {["Morning", "Afternoon", "Evening"].map((time) => (
                          <button
                            key={time}
                            onClick={() =>
                              setData({ ...data, timing: time })
                            }
                            className={`rounded-lg border p-4 text-sm ${
                              data.timing === time
                                ? "border-gold bg-gold-soft"
                                : "border-border"
                            }`}
                          >
                            <Clock className="mx-auto mb-2 h-4 w-4" />
                            {time}
                          </button>
                        ))}

                      </div>
                    </div>
                  </div>
                )} */}

                {/* STEP 4 */}
                {step === 3 && (
                  <div className="space-y-5">

                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-gold">
                        Step 4 of 5
                      </div>

                      <h1 className="mt-2 font-display text-3xl">
                        Experience & Qualification
                      </h1>
                    </div>

                    <div className="grid gap-4">

                      <div>
                        <Label>Teaching Experience</Label>

                        <div className="mt-2 grid grid-cols-3 gap-2">

                          {["Fresher", "1 Year", "3 Years", "5+ Years", "Other"].map((exp) => (
                            <button
                              key={exp}
                              onClick={() =>
                                setData({ ...data, experience: exp })
                              }
                              className={`rounded-lg border p-4 ${
                                data.experience === exp
                                  ? "border-gold bg-gold-soft"
                                  : "border-border"
                              }`}
                            >
                              {exp}
                            </button>
                          ))}
                          {data.experience === "Other" && (
  <div className="mt-4 space-y-1.5">
    <Label>Custom Experience</Label>

    <Input
      placeholder="Enter experience"
      value={data.customExperience}
      onChange={(e) =>
        setData({
          ...data,
          customExperience: e.target.value,
        })
      }
    />
  </div>
)}

                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label>Qualification</Label>

                        <Input
                          placeholder="Music Degree / Trinity Certification"
                          value={data.qualification}
                          onChange={(e) =>
                            setData({
                              ...data,
                              qualification: e.target.value,
                            })
                          }
                        />
                      </div>

                    </div>
                  </div>
                )}

                {/* STEP 5 */}
                {step === 4 && (
                  <div className="space-y-5 text-center">

                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-gold">
                        Step 5 of 5
                      </div>

                      <h1 className="mt-2 font-display text-3xl">
                        Upload Profile Photo
                      </h1>
                    </div>

                    <label className="mx-auto flex h-40 w-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-full border-2 border-dashed border-gold/40 bg-gold-soft text-gold-foreground hover:bg-gold/20">
                      <Upload className="h-6 w-6" />
                      <span className="text-xs">Upload</span>

                      <input type="file" className="hidden" />
                    </label>

                    <div className="rounded-2xl bg-muted p-4 text-sm">
                      <p>
                        You will be assigned as{" "}
                        <strong>{data.subject}</strong> instructor.
                      </p>

                      <p className="mt-1 text-muted-foreground">
                        Experience: {data.experience}
                      </p>
                    </div>

                  </div>
                )}

              </motion.div>
            </AnimatePresence>

            {/* Buttons */}
            <div className="mt-8 flex items-center justify-between">

              <Button
                variant="ghost"
                onClick={back}
                disabled={step === 0}
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Button>

              {step < steps.length - 1 ? (
                <Button
                  onClick={next}
                  className="bg-gold text-gold-foreground hover:bg-gold/90"
                >
                  Continue
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={finish}
                  className="bg-foreground text-background hover:bg-foreground/90"
                >
                  Enter Dashboard
                  <GraduationCap className="ml-2 h-4 w-4" />
                </Button>
              )}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherSignup;