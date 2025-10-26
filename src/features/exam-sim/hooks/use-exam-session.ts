/**
 * Exam Session Hook
 *
 * Manages exam initialization and state
 */

"use client";

import { useEffect } from "react";
import { useExamStore } from "../stores/exam-store";
import { useAllQuestions } from "@/features/quiz/hooks/use-questions";
import { generateExam } from "../services/exam-generator";

/**
 * Hook to manage exam session
 */
export function useExamSession(questionCount: number = 50) {
  const store = useExamStore();
  const { data: allQuestions, isLoading } = useAllQuestions();

  /**
   * Initialize exam when questions are loaded
   */
  useEffect(() => {
    if (!allQuestions || allQuestions.length === 0) return;
    if (store.questions.length > 0) return; // Already initialized

    // Generate exam questions
    const examQuestions = generateExam(allQuestions, questionCount);
    store.initializeExam(examQuestions);
  }, [allQuestions, questionCount, store]);

  return {
    isLoading,
    isInitialized: store.questions.length > 0,
  };
}

// TODO: Add option to restore previous exam session
// TODO: Add exam configuration options
