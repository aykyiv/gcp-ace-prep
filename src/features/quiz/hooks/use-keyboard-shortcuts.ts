/**
 * Keyboard Shortcuts Hook
 *
 * Implements keyboard navigation for the quiz interface
 */

"use client";

import { useEffect } from "react";
import { useQuizStore } from "../stores/quiz-store";
import { DIFFICULTY_RATINGS } from "@/lib/constants";

/**
 * Keyboard shortcut definitions
 */
const SHORTCUTS = {
  // Option selection (A-E)
  SELECT_A: "a",
  SELECT_B: "b",
  SELECT_C: "c",
  SELECT_D: "d",
  SELECT_E: "e",

  // Actions
  SUBMIT: "Enter",
  SKIP: "s",
  NEXT: "n",

  // Confidence ratings (1-4)
  RATING_AGAIN: "1",
  RATING_HARD: "2",
  RATING_GOOD: "3",
  RATING_EASY: "4",
};

/**
 * Hook to enable keyboard shortcuts
 */
export function useKeyboardShortcuts(enabled: boolean = true) {
  const store = useQuizStore();

  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      const { currentQuestion, hasSubmitted, validationResult } = store;

      if (!currentQuestion) return;

      // Option selection (A-E)
      const optionKeys = ["a", "b", "c", "d", "e"];
      if (optionKeys.includes(key) && !hasSubmitted) {
        const optionIndex = optionKeys.indexOf(key);
        const option = currentQuestion.options[optionIndex];

        if (option) {
          const isMultipleSelect = currentQuestion.type === "multiple-select";
          store.toggleOption(option.id, isMultipleSelect);
        }
        return;
      }

      // Submit answer
      if (
        key === "enter" &&
        !hasSubmitted &&
        store.selectedOptions.length > 0
      ) {
        // Trigger submit (handled by component)
        event.preventDefault();
        return;
      }

      // Confidence ratings (1-4) - only after submission
      if (hasSubmitted && validationResult) {
        if (key === "1") {
          store.setConfidenceRating(DIFFICULTY_RATINGS.AGAIN);
          setTimeout(() => store.nextQuestion(), 500);
        } else if (key === "2") {
          store.setConfidenceRating(DIFFICULTY_RATINGS.HARD);
          setTimeout(() => store.nextQuestion(), 500);
        } else if (key === "3") {
          store.setConfidenceRating(DIFFICULTY_RATINGS.GOOD);
          setTimeout(() => store.nextQuestion(), 500);
        } else if (key === "4") {
          store.setConfidenceRating(DIFFICULTY_RATINGS.EASY);
          setTimeout(() => store.nextQuestion(), 500);
        }
        return;
      }

      // Skip question
      if (key === "s" && !hasSubmitted) {
        store.skipQuestion();
        return;
      }

      // Next question (after rating submitted)
      if (key === "n" && hasSubmitted && store.confidenceRating !== null) {
        store.nextQuestion();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [enabled, store]);

  return {
    shortcuts: SHORTCUTS,
  };
}

// TODO: Add visual keyboard hints overlay
// TODO: Add customizable keyboard shortcuts
// TODO: Add help dialog showing all shortcuts
