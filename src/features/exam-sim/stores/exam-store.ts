/**
 * Exam Simulation State Store
 *
 * Manages exam session state with strict time limits
 * No answer validation until submit
 */

import { create } from "zustand";
import type { QuizQuestion } from "@/features/quiz/types/question.types";

/**
 * Exam question state
 */
interface ExamQuestionState {
  question: QuizQuestion;
  selectedOptions: string[];
  flagged: boolean;
  answered: boolean;
  timeSpent: number; // seconds on this question
}

/**
 * Exam session state
 */
interface ExamState {
  // Session data
  questions: ExamQuestionState[];
  currentQuestionIndex: number;
  startTime: Date | null;
  endTime: Date | null;
  timeRemaining: number; // seconds remaining (120 minutes = 7200 seconds)
  isSubmitted: boolean;

  // Results (after submission)
  score: number | null;
  correctAnswers: number | null;
  incorrectAnswers: number | null;
  unansweredQuestions: number | null;

  // Actions
  initializeExam: (questions: QuizQuestion[]) => void;
  setCurrentQuestion: (index: number) => void;
  selectOption: (
    questionIndex: number,
    optionId: string,
    isMultipleSelect: boolean
  ) => void;
  toggleFlag: (questionIndex: number) => void;
  updateTimeRemaining: (seconds: number) => void;
  submitExam: () => void;
  resetExam: () => void;
}

/**
 * Create exam store
 */
export const useExamStore = create<ExamState>((set, get) => ({
  // Initial state
  questions: [],
  currentQuestionIndex: 0,
  startTime: null,
  endTime: null,
  timeRemaining: 7200, // 2 hours in seconds
  isSubmitted: false,
  score: null,
  correctAnswers: null,
  incorrectAnswers: null,
  unansweredQuestions: null,

  /**
   * Initialize exam with questions
   */
  initializeExam: (questions) => {
    const examQuestions: ExamQuestionState[] = questions.map((q) => ({
      question: q,
      selectedOptions: [],
      flagged: false,
      answered: false,
      timeSpent: 0,
    }));

    set({
      questions: examQuestions,
      currentQuestionIndex: 0,
      startTime: new Date(),
      endTime: null,
      timeRemaining: 7200,
      isSubmitted: false,
      score: null,
      correctAnswers: null,
      incorrectAnswers: null,
      unansweredQuestions: null,
    });
  },

  /**
   * Navigate to specific question
   */
  setCurrentQuestion: (index) => {
    const { questions } = get();
    if (index >= 0 && index < questions.length) {
      set({ currentQuestionIndex: index });
    }
  },

  /**
   * Select/deselect answer option
   */
  selectOption: (questionIndex, optionId, isMultipleSelect) => {
    const { questions } = get();
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex];

    if (isMultipleSelect) {
      // Toggle option for multiple select
      if (question.selectedOptions.includes(optionId)) {
        question.selectedOptions = question.selectedOptions.filter(
          (id) => id !== optionId
        );
      } else {
        question.selectedOptions = [...question.selectedOptions, optionId];
      }
    } else {
      // Replace selection for single choice
      question.selectedOptions = [optionId];
    }

    // Mark as answered if has selections
    question.answered = question.selectedOptions.length > 0;

    set({ questions: updatedQuestions });
  },

  /**
   * Toggle flag for review
   */
  toggleFlag: (questionIndex) => {
    const { questions } = get();
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].flagged =
      !updatedQuestions[questionIndex].flagged;
    set({ questions: updatedQuestions });
  },

  /**
   * Update remaining time
   */
  updateTimeRemaining: (seconds) => {
    set({ timeRemaining: seconds });

    // Auto-submit when time runs out
    if (seconds <= 0) {
      get().submitExam();
    }
  },

  /**
   * Submit exam (calculate results)
   */
  submitExam: () => {
    const { questions } = get();

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    questions.forEach((examQuestion) => {
      const { question, selectedOptions } = examQuestion;

      if (selectedOptions.length === 0) {
        unansweredCount++;
        return;
      }

      // Check if answer is correct
      const correctAnswers = question.correctAnswer;
      const isCorrect =
        selectedOptions.length === correctAnswers.length &&
        selectedOptions.every((opt) => correctAnswers.includes(opt));

      if (isCorrect) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    const totalAnswered = correctCount + incorrectCount;
    const scorePercentage =
      totalAnswered > 0
        ? Math.round((correctCount / questions.length) * 100)
        : 0;

    set({
      isSubmitted: true,
      endTime: new Date(),
      score: scorePercentage,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      unansweredQuestions: unansweredCount,
    });
  },

  /**
   * Reset exam to initial state
   */
  resetExam: () => {
    set({
      questions: [],
      currentQuestionIndex: 0,
      startTime: null,
      endTime: null,
      timeRemaining: 7200,
      isSubmitted: false,
      score: null,
      correctAnswers: null,
      incorrectAnswers: null,
      unansweredQuestions: null,
    });
  },
}));

// TODO: Add pause/resume functionality
// TODO: Add question time tracking
// TODO: Add auto-save to localStorage
