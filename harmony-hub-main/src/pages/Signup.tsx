import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/store/auth";

const steps = [
  "Personal",
  "Course",
  "Schedule",
  "Level",
  "Profile",
];

function Signup() {

  const navigate = useNavigate();

  const login = useAuth((s) => s.login);

  const [step, setStep] = useState(0);

  const [courses, setCourses] =
    useState<any[]>([]);

  const [data, setData] = useState({

    name: "",
    email: "",
    phone: "",
    password: "",

    // selected course id
    course: "",

    mode: "Online",

    fromTime: "06:00 AM",
    toTime: "07:00 AM",

    availableDays: [] as string[],

    // selected level
    selectedLevel: "",
  });

  // ====================================
  // FETCH COURSES
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
  // SELECTED COURSE
  // ====================================

  const selectedCourse = courses.find(
    (c: any) => c._id === data.course
  );

  // ====================================
  // SELECTED LEVEL COURSE
  // ====================================

  const selectedGradeCourse = courses.find(
    (c: any) =>
      c.name === selectedCourse?.name &&
      c.mainLevel === data.selectedLevel
  );

  // ====================================
  // DAYS
  // ====================================

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // ====================================
  // TIMESLOTS
  // ====================================

  const timeSlots = Array.from(
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
  );

  // ====================================
  // NEXT / BACK
  // ====================================

  const next = () =>
    setStep((s) =>
      Math.min(
        s + 1,
        steps.length - 1
      )
    );

  const back = () =>
    setStep((s) =>
      Math.max(s - 1, 0)
    );

  // ====================================
  // FINISH
  // ====================================

  const finish = async () => {

    try {

      const response = await fetch(
        "https://marcylmsdeploy.onrender.com/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            name: data.name,

            email: data.email,

            password:
              data.password,

            phone: data.phone,

            role: "student",

            // IMPORTANT
            // SAVE REAL COURSE ID
            course:
              selectedGradeCourse?._id,

            // SAVE LEVEL
            level:
              data.selectedLevel,

            // SAVE GRADE
            batch:
              selectedGradeCourse?.grade,

            mode: data.mode,

            fromTime:
              data.fromTime,

            toTime:
              data.toTime,

            availableDays:
              data.availableDays,

          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {

        alert(result.message);

        return;

      }

      localStorage.setItem(
        "token",
        result.token
      );

      login(result.user);

      alert("Signup Success");

      navigate("/student");

    } catch (error) {

      console.log(error);

      alert(
        "Something went wrong"
      );

    }

  };

  return (

    <div className="min-h-screen bg-background">

      <div className="mx-auto flex max-w-3xl flex-col px-4 py-10 sm:px-6">

        <Logo />

        <div className="mt-10">

          {/* PROGRESS */}

          <div className="mb-8 flex items-center gap-2">

            {steps.map((s, i) => (

              <div
                key={s}
                className="flex flex-1 items-center gap-2"
              >

                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                    i < step
                      ? "bg-gold text-gold-foreground"
                      : i === step
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground"
                  }`}
                >

                  {i < step ? (

                    <Check className="h-3.5 w-3.5" />

                  ) : (

                    i + 1

                  )}

                </div>

                {i < steps.length - 1 && (

                  <div
                    className={`h-px flex-1 ${
                      i < step
                        ? "bg-gold"
                        : "bg-border"
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
                initial={{
                  opacity: 0,
                  x: 20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -20,
                }}
                transition={{
                  duration: 0.25,
                }}
              >

                {/* STEP 1 */}

                {step === 0 && (

                  <div className="space-y-5">

                    <div>

                      <div className="text-xs font-semibold uppercase tracking-wider text-gold">

                        Step 1 of 5

                      </div>

                      <h1 className="mt-2 font-display text-3xl">

                        Tell us about you

                      </h1>

                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">

                      <div className="space-y-1.5">

                        <Label>
                          Full Name
                        </Label>

                        <Input
                          value={data.name}
                          onChange={(e) =>
                            setData({
                              ...data,
                              name:
                                e.target.value,
                            })
                          }
                        />

                      </div>

                      <div className="space-y-1.5">

                        <Label>
                          Phone
                        </Label>

                        <Input
                          value={data.phone}
                          onChange={(e) =>
                            setData({
                              ...data,
                              phone:
                                e.target.value,
                            })
                          }
                        />

                      </div>

                      <div className="sm:col-span-2 space-y-1.5">

                        <Label>
                          Email
                        </Label>

                        <Input
                          type="email"
                          value={data.email}
                          onChange={(e) =>
                            setData({
                              ...data,
                              email:
                                e.target.value,
                            })
                          }
                        />

                      </div>

                      <div className="sm:col-span-2 space-y-1.5">

                        <Label>
                          Password
                        </Label>

                        <Input
                          type="password"
                          value={data.password}
                          onChange={(e) =>
                            setData({
                              ...data,
                              password:
                                e.target.value,
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

                        Pick your course

                      </h1>

                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">

                      {[
                        ...new Map(
                          courses.map(
                            (c: any) => [
                              c.name,
                              c,
                            ]
                          )
                        ).values(),
                      ].map((c: any) => (

                        <button
                          key={c._id}
                          type="button"
                          onClick={() =>
                            setData({
                              ...data,
                              course:
                                c._id,
                              selectedLevel:
                                "",
                            })
                          }
                          className={`rounded-xl border p-5 text-left transition-all ${
                            data.course ===
                            c._id
                              ? "border-gold bg-gold-soft"
                              : "border-border hover:border-gold/40"
                          }`}
                        >

                          <div className="font-medium text-lg">

                            {c.name}

                          </div>

                          <div className="mt-1 text-xs text-muted-foreground">

                            {c.category}

                          </div>

                        </button>

                      ))}

                    </div>

                  </div>

                )}

                {/* STEP 3 */}

                {step === 2 && (

                  <div className="space-y-6">

                    <h1 className="font-display text-3xl">
                      Schedule
                    </h1>

                    {/* DAYS */}

                    <div>

                      <Label>
                        Available Days
                      </Label>

                      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">

                        {days.map((day) => (

                          <button
                            key={day}
                            type="button"
                            onClick={() => {

                              if (
                                data.availableDays.includes(
                                  day
                                )
                              ) {

                                setData({
                                  ...data,
                                  availableDays:
                                    data.availableDays.filter(
                                      (
                                        d
                                      ) =>
                                        d !==
                                        day
                                    ),
                                });

                              } else {

                                setData({
                                  ...data,
                                  availableDays:
                                    [
                                      ...data.availableDays,
                                      day,
                                    ],
                                });

                              }

                            }}
                            className={`rounded-xl border p-4 text-sm ${
                              data.availableDays.includes(
                                day
                              )
                                ? "border-gold bg-gold-soft"
                                : "border-border"
                            }`}
                          >

                            {day}

                          </button>

                        ))}

                      </div>

                    </div>

                  </div>

                )}

                {/* STEP 4 */}

                {step === 3 && (

                  <div className="space-y-6">

                    <h1 className="font-display text-3xl">
                      Select Your Level
                    </h1>

                    {[
                      "Basic",
                      "Intermediate",
                      "Advanced",
                    ].map((level) => {

                      const levelCourses =
                        courses.filter(
                          (c: any) =>
                            c.name ===
                              selectedCourse?.name &&
                            c.mainLevel ===
                              level
                        );

                      if (
                        levelCourses.length ===
                        0
                      )
                        return null;

                      return (

                        <button
                          key={level}
                          type="button"
                          onClick={() =>
                            setData({
                              ...data,
                              selectedLevel:
                                level,
                            })
                          }
                          className={`w-full rounded-2xl border p-5 text-left ${
                            data.selectedLevel ===
                            level
                              ? "border-gold bg-gold-soft"
                              : "border-border"
                          }`}
                        >

                          <div className="flex items-center justify-between">

                            <div className="text-xl font-semibold">

                              {level}

                            </div>

                            <div className="text-sm font-bold text-gold">

                              Starting ₹
                              {
                                levelCourses[0]
                                  ?.fee
                              }

                            </div>

                          </div>

                          <div className="mt-4 grid gap-3 sm:grid-cols-3">

                            {levelCourses.map(
                              (c: any) => (

                                <div
                                  key={c._id}
                                  className="rounded-xl border bg-black/5 p-3"
                                >

                                  <div className="text-sm font-semibold">

                                    {c.grade}

                                  </div>

                                  <div className="text-sm font-bold text-gold">

                                    ₹{c.fee}

                                  </div>

                                </div>

                              )
                            )}

                          </div>

                        </button>

                      );

                    })}

                  </div>

                )}

                {/* STEP 5 */}

                {step === 4 && (

                  <div className="space-y-5 text-center">

                    <h1 className="font-display text-3xl">
                      Upload Your Photo
                    </h1>

                    <label className="mx-auto flex h-40 w-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-full border-2 border-dashed border-gold/40 bg-gold-soft">

                      <Upload className="h-6 w-6" />

                      <span className="text-xs">
                        Upload
                      </span>

                      <input
                        type="file"
                        className="hidden"
                      />

                    </label>

                    <div className="rounded-2xl bg-muted p-4 text-sm">

                      <p>

                        Course:
                        {" "}

                        <strong>

                          {
                            selectedCourse?.name
                          }

                        </strong>

                      </p>

                      <p className="mt-1">

                        Level:
                        {" "}
                        {
                          data.selectedLevel
                        }

                      </p>

                      <p className="mt-1">

                        Grade:
                        {" "}
                        {
                          selectedGradeCourse?.grade
                        }

                      </p>

                    </div>

                  </div>

                )}

              </motion.div>

            </AnimatePresence>

            {/* BUTTONS */}

            <div className="mt-8 flex items-center justify-between">

              <Button
                variant="ghost"
                onClick={back}
                disabled={step === 0}
              >

                <ArrowLeft className="mr-1 h-4 w-4" />

                Back

              </Button>

              {step <
              steps.length - 1 ? (

                <Button
                  onClick={next}
                  className="bg-gold text-gold-foreground"
                >

                  Continue

                  <ArrowRight className="ml-1 h-4 w-4" />

                </Button>

              ) : (

                <Button
                  onClick={finish}
                  className="bg-foreground text-background"
                >

                  Enter Dashboard

                  <ArrowRight className="ml-1 h-4 w-4" />

                </Button>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Signup;