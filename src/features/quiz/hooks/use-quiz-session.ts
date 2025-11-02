/**
 * Quiz Session Management Hook
 *
 * Handles quiz session initialization, question loading,
 * and integration with the quiz store
 */

"use client";

import { useEffect } from "react";
import { useQuizStore } from "../stores/quiz-store";
import { useMultipleDomainQuestions } from "./use-questions";
import { selectQuestionsForSession } from "../services/question-scheduler";
import type { SessionConfig } from "../types/session.types";

/**
 * Hook to manage quiz session lifecycle
 *
 * @param config - Session configuration (domains, count, mode)
 * @returns Session state and control functions
 */
export function useQuizSession(config: SessionConfig | null) {
  const store = useQuizStore();

  // Load questions for selected domains
  const {
    data: questions,
    isLoading,
    error,
  } = useMultipleDomainQuestions(config?.domains || []);

  /**
   * Initialize session when config and questions are ready
   */
  useEffect(() => {
    if (!config || !questions || questions.length === 0) return;

    // Select questions based on session config
    const selectedQuestionIds = selectQuestionsForSession(questions, config);

    // Initialize store with selected questions
    store.initializeSession(selectedQuestionIds, questions);
  }, [config, questions, store]);

  /**
   * Update current question when index changes (for navigation)
   */
  useEffect(() => {
    if (!questions || questions.length === 0) return;

    const currentQuestionId = store.questionIds[store.currentQuestionIndex];
    const currentQuestion = questions.find((q) => q.id === currentQuestionId);

    if (currentQuestion) {
      // This call is now safe because the store checks if the question ID is redundant.
      store.setCurrentQuestion(currentQuestion);
    }
  }, [store.currentQuestionIndex, store.questionIds, questions, store]);

  return {
    // Session state
    currentQuestion: store.currentQuestion,
    currentIndex: store.currentQuestionIndex,
    totalQuestions: store.questionIds.length,

    // Progress
    answeredCount: store.answeredQuestions.size,
    correctCount: store.correctAnswers,
    incorrectCount: store.incorrectAnswers,
    skippedCount: store.skippedQuestions.size,

    // Loading state
    isLoading,
    error,

    // Computed values
    isLastQuestion: store.currentQuestionIndex === store.questionIds.length - 1,
    progressPercentage:
      store.questionIds.length > 0
        ? (store.currentQuestionIndex / store.questionIds.length) * 100
        : 0,
  };
}

// TODO: Add session pause/resume functionality
// TODO: Add session summary on completion
// TODO: Add ability to restart session
