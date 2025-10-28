/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * SuperMemo 2 Service
 *
 * High-level service for managing SuperMemo 2 operations including
 * scheduling, progress updates, and due question calculations.
 */

import { createInitialSM2Data, updateSM2Data } from "@/lib/supermemo2";
import { storage } from "@/lib/storage";
import { isDue, getStartOfToday } from "@/lib/date-utils";
import type { SM2Data, DifficultyRating } from "../types/supermemo.types";
import type { AnswerValidationResult } from "../types/answer.types";
import { PROGRESS_THRESHOLDS } from "@/lib/constants";

/**
 * Gets or creates SM2 data for a question
 *
 * @param questionId - Question ID
 * @returns SM2 data (existing or newly created)
 */
export function getOrCreateProgress(questionId: string): SM2Data {
  const existing = storage.getQuestionProgress(questionId);
  if (existing) {
    // Convert date strings back to Date objects if needed
    return {
      ...existing,
      nextReviewDate: new Date(existing.nextReviewDate),
      lastReviewedDate: existing.lastReviewedDate
        ? new Date(existing.lastReviewedDate)
        : null,
    };
  }

  // Create new progress data for this question
  return createInitialSM2Data(questionId);
}

/**
 * Updates question progress after an answer attempt
 *
 * @param questionId - Question ID
 * @param rating - User's difficulty rating
 * @param validation - Answer validation result
 */
export function updateQuestionProgress(
  questionId: string,
  rating: DifficultyRating,
  validation: AnswerValidationResult
): void {
  const currentData = getOrCreateProgress(questionId);

  // Update SM2 data based on performance
  const updatedData = updateSM2Data(
    currentData,
    rating,
    validation.isCorrect,
    validation.accuracyPercentage
  );

  // Save to storage
  storage.updateQuestionProgress(questionId, updatedData);

  // Update study streak
  storage.updateStudyStreakForToday();
}

/**
 * Gets all questions that are due for review
 *
 * @param questionIds - Array of question IDs to check
 * @returns Array of due question IDs
 */
export function getDueQuestions(questionIds: string[]): string[] {
  const progress = storage.loadQuestionProgress();
  const today = getStartOfToday();

  return questionIds.filter((id) => {
    const questionProgress = progress[id];

    // If no progress, it's a new question (due immediately)
    if (!questionProgress) {
      return true;
    }

    // Check if review date is due
    const reviewDate = new Date(questionProgress.nextReviewDate);
    return isDue(reviewDate);
  });
}

/**
 * Gets questions that have never been attempted
 *
 * @param questionIds - Array of question IDs to check
 * @returns Array of new question IDs
 */
export function getNewQuestions(questionIds: string[]): string[] {
  const progress = storage.loadQuestionProgress();

  return questionIds.filter((id) => {
    const questionProgress = progress[id];
    return !questionProgress || questionProgress.totalAttempts === 0;
  });
}

/**
 * Gets questions that are considered "weak" (low ease factor or poor accuracy)
 *
 * @param questionIds - Array of question IDs to check
 * @returns Array of weak question IDs
 */
export function getWeakQuestions(questionIds: string[]): string[] {
  const progress = storage.loadQuestionProgress();

  return questionIds.filter((id) => {
    const questionProgress = progress[id];

    // No progress means not weak (just new)
    if (!questionProgress || questionProgress.totalAttempts === 0) {
      return false;
    }

    // Check if ease factor is below threshold
    const hasLowEase =
      questionProgress.easeFactor < PROGRESS_THRESHOLDS.WEAK_QUESTION_EASE;

    // Check if accuracy is below 50%
    const accuracy =
      questionProgress.correctAttempts / questionProgress.totalAttempts;
    const hasLowAccuracy = accuracy < 0.5;

    // Check if recently answered incorrectly (within last 7 days)
    const lastReview = questionProgress.lastReviewedDate;
    const isRecentlyWrong =
      lastReview &&
      new Date().getTime() - new Date(lastReview).getTime() <
        7 * 24 * 60 * 60 * 1000 &&
      questionProgress.easeFactor < 2.0;

    return hasLowEase || hasLowAccuracy || isRecentlyWrong;
  });
}

/**
 * Gets questions that have reached "mastery" level
 *
 * @param questionIds - Array of question IDs to check
 * @returns Array of mastered question IDs
 */
export function getMasteredQuestions(questionIds: string[]): string[] {
  const progress = storage.loadQuestionProgress();

  return questionIds.filter((id) => {
    const questionProgress = progress[id];

    if (!questionProgress) return false;

    // Check mastery criteria
    const hasLongInterval =
      questionProgress.interval >= PROGRESS_THRESHOLDS.MASTERY_INTERVAL_DAYS;
    const hasHighEase =
      questionProgress.easeFactor >= PROGRESS_THRESHOLDS.MASTERY_EASE_FACTOR;
    const hasMultipleCorrect = questionProgress.correctAttempts >= 3;

    return hasLongInterval && hasHighEase && hasMultipleCorrect;
  });
}

/**
 * Calculates domain mastery percentage
 *
 * @param questionIds - Array of question IDs in the domain
 * @returns Mastery percentage (0-100)
 */
export function calculateDomainMastery(questionIds: string[]): number {
  if (questionIds.length === 0) return 0;

  const masteredQuestions = getMasteredQuestions(questionIds);
  return Math.round((masteredQuestions.length / questionIds.length) * 100);
}

/**
 * Gets upcoming review counts for the next N days
 *
 * @param questionIds - Array of question IDs to check
 * @param days - Number of days to look ahead
 * @returns Array of review counts per day
 */
export function getUpcomingReviewCounts(
  questionIds: string[],
  days: number = 7
): number[] {
  const progress = storage.loadQuestionProgress();
  const counts = new Array(days).fill(0);
  const today = getStartOfToday();

  questionIds.forEach((id) => {
    const questionProgress = progress[id];
    if (!questionProgress) return;

    const reviewDate = new Date(questionProgress.nextReviewDate);
    const daysDiff = Math.floor(
      (reviewDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)
    );

    if (daysDiff >= 0 && daysDiff < days) {
      counts[daysDiff]++;
    }
  });

  return counts;
}

/**
 * Resets progress for a specific question (for testing or manual reset)
 *
 * @param questionId - Question ID to reset
 */
export function resetQuestionProgress(questionId: string): void {
  storage.deleteQuestionProgress(questionId);
}

/**
 * Resets all progress (use with extreme caution!)
 */
export function resetAllProgress(): void {
  if (
    confirm(
      "Are you sure you want to reset ALL progress? This cannot be undone."
    )
  ) {
    storage.clearAllProgress();
  }
}

/**
 * Gets overall statistics for all questions
 *
 * @param questionIds - Array of all question IDs
 * @returns Statistics object
 */
export function getOverallStatistics(questionIds: string[]): {
  totalQuestions: number;
  newQuestions: number;
  dueQuestions: number;
  masteredQuestions: number;
  weakQuestions: number;
  averageEaseFactor: number;
  overallAccuracy: number;
} {
  const progress = storage.loadQuestionProgress();

  let totalAttempts = 0;
  let totalCorrect = 0;
  let totalEase = 0;
  let questionsWithProgress = 0;

  questionIds.forEach((id) => {
    const questionProgress = progress[id];
    if (questionProgress && questionProgress.totalAttempts > 0) {
      totalAttempts += questionProgress.totalAttempts;
      totalCorrect += questionProgress.correctAttempts;
      totalEase += questionProgress.easeFactor;
      questionsWithProgress++;
    }
  });

  return {
    totalQuestions: questionIds.length,
    newQuestions: getNewQuestions(questionIds).length,
    dueQuestions: getDueQuestions(questionIds).length,
    masteredQuestions: getMasteredQuestions(questionIds).length,
    weakQuestions: getWeakQuestions(questionIds).length,
    averageEaseFactor:
      questionsWithProgress > 0 ? totalEase / questionsWithProgress : 2.5,
    overallAccuracy:
      totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0,
  };
}

// TODO: Add function to export progress data as JSON
// TODO: Add function to import progress data from JSON
// TODO: Add function to calculate optimal study time recommendations
