/**
 * Zod validation schemas for quiz questions
 * Ensures data integrity when loading from JSON
 */

import { z } from "zod";
import { DOMAINS, DIFFICULTY_LEVELS, QUESTION_TYPES } from "@/lib/constants";

/**
 * Schema for question option
 */
export const QuestionOptionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
});

/**
 * Schema for question explanation
 */
export const QuestionExplanationSchema = z.object({
  correct: z.string().min(1),
  incorrect: z.record(z.string(), z.string()),
});

/**
 * Schema for complete quiz question
 */
export const QuizQuestionSchema = z.object({
  id: z.string().min(1),
  domain: z.enum([
    DOMAINS.COMPUTE_ENGINE,
    DOMAINS.IAM,
    DOMAINS.NETWORKING,
    DOMAINS.STORAGE,
    DOMAINS.GKE,
    DOMAINS.MONITORING,
    DOMAINS.APP_ENGINE,
    DOMAINS.DATA_ANALYTICS,
    DOMAINS.DEVELOPER_TOOLS,
  ]),
  difficulty: z.enum([
    DIFFICULTY_LEVELS.EASY,
    DIFFICULTY_LEVELS.MEDIUM,
    DIFFICULTY_LEVELS.HARD,
  ]),
  type: z.enum([
    QUESTION_TYPES.MULTIPLE_CHOICE,
    QUESTION_TYPES.MULTIPLE_SELECT,
  ]),
  scenario: z.string().nullable().optional(),
  question: z.string().min(1),
  options: z.array(QuestionOptionSchema).min(2).max(5),
  correctAnswer: z.array(z.string()).min(1),
  explanation: QuestionExplanationSchema,
  keyConceptName: z.string().min(1),
  keyConcept: z.string().min(1),
  tags: z.array(z.string()),
  examPatternKeywords: z.array(z.string()),
  relatedQuestionIds: z.array(z.string()).optional(),
  officialDocsUrl: z.string().url(),
});

/**
 * Schema for array of questions (entire domain file)
 */
export const QuizQuestionsArraySchema = z.array(QuizQuestionSchema);

// Type inference from schemas
export type QuizQuestionSchemaType = z.infer<typeof QuizQuestionSchema>;
export type QuestionOptionSchemaType = z.infer<typeof QuestionOptionSchema>;

// TODO: Add schemas for question metadata, question banks, etc.
