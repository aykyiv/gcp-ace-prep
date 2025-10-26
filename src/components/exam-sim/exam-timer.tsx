/**
 * Exam Timer Component
 *
 * Large, prominent countdown timer
 */

"use client";

import { useExamTimer } from "@/features/exam-sim/hooks/use-exam-timer";
import { cn } from "@/lib/utils";

export function ExamTimer() {
  const { timeRemaining } = useExamTimer();

  // Format time as HH:MM:SS
  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;

  const timeString = `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  // Determine color based on time remaining
  const getTimerColor = () => {
    if (timeRemaining > 1800) return "text-green-600"; // >30 min
    if (timeRemaining > 600) return "text-yellow-600"; // >10 min
    return "text-red-600"; // <10 min
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-600">Time Remaining:</span>
      <div className={cn("text-2xl font-bold font-mono", getTimerColor())}>
        {timeString}
      </div>
    </div>
  );
}

// TODO: Add visual warning animation when time is low
// TODO: Add sound alert at 5 minutes
