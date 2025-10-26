/**
 * Type definitions for quiz sessions
 */

import { UserAnswer } from "./answer.types";
import { Domain, DifficultyLevel, QuestionType } from "./question.types";
import { STUDY_MODES } from "@/lib/constants";

/**
 * Valid study mode values
 */
export type StudyMode = (typeof STUDY_MODES)[keyof typeof STUDY_MODES];

/**
 * Session configuration options
 */
export interface SessionConfig {
  domains: Domain[]; // Selected domains for this session
  questionsPerSession: number; // Number of questions to include
  studyMode: StudyMode | string; // Type of study session
  difficultyFilter?: DifficultyLevel[]; // Optional difficulty filter
  questionTypeFilter?: QuestionType[]; // Optional question type filter
  tagFilter?: string[]; // Optional tag filter
}

/**
 * Active quiz session state
 */
export interface QuizSession {
  id: string; // Unique session ID
  config: SessionConfig;
  questionIds: string[]; // Ordered list of question IDs for this session
  currentIndex: number; // Current question index
  startTime: Date; // When the session started
  endTime?: Date; // When the session ended (if completed)
  answers: Map<string, UserAnswer>; // Map of questionId to user's answer
  skippedQuestions: Set<string>; // Set of skipped question IDs
}

/**
 * Session completion summary
 */
export interface SessionSummary {
  sessionId: string;
  totalQuestions: number;
  answeredQuestions: number;
  skippedQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracyPercentage: number;
  timeSpentSeconds: number;
  domainBreakdown: Map<Domain, SessionDomainStats>; // Stats per domain
}

/**
 * Statistics for a domain within a session
 */
export interface SessionDomainStats {
  domain: Domain;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracyPercentage: number;
}

/**
 * Session history record for storage
 */
export interface SessionHistoryRecord {
  sessionId: string;
  date: Date;
  config: SessionConfig;
  summary: SessionSummary;
}

// TODO: Add real-time session state types (e.g., pause, resume)
