import {
  useEffect,
  useRef,
  useState,
} from "react";

import axios from "axios";

import html2canvas
from "html2canvas";
import preview from "../../assets/certificate-bg.png";


const API =
  "http://localhost:5000/api";

// =========================
// SAMPLE STUDENTS
// =========================



export default function
TeacherCertificateForm() {
    const [
  students,
  setStudents,
] = useState<any[]>([]);
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

  const previewRef =
    useRef<any>();

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
  // CHANGE
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
  // STUDENT SELECT
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

  const sendRequest =
    async () => {

      const canvas =
        await html2canvas(
          previewRef.current
        );

      const previewImage =
        canvas.toDataURL(
          "image/png"
        );

      await axios.post(
        `${API}/certificates/create`,
        {
          ...form,

          previewImage,
        }
      );

      alert(
        "Certificate Request Sent"
      );
    };

  return (

    <div className="grid md:grid-cols-2 gap-10 p-10">

      {/* FORM */}

      <div className="space-y-4">

        {/* STUDENT */}

        <select
          className="border p-3 w-full"
          onChange={
            handleStudent
          }
        >

          <option>
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

        {/* COURSE */}

        <input
          name="course"
          value={
            form.course
          }
          onChange={
            handleChange
          }
          className="border p-3 w-full"
        />

        {/* CATEGORY */}

        <input
          name="category"
          value={
            form.category
          }
          onChange={
            handleChange
          }
          className="border p-3 w-full"
        />

        {/* LEVEL */}

        <input
          name="level"
          value={
            form.level
          }
          onChange={
            handleChange
          }
          className="border p-3 w-full"
        />

        {/* DESCRIPTION */}

        <textarea
          name="description"
          value={
            form.description
          }
          onChange={
            handleChange
          }
          className="border p-3 w-full h-40"
        />

        {/* DURATION */}

        <input
          name="duration"
          value={
            form.duration
          }
          onChange={
            handleChange
          }
          className="border p-3 w-full"
        />

        {/* DATE */}

        <input
          name="completionDate"
          value={
            form.completionDate
          }
          onChange={
            handleChange
          }
          className="border p-3 w-full"
        />

        {/* BUTTON */}

        <button
          onClick={
            sendRequest
          }
          className="bg-black text-white px-5 py-3 rounded-lg"
        >
          Send Request
        </button>

      </div>

      {/* PREVIEW */}

      <div
    ref={previewRef}
    className="
      relative
      w-[1400px]
      h-[1000px]
      overflow-hidden
      rounded-lg
      bg-white
      scale-[0.45]
      origin-top-left
    "
  >

        {/* BG IMAGE */}

        <img
          src={preview}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* CONTENT */}
        <div className="relative z-10 w-full h-full">

  {/* CATEGORY */}

  <h1
    className="
      absolute
      top-[280px]
      left-[600px]
     
      text-[52px]
      font-bold
    "
  >
    {form.category}
  </h1>

  {/* COURSE */}

  <h2
    className="
      absolute
      top-[350px]
      left-[700px]
      text-[42px]
      font-bold
      uppercase
    "
  >
    {form.course}
  </h2>

  {/* STUDENT NAME */}

  <h3
    className="
      absolute
      top-[460px]
      left-[710px]
      text-[48px]
      font-bold
      text-yellow-700
      whitespace-nowrap
    "
  >
    {form.studentName}
  </h3>

  {/* DESCRIPTION */}

  <div
    className="
      absolute
      top-[540px]
      left-[350px]
      w-[900px]
      text-center
      text-[24px]
      leading-[42px]
    "
  >

    <p>

      In recognition of successful completion of{" "}

      
        {form.level}
      

      {" "}in{" "}

      
        {form.course}
     

      {" "}under{" "}

      
        {form.category}
    

    </p>

    <p className="mt-6">

      {form.description}

    </p>

  </div>

  {/* DURATION */}

  <p
    className="
      absolute
      bottom-[250px]
      left-[680px]
      text-[24px]
    "
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
      left-[620px]
      text-[24px]
    "
  >
    Date of Completion:
    {" "}
    {form.completionDate}
  </p>

</div>


      </div>

    </div>
  );
}