/**
 * Question Loader Service
 *
 * Handles loading quiz questions from JSON files and caching them.
 * Provides filtering and domain-specific question retrieval.
 */

import { QuizQuestionsArraySchema } from "../schemas/question.schema";
import type { QuizQuestion, Domain } from "../types/question.types";

/**
 * Cache for loaded questions to avoid re-parsing JSON
 * In a real app, this would use React Query or similar
 */
const questionsCache = new Map<Domain, QuizQuestion[]>();

/**
 * Loads questions for a specific domain from JSON file
 *
 * @param domain - Domain identifier
 * @returns Array of quiz questions
 */
export async function loadDomainQuestions(
  domain: Domain
): Promise<QuizQuestion[]> {
  // Check cache first
  if (questionsCache.has(domain)) {
    return questionsCache.get(domain)!;
  }

  try {
    // Dynamic import of JSON file based on domain
    const questionsModule = await import(`@/data/domains/${domain}.json`);
    const questionsData = questionsModule.default;

    // Validate data with Zod schema
    const validatedQuestions = QuizQuestionsArraySchema.parse(questionsData);

    // Cache for future use
    questionsCache.set(domain, validatedQuestions as QuizQuestion[]);

    return validatedQuestions as QuizQuestion[];
  } catch (error) {
    console.error(`Failed to load questions for domain ${domain}:`, error);

    // Return empty array if loading fails (graceful degradation)
    return [];
  }
}

/**
 * Loads questions for multiple domains
 *
 * @param domains - Array of domain identifiers
 * @returns Flattened array of all questions
 */
export async function loadMultipleDomainQuestions(
  domains: Domain[]
): Promise<QuizQuestion[]> {
  // Load all domains in parallel
  const questionArrays = await Promise.all(
    domains.map((domain) => loadDomainQuestions(domain))
  );

  // Flatten into single array
  return questionArrays.flat();
}

/**
 * Gets a single question by ID
 *
 * @param questionId - Question ID to find
 * @param domain - Domain to search in (optional, searches all if not provided)
 * @returns Question or null if not found
 */
export async function getQuestionById(
  questionId: string,
  domain?: Domain
): Promise<QuizQuestion | null> {
  if (domain) {
    // Search in specific domain
    const questions = await loadDomainQuestions(domain);
    return questions.find((q) => q.id === questionId) || null;
  }

  // Search all domains (less efficient, use sparingly)
  const allDomains: Domain[] = [
    "compute-engine",
    "iam",
    "networking",
    "storage",
    "gke",
    "monitoring-logging",
    "app-engine-cloud-run",
    "data-analytics",
    "developer-tools",
  ];

  for (const d of allDomains) {
    const questions = await loadDomainQuestions(d);
    const found = questions.find((q) => q.id === questionId);
    if (found) return found;
  }

  return null;
}

/**
 * Gets all questions from all domains
 * Use sparingly - prefer loading specific domains
 *
 * @returns All questions across all domains
 */
export async function loadAllQuestions(): Promise<QuizQuestion[]> {
  const allDomains: Domain[] = [
    "compute-engine",
    "iam",
    "networking",
    "storage",
    "gke",
    "monitoring-logging",
    "app-engine-cloud-run",
    "data-analytics",
    "developer-tools",
  ];

  return await loadMultipleDomainQuestions(allDomains);
}

/**
 * Clears the questions cache
 * Useful for testing or if questions are updated
 */
export function clearQuestionsCache(): void {
  questionsCache.clear();
}

/**
 * Gets cache statistics
 * Useful for debugging
 */
export function getCacheStats(): {
  cachedDomains: Domain[];
  totalCachedQuestions: number;
} {
  const cachedDomains = Array.from(questionsCache.keys());
  const totalCachedQuestions = Array.from(questionsCache.values()).reduce(
    (sum, questions) => sum + questions.length,
    0
  );

  return {
    cachedDomains,
    totalCachedQuestions,
  };
}

// TODO: Add function to preload all domains on app start
// TODO: Add function to validate question IDs are unique across domains
// TODO: Add function to get random questions for quick practice
