import {
  useEffect,
  useRef,
  useState,
} from "react";

import axios from "axios";

import html2canvas
from "html2canvas";

import preview
from "../../assets/certificate-bg.png";

const API =
  "http://localhost:5000/api";

export default function
TeacherCertificateForm() {

  // =========================
  // STATES
  // =========================

  const [
    students,
    setStudents,
  ] = useState<any[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const previewRef =
    useRef<any>(null);

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
  // HANDLE INPUT
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

  const sendRequest =
    async () => {

      try {

        setLoading(true);

        const canvas =
          await html2canvas(
            previewRef.current,
            {
              scale: 2,
              useCORS: true,
              backgroundColor:
                "#ffffff",
            }
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

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }
    };

  return (

    <div
      className="
        min-h-screen
        bg-gray-100
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
          className="
            w-full
            xl:w-[420px]
            bg-white
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
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-lg
                  p-3
                  bg-white
                "
                onChange={
                  handleStudent
                }
                value={
                  form.student
                }
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

              <label
                className="
                  text-sm
                  font-medium
                  mb-2
                  block
                "
              >
                Course
              </label>

              <input
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
                  border-gray-300
                  rounded-lg
                  p-3
                "
              />

            </div>

            {/* CATEGORY */}

            <div>

              <label
                className="
                  text-sm
                  font-medium
                  mb-2
                  block
                "
              >
                Category
              </label>

              <input
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
                  border-gray-300
                  rounded-lg
                  p-3
                "
              />

            </div>

            {/* LEVEL */}

            <div>

              <label
                className="
                  text-sm
                  font-medium
                  mb-2
                  block
                "
              >
                Level
              </label>

              <input
                name="level"
                value={
                  form.level
                }
                onChange={
                  handleChange
                }
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-lg
                  p-3
                "
              />

            </div>

            {/* DESCRIPTION */}

            <div>

              <label
                className="
                  text-sm
                  font-medium
                  mb-2
                  block
                "
              >
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
                  border-gray-300
                  rounded-lg
                  p-3
                  h-40
                "
              />

            </div>

            {/* DURATION */}

            <div>

              <label
                className="
                  text-sm
                  font-medium
                  mb-2
                  block
                "
              >
                Duration
              </label>

              <input
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
                  border-gray-300
                  rounded-lg
                  p-3
                "
              />

            </div>

            {/* DATE */}

            <div>

              <label
                className="
                  text-sm
                  font-medium
                  mb-2
                  block
                "
              >
                Completion Date
              </label>

              <input
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
                  border-gray-300
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
              className="
                w-full
                bg-black
                text-white
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
            bg-white
            rounded-2xl
            shadow-lg
            p-3
            md:p-5
          "
        >

          {/* RESPONSIVE WRAPPER */}

          <div
            className="
              w-full
              overflow-auto
            "
          >

            {/* CERTIFICATE */}

            <div
              ref={previewRef}
              className="
                relative
                w-[1400px]
                h-[1000px]
                overflow-hidden
                rounded-lg
                bg-white
                origin-top-left

                scale-[0.18]

                sm:scale-[0.24]

                md:scale-[0.32]

                lg:scale-[0.40]

                xl:scale-[0.48]
              "
              style={{
                backgroundColor:
                  "#ffffff",

                color:
                  "#000000",
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

              <div
                className="
                  relative
                  z-10
                  w-full
                  h-full
                "
              >

                {/* CATEGORY */}

                <h1
                  className="
                    absolute
                    top-[280px]
                    left-[600px]
                    text-[52px]
                    font-bold
                    whitespace-nowrap
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
                    whitespace-nowrap
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

        </div>

      </div>

    </div>
  );
}