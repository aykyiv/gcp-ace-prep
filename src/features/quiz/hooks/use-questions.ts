/**
 * React Hook for loading quiz questions
 *
 * Uses TanStack Query for caching and state management
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import {
  loadDomainQuestions,
  loadMultipleDomainQuestions,
  getQuestionById,
  loadAllQuestions,
} from "../services/question-loader";
import type { Domain } from "../types/question.types";

/**
 * Hook to load questions for a single domain
 *
 * @param domain - Domain to load questions from
 * @returns React Query result with questions data
 */
export function useDomainQuestions(domain: Domain) {
  return useQuery({
    queryKey: ["questions", domain],
    queryFn: () => loadDomainQuestions(domain),
    staleTime: Infinity, // Questions never change during app lifetime
  });
}

/**
 * Hook to load questions from multiple domains
 *
 * @param domains - Array of domains to load
 * @returns React Query result with combined questions
 */
export function useMultipleDomainQuestions(domains: Domain[]) {
  return useQuery({
    queryKey: ["questions", "multiple", domains.sort()], // Sort for consistent cache key
    queryFn: () => loadMultipleDomainQuestions(domains),
    staleTime: Infinity,
    enabled: domains.length > 0, // Only run if domains provided
  });
}

/**
 * Hook to get a single question by ID
 *
 * @param questionId - Question ID to fetch
 * @param domain - Optional domain to search in (faster)
 * @returns React Query result with single question
 */
export function useQuestion(questionId: string, domain?: Domain) {
  return useQuery({
    queryKey: ["question", questionId, domain],
    queryFn: () => getQuestionById(questionId, domain),
    staleTime: Infinity,
    enabled: !!questionId, // Only run if questionId provided
  });
}

/**
 * Hook to load all questions (use sparingly)
 *
 * @returns React Query result with all questions
 */
export function useAllQuestions() {
  return useQuery({
    queryKey: ["questions", "all"],
    queryFn: loadAllQuestions,
    staleTime: Infinity,
  });
}

// TODO: Add hook to prefetch questions for better UX
// TODO: Add hook to get questions with filters applied
// TODO: Add hook to get question count by domain without loading all questions
