import { useEffect, useState, useRef } from "react";
import type { ExamTimerProps } from "../../types/examSession";
import { AlarmClock } from "lucide-react";

export function Timer({ endsAt, onTimeUp }: ExamTimerProps) {
  const hasTriggered = useRef(false);

  const [remainingMs, setRemainingMs] = useState(0); // Start at 0, let effect update it

  useEffect(() => {
    // 1. Guard: If data isn't loaded yet, do nothing
    if (!endsAt) {
      console.warn("Timer: 'endsAt' prop is missing or undefined");
      return;
    }
    //Check if the string ends with 'Z'. If not, add it.
    // This forces the browser to treat it as UTC time, not Local time.
    const formattedEndsAt = endsAt.endsWith("Z") ? endsAt : `${endsAt}Z`;
    const targetTime = new Date(formattedEndsAt).getTime();

    // 2. Debugging: Check exactly what the browser thinks the time is
    console.log("Timer Init -> Ends At:", endsAt);
    console.log(
      "Timer Init -> Parsed Target:",
      new Date(targetTime).toLocaleString(),
    );
    console.log("Timer Init -> Current Time:", new Date().toLocaleString());
    console.log("Timer Init -> Diff (ms):", targetTime - Date.now());

    // 3. Validation: If Invalid Date, stop here
    if (isNaN(targetTime)) {
      console.error("Timer Error: Invalid Date format", endsAt);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        setRemainingMs(0);
        clearInterval(interval);

        // 4. Trigger Submission
        if (!hasTriggered.current) {
          console.log("Timer: Time is up. Triggering submission.");
          hasTriggered.current = true;
          onTimeUp();
        }
      } else {
        setRemainingMs(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endsAt, onTimeUp]);

  const hours = Math.floor(remainingMs / 3600000);
  const minutes = Math.floor((remainingMs % 3600000) / 60000);
  const seconds = Math.floor((remainingMs % 60000) / 1000);

  return (
    <div className="">
      <span
        className={`flex items-center gap-2 ${
          remainingMs < 60000 ? "text-red-600 text-lg font-bold" : ""
        }`}
      >
        <AlarmClock className="w-6 h-6" />
        {/* 2. Display formatted string */}
        {hours}:{minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
