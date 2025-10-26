/**
 * Exam Timer Hook
 *
 * Manages countdown timer for exam
 */

"use client";

import { useEffect, useRef } from "react";
import { useExamStore } from "../stores/exam-store";

/**
 * Hook to manage exam countdown timer
 */
export function useExamTimer() {
  const store = useExamStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Don't start timer if exam not initialized or already submitted
    if (!store.startTime || store.isSubmitted) {
      return;
    }

    // Update timer every second
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - store.startTime!.getTime()) / 1000
      );
      const remaining = Math.max(0, 7200 - elapsed); // 7200 = 2 hours

      store.updateTimeRemaining(remaining);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [store.startTime, store.isSubmitted, store]);

  return {
    timeRemaining: store.timeRemaining,
  };
}

// TODO: Add warning at 10 minutes remaining
// TODO: Add pause timer functionality
