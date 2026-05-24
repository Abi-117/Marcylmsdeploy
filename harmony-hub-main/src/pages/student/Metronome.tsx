import { useEffect, useRef, useState } from "react";

export default function Metronome() {
  const [bpm, setBpm] = useState(90);
  const [playing, setPlaying] = useState(false);

  const intervalRef = useRef<any>(null);

  // 🎧 CLICK SOUND (clean web audio)
  const playClick = () => {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = 1000;
    gain.gain.value = 0.1;

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  };

  useEffect(() => {
    if (!playing) {
      clearInterval(intervalRef.current);
      return;
    }

    const interval = (60 / bpm) * 1000;

    intervalRef.current = setInterval(() => {
      playClick();
    }, interval);

    return () => clearInterval(intervalRef.current);
  }, [playing, bpm]);

  return (
    <div className="p-4 border rounded-xl text-center">
      <h2 className="text-3xl font-bold">{bpm} BPM</h2>

      <input
        type="range"
        min={40}
        max={220}
        value={bpm}
        onChange={(e) => setBpm(Number(e.target.value))}
        className="w-full mt-4"
      />

      <button
        onClick={() => setPlaying(!playing)}
        className="mt-4 px-4 py-2 bg-black text-white rounded"
      >
        {playing ? "Stop" : "Start"}
      </button>
    </div>
  );
}