/**
 * Exam Grading Service
 *
 * Calculates detailed exam results by domain
 */

import type { QuizQuestion } from "@/features/quiz/types/question.types";
import { DOMAIN_METADATA } from "@/lib/constants";

/**
 * Domain-specific results
 */
export interface DomainResults {
  domain: string;
  domainName: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  accuracyPercentage: number;
}

/**
 * Calculate results broken down by domain
 */
export function calculateDomainResults(
  questions: Array<{
    question: QuizQuestion;
    selectedOptions: string[];
  }>
): DomainResults[] {
  const domainMap = new Map<string, DomainResults>();

  // Initialize all domains
  Object.keys(DOMAIN_METADATA).forEach((domain) => {
    domainMap.set(domain, {
      domain,
      domainName: DOMAIN_METADATA[domain as keyof typeof DOMAIN_METADATA].name,
      totalQuestions: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      unanswered: 0,
      accuracyPercentage: 0,
    });
  });

  // Process each question
  questions.forEach(({ question, selectedOptions }) => {
    const domainResults = domainMap.get(question.domain)!;
    domainResults.totalQuestions++;

    if (selectedOptions.length === 0) {
      domainResults.unanswered++;
      return;
    }

    // Check correctness
    const isCorrect =
      selectedOptions.length === question.correctAnswer.length &&
      selectedOptions.every((opt) => question.correctAnswer.includes(opt));

    if (isCorrect) {
      domainResults.correctAnswers++;
    } else {
      domainResults.incorrectAnswers++;
    }
  });

  // Calculate accuracy percentages
  domainMap.forEach((results) => {
    const answered = results.correctAnswers + results.incorrectAnswers;
    results.accuracyPercentage =
      answered > 0 ? Math.round((results.correctAnswers / answered) * 100) : 0;
  });

  // Return sorted by exam percentage (most important first)
  return Array.from(domainMap.values())
    .filter((r) => r.totalQuestions > 0) // Only domains that had questions
    .sort((a, b) => {
      const aWeight =
        DOMAIN_METADATA[a.domain as keyof typeof DOMAIN_METADATA]
          .examPercentage;
      const bWeight =
        DOMAIN_METADATA[b.domain as keyof typeof DOMAIN_METADATA]
          .examPercentage;
      return bWeight - aWeight;
    });
}

// TODO: Add time per question analysis
// TODO: Add difficulty-based scoring
