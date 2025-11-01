/**
 * Exam Generator Service
 *
 * Generates realistic exam with proper domain distribution
 * Follows actual GCP ACE exam structure
 */

import type {
  QuizQuestion,
} from "@/features/quiz/types/question.types";
import { DOMAIN_METADATA } from "@/lib/constants";
import { shuffleArray } from "@/lib/utils";

/**
 * Generate exam with realistic domain distribution
 *
 * @param allQuestions - All available questions
 * @param questionCount - Total questions (default 50)
 * @returns Array of selected questions
 */
export function generateExam(
  allQuestions: QuizQuestion[],
  questionCount: number = 50
): QuizQuestion[] {
  // Calculate questions per domain based on exam percentage
  const domainQuestionCounts = calculateDomainDistribution(questionCount);

  const selectedQuestions: QuizQuestion[] = [];

  // Select questions for each domain
  Object.entries(domainQuestionCounts).forEach(([domain, count]) => {
    const domainQuestions = allQuestions.filter((q) => q.domain === domain);

    // Shuffle and take required count
    const shuffled = shuffleArray(domainQuestions);
    const selected = shuffled.slice(0, count);

    selectedQuestions.push(...selected);
  });

  // Shuffle all selected questions so domains are mixed
  return shuffleArray(selectedQuestions);
}

/**
 * Calculate how many questions per domain based on exam percentages
 */
function calculateDomainDistribution(
  totalQuestions: number
): Record<string, number> {
  const distribution: Record<string, number> = {};

  Object.entries(DOMAIN_METADATA).forEach(([domain, metadata]) => {
    // Calculate based on exam percentage
    const count = Math.round((metadata.examPercentage / 100) * totalQuestions);
    distribution[domain] = count;
  });

  // Adjust to ensure exact total
  const currentTotal = Object.values(distribution).reduce(
    (sum, count) => sum + count,
    0
  );
  const diff = totalQuestions - currentTotal;

  if (diff !== 0) {
    // Add/subtract from largest domain
    const largestDomain = Object.entries(distribution).sort(
      (a, b) => b[1] - a[1]
    )[0][0];
    distribution[largestDomain] += diff;
  }

  return distribution;
}

/**
 * Get difficulty distribution for exam
 * Realistic mix: 20% Easy, 50% Medium, 30% Hard
 */
export function getRecommendedDifficultyMix() {
  return {
    easy: 0.2,
    medium: 0.5,
    hard: 0.3,
  };
}

// TODO: Add option to generate from weak areas only
// TODO: Add option to filter by specific domains
// TODO: Add question type balance (70% MC, 30% MS)
