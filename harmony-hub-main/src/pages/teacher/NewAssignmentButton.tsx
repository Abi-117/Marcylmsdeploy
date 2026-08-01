import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const API = "https://marcylmsdeploy-2.onrender.com/api";

function NewAssignmentButton({ onRefresh }: any) {
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // FETCH STUDENTS
  // =========================
  const fetchStudents = async () => {
  try {

    const authData = JSON.parse(
      localStorage.getItem("ms-auth") || "{}"
    );

    const teacher = authData?.state?.user;

    const teacherId = teacher?._id || teacher?.id;

    const res = await axios.get(
      `${API}/admin/teacher/${teacherId}/students`
    );

    setStudents(res.data || []);

  } catch (err) {

    console.log(err);

  }
};

  useEffect(() => {
    fetchStudents();
  }, []);

  // =========================
  // TOGGLE STUDENT
  // =========================
  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  };

  // =========================
  // CREATE
  // =========================
const createAssignment = async () => {

  if (loading) return;

  try {

    if (
      !title ||
      selectedStudents.length === 0
    ) {
      return alert("Fill all fields");
    }

    setLoading(true);

    const authData = JSON.parse(
      localStorage.getItem("ms-auth") || "{}"
    );

    const teacher =
      authData?.state?.user;

    await axios.post(
      `${API}/assignments/create`,
      {
        title,

        due,

        studentIds:
          selectedStudents,

        teacherId:
          teacher?._id || teacher?.id,

        teacherName:
          teacher?.name,
      }
    );

    alert(
      "Assignment created successfully"
    );

    setTitle("");
    setDue("");
    setSelectedStudents([]);

    onRefresh?.();

  } catch (err) {

    console.log(err);

    alert("Create failed");

  } finally {

    setLoading(false);

  }

};

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gold text-black">
          + New Assignment
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Assignment</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">

          {/* TITLE */}
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* STUDENTS MULTI SELECT */}
          <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
            {students.map((s) => (
              <label
                key={s._id}
                className="flex items-center gap-2 py-1 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(s._id)}
                  onChange={() => toggleStudent(s._id)}
                />
                {s.name}
              </label>
            ))}
          </div>

          {/* DUE */}
          <Input
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
          />

          {/* SUBMIT */}
          <Button onClick={createAssignment} disabled={loading}>
            {loading ? "Creating..." : "Create Assignment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default NewAssignmentButton;