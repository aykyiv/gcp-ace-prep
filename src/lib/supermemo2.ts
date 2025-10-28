/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * SuperMemo 2 Algorithm Implementation
 *
 * This is the core spaced repetition algorithm that determines when
 * questions should be reviewed. It adapts to user performance by
 * adjusting intervals based on difficulty ratings.
 *
 * Algorithm: <https://www.supermemo.com/en/archives1990-2015/english/ol/sm2>
 */

import { SM2_CONFIG, DIFFICULTY_RATINGS } from "./constants";
import type {
  SM2Data,
  SM2CalculationInput,
  SM2CalculationResult,
  DifficultyRating,
} from "@/features/quiz/types/supermemo.types";
import { addDays } from "./date-utils";
import { clamp } from "./utils";

/**
 * Calculates the next review date and ease factor using SuperMemo 2
 *
 * @param input - Current SM2 data, user rating, and answer correctness
 * @returns Updated SM2 data with new interval and ease factor
 */
export function calculateSM2(input: SM2CalculationInput): SM2CalculationResult {
  const { currentData, rating, wasCorrect, accuracyPercentage } = input;

  let { easeFactor, interval, repetitions } = currentData;

  // Adjust ease factor based on rating
  easeFactor = adjustEaseFactor(easeFactor, rating, accuracyPercentage);

  // Calculate new interval based on rating and repetitions
  if (rating === DIFFICULTY_RATINGS.AGAIN) {
    // Reset to beginning - user failed to recall
    interval = SM2_CONFIG.FIRST_INTERVAL;
    repetitions = 0;
  } else {
    // User recalled (with varying difficulty)
    repetitions += 1;

    if (repetitions === 1) {
      // First successful review
      interval = SM2_CONFIG.FIRST_INTERVAL;
    } else if (repetitions === 2) {
      // Second successful review
      interval = SM2_CONFIG.SECOND_INTERVAL;
    } else {
      // Subsequent reviews - multiply by ease factor
      interval = Math.round(interval * easeFactor);
    }

    // Apply rating-specific multiplier for fine-tuning
    const multiplier = SM2_CONFIG.MULTIPLIERS[getRatingKey(rating)];
    if (multiplier > 0) {
      interval = Math.round(interval * multiplier);
    }
  }

  // Clamp interval to reasonable bounds
  interval = clamp(
    interval,
    SM2_CONFIG.FIRST_INTERVAL,
    SM2_CONFIG.MAX_INTERVAL
  );

  // Calculate next review date
  const nextReviewDate = addDays(new Date(), interval);

  return {
    easeFactor,
    interval,
    repetitions,
    nextReviewDate,
  };
}

/**
 * Adjusts the ease factor based on user's rating and accuracy
 *
 * @param currentEase - Current ease factor
 * @param rating - User's difficulty rating (0-5)
 * @param accuracyPercentage - Percentage correct (for partial credit)
 * @returns Adjusted ease factor
 */
function adjustEaseFactor(
  currentEase: number,
  rating: DifficultyRating,
  accuracyPercentage: number
): number {
  // Get base adjustment from rating
  const ratingKey = getRatingKey(rating);
  const adjustment = SM2_CONFIG.EASE_ADJUSTMENTS[ratingKey];

  // For partial credit, reduce the adjustment proportionally
  const accuracyFactor = accuracyPercentage / 100;
  const finalAdjustment = adjustment * accuracyFactor;

  // Apply adjustment and clamp to valid range
  const newEase = currentEase + finalAdjustment;
  return clamp(newEase, SM2_CONFIG.MIN_EASE, 5.0);
}

/**
 * Gets the rating key name for accessing config objects
 */
function getRatingKey(
  rating: DifficultyRating
): "AGAIN" | "HARD" | "GOOD" | "EASY" {
  switch (rating) {
    case DIFFICULTY_RATINGS.AGAIN:
      return "AGAIN";
    case DIFFICULTY_RATINGS.HARD:
      return "HARD";
    case DIFFICULTY_RATINGS.GOOD:
      return "GOOD";
    case DIFFICULTY_RATINGS.EASY:
      return "EASY";
    default:
      return "GOOD"; // Fallback to GOOD for safety
  }
}

/**
 * Creates initial SM2 data for a new question
 *
 * @param questionId - The question ID
 * @returns Initial SM2 data
 */
export function createInitialSM2Data(questionId: string): SM2Data {
  return {
    questionId,
    easeFactor: SM2_CONFIG.INITIAL_EASE,
    interval: 0,
    repetitions: 0,
    nextReviewDate: new Date(), // Due immediately (new question)
    lastReviewedDate: null,
    correctAttempts: 0,
    totalAttempts: 0,
  };
}

/**
 * Updates SM2 data after a quiz attempt
 *
 * @param currentData - Current SM2 data
 * @param rating - User's difficulty rating
 * @param wasCorrect - Whether the answer was correct
 * @param accuracyPercentage - Accuracy percentage (for partial credit)
 * @returns Updated SM2 data
 */
export function updateSM2Data(
  currentData: SM2Data,
  rating: DifficultyRating,
  wasCorrect: boolean,
  accuracyPercentage: number = 100
): SM2Data {
  // Calculate new SM2 values
  const calculation = calculateSM2({
    currentData,
    rating,
    wasCorrect,
    accuracyPercentage,
  });

  // Update attempt counters
  const correctAttempts = currentData.correctAttempts + (wasCorrect ? 1 : 0);
  const totalAttempts = currentData.totalAttempts + 1;

  // Return updated data
  return {
    ...currentData,
    easeFactor: calculation.easeFactor,
    interval: calculation.interval,
    repetitions: calculation.repetitions,
    nextReviewDate: calculation.nextReviewDate,
    lastReviewedDate: new Date(),
    correctAttempts,
    totalAttempts,
  };
}

// TODO: Add function to calculate optimal daily review load
// TODO: Add function to predict future review dates for calendar
