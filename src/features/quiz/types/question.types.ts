/**
 * Type definitions for quiz questions
 * Includes multiple choice and multiple select question structures
 */

import { DOMAINS, DIFFICULTY_LEVELS, QUESTION_TYPES } from "@/lib/constants";

/**
 * Valid domain identifiers
 */
export type Domain = (typeof DOMAINS)[keyof typeof DOMAINS];

/**
 * Valid difficulty levels
 */
export type DifficultyLevel =
  (typeof DIFFICULTY_LEVELS)[keyof typeof DIFFICULTY_LEVELS];

/**
 * Valid question types
 */
export type QuestionType = (typeof QUESTION_TYPES)[keyof typeof QUESTION_TYPES];

/**
 * Individual question option (A, B, C, D, E)
 */
export interface QuestionOption {
  id: string; // 'A', 'B', 'C', etc.
  text: string;
}

/**
 * Explanation structure for answers
 */
export interface QuestionExplanation {
  correct: string; // Why the correct answer is correct
  incorrect: Record<string, string>; // Why each incorrect option is wrong (keyed by option id)
}

/**
 * Complete quiz question structure
 */
export interface QuizQuestion {
  id: string; // Unique identifier (e.g., "ace-compute-001")
  domain: Domain;
  difficulty: DifficultyLevel;
  type: QuestionType;
  scenario?: string; // Optional context/scenario for the question
  question: string; // The actual question text
  options: QuestionOption[]; // Array of answer options
  correctAnswer: string[]; // Array of correct option IDs (single for MC, multiple for MS)
  explanation: QuestionExplanation;
  keyConceptName: string; // Short concept name (e.g., "Cost Optimization")
  keyConcept: string; // Detailed key concept explanation
  tags: string[]; // Array of concept tags for filtering
  examPatternKeywords: string[]; // Keywords that indicate exam patterns
  relatedQuestionIds: string[]; // IDs of related questions
  officialDocsUrl: string; // Link to official GCP documentation
}

/**
 * Lightweight question reference (for lists, without full content)
 */
export interface QuestionReference {
  id: string;
  domain: Domain;
  difficulty: DifficultyLevel;
  type: QuestionType;
  tags: string[];
}

// TODO: Add question metadata types as needed (e.g., statistics, usage tracking)
