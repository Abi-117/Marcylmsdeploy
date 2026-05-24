import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const API = "https://marcylmsdeploy.onrender.com/api";

function NewAssignmentButton({ onRefresh }: any) {
  const [title, setTitle] = useState("");
  const [studentName, setStudentName] = useState("");
  const [due, setDue] = useState("");
  const [loading, setLoading] = useState(false);

  const createAssignment = async () => {
    if (!title || !studentName) {
      return alert("Fill all fields");
    }

    try {
      setLoading(true);

      await axios.post(`${API}/assignments/create`, {
        title,
        studentName,
        due,
        teacherId: "teacher1",
        status: "Pending",
      });

      setTitle("");
      setStudentName("");
      setDue("");

      onRefresh(); // reload list
      alert("Assignment created!");
    } catch (err) {
      console.log(err);
      alert("Failed to create");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gold text-black">
          New assignment
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Assignment</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input
            placeholder="Student Name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />

          <Input
            placeholder="Due (e.g. 3 days / Tomorrow)"
            value={due}
            onChange={(e) => setDue(e.target.value)}
          />

          <Button onClick={createAssignment} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default NewAssignmentButton;