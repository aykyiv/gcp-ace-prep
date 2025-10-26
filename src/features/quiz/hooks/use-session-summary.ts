/**
 * Session Summary Hook
 *
 * Calculates session statistics and generates summary
 */

"use client";

import { useQuizStore } from "../stores/quiz-store";
import { useMemo } from "react";
import type {
  SessionSummary,
  SessionDomainStats,
} from "../types/session.types";
import { Domain } from "../types/question.types";

/**
 * Hook to calculate session summary
 */
export function useSessionSummary() {
  const store = useQuizStore();

  const summary = useMemo((): SessionSummary | null => {
    if (!store.sessionStartTime) return null;

    const totalQuestions = store.questionIds.length;
    const answeredQuestions = store.answeredQuestions.size;
    const skippedQuestions = store.skippedQuestions.size;
    const correctAnswers = store.correctAnswers;
    const incorrectAnswers = store.incorrectAnswers;

    // Calculate time spent
    const timeSpentSeconds = Math.floor(
      (Date.now() - store.sessionStartTime.getTime()) / 1000
    );

    // Calculate accuracy
    const accuracyPercentage =
      answeredQuestions > 0 ? (correctAnswers / answeredQuestions) * 100 : 0;

    // TODO: Calculate domain breakdown
    const domainBreakdown = new Map<Domain, SessionDomainStats>();

    return {
      sessionId: `session-${Date.now()}`,
      totalQuestions,
      answeredQuestions,
      skippedQuestions,
      correctAnswers,
      incorrectAnswers,
      accuracyPercentage: Math.round(accuracyPercentage * 10) / 10,
      timeSpentSeconds,
      domainBreakdown,
    };
  }, [store]);

  return summary;
}

// TODO: Add time per question average
// TODO: Add comparison to previous sessions
// TODO: Add streak tracking integration
