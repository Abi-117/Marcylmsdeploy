import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import { PageHeader, StatCard } from "@/components/dashboard/Primitives";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

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

export default function Practice() {
  const studentId = "student123"; // replace with login user later

  const [history, setHistory] = useState<any[]>([]);

  // LOAD REAL DATA FROM BACKEND
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API}/practice/${studentId}`);
      setHistory(res.data);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  // TODAY MINUTES
  const todayMinutes = history
    .filter((h) => {
      const d = new Date(h.createdAt);
      const t = new Date();
      return d.toDateString() === t.toDateString();
    })
    .reduce((a, b) => a + (b.duration || 0), 0) / 60;

  // TOTAL MINUTES
  const totalMinutes =
    history.reduce((a, b) => a + (b.duration || 0), 0) / 60;

  // CHART DATA
  const chartData = history.map((h) => ({
    date: new Date(h.createdAt).toLocaleDateString(),
    minutes: (h.duration || 0) / 60,
  }));

  return (
    <div>
      <PageHeader
        title="Practice Studio"
        subtitle="Timer + Metronome + Video Upload + Analytics"
      />

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Today"
          value={`${todayMinutes.toFixed(0)} min`}
          icon={Music2}
          accent
        />
        <StatCard label="Streak" value="Live" icon={Flame} />
        <StatCard
          label="Total Practice"
          value={`${totalMinutes.toFixed(0)} min`}
          icon={Target}
        />
      </div>

      {/* MAIN TOOLS */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <PracticeTimer studentId={studentId} onSave={fetchHistory} />
        <Metronome />
        <VideoUpload studentId={studentId} onUpload={fetchHistory} />
      </div>

      {/* ANALYTICS */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="font-display text-lg mb-4">
            Practice Analytics
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="minutes" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

//
// ================= TIMER =================
//
function PracticeTimer({ studentId, onSave }: any) {
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
        notes: "Timer session",
        bpm: 0,
        videoUrl: "manual",
      });

      setSec(0);
      setRunning(false);
      onSave();
      alert("Saved successfully");
    } catch (err) {
      console.log(err);
      alert("Save failed");
    }
  };

  return (
    <Card>
      <CardContent className="p-6 text-center">
        <div className="font-display text-5xl">
          {Math.floor(sec / 60)}:
          {(sec % 60).toString().padStart(2, "0")}
        </div>

        <div className="flex gap-3 justify-center mt-4">
          <Button onClick={() => setRunning(!running)}>
            {running ? <Pause /> : <Play />}
          </Button>

          <Button onClick={saveSession} variant="outline">
            Save
          </Button>

          <Button onClick={() => setSec(0)} variant="outline">
            <RotateCcw />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

//
// ================= METRONOME =================
//
function Metronome() {
  const [bpm, setBpm] = useState(90);
  const [playing, setPlaying] = useState(false);
  const [beat, setBeat] = useState(0);

  const ref = useRef<any>(null);

  useEffect(() => {
    if (!playing) {
      setBeat(0);
      return;
    }

    const interval = 60000 / bpm;

    ref.current = setInterval(() => {
      setBeat((b) => (b + 1) % 4);
    }, interval);

    return () => clearInterval(ref.current);
  }, [playing, bpm]);

  return (
    <Card>
      <CardContent className="p-6 text-center">
        <div className="font-display text-5xl">{bpm}</div>
        <div className="text-sm text-muted-foreground">BPM</div>

        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-3 w-3 rounded-full ${
                playing && beat === i ? "bg-yellow-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <Slider
          value={[bpm]}
          min={40}
          max={220}
          step={1}
          onValueChange={(v) => setBpm(v[0])}
          className="mt-6"
        />

        <Button
          className="mt-4"
          variant="outline"
          onClick={() => setPlaying(!playing)}
        >
          {playing ? <Pause /> : <Play />}
        </Button>
      </CardContent>
    </Card>
  );
}

//
// ================= VIDEO UPLOAD =================
//
function VideoUpload({ studentId, onUpload }: any) {
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");

  const upload = async () => {
    if (!file) return alert("Select video");

    const formData = new FormData();
    formData.append("video", file);
    formData.append("studentId", studentId);
    formData.append("notes", notes);

    try {
      await axios.post(`${API}/practice/upload`, formData);
      alert("Uploaded");
      setFile(null);
      setNotes("");
      onUpload();
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="font-semibold mb-2">Upload Practice Video</div>

        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <textarea
          className="w-full border mt-2 p-2"
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Button onClick={upload} className="mt-3 w-full">
          <Upload className="mr-2" /> Upload
        </Button>
      </CardContent>
    </Card>
  );
}