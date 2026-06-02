import {
  useEffect,
  useRef,
  useState,
} from "react";

import axios from "axios";

// IMPORTANT
// INSTALL:
// npm install html2canvas-pro

import html2canvas
from "html2canvas-pro";

import preview
from "../../assets/certificate-bg.png";
import { Badge } from "@/components/ui/badge";

const API =
  "https://marcylmsdeploy-2.onrender.com/api";

export default function
TeacherCertificateForm() {

  // =========================
  // STATES
  // =========================

  const previewRef =
    useRef<any>(null);
  
const [levels, setLevels] =
  useState<string[]>([]);
  useEffect(() => {
  fetchLevels();
}, []);

const fetchLevels = async () => {
  try {
    const res = await axios.get(
      `${API}/courses`
    );

const allLevels =
  res.data.map(
    (c) =>
      `${c.mainLevel} - ${c.grade}`
  );

setLevels(
  [...new Set(allLevels)]
); 


  } catch (err) {
    console.log(err);
  }
};

const [certificates, setCertificates] =
  useState<any[]>([]);

useEffect(() => {
  fetchCertificates();
}, []);

const teacherId =
  localStorage.getItem("userId");

console.log(
  "Teacher ID:",
  teacherId
);
const fetchCertificates = async () => {

  const teacherId =
    localStorage.getItem("userId");

  if (!teacherId) {
    console.log(
      "Teacher ID not found"
    );
    return;
  }

  try {

    const res =
      await axios.get(
        `${API}/certificates/teacher/${teacherId}`
      );

    setCertificates(
      res.data
    );

  } catch (err) {

    console.log(err);

  }
};
  const [
    students,
    setStudents,
  ] = useState<any[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    form,
    setForm,
  ] = useState({

    student: "",

    studentName: "",

    course:
      "Guitar",

    category:
      "Western Music",

    level:
      "Basic",

    description:
      "With dedication, enthusiasm, and excellence in communication, confidence-building, stage presence, voice modulation, expression, and presentation skills.",

    duration:
      "1 Year",

    completionDate:
      new Date()
        .toDateString(),
  });

  // =========================
  // FIX OKLCH ERROR
  // =========================

  useEffect(() => {

    document.body.style.backgroundColor =
      "#f3f4f6";

    document.body.style.color =
      "#000000";

  }, []);

  // =========================
  // FETCH STUDENTS
  // =========================

  useEffect(() => {

    fetchStudents();

  }, []);

  const fetchStudents =
    async () => {

      try {

        const res =
          await axios.get(
            `${API}/teacher/students`
          );

        setStudents(
          res.data
        );

      } catch (err) {

        console.log(err);

      }
    };

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange =
    (
      e: any
    ) => {

      setForm({

        ...form,

        [e.target.name]:
          e.target.value,
      });
    };

  // =========================
  // HANDLE STUDENT
  // =========================

  const handleStudent =
    (
      e: any
    ) => {

      const selected =
        students.find(
          (s) =>
            s._id ===
            e.target.value
        );

      setForm({

        ...form,

        student:
          selected?._id || "",

        studentName:
          selected?.name || "",
      });
    };


    

  // =========================
  // SEND REQUEST
  // =========================

const sendRequest = async () => {
  try {
    setLoading(true);

    const teacher =
      localStorage.getItem("userId");

    await document.fonts.ready;

    const canvas =
      await html2canvas(
        previewRef.current,
        {
          scale: 3,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
        }
      );

    const previewImage =
      canvas.toDataURL(
        "image/jpeg",
        0.9
      );

    await axios.post(
      `${API}/certificates/create`,
      {
        ...form,
        teacher,
        previewImage,
      }
    );

    alert(
      "Certificate Request Sent"
    );

    fetchCertificates();

  } catch (err) {

    console.log(err);

    alert("Request Failed");

  } finally {

    setLoading(false);

  }
};

  return (

    <div
      style={{
        backgroundColor:
          "#f3f4f6",
      }}
      className="
        min-h-screen
        p-3
        md:p-6
        lg:p-10
      "
    >

      <div
        className="
          flex
          flex-col
          xl:flex-row
          gap-8
        "
      >

        {/* ========================= */}
        {/* FORM */}
        {/* ========================= */}

        <div
          style={{
            backgroundColor:
              "#ffffff",
          }}
          className="
            w-full
            xl:w-[420px]
            rounded-2xl
            shadow-lg
            p-5
            md:p-6
            h-fit
          "
        >

          <h1
            className="
              text-2xl
              font-bold
              mb-6
            "
          >
            Create Certificate
          </h1>

          <div className="space-y-4">

            {/* STUDENT */}

            <div>

              <label
                className="
                  text-sm
                  font-medium
                  mb-2
                  block
                "
              >
                Student
              </label>

              <select
                value={
                  form.student
                }
                onChange={
                  handleStudent
                }
                className="
                  w-full
                  border
                  rounded-lg
                  p-3
                "
                style={{
                  backgroundColor:
                    "#ffffff",

                  borderColor:
                    "#d1d5db",
                }}
              >

                <option value="">
                  Select Student
                </option>

                {students.map(
                  (student) => (

                    <option
                      key={
                        student._id
                      }
                      value={
                        student._id
                      }
                    >
                      {student.name}
                    </option>

                  )
                )}

              </select>

            </div>

            {/* COURSE */}

            <div>

              <label className="block mb-2 text-sm font-medium">
                Course
              </label>

              <input
                type="text"
                name="course"
                value={
                  form.course
                }
                onChange={
                  handleChange
                }
                className="
                  w-full
                  border
                  rounded-lg
                  p-3
                "
              />

            </div>

            {/* CATEGORY */}

            <div>

              <label className="block mb-2 text-sm font-medium">
                Category
              </label>

              <input
                type="text"
                name="category"
                value={
                  form.category
                }
                onChange={
                  handleChange
                }
                className="
                  w-full
                  border
                  rounded-lg
                  p-3
                "
              />

            </div>

            {/* LEVEL */}

            <div>

              <label className="block mb-2 text-sm font-medium">
                Level
              </label>

             <select
  name="level"
  value={form.level}
  onChange={handleChange}
  className="w-full border rounded-lg p-3"
>
  <option value="">Select Level</option>

  {levels.map((level) => (
    <option
      key={level}
      value={level}
    >
      {level}
    </option>
  ))}
</select>

            </div>

            {/* DESCRIPTION */}

            <div>

              <label className="block mb-2 text-sm font-medium">
                Description
              </label>

              <textarea
                name="description"
                value={
                  form.description
                }
                onChange={
                  handleChange
                }
                className="
                  w-full
                  border
                  rounded-lg
                  p-3
                  h-40
                "
              />

            </div>

            {/* DURATION */}

            <div>

              <label className="block mb-2 text-sm font-medium">
                Duration
              </label>

              <input
                type="text"
                name="duration"
                value={
                  form.duration
                }
                onChange={
                  handleChange
                }
                className="
                  w-full
                  border
                  rounded-lg
                  p-3
                "
              />

            </div>

            {/* DATE */}

            <div>

              <label className="block mb-2 text-sm font-medium">
                Completion Date
              </label>

              <input
                type="text"
                name="completionDate"
                value={
                  form.completionDate
                }
                onChange={
                  handleChange
                }
                className="
                  w-full
                  border
                  rounded-lg
                  p-3
                "
              />

            </div>

            {/* BUTTON */}

            <button
              onClick={
                sendRequest
              }
              disabled={
                loading
              }
              style={{
                backgroundColor:
                  "#000000",

                color:
                  "#ffffff",
              }}
              className="
                w-full
                rounded-lg
                py-3
                font-semibold
                mt-4
              "
            >

              {loading
                ? "Sending..."
                : "Send Request"}

            </button>

          </div>

        </div>

        {/* ========================= */}
        {/* PREVIEW */}
        {/* ========================= */}

        <div
          className="
            flex-1
            overflow-auto
            rounded-2xl
            shadow-lg
            p-3
            md:p-5
          "
          style={{
            backgroundColor:
              "#ffffff",
          }}
        >

          {/* MOBILE RESPONSIVE */}

          <div className="overflow-auto w-full">

            {/* CERTIFICATE */}

            <div
              ref={previewRef}
              className="
                relative
                w-[1400px]
                h-[1000px]
                overflow-hidden
                rounded-lg
                origin-top-left

              "
              style={{
                zoom: 0.4,
                backgroundColor:
                  "#ffffff",
              }}
            >

              {/* BG IMAGE */}

              <img
                src={preview}
                alt=""
                className="
                  absolute
                  inset-0
                  w-full
                  h-full
                  object-cover
                "
              />

              {/* CONTENT */}

              <div className="relative z-10 w-full h-full">

                {/* CATEGORY */}

                <h1
  className="
    absolute
    top-[280px]
    left-1/2
    -translate-x-1/2
    text-[58px]
    font-bold
    text-center
    w-[900px]
  "
>
  {form.category}
</h1>

                {/* COURSE */}

                <h2
                  className="
                    absolute
                    top-[350px]
                    left-1/2
                    -transform
                    -translate-x-1/2
                    text-center
                    w-[900px]
                    
                    text-[42px]
                    font-bold
                    uppercase
                  
                  "
                  style={{
                    color:
                      "#000000",
                  }}
                >
                  {form.course}
                </h2>

                {/* STUDENT */}

                <h3
  className="
    absolute
    top-[450px]
    left-1/2
    -translate-x-1/2
    text-[48px]
    font-bold
    text-center
    w-[900px]
  "
  style={{
    color: "#b68b2d",
  }}
>
  {form.studentName}
</h3>

                {/* DESCRIPTION */}

               <div
  className="
    absolute
    top-[540px]
    left-1/2
    -translate-x-1/2
    w-[900px]
    text-center
  "
>
  <p
    className="
      text-[24px]
      leading-[38px]
    "
  >
    In recognition of successful
    completion of {form.level}
    in {form.course}
    in {form.category}
  </p>

  <p
    className="
      mt-4
      text-[22px]
      leading-[34px]
      break-words
      whitespace-normal
    "
  >
    {form.description}
  </p>
</div>

                {/* DURATION */}

                <p
                  className="
                    absolute
                    bottom-[250px]
                    left-[580px]
                    text-[24px]
                  "
                  style={{
                    color:
                      "#000000",
                  }}
                >

                  Course Duration:
                  {" "}
                  {form.duration}

                </p>

                {/* DATE */}

                <p
                  className="
                    absolute
                    bottom-[220px]
                    left-[520px]
                    text-[24px]
                  "
                  style={{
                    color:
                      "#000000",
                  }}
                >

                  Date of Completion:
                  {" "}
                  {form.completionDate}

                </p>

              </div>

            </div>

          </div>

        </div>
        

      </div>
      {certificates.map((c) => (

  <div
    key={c._id}
    className="border p-4 rounded-xl"
  >

    <h3>
      {c.studentName}
    </h3>

    <p>
      {c.course}
    </p>

    <p>
      {c.level}
    </p>

    <Badge
  className={
    c.status === "approved"
      ? "bg-green-600 text-white"
      : "bg-orange-500 text-white"
  }
>
  {c.status === "approved"
    ? "Completed"
    : "Pending Approval"}
</Badge>

  </div>

))}

    </div>
  );
}