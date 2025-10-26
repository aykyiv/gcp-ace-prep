/**
 * Session Service
 *
 * Handles session persistence and history tracking
 */

import { storage } from "@/lib/storage";
import type {
  SessionHistoryRecord,
  SessionConfig,
  SessionSummary,
} from "../types/session.types";

/**
 * Saves a completed session to history
 */
export function saveSessionToHistory(
  config: SessionConfig,
  summary: SessionSummary
): void {
  const record: SessionHistoryRecord = {
    sessionId: summary.sessionId,
    date: new Date(),
    config,
    summary,
  };

  storage.addSessionRecord(record);
}

/**
 * Gets recent session history
 *
 * @param count - Number of sessions to retrieve
 * @returns Array of session records
 */
export function getRecentSessions(count: number = 10): SessionHistoryRecord[] {
  const history = storage.loadSessionHistory();
  return history.slice(-count).reverse(); // Most recent first
}

/**
 * Gets session statistics for a date range
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Aggregated statistics
 */
export function getSessionStats(startDate: Date, endDate: Date) {
  const sessions = storage.getSessionsByDateRange(startDate, endDate);

  const totalSessions = sessions.length;
  const totalQuestions = sessions.reduce(
    (sum, s) => sum + s.summary.answeredQuestions,
    0
  );
  const totalCorrect = sessions.reduce(
    (sum, s) => sum + s.summary.correctAnswers,
    0
  );
  const averageAccuracy =
    totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

  return {
    totalSessions,
    totalQuestions,
    totalCorrect,
    averageAccuracy: Math.round(averageAccuracy * 10) / 10,
  };
}

/**
 * Gets today's study statistics
 */
export function getTodayStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return getSessionStats(today, tomorrow);
}

/**
 * Clears all session history
 */
export function clearSessionHistory(): void {
  if (
    confirm(
      "Are you sure you want to clear all session history? This cannot be undone."
    )
  ) {
    storage.saveSessionHistory([]);
  }
}

// TODO: Add session analytics (best time of day, accuracy trends)
// TODO: Add session export to JSON/CSV
// TODO: Add session comparison features
