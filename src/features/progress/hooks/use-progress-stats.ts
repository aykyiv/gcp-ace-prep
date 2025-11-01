/**
 * Progress Statistics Hook
 *
 * Provides basic progress metrics for the dashboard
 */

"use client";

import { useState, useEffect } from "react"; // Changed from useMemo to useState/useEffect
import {
  calculateOverallAccuracy,
  getTotalQuestionsAnswered,
  getStudyStreak,
  getTotalStudyTime,
  getRecentSessions,
} from "../services/progress-service";
import { useAllQuestions } from "@/features/quiz/hooks/use-questions";
import type { SessionHistoryRecord } from "@/features/quiz/types/session.types";

/**
 * Interface defining the complete structure of the progress stats object
 */
interface ProgressStats {
  totalQuestions: number;
  questionsAnswered: number;
  completionPercentage: number;
  overallAccuracy: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
  totalStudyTime: number;
  recentSessions: SessionHistoryRecord[];
}
// Define a default state object for server rendering
const DEFAULT_STATS: ProgressStats = {
  totalQuestions: 0,
  questionsAnswered: 0,
  completionPercentage: 0,
  overallAccuracy: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: "",
  totalStudyTime: 0,
  recentSessions: [],
};

/**
 * Hook to get overall progress statistics
 */
export function useProgressStats() {
  const { data: allQuestions } = useAllQuestions();
  const [stats, setStats] = useState(DEFAULT_STATS); // Initialize state with safe default

  useEffect(() => {
    // This code only runs in the browser, after the component has mounted.
    // This ensures all progress-service functions (which access localStorage) are safe.

    const totalQuestions = allQuestions?.length || 0;

    const questionsAnswered = getTotalQuestionsAnswered();
    const overallAccuracy = calculateOverallAccuracy();
    const streak = getStudyStreak();
    const totalStudyTime = getTotalStudyTime();
    const recentSessions = getRecentSessions(7);

    // Calculate completion percentage
    const completionPercentage =
      totalQuestions > 0
        ? Math.round((questionsAnswered / totalQuestions) * 100)
        : 0;

    setStats({
      totalQuestions,
      questionsAnswered,
      completionPercentage,
      overallAccuracy,
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastStudyDate: streak.lastStudyDate,
      totalStudyTime,
      recentSessions,
    });
  }, [allQuestions]);

  // Return the state. It will be DEFAULT_STATS during SSR/build, and the real data after mounting.
  return stats;
}

// TODO: Add comparison to previous week
// TODO: Add daily average calculations
