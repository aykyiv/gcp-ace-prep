/**
 * Quiz Session Management Hook
 *
 * Handles quiz session initialization, question loading,
 * and integration with the quiz store
 */
"use client";

import { useEffect, useRef, useMemo } from "react";
import { useQuizStore } from "../stores/quiz-store";
import { useMultipleDomainQuestions } from "./use-questions";
import { selectQuestionsForSession } from "../services/question-scheduler";
import type { SessionConfig } from "../types/session.types";

/**
 * Hook to manage quiz session lifecycle
 * * ✅ FIXED: Infinite loop issue resolved by removing store from dependencies
 * ✅ FIXED: Config change detection auto-resets session
 * ✅ FIXED: Using selectors for better performance
 * ✅ FIXED: Memoized selectedQuestionIds to prevent shuffle recalculation
 *
 * @param config - Session configuration (domains, count, mode)
 * @returns Session state and control functions
 */
export function useQuizSession(config: SessionConfig | null) {
  // --- 1. State and Action Selectors (Performance Fix) ---

  // ✅ FIX: Use selectors to extract only needed state/methods
  const initializeSession = useQuizStore((state) => state.initializeSession);
  const setCurrentQuestion = useQuizStore((state) => state.setCurrentQuestion);
  const resetSession = useQuizStore((state) => state.resetSession);

  // Extract necessary state values with selectors
  const currentQuestion = useQuizStore((state) => state.currentQuestion);
  const currentQuestionIndex = useQuizStore(
    (state) => state.currentQuestionIndex
  );
  const questionIds = useQuizStore((state) => state.questionIds);
  const answeredQuestions = useQuizStore((state) => state.answeredQuestions);
  const correctAnswers = useQuizStore((state) => state.correctAnswers);
  const incorrectAnswers = useQuizStore((state) => state.incorrectAnswers);
  const skippedQuestions = useQuizStore((state) => state.skippedQuestions);
  const sessionId = useQuizStore((state) => state.sessionId);

  // --- 2. Refs for Change Detection ---

  // ✅ FIX: Track previous config/questions to detect meaningful changes
  const prevConfigRef = useRef<string | null>(null);
  const selectedQuestionIdsRef = useRef<string[]>([]);

  // Load questions for selected domains
  const {
    data: questions,
    isLoading,
    error,
  } = useMultipleDomainQuestions(config?.domains || []);

  // --- 3. Memoization of Question Selection (Shuffle Fix) ---

  // ✅ FIX: Memoize selectedQuestionIds to prevent recalculation on every render
  const selectedQuestionIds = useMemo(() => {
    if (!config || !questions || questions.length === 0) return [];

    const newIds = selectQuestionsForSession(questions, config);

    // Check if same questions as before (by content, ignoring order due to shuffle)
    const isSameSet =
      selectedQuestionIdsRef.current.length === newIds.length &&
      newIds.every((id) => selectedQuestionIdsRef.current.includes(id));

    if (isSameSet) {
      // Same questions, return previous array reference to prevent re-initialization
      console.log("[useQuizSession] Same questions selected, using cached IDs");
      return selectedQuestionIdsRef.current;
    }

    // Different questions, update ref and return new array
    console.log("[useQuizSession] New questions selected:", newIds.length);
    selectedQuestionIdsRef.current = newIds;
    return newIds;
  }, [config, questions]);

  // --- 4. Initialization and Config Change Effect ---

  /**
   * Initialize session when config and questions are ready
   * ✅ FIX: Added config change detection
   * ✅ FIX: Removed 'store' from dependencies (methods are stable)
   * ✅ FIX: Using memoized selectedQuestionIds
   */
  useEffect(() => {
    if (!config || !questions || questions.length === 0) return;
    if (selectedQuestionIds.length === 0) return;

    // Generate config hash to detect changes
    const currentConfigHash = JSON.stringify({
      domains: config.domains.sort(),
      questionsPerSession: config.questionsPerSession,
      studyMode: config.studyMode,
      difficultyFilter: config.difficultyFilter?.sort(),
      questionTypeFilter: config.questionTypeFilter?.sort(),
      tagFilter: config.tagFilter?.sort(),
    });

    // If config changed from previous, reset session first
    if (prevConfigRef.current && prevConfigRef.current !== currentConfigHash) {
      console.log("[useQuizSession] Config changed, resetting session");
      resetSession();
    }

    prevConfigRef.current = currentConfigHash;

    // Initialize store with selected questions
    console.log(
      "[useQuizSession] Initializing session with",
      selectedQuestionIds.length,
      "questions"
    );
    initializeSession(selectedQuestionIds, questions);
  }, [selectedQuestionIds, questions, initializeSession, resetSession, config]); // 'config' must be here for hash generation

  // --- 5. Current Question Update Effect ---

  /**
   * Update current question when index changes (for navigation)
   * ✅ FIX: Removed 'store' from dependencies
   */
  useEffect(() => {
    if (!questions || questions.length === 0) return;

    const currentQuestionId = questionIds[currentQuestionIndex];
    const question = questions.find((q) => q.id === currentQuestionId);

    if (question) {
      setCurrentQuestion(question);
    }
  }, [currentQuestionIndex, questionIds, questions, setCurrentQuestion]);

  // --- 6. Return Values ---

  return {
    // Session state
    currentQuestion,
    currentIndex: currentQuestionIndex,
    totalQuestions: questionIds.length,
    sessionId,

    // Progress
    answeredCount: answeredQuestions.size,
    correctCount: correctAnswers,
    incorrectCount: incorrectAnswers,
    skippedCount: skippedQuestions.size,

    // Loading state
    isLoading,
    error,

    // Computed values
    isLastQuestion: currentQuestionIndex === questionIds.length - 1,
    progressPercentage:
      questionIds.length > 0
        ? (currentQuestionIndex / questionIds.length) * 100
        : 0,
  };
}

// TODO: Add session pause/resume functionality
// TODO: Add session summary on completion
// TODO: Add ability to restart session
