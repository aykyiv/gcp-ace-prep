/**
 * Type definitions for SuperMemo 2 algorithm
 * Manages spaced repetition scheduling
 */

import { DIFFICULTY_RATINGS } from "@/lib/constants";

/**
 * Valid difficulty rating values
 */
export type DifficultyRating =
  (typeof DIFFICULTY_RATINGS)[keyof typeof DIFFICULTY_RATINGS];

/**
 * SuperMemo 2 data for a single question
 */
export interface SM2Data {
  questionId: string;
  easeFactor: number; // Current ease factor (starts at 2.5)
  interval: number; // Current interval in days
  repetitions: number; // Number of successful repetitions
  nextReviewDate: Date; // When the question should be reviewed next
  lastReviewedDate: Date | null; // Last time the question was reviewed
  correctAttempts: number; // Total number of correct attempts
  totalAttempts: number; // Total number of attempts
}

/**
 * Result of SuperMemo 2 calculation
 */
export interface SM2CalculationResult {
  easeFactor: number; // New ease factor
  interval: number; // New interval in days
  repetitions: number; // Updated repetition count
  nextReviewDate: Date; // New review date
}

/**
 * Input for SuperMemo 2 calculation
 */
export interface SM2CalculationInput {
  currentData: SM2Data;
  rating: DifficultyRating;
  wasCorrect: boolean; // Whether the answer was correct
  accuracyPercentage: number; // For partial credit (multiple select)
}

/**
 * Progress data stored in browser storage
 */
export interface QuestionProgress {
  [questionId: string]: SM2Data;
}

// TODO: Add scheduling metadata (e.g., last updated, version)
