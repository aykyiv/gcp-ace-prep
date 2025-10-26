/**
 * Answer Submission Hook
 *
 * Handles answer validation and SuperMemo 2 progress updates
 */

"use client";

import { useCallback } from "react";
import { useQuizStore } from "../stores/quiz-store";
import {
  validateAnswer,
} from "../services/answer-checker";
import { updateQuestionProgress } from "../services/supermemo-service";
import type { DifficultyRating } from "../types/supermemo.types";

/**
 * Hook for submitting answers and updating progress
 */
export function useAnswerSubmission() {
  const store = useQuizStore();

  /**
   * Submit the current answer for validation
   */
  const submitAnswer = useCallback(() => {
    const { currentQuestion, selectedOptions } = store;

    if (!currentQuestion || selectedOptions.length === 0) {
      console.warn("Cannot submit: no question or no selections");
      return;
    }

    // Create user answer object
    const userAnswer = {
      questionId: currentQuestion.id,
      selectedOptions,
      timestamp: new Date(),
      timeSpentSeconds: 0, // TODO: Implement time tracking
    };

    // Validate the answer
    const validation = validateAnswer(currentQuestion, userAnswer);

    // Update store with validation result
    store.submitAnswer(validation);

    return validation;
  }, [store]);

  /**
   * Submit confidence rating and update SuperMemo 2 progress
   */
  const submitConfidenceRating = useCallback(
    (rating: DifficultyRating) => {
      const { currentQuestion, validationResult } = store;

      if (!currentQuestion || !validationResult) {
        console.warn("Cannot submit rating: no question or validation result");
        return;
      }

      // Update SuperMemo 2 progress
      updateQuestionProgress(currentQuestion.id, rating, validationResult);

      // Update store with rating
      store.setConfidenceRating(rating);

      // Automatically move to next question after rating
      setTimeout(() => {
        store.nextQuestion();
      }, 500); // Small delay for better UX
    },
    [store]
  );

  return {
    submitAnswer,
    submitConfidenceRating,
    canSubmit: store.selectedOptions.length > 0 && !store.hasSubmitted,
    hasSubmitted: store.hasSubmitted,
  };
}

// TODO: Add validation for minimum time spent before submission
// TODO: Add confirmation dialog for skipping questions
