import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause } from "lucide-react";

export default function Metronome() {
  const [bpm, setBpm] = useState(90);
  const [playing, setPlaying] = useState(false);
  const [beat, setBeat] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // optional click sound
  useEffect(() => {
    audioRef.current = new Audio(
      "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
    );
  }, []);

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

        // play sound on beat 1
        if (next === 0 && audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
        }

        return next;
      });
    }, interval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, bpm]);

  return (
    <Card>
      <CardContent className="p-6 text-center">
        {/* BPM DISPLAY */}
        <div className="text-5xl font-bold">{bpm}</div>
        <div className="text-sm text-muted-foreground">BPM</div>

        {/* BEAT INDICATOR */}
        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-3 w-3 rounded-full transition-all ${
                playing && beat === i
                  ? "bg-yellow-500 scale-125"
                  : "bg-gray-300"
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

        {/* BUTTON */}
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => setPlaying((p) => !p)}
        >
          {playing ? (
            <>
              <Pause className="mr-2 h-4 w-4" />
              Stop
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Start
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}