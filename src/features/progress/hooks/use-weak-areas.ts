/**
 * Weak Areas Hook
 *
 * Identifies questions that need more practice
 */

"use client";

import { useMemo } from "react";
import { getWeakQuestions } from "@/features/quiz/services/supermemo-service";
import { useAllQuestions } from "@/features/quiz/hooks/use-questions";

/**
 * Hook to get weak areas (questions to review)
 */
export function useWeakAreas() {
  const { data: allQuestions } = useAllQuestions();

  const weakAreas = useMemo(() => {
    if (!allQuestions) return [];

    const questionIds = allQuestions.map((q) => q.id);
    const weakIds = getWeakQuestions(questionIds);

    // Get full question details for weak questions
    const weakQuestions = allQuestions.filter((q) => weakIds.includes(q.id));

    // Sort by domain for easier review
    return weakQuestions.sort((a, b) => a.domain.localeCompare(b.domain));
  }, [allQuestions]);

  return weakAreas;
}

// TODO: Add sorting by ease factor
// TODO: Add filtering by domain
