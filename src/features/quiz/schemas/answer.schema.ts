/**
 * Zod validation schemas for user answers
 * Validates answer submission data
 */

import { z } from "zod";

/**
 * Schema for user answer submission
 */
export const UserAnswerSchema = z.object({
  questionId: z.string().min(1),
  selectedOptions: z.array(z.string()).min(1), // At least one option must be selected
  timestamp: z.date(),
  timeSpentSeconds: z.number().min(0),
});

/**
 * Schema for difficulty rating
 */
export const DifficultyRatingSchema = z.union([
  z.literal(0), // AGAIN
  z.literal(3), // HARD
  z.literal(4), // GOOD
  z.literal(5), // EASY
]);

/**
 * Schema for answer submission with rating
 */
export const AnswerSubmissionSchema = z.object({
  questionId: z.string().min(1),
  selectedOptions: z.array(z.string()).min(1),
  rating: DifficultyRatingSchema,
  timeSpentSeconds: z.number().min(0),
});

// Type inference
export type UserAnswerSchemaType = z.infer<typeof UserAnswerSchema>;
export type DifficultyRatingSchemaType = z.infer<typeof DifficultyRatingSchema>;
export type AnswerSubmissionSchemaType = z.infer<typeof AnswerSubmissionSchema>;

// TODO: Add validation for batch answer submissions
