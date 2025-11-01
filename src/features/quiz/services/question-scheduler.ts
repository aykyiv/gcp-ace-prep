/**
 * Question Scheduler Service
 *
 * Handles the logic for selecting which questions to show in a session
 * based on study mode, filters, and SuperMemo 2 scheduling.
 */

import {
  getDueQuestions,
  getNewQuestions,
  getWeakQuestions,
} from "./supermemo-service";
import { shuffleArray } from "@/lib/utils";
import type { SessionConfig } from "../types/session.types";
import { STUDY_MODES, SESSION_CONFIG } from "@/lib/constants";

/**
 * Selects questions for a study session based on configuration
 *
 * @param allQuestionIds - All available question IDs (after domain/filter)
 * @param config - Session configuration
 * @returns Array of question IDs to use in the session
 */
export function selectQuestionsForSession(
  allQuestionIds: string[],
  config: SessionConfig
): string[] {
  let selectedQuestions: string[] = [];

  // Apply study mode logic
  switch (config.studyMode) {
    case STUDY_MODES.NEW_QUESTIONS:
      selectedQuestions = selectNewQuestions(
        allQuestionIds,
        config.questionsPerSession
      );
      break;

    case STUDY_MODES.REVIEW_DUE:
      selectedQuestions = selectDueQuestions(
        allQuestionIds,
        config.questionsPerSession
      );
      break;

    case STUDY_MODES.WEAK_AREAS:
      selectedQuestions = selectWeakQuestions(
        allQuestionIds,
        config.questionsPerSession
      );
      break;

    case STUDY_MODES.MIXED:
    default:
      selectedQuestions = selectMixedQuestions(
        allQuestionIds,
        config.questionsPerSession
      );
      break;
  }

  // Shuffle to prevent pattern learning
  return shuffleArray(selectedQuestions);
}

/**
 * Selects only new (never attempted) questions
 */
function selectNewQuestions(questionIds: string[], count: number): string[] {
  const newQuestions = getNewQuestions(questionIds);
  return newQuestions.slice(0, count);
}

/**
 * Selects only due review questions
 */
function selectDueQuestions(questionIds: string[], count: number): string[] {
  const dueQuestions = getDueQuestions(questionIds);

  // Prioritize overdue questions (sort by how overdue they are)
  // TODO: Implement sorting by how overdue questions are

  return dueQuestions.slice(0, count);
}

/**
 * Selects only weak questions
 */
function selectWeakQuestions(questionIds: string[], count: number): string[] {
  const weakQuestions = getWeakQuestions(questionIds);
  return weakQuestions.slice(0, count);
}

/**
 * Selects a mix of new and review questions (Google-recommended ratio)
 */
function selectMixedQuestions(questionIds: string[], count: number): string[] {
  const newQuestions = getNewQuestions(questionIds);
  const dueQuestions = getDueQuestions(questionIds);

  // Calculate split based on NEW_REVIEW_RATIO (20% new, 80% review)
  const newCount = Math.floor(count * SESSION_CONFIG.NEW_REVIEW_RATIO);
  const reviewCount = count - newCount;

  // Select from each pool
  const selectedNew = newQuestions.slice(0, newCount);
  const selectedReview = dueQuestions.slice(0, reviewCount);

  // Combine and shuffle
  return [...selectedNew, ...selectedReview];
}

/**
 * Filters questions by difficulty level
 *
 * @param questions - Array of full question objects
 * @param difficulties - Array of difficulty levels to include
 * @returns Filtered questions
 */
export function filterByDifficulty<T extends { difficulty: string }>(
  questions: T[],
  difficulties: string[] | undefined
): T[] {
  if (!difficulties || difficulties.length === 0) {
    return questions;
  }

  return questions.filter((q) => difficulties.includes(q.difficulty));
}

/**
 * Filters questions by type (multiple choice vs multiple select)
 *
 * @param questions - Array of full question objects
 * @param types - Array of question types to include
 * @returns Filtered questions
 */
export function filterByType<T extends { type: string }>(
  questions: T[],
  types: string[] | undefined
): T[] {
  if (!types || types.length === 0) {
    return questions;
  }

  return questions.filter((q) => types.includes(q.type));
}

/**
 * Filters questions by tags
 *
 * @param questions - Array of full question objects
 * @param tags - Array of tags to filter by (ANY match)
 * @returns Filtered questions
 */
export function filterByTags<T extends { tags: string[] }>(
  questions: T[],
  tags: string[] | undefined
): T[] {
  if (!tags || tags.length === 0) {
    return questions;
  }

  return questions.filter((q) => q.tags.some((tag) => tags.includes(tag)));
}

// TODO: Add function to balance question distribution across domains
// TODO: Add function to avoid showing related questions in same session
// TODO: Add function to prioritize questions with upcoming exam dates
