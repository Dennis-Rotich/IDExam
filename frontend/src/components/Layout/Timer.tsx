import { useState, useEffect, useRef } from "react";
import { Clock, AlertCircle } from "lucide-react";

interface TimerProps {
  endsAt: string;
  onTimeUp: () => void;
}

export function Timer({ endsAt, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const targetTime = new Date(endsAt).getTime();

    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft(0);
        if (!hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          onTimeUp();
        }
      } else {
        setTimeLeft(difference);
      }
    };

    // Initial calculation
    calculateTimeLeft();

    // Re-calculate every second
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [endsAt, onTimeUp]);

  // Formatting math
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  const formatTime = (time: number) => time.toString().padStart(2, "0");

  // Determine alert states
  const isWarning = timeLeft <= 5 * 60 * 1000 && timeLeft > 60 * 1000; // Under 5 mins
  const isCritical = timeLeft <= 60 * 1000 && timeLeft > 0; // Under 1 min

  return (
    <div
      className={`flex items-center gap-2 font-mono px-3 py-1.5 rounded border transition-colors ${
        isCritical
          ? "bg-red-900/20 border-red-500/50 text-red-400 animate-pulse"
          : isWarning
          ? "bg-amber-900/20 border-amber-500/50 text-amber-400"
          : "bg-zinc-800 border-zinc-700 text-zinc-300"
      }`}
    >
      {isCritical ? <AlertCircle size={16} /> : <Clock size={16} />}
      <span className="text-sm tracking-widest font-bold">
        {hours > 0 ? `${formatTime(hours)}:` : ""}
        {formatTime(minutes)}:{formatTime(seconds)}
      </span>
    </div>
  );
}