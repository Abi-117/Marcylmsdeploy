import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function Metronome() {
  const [bpm, setBpm] = useState(90);
  const [playing, setPlaying] = useState(false);
  const [beat, setBeat] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 🔊 Click sound (optional)
  const playClick = () => {
    const audio = new Audio("/click.mp3"); // put in /public
    audio.volume = 0.7;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    if (!playing) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setBeat(0);
      return;
    }

    const interval = 60000 / bpm;

    intervalRef.current = setInterval(() => {
      setBeat((prev) => {
        const next = (prev + 1) % 4;
        playClick(); // 🔊 sound on every beat
        return next;
      });
    }, interval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, bpm]);

  const reset = () => {
    setPlaying(false);
    setBeat(0);
  };

  return (
    <Card>
      <CardContent className="p-6 text-center">

        {/* BPM DISPLAY */}
        <div className="text-5xl font-bold">{bpm}</div>
        <div className="text-sm text-muted-foreground">BPM</div>

        {/* BEAT VISUAL */}
        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-3 w-3 rounded-full transition-all duration-150 ${
                playing && beat === i ? "bg-yellow-500 scale-125" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* SLIDER */}
        <div className="mt-6">
          <Slider
            value={[bpm]}
            min={40}
            max={220}
            step={1}
            onValueChange={(v) => setBpm(v[0])}
          />
        </div>

        {/* CONTROLS */}
        <div className="flex justify-center gap-3 mt-6">
          <Button onClick={() => setPlaying(!playing)}>
            {playing ? <Pause /> : <Play />}
          </Button>

          <Button variant="outline" onClick={reset}>
            <RotateCcw />
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}