import { useEffect, useState } from "react";
import axios from "axios";

import { PageHeader, StatCard } from "@/components/dashboard/Primitives";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Metronome from "@/pages/student/Metronome";

import {
  Play,
  Pause,
  RotateCcw,
  Upload,
  Flame,
  Target,
  Music2,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";

const API = "https://marcylmsdeploy.onrender.com/api";

/* ================= MAIN PAGE ================= */

export default function Practice() {
  const getUserId = () => {
    try {
      return JSON.parse(localStorage.getItem("user"))?._id || null;
    } catch {
      return null;
    }
  };

  const studentId = getUserId();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) fetchHistory();
    else setLoading(false);
  }, [studentId]);

  const fetchHistory = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/practice/${studentId}`);

      setHistory(res.data || []);
    } catch (err) {
      console.log("Fetch error:", err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= CALCULATIONS ================= */

  const todayMinutes =
    history
      .filter(
        (h) =>
          new Date(h.createdAt).toDateString() ===
          new Date().toDateString()
      )
      .reduce((a, b) => a + (b.duration || 0), 0) / 60;

  const totalMinutes =
    history.reduce((a, b) => a + (b.duration || 0), 0) / 60;

  const chartData = history.map((h) => ({
    date: new Date(h.createdAt).toLocaleDateString(),
    minutes: (h.duration || 0) / 60,
  }));

  if (loading) {
    return (
      <div className="p-6 text-muted-foreground">
        Loading practice data...
      </div>
    );
  }

  if (!studentId) {
    return (
      <div className="p-6 text-red-500">
        No user found. Please login again.
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Practice Studio"
        subtitle="Real-time tracking system"
      />

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Today"
          value={`${todayMinutes.toFixed(0)} min`}
          icon={Music2}
          accent
        />

        <StatCard
          label="Streak"
          value={history.length > 0 ? "Active 🔥" : "0"}
          icon={Flame}
        />

        <StatCard
          label="Total Practice"
          value={`${totalMinutes.toFixed(0)} min`}
          icon={Target}
        />
      </div>

      {/* TOOLS */}
      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        <PracticeTimer studentId={studentId} onSave={fetchHistory} />
        <Metronome />
        <VideoUpload studentId={studentId} onUpload={fetchHistory} />
      </div>

      {/* CHART */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line dataKey="minutes" stroke="#f59e0b" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

/* ================= TIMER ================= */

function PracticeTimer({ studentId, onSave }) {
  const [sec, setSec] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const i = setInterval(() => setSec((s) => s + 1), 1000);
    return () => clearInterval(i);
  }, [running]);

  const saveSession = async () => {
    try {
      await axios.post(`${API}/practice/upload`, {
        studentId,
        duration: sec,
        notes: "Practice session",
        bpm: 0,
      });

      setSec(0);
      setRunning(false);
      onSave();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card>
      <CardContent className="p-6 text-center">
        <div className="text-4xl font-bold">
          {Math.floor(sec / 60)}:{(sec % 60).toString().padStart(2, "0")}
        </div>

        <div className="flex gap-3 justify-center mt-4">
          <Button onClick={() => setRunning(!running)}>
            {running ? <Pause /> : <Play />}
          </Button>

          <Button onClick={saveSession}>Save</Button>

          <Button onClick={() => setSec(0)}>
            <RotateCcw />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


/* ================= VIDEO UPLOAD ================= */

function VideoUpload({ studentId, onUpload }) {
  const [file, setFile] = useState(null);

  const upload = async () => {
    if (!file || !studentId) return;

    const formData = new FormData();
    formData.append("video", file);
    formData.append("studentId", studentId);

    try {
      await axios.post(`${API}/practice/video`, formData);
      setFile(null);
      onUpload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <Button className="mt-3 w-full" onClick={upload}>
          <Upload className="mr-2" />
          Upload
        </Button>
      </CardContent>
    </Card>
  );
}