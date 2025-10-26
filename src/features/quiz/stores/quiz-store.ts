/**
 * Quiz Session State Store (Zustand)
 *
 * Manages the current quiz session state including:
 * - Current question
 * - User selections
 * - Answer validation results
 * - Session progress
 */

import { create } from "zustand";
import type { QuizQuestion } from "../types/question.types";
import type { AnswerValidationResult } from "../types/answer.types";

/**
 * Quiz session state interface
 */
interface QuizState {
  // Current session data
  questionIds: string[];
  currentQuestionIndex: number;
  currentQuestion: QuizQuestion | null;

  // User interaction state
  selectedOptions: string[];
  hasSubmitted: boolean;
  validationResult: AnswerValidationResult | null;
  confidenceRating: number | null;

  // Session statistics
  answeredQuestions: Set<string>;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: Set<string>;
  sessionStartTime: Date | null;
  isInitialized: boolean;

  // Actions
  initializeSession: (questionIds: string[], questions: QuizQuestion[]) => void;
  setCurrentQuestion: (question: QuizQuestion) => void;
  toggleOption: (optionId: string, isMultipleSelect: boolean) => void;
  submitAnswer: (validation: AnswerValidationResult) => void;
  setConfidenceRating: (rating: number) => void;
  nextQuestion: () => void;
  skipQuestion: () => void;
  resetSession: () => void;
}

/**
 * Create quiz store with Zustand
 */
export const useQuizStore = create<QuizState>((set, get) => ({
  // Initial state
  questionIds: [],
  currentQuestionIndex: 0,
  currentQuestion: null,
  selectedOptions: [],
  hasSubmitted: false,
  validationResult: null,
  confidenceRating: null,
  answeredQuestions: new Set(),
  correctAnswers: 0,
  incorrectAnswers: 0,
  skippedQuestions: new Set(),
  sessionStartTime: null,
  isInitialized: false,

  /**
   * Initialize a new quiz session
   */
  initializeSession: (questionIds, questions) => {
    if (get().isInitialized) {
      return;
    }
    const firstQuestion =
      questions.find((q) => q.id === questionIds[0]) || null;

    set({
      questionIds,
      currentQuestionIndex: 0,
      currentQuestion: firstQuestion,
      selectedOptions: [],
      hasSubmitted: false,
      validationResult: null,
      confidenceRating: null,
      answeredQuestions: new Set(),
      correctAnswers: 0,
      incorrectAnswers: 0,
      skippedQuestions: new Set(),
      sessionStartTime: new Date(),
      isInitialized: true,
    });
  },

  /**
   * Set the current question being displayed
   */
  setCurrentQuestion: (question) => {
    const { currentQuestion } = get();

    // ✅ FIX: Check if the question is already set to prevent redundant update calls
    if (currentQuestion?.id === question.id) {
      return;
    }

    set({
      currentQuestion: question,
      selectedOptions: [],
      hasSubmitted: false,
      validationResult: null,
      confidenceRating: null,
    });
  },

  /**
   * Toggle option selection (for both radio and checkbox)
   */
  toggleOption: (optionId, isMultipleSelect) => {
    const { selectedOptions } = get();

    if (isMultipleSelect) {
      // Multiple select: toggle the option
      const newSelections = selectedOptions.includes(optionId)
        ? selectedOptions.filter((id) => id !== optionId)
        : [...selectedOptions, optionId];

      set({ selectedOptions: newSelections });
    } else {
      // Single choice: replace selection
      set({ selectedOptions: [optionId] });
    }
  },

  /**
   * Submit answer and show validation results
   */
  submitAnswer: (validation) => {
    const {
      currentQuestion,
      answeredQuestions,
      correctAnswers,
      incorrectAnswers,
    } = get();

    if (!currentQuestion) return;

    // Update answered questions set
    const newAnsweredQuestions = new Set(answeredQuestions);
    newAnsweredQuestions.add(currentQuestion.id);

    // Update correctness counters
    const newCorrectAnswers = validation.isCorrect
      ? correctAnswers + 1
      : correctAnswers;
    const newIncorrectAnswers = !validation.isCorrect
      ? incorrectAnswers + 1
      : incorrectAnswers;

    set({
      hasSubmitted: true,
      validationResult: validation,
      answeredQuestions: newAnsweredQuestions,
      correctAnswers: newCorrectAnswers,
      incorrectAnswers: newIncorrectAnswers,
    });
  },

  /**
   * Set confidence rating (SuperMemo 2)
   */
  setConfidenceRating: (rating) => {
    set({ confidenceRating: rating });
  },

  /**
   * Move to next question
   */
  nextQuestion: () => {
    const { questionIds, currentQuestionIndex } = get();
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex < questionIds.length) {
      set({
        currentQuestionIndex: nextIndex,
        selectedOptions: [],
        hasSubmitted: false,
        validationResult: null,
        confidenceRating: null,
      });
    }
    // TODO: Handle session completion when no more questions
  },

  /**
   * Skip current question without answering
   */
  skipQuestion: () => {
    const { currentQuestion, skippedQuestions } = get();

    if (!currentQuestion) return;

    const newSkippedQuestions = new Set(skippedQuestions);
    newSkippedQuestions.add(currentQuestion.id);

    set({ skippedQuestions: newSkippedQuestions });

    // Move to next question
    get().nextQuestion();
  },

  /**
   * Reset session state
   */
  resetSession: () => {
    set({
      questionIds: [],
      currentQuestionIndex: 0,
      currentQuestion: null,
      selectedOptions: [],
      hasSubmitted: false,
      validationResult: null,
      confidenceRating: null,
      answeredQuestions: new Set(),
      correctAnswers: 0,
      incorrectAnswers: 0,
      skippedQuestions: new Set(),
      sessionStartTime: null,
    });
  },
}));

// TODO: Add persistence to localStorage for session recovery
// TODO: Add undo last answer functionality
// TODO: Add time tracking per question
