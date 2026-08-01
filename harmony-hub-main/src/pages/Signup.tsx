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

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const timeSlots = [
  { from: "06:00 AM", to: "07:00 AM" },
  { from: "07:00 AM", to: "08:00 AM" },
  { from: "08:00 AM", to: "09:00 AM" },
  { from: "09:00 AM", to: "10:00 AM" },
  { from: "10:00 AM", to: "11:00 AM" },
  { from: "11:00 AM", to: "12:00 PM" },
  { from: "12:00 PM", to: "01:00 PM" },
  { from: "01:00 PM", to: "02:00 PM" },
  { from: "02:00 PM", to: "03:00 PM" },
  { from: "03:00 PM", to: "04:00 PM" },
  { from: "04:00 PM", to: "05:00 PM" },
  { from: "05:00 PM", to: "06:00 PM" },
  { from: "06:00 PM", to: "07:00 PM" },
  { from: "07:00 PM", to: "08:00 PM" },
  { from: "08:00 PM", to: "09:00 PM" },
  { from: "09:00 PM", to: "10:00 PM" },
  { from: "10:00 PM", to: "11:00 PM" },
];

function Signup() {
  const navigate = useNavigate();
  const login = useAuth((s) => s.login);

  const [step, setStep] = useState(0);

  const [courses, setCourses] = useState<any[]>([]);
  const [image, setImage] = useState<File | null>(null);

  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",

    course: "",

    mode: "Online",

    availableDays: [] as string[],

    fromTime: "",
    toTime: "",

    selectedLevel: "",

    classType: "",
  });

  // ===============================
  // CLOUDINARY
  // ===============================

  const uploadImage = async () => {
    if (!image) return "";

    const formData = new FormData();

    formData.append("file", image);
    formData.append(
      "upload_preset",
      "your_upload_preset"
    );

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const json = await res.json();

    return json.secure_url;
  };

  // ===============================
  // LOAD COURSES
  // ===============================

  const fetchCourses = async () => {
    try {
      const res = await fetch(
        "https://marcylmsdeploy-2.onrender.com/api/courses"
      );

      const json = await res.json();

      setCourses(json);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ===============================
  // SELECTED COURSE
  // ===============================

  const selectedCourse = courses.find(
    (c: any) => c._id === data.course
  );

  const uniqueCourses = [
    ...new Set(courses.map((c: any) => c.name)),
  ];

  const selectedGradeCourse = courses.find(
    (c: any) =>
      c.name === selectedCourse?.name &&
      c.classMode === selectedCourse?.classMode &&
      c.mainLevel === data.selectedLevel
  );

  // ===============================
  // NEXT
  // ===============================

  const next = () => {
    if (step === 0) {
      if (
        !data.name ||
        !data.phone ||
        !data.email ||
        !data.password
      ) {
        alert("Please fill all details");
        return;
      }
    }

    if (step === 1) {
      if (!data.course) {
        alert("Please select a course");
        return;
      }
    }

    if (step === 2) {
      if (
        !data.mode ||
        data.availableDays.length === 0 ||
        !data.fromTime ||
        !data.toTime
      ) {
        alert("Please select day and time");
        return;
      }
    }

    if (step === 3) {
      if (!data.selectedLevel) {
        alert("Please select level");
        return;
      }
    }

    setStep((prev) =>
      Math.min(prev + 1, steps.length - 1)
    );
  };

  // ===============================
  // BACK
  // ===============================

  const back = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  // ===============================
  // REGISTER
  // ===============================

  const finish = async () => {
    try {
      let imageUrl = "";

      if (image) {
        imageUrl = await uploadImage();
      }

      const res = await fetch(
        "https://marcylmsdeploy-2.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: data.password,

            role: "student",

            course: selectedGradeCourse?._id,

            level: data.selectedLevel,

            batch: selectedGradeCourse?.grade,

            mode: data.mode,

            classType: selectedGradeCourse?.classMode,

            availableDays: data.availableDays,

            fromTime: data.fromTime,

            toTime: data.toTime,

            image: imageUrl,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        alert(result.message);
        return;
      }

      localStorage.setItem(
        "token",
        result.token
      );

      login(result.user);

      navigate("/student");
    } catch (err) {
      console.log(err);
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
            <div
              key={s}
              className="flex flex-1 items-center gap-2"
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold
                ${
                  i < step
                    ? "bg-gold text-white"
                    : i === step
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i < step ? (
                  <Check className="h-4 w-4" />
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

        <div className="rounded-3xl border bg-card p-8 shadow-luxe">

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >

{/* =========================
STEP 1
========================= */}

{step === 0 && (

<div className="space-y-5">

<div>

<div className="text-xs uppercase font-semibold tracking-wider text-gold">

Step 1 of 5

</div>

<h1 className="mt-2 font-display text-3xl">

Tell us about yourself

</h1>

</div>

<div className="grid gap-4 sm:grid-cols-2">

<div>

<Label>Full Name</Label>

<Input
value={data.name}
onChange={(e)=>
setData({
...data,
name:e.target.value,
})
}
/>

</div>

<div>

<Label>Phone</Label>

<Input
value={data.phone}
onChange={(e)=>
setData({
...data,
phone:e.target.value,
})
}
/>

</div>

<div className="sm:col-span-2">

<Label>Email</Label>

<Input
type="email"
value={data.email}
onChange={(e)=>
setData({
...data,
email:e.target.value,
})
}
/>

</div>

<div className="sm:col-span-2">

<Label>Password</Label>

<Input
type="password"
value={data.password}
onChange={(e)=>
setData({
...data,
password:e.target.value,
})
}
/>

</div>

</div>

</div>

)}

{/* =========================
STEP 2
========================= */}

{step===1 && (

<div className="space-y-8">

<div>

<div className="text-xs uppercase font-semibold tracking-wider text-gold">

Step 2 of 5

</div>

<h1 className="mt-2 font-display text-3xl">

Choose Course

</h1>

</div>

<div className="grid gap-4 sm:grid-cols-2">

{uniqueCourses.map((courseName)=>{

const courseTypes=[
...new Map(
courses
.filter((c:any)=>c.name===courseName)
.map((c:any)=>[c.classMode,c])
).values()
];

return(

<div
key={courseName}
className="rounded-xl border p-5"
>

<h2 className="mb-4 text-lg font-semibold">

{courseName}

</h2>

<div className="space-y-3">

{courseTypes.map((course:any)=>(

<button

key={course._id}

type="button"

onClick={()=>

setData({

...data,

course:course._id,

classType:course.classMode,

selectedLevel:"",

})

}

className={`w-full rounded-xl border p-4 flex justify-between

${

data.course===course._id

?

"border-gold bg-gold-soft"

:

"border-border"

}

`}

>

<span>

{course.classMode}

</span>

{data.course===course._id && (

<Check className="h-4 w-4"/>

)}

</button>

))}

</div>

</div>

);

})}

</div>

</div>

)}

{/* =========================
STEP 3
========================= */}

{step===2 && (

<div className="space-y-8">

<div>

<div className="text-xs uppercase tracking-wider text-gold font-semibold">

Step 3 of 5

</div>

<h1 className="mt-2 text-3xl font-display">

Choose Schedule

</h1>

<p className="text-muted-foreground mt-2">

Select Mode, Day and Time

</p>

</div>

{/* MODE */}

<div>

<Label>

Learning Mode

</Label>

<div className="mt-3 grid grid-cols-2 gap-3">

{["Online","Offline"].map((mode)=>(

<button

key={mode}

type="button"

onClick={()=>

setData({

...data,

mode,

})

}

className={`rounded-xl border p-4

${

data.mode===mode

?

"border-gold bg-gold-soft"

:

"border-border"

}

`}

>

{mode}

</button>

))}

</div>

</div>

{/* DAYS */}

<div>

<Label>

Select Day

</Label>

<div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">

{days.map((day)=>(

<button

key={day}

type="button"

onClick={()=>

setData({

...data,

availableDays:[day],

})

}

className={`rounded-xl border p-3

${

data.availableDays.includes(day)

?

"border-gold bg-gold-soft"

:

"border-border"

}

`}

>

{day}

</button>

))}

</div>

</div>

{/* TIMES */}

<div>

<Label>

Select Time

</Label>

<div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">

{timeSlots.map((slot)=>(

<button

key={slot.from}

type="button"

onClick={()=>

setData({

...data,

fromTime:slot.from,

toTime:slot.to,

})

}

className={`rounded-xl border p-4 text-left

${

data.fromTime===slot.from

?

"border-gold bg-gold-soft"

:

"border-border"

}

`}

>

<div className="font-semibold">

{slot.from}

</div>

<div className="text-sm text-muted-foreground">

to {slot.to}

</div>

</button>

))}

</div>

</div>

</div>

)}

{/* =========================
STEP 4
========================= */}

{step === 3 && (
  <div className="space-y-6">
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-gold">
        Step 4 of 5
      </div>

      <h1 className="mt-2 font-display text-3xl">
        Select Your Level
      </h1>
    </div>

    {["Basic", "Intermediate", "Advanced"].map((level) => {
      const levelCourses = courses.filter(
        (c: any) =>
          c.name === selectedCourse?.name &&
          c.classMode === selectedCourse?.classMode &&
          c.mainLevel === level
      );

      if (levelCourses.length === 0) return null;

      return (
        <button
          key={level}
          type="button"
          onClick={() =>
            setData({
              ...data,
              selectedLevel: level,
            })
          }
          className={`w-full rounded-2xl border p-5 text-left transition ${
            data.selectedLevel === level
              ? "border-gold bg-gold-soft"
              : "border-border hover:border-gold"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="text-xl font-semibold">
              {level}
            </div>

            <div className="font-bold text-gold">
              ₹{levelCourses[0].fee}
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {levelCourses.map((course: any) => (
              <div
                key={course._id}
                className="rounded-xl border bg-muted/30 p-3"
              >
                <div className="font-semibold">
                  {course.grade}
                </div>

                <div className="text-gold font-bold">
                  ₹{course.fee}
                </div>
              </div>
            ))}
          </div>
        </button>
      );
    })}
  </div>
)}

{/* =========================
STEP 5
========================= */}

{step === 4 && (
  <div className="space-y-6 text-center">
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-gold">
        Step 5 of 5
      </div>

      <h1 className="mt-2 font-display text-3xl">
        Upload Profile Photo
      </h1>
    </div>

    <label className="mx-auto flex h-40 w-40 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-gold/50 bg-gold-soft">
      <Upload className="h-6 w-6" />

      <span className="text-xs mt-2">
        Upload Photo
      </span>

      <input
        hidden
        type="file"
        accept="image/*"
        onChange={(e) =>
          setImage(e.target.files?.[0] || null)
        }
      />
    </label>

    <div className="rounded-2xl bg-muted p-5 text-left space-y-2">
      <p>
        <strong>Course :</strong>{" "}
        {selectedCourse?.name}
      </p>

      <p>
        <strong>Class :</strong>{" "}
        {selectedCourse?.classMode}
      </p>

      <p>
        <strong>Level :</strong>{" "}
        {data.selectedLevel}
      </p>

      <p>
        <strong>Grade :</strong>{" "}
        {selectedGradeCourse?.grade}
      </p>

      <p>
        <strong>Mode :</strong>{" "}
        {data.mode}
      </p>

      <p>
        <strong>Day :</strong>{" "}
        {data.availableDays.join(", ")}
      </p>

      <p>
        <strong>Time :</strong>{" "}
        {data.fromTime} - {data.toTime}
      </p>
    </div>
  </div>
)}

            </motion.div>
          </AnimatePresence>

          {/* Bottom Buttons */}

          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="ghost"
              disabled={step === 0}
              onClick={back}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            {step < steps.length - 1 ? (
              <Button
                onClick={next}
                className="bg-gold text-gold-foreground"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={finish}
                className="bg-foreground text-background"
              >
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
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