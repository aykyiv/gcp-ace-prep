/**
 * Session Configuration Hook
 *
 * Manages session configuration state before starting quiz
 * Stores selected domains, filters, and study preferences
 */

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SessionConfig } from "../types/session.types";
import type {
  Domain,
  DifficultyLevel,
  QuestionType,
} from "../types/question.types";
import { STUDY_MODES, SESSION_CONFIG } from "@/lib/constants";

/**
 * Session configuration state interface
 */
interface SessionConfigState {
  // Configuration
  selectedDomains: Domain[];
  questionsPerSession: number;
  studyMode: string;
  difficultyFilter: DifficultyLevel[];
  questionTypeFilter: QuestionType[];
  tagFilter: string[];

  // Actions
  toggleDomain: (domain: Domain) => void;
  setAllDomains: (domains: Domain[]) => void;
  clearDomains: () => void;
  setQuestionsPerSession: (count: number) => void;
  setStudyMode: (mode: string) => void;
  toggleDifficulty: (difficulty: DifficultyLevel) => void;
  setAllDifficulties: (difficulties: DifficultyLevel[]) => void;
  toggleQuestionType: (type: QuestionType) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  clearFilters: () => void;
  getConfig: () => SessionConfig;
}

/**
 * Create session config store with persistence
 */
export const useSessionConfig = create<SessionConfigState>()(
  persist(
    (set, get) => ({
      // Initial state
      selectedDomains: [],
      questionsPerSession: SESSION_CONFIG.DEFAULT_QUESTIONS_PER_SESSION,
      studyMode: STUDY_MODES.MIXED,
      difficultyFilter: [],
      questionTypeFilter: [],
      tagFilter: [],

      /**
       * Toggle domain selection
       */
      toggleDomain: (domain) => {
        set((state) => ({
          selectedDomains: state.selectedDomains.includes(domain)
            ? state.selectedDomains.filter((d) => d !== domain)
            : [...state.selectedDomains, domain],
        }));
      },

      /**
       * Select all domains
       */
      setAllDomains: (domains) => {
        set({ selectedDomains: domains });
      },

      /**
       * Clear all domain selections
       */
      clearDomains: () => {
        set({ selectedDomains: [] });
      },

      /**
       * Set questions per session count
       */
      setQuestionsPerSession: (count) => {
        set({ questionsPerSession: count });
      },

      /**
       * Set study mode
       */
      setStudyMode: (mode) => {
        set({ studyMode: mode });
      },

      /**
       * Toggle difficulty filter
       */
      toggleDifficulty: (difficulty) => {
        set((state) => ({
          difficultyFilter: state.difficultyFilter.includes(difficulty)
            ? state.difficultyFilter.filter((d) => d !== difficulty)
            : [...state.difficultyFilter, difficulty],
        }));
      },

      /**
       * Set all difficulties (or clear)
       */
      setAllDifficulties: (difficulties) => {
        set({ difficultyFilter: difficulties });
      },

      /**
       * Toggle question type filter
       */
      toggleQuestionType: (type) => {
        set((state) => ({
          questionTypeFilter: state.questionTypeFilter.includes(type)
            ? state.questionTypeFilter.filter((t) => t !== type)
            : [...state.questionTypeFilter, type],
        }));
      },

      /**
       * Add tag to filter
       */
      addTag: (tag) => {
        set((state) => ({
          tagFilter: state.tagFilter.includes(tag)
            ? state.tagFilter
            : [...state.tagFilter, tag],
        }));
      },

      /**
       * Remove tag from filter
       */
      removeTag: (tag) => {
        set((state) => ({
          tagFilter: state.tagFilter.filter((t) => t !== tag),
        }));
      },

      /**
       * Clear all filters
       */
      clearFilters: () => {
        set({
          difficultyFilter: [],
          questionTypeFilter: [],
          tagFilter: [],
        });
      },

      /**
       * Get session config object
       */
      getConfig: () => {
        const state = get();
        return {
          domains: state.selectedDomains,
          questionsPerSession: state.questionsPerSession,
          studyMode: state.studyMode,
          difficultyFilter:
            state.difficultyFilter.length > 0
              ? state.difficultyFilter
              : undefined,
          questionTypeFilter:
            state.questionTypeFilter.length > 0
              ? state.questionTypeFilter
              : undefined,
          tagFilter: state.tagFilter.length > 0 ? state.tagFilter : undefined,
        };
      },
    }),
    {
      name: "session-config-storage", // localStorage key
    }
  )
);

// TODO: Add preset configurations (e.g., "Quick Practice", "Full Domain Review")
// TODO: Add validation to ensure at least one domain is selected
// TODO: Add smart defaults based on user's progress
