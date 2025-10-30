/**
 * Progress Service
 *
 * BASIC calculations for progress metrics
 * No complex algorithms - just straightforward stats
 */

import { storage } from "@/lib/storage";
import { DOMAIN_METADATA } from "@/lib/constants";
import { getMasteredQuestions } from "@/features/quiz/services/supermemo-service";
import type { Domain } from "@/features/quiz/types/question.types";

/**
 * Calculate mastery percentage for a domain
 * Simple formula: mastered questions / total questions * 100
 */
export function calculateDomainMastery(domainQuestionIds: string[]): number {
  if (domainQuestionIds.length === 0) return 0;

  const masteredIds = getMasteredQuestions(domainQuestionIds);
  return Math.round((masteredIds.length / domainQuestionIds.length) * 100);
}

/**
 * Calculate overall accuracy from all attempts
 */
export function calculateOverallAccuracy(): number {
  const progress = storage.loadQuestionProgress();

  let totalAttempts = 0;
  let correctAttempts = 0;

  Object.values(progress).forEach((questionProgress) => {
    if (questionProgress.totalAttempts > 0) {
      totalAttempts += questionProgress.totalAttempts;
      correctAttempts += questionProgress.correctAttempts;
    }
  });

  if (totalAttempts === 0) return 0;
  return Math.round((correctAttempts / totalAttempts) * 100);
}

/**
 * Get total questions answered (at least once)
 */
export function getTotalQuestionsAnswered(): number {
  const progress = storage.loadQuestionProgress();

  return Object.values(progress).filter((p) => p.totalAttempts > 0).length;
}

/**
 * Get current study streak
 */
export function getStudyStreak(): {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
} {
  const streakData = storage.loadStudyStreak();

  return {
    currentStreak: streakData.currentStreak,
    longestStreak: streakData.longestStreak,
    lastStudyDate: streakData.lastStudyDate,
  };
}

/**
 * Calculate exam readiness score
 * Simple average of all domain mastery percentages
 */
export function calculateExamReadiness(): number {
  const domains = Object.keys(DOMAIN_METADATA) as Domain[];
  let totalMastery = 0;

  // For simplicity, assume equal weighting (in reality, use examPercentage)
  domains.forEach((domain) => {
    const metadata = DOMAIN_METADATA[domain];
    // We don't have question IDs here, so just return a placeholder
    // In real implementation, you'd load questions per domain
    totalMastery += 0; // TODO: Implement properly with actual question IDs
  });

  return Math.round(totalMastery / domains.length);
}

/**
 * Get recent session history (last 7 days)
 */
export function getRecentSessions(days: number = 7) {
  const history = storage.loadSessionHistory();
  const cutoffDate = new Date();

  cutoffDate.setDate(cutoffDate.getDate() - days);
  cutoffDate.setHours(0, 0, 0, 0);

  return history
    .filter((session) => new Date(session.date) >= cutoffDate)
    .reverse();
}

/**
 * Calculate total study time (from all sessions)
 */
export function getTotalStudyTime(): number {
  const history = storage.loadSessionHistory();
  return history.reduce(
    (total, session) => total + session.summary.timeSpentSeconds,
    0
  );
}

// TODO: Add weekly/monthly statistics
// TODO: Add accuracy trend calculations
// TODO: Add domain-specific time tracking
