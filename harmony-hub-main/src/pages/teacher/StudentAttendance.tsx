import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/store/auth";

const API = "https://marcylmsdeploy.onrender.com/api";

export default function StudentAttendance() {
  const { user } = useAuth();

  const studentId = user?.id;

  const [data, setData] = useState([]);

  useEffect(() => {
    if (!studentId) return;

    axios
      .get(`${API}/attendance/student/${studentId}`)
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, [studentId]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">My Attendance</h1>

      {data.map((a: any) => (
        <div key={a._id} className="border p-3 mt-2">
          <p>{a.classTitle}</p>
          <p>{a.courseName}</p>
          <p>{a.date}</p>
          <p>Status: {a.status}</p>
        </div>
      ))}
    </div>
  );
}