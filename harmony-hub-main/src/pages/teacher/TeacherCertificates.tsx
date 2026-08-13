import {
  useEffect,
  useRef,
  useState,
} from "react";

import axios from "axios";
import html2canvas from "html2canvas-pro";

import preview from "../../assets/certificate-bg.png";
import { Badge } from "@/components/ui/badge";

const API =
  "https://marcylmsdeploy-2.onrender.com/api";

interface Student {
  _id: string;
  name: string;
  email?: string;
  course?: string;
  category?: string;
  level?: string;
}

interface Certificate {
  _id: string;
  studentName: string;
  course: string;
  category?: string;
  level: string;
  duration?: string;
  completionDate?: string;
  status?: string;
  previewImage?: string;
}

interface Course {
  _id?: string;
  name?: string;
  category?: string;
  mainLevel?: string;
  grade?: string;
}

interface CertificateForm {
  student: string;
  studentName: string;
  course: string;
  category: string;
  level: string;
  description: string;
  duration: string;
  completionDate: string;
}

export default function TeacherCertificateForm() {
  // =========================================================
  // REFS
  // =========================================================

  const previewRef =
    useRef<HTMLDivElement>(null);

  // =========================================================
  // STATES
  // =========================================================

  const [levels, setLevels] =
    useState<string[]>([]);

  const [students, setStudents] =
    useState<Student[]>([]);

  const [certificates, setCertificates] =
    useState<Certificate[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState<CertificateForm>({
      student: "",
      studentName: "",
      course: "Guitar",
      category: "Western Music",
      level: "Basic",
      description:
        "With dedication, enthusiasm, and excellence in communication, confidence-building, stage presence, voice modulation, expression, and presentation skills.",
      duration: "1 Year",
      completionDate: new Date().toDateString(),
    });

  // =========================================================
  // TEACHER ID
  // =========================================================
  // Keeping localStorage approach avoids the missing useAuth()
  // import/error from the original code.
  // =========================================================

  const teacherId =
    localStorage.getItem("userId");

  // =========================================================
  // FIX OKLCH / HTML2CANVAS BACKGROUND
  // =========================================================

  useEffect(() => {
    const previousBackground =
      document.body.style.backgroundColor;

    const previousColor =
      document.body.style.color;

    document.body.style.backgroundColor =
      "#f3f4f6";

    document.body.style.color =
      "#000000";

    return () => {
      document.body.style.backgroundColor =
        previousBackground;

      document.body.style.color =
        previousColor;
    };
  }, []);

  // =========================================================
  // FETCH LEVELS
  // =========================================================

  const fetchLevels = async () => {
    try {
      const res =
        await axios.get<Course[]>(
          `${API}/courses`
        );

      const allLevels =
        res.data
          .filter(
            (course) =>
              course.mainLevel &&
              course.grade
          )
          .map(
            (course) =>
              `${course.mainLevel} - ${course.grade}`
          );

      const uniqueLevels =
        Array.from(
          new Set(allLevels)
        );

      setLevels(uniqueLevels);
    } catch (err) {
      console.error(
        "FETCH LEVELS ERROR:",
        err
      );

      setLevels([]);
    }
  };

  // =========================================================
  // FETCH STUDENTS
  // =========================================================

  const fetchStudents = async () => {
    try {
      const res =
        await axios.get<Student[]>(
          `${API}/teacher/students`
        );

      setStudents(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (err) {
      console.error(
        "FETCH STUDENTS ERROR:",
        err
      );

      setStudents([]);
    }
  };

  // =========================================================
  // FETCH CERTIFICATES
  // =========================================================

  const fetchCertificates = async () => {
    if (!teacherId) {
      console.warn(
        "Teacher ID not found"
      );

      setCertificates([]);
      return;
    }

    try {
      setLoading(true);

      const res =
        await axios.get<Certificate[]>(
          `${API}/certificates/teacher/${teacherId}`
        );

      setCertificates(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (err) {
      console.error(
        "FETCH CERTIFICATES ERROR:",
        err
      );

      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL DATA
  // =========================================================

  useEffect(() => {
    fetchLevels();
    fetchStudents();
  }, []);

  // =========================================================
  // FETCH TEACHER CERTIFICATES
  // =========================================================

  useEffect(() => {
    if (!teacherId) {
      return;
    }

    fetchCertificates();
  }, [teacherId]);

  // =========================================================
  // HANDLE FORM CHANGE
  // =========================================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // HANDLE STUDENT CHANGE
  // =========================================================

  const handleStudent = (
    e: React.ChangeEvent<
      HTMLSelectElement
    >
  ) => {
    const selectedId =
      e.target.value;

    const selected =
      students.find(
        (student) =>
          student._id === selectedId
      );

    setForm((prev) => ({
      ...prev,
      student:
        selected?._id || "",
      studentName:
        selected?.name || "",
    }));
  };

  // =========================================================
  // SEND CERTIFICATE REQUEST
  // =========================================================

  const sendRequest = async () => {
    if (!previewRef.current) {
      alert(
        "Certificate preview is not ready."
      );
      return;
    }

    if (!teacherId) {
      alert(
        "Teacher ID not found. Please login again."
      );
      return;
    }

    if (!form.student) {
      alert(
        "Please select a student."
      );
      return;
    }

    if (!form.studentName) {
      alert(
        "Student name is missing."
      );
      return;
    }

    if (!form.course.trim()) {
      alert(
        "Please enter the course."
      );
      return;
    }

    if (!form.category.trim()) {
      alert(
        "Please enter the category."
      );
      return;
    }

    if (!form.level.trim()) {
      alert(
        "Please select a level."
      );
      return;
    }

    if (!form.duration.trim()) {
      alert(
        "Please enter the course duration."
      );
      return;
    }

    if (!form.completionDate.trim()) {
      alert(
        "Please enter completion date."
      );
      return;
    }

    try {
      setLoading(true);

      // -----------------------------------------------------
      // Wait until browser fonts are completely loaded.
      // This helps html2canvas capture text correctly.
      // -----------------------------------------------------

      if (
        document.fonts &&
        document.fonts.ready
      ) {
        await document.fonts.ready;
      }

      // -----------------------------------------------------
      // Generate certificate preview image
      // -----------------------------------------------------

      const canvas =
        await html2canvas(
          previewRef.current,
          {
            scale: 3,
            useCORS: true,
            backgroundColor:
              "#ffffff",
            logging: false,
          }
        );

      const previewImage =
        canvas.toDataURL(
          "image/jpeg",
          0.9
        );

      // -----------------------------------------------------
      // Send certificate request
      // -----------------------------------------------------

      await axios.post(
        `${API}/certificates/create`,
        {
          student:
            form.student,

          studentName:
            form.studentName,

          teacher:
            teacherId,

          course:
            form.course,

          category:
            form.category,

          level:
            form.level,

          duration:
            form.duration,

          completionDate:
            form.completionDate,

          previewImage:
            previewImage,
        }
      );

      alert(
        "Certificate Request Sent"
      );

      // -----------------------------------------------------
      // Refresh certificate list
      // -----------------------------------------------------

      await fetchCertificates();

    } catch (err: any) {
      console.error(
        "SEND CERTIFICATE REQUEST ERROR:",
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Request Failed";

      alert(message);

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RETURN UI
  // =========================================================

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
        {/* =================================================
            FORM
        ================================================= */}

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

            {/* =================================================
                STUDENT
            ================================================= */}

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
                value={form.student}
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

            {/* =================================================
                COURSE
            ================================================= */}

            <div>
              <label
                className="
                  block
                  mb-2
                  text-sm
                  font-medium
                "
              >
                Course
              </label>

              <input
                type="text"
                name="course"
                value={form.course}
                onChange={
                  handleChange
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
              />
            </div>

            {/* =================================================
                CATEGORY
            ================================================= */}

            <div>
              <label
                className="
                  block
                  mb-2
                  text-sm
                  font-medium
                "
              >
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
                style={{
                  backgroundColor:
                    "#ffffff",
                  borderColor:
                    "#d1d5db",
                }}
              />
            </div>

            {/* =================================================
                LEVEL
            ================================================= */}

            <div>
              <label
                className="
                  block
                  mb-2
                  text-sm
                  font-medium
                "
              >
                Level
              </label>

              <select
                name="level"
                value={form.level}
                onChange={
                  handleChange
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
                  Select Level
                </option>

                {levels.map(
                  (level) => (
                    <option
                      key={level}
                      value={level}
                    >
                      {level}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <div>
              <label
                className="
                  block
                  mb-2
                  text-sm
                  font-medium
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
                  rounded-lg
                  p-3
                  h-40
                  resize-none
                "
                style={{
                  backgroundColor:
                    "#ffffff",
                  borderColor:
                    "#d1d5db",
                }}
              />
            </div>

            {/* =================================================
                DURATION
            ================================================= */}

            <div>
              <label
                className="
                  block
                  mb-2
                  text-sm
                  font-medium
                "
              >
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
                style={{
                  backgroundColor:
                    "#ffffff",
                  borderColor:
                    "#d1d5db",
                }}
              />
            </div>

            {/* =================================================
                COMPLETION DATE
            ================================================= */}

            <div>
              <label
                className="
                  block
                  mb-2
                  text-sm
                  font-medium
                "
              >
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
                style={{
                  backgroundColor:
                    "#ffffff",
                  borderColor:
                    "#d1d5db",
                }}
              />
            </div>

            {/* =================================================
                SEND BUTTON
            ================================================= */}

            <button
              type="button"
              onClick={
                sendRequest
              }
              disabled={loading}
              style={{
                backgroundColor:
                  loading
                    ? "#6b7280"
                    : "#000000",
                color:
                  "#ffffff",
              }}
              className="
                w-full
                rounded-lg
                py-3
                font-semibold
                mt-4
                disabled:cursor-not-allowed
              "
            >
              {loading
                ? "Sending..."
                : "Send Request"}
            </button>

          </div>
        </div>

        {/* =================================================
            PREVIEW
        ================================================= */}

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
          <div
            className="
              overflow-auto
              w-full
            "
          >
            {/* =================================================
                CERTIFICATE
            ================================================= */}

            <div
              ref={previewRef}
              className="
                relative
                w-[1400px]
                h-[1000px]
                overflow-hidden
                rounded-lg
              "
              style={{
                backgroundColor:
                  "#ffffff",
              }}
            >
              {/* =================================================
                  BACKGROUND IMAGE
              ================================================= */}

              <img
                src={preview}
                alt="Certificate Background"
                className="
                  absolute
                  inset-0
                  w-full
                  h-full
                  object-cover
                "
                crossOrigin="anonymous"
              />

              {/* =================================================
                  CERTIFICATE CONTENT
              ================================================= */}

              <div
                className="
                  relative
                  z-10
                  w-full
                  h-full
                "
              >

                {/* =================================================
                    CATEGORY
                ================================================= */}

                <h1
                  className="
                    absolute
                    top-[250px]
                    left-1/2
                    -translate-x-1/2
                    text-[72px]
                    font-bold
                    text-center
                    w-[900px]
                  "
                  style={{
                    color:
                      "#000000",
                  }}
                >
                  {form.category}
                </h1>

                {/* =================================================
                    COURSE
                ================================================= */}

                <h2
                  className="
                    absolute
                    top-[340px]
                    left-1/2
                    -translate-x-1/2
                    text-center
                    w-[900px]
                    text-[52px]
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

                {/* =================================================
                    STUDENT
                ================================================= */}

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
                    color:
                      "#b68b2d",
                  }}
                >
                  {form.studentName}
                </h3>

                {/* =================================================
                    DESCRIPTION
                ================================================= */}

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
                    style={{
                      color:
                        "#000000",
                    }}
                  >
                    In recognition of
                    successful
                    completion of{" "}
                    {form.level} in{" "}
                    {form.course} in{" "}
                    {form.category}
                  </p>

                  <p
                    className="
                      mt-4
                      text-[22px]
                      leading-[34px]
                      break-words
                      whitespace-normal
                    "
                    style={{
                      color:
                        "#000000",
                    }}
                  >
                    {form.description}
                  </p>
                </div>

                {/* =================================================
                    DURATION
                ================================================= */}

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
                  Course Duration:{" "}
                  {form.duration}
                </p>

                {/* =================================================
                    COMPLETION DATE
                ================================================= */}

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
                  Date of Completion:{" "}
                  {form.completionDate}
                </p>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          CERTIFICATE REQUEST HISTORY
      ========================================================= */}

      <div
        className="
          mt-10
          grid
          gap-5
          md:grid-cols-2
          lg:grid-cols-3
        "
      >
        {certificates.map(
          (certificate) => (
            <div
              key={
                certificate._id
              }
              className="
                group
                bg-white
                border
                border-slate-200
                rounded-2xl
                p-6
                shadow-sm
                hover:shadow-xl
                hover:-translate-y-1
                transition-all
                duration-300
              "
            >
              {/* =================================================
                  HEADER
              ================================================= */}

              <div
                className="
                  flex
                  items-start
                  justify-between
                  mb-4
                "
              >
                <div>
                  <h3
                    className="
                      text-lg
                      font-bold
                      text-slate-800
                      capitalize
                    "
                  >
                    {
                      certificate.studentName
                    }
                  </h3>

                  <p
                    className="
                      text-sm
                      text-slate-500
                      mt-1
                    "
                  >
                    Certificate Details
                  </p>
                </div>

                <Badge
                  className={
                    certificate.status ===
                    "approved"
                      ? "bg-green-600 text-white hover:bg-green-600"
                      : "bg-orange-500 text-white hover:bg-orange-500"
                  }
                >
                  {certificate.status ===
                  "approved"
                    ? "Completed"
                    : "Pending Approval"}
                </Badge>
              </div>

              {/* =================================================
                  DETAILS
              ================================================= */}

              <div
                className="
                  space-y-3
                "
              >
                <div
                  className="
                    flex
                    justify-between
                    gap-4
                    border-b
                    pb-2
                  "
                >
                  <span
                    className="
                      text-slate-500
                      text-sm
                    "
                  >
                    Course
                  </span>

                  <span
                    className="
                      font-medium
                      text-slate-800
                      text-right
                    "
                  >
                    {
                      certificate.course
                    }
                  </span>
                </div>

                <div
                  className="
                    flex
                    justify-between
                    gap-4
                  "
                >
                  <span
                    className="
                      text-slate-500
                      text-sm
                    "
                  >
                    Level
                  </span>

                  <span
                    className="
                      font-medium
                      text-slate-800
                      text-right
                    "
                  >
                    {
                      certificate.level
                    }
                  </span>
                </div>

                {certificate.duration && (
                  <div
                    className="
                      flex
                      justify-between
                      gap-4
                    "
                  >
                    <span
                      className="
                        text-slate-500
                        text-sm
                      "
                    >
                      Duration
                    </span>

                    <span
                      className="
                        font-medium
                        text-slate-800
                        text-right
                      "
                    >
                      {
                        certificate.duration
                      }
                    </span>
                  </div>
                )}

                {certificate.completionDate && (
                  <div
                    className="
                      flex
                      justify-between
                      gap-4
                    "
                  >
                    <span
                      className="
                        text-slate-500
                        text-sm
                      "
                    >
                      Completion Date
                    </span>

                    <span
                      className="
                        font-medium
                        text-slate-800
                        text-right
                      "
                    >
                      {
                        certificate.completionDate
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}