/**
 * Type definitions for user answers and answer validation
 */

/**
 * User's answer to a question
 */
export interface UserAnswer {
  questionId: string;
  selectedOptions: string[]; // Array of selected option IDs
  timestamp: Date; // When the answer was submitted
  timeSpentSeconds: number; // Time spent on the question
}

/**
 * Result of answer validation
 */
export interface AnswerValidationResult {
  isCorrect: boolean; // Fully correct (all correct options selected)
  isPartiallyCorrect: boolean; // Partially correct (for multiple select)
  correctOptions: string[]; // The correct option IDs
  selectedOptions: string[]; // User's selected option IDs
  incorrectSelections: string[]; // Incorrectly selected options
  missedCorrectOptions: string[]; // Correct options not selected
  correctCount: number; // Number of correct selections
  totalCorrectCount: number; // Total number of correct options
  accuracyPercentage: number; // Percentage correct (for partial credit)
}

/**
 * Answer feedback for UI display
 */
export interface AnswerFeedback {
  validation: AnswerValidationResult;
  explanation: {
    correct: string;
    incorrectReasons: Map<string, string>; // Map of option ID to explanation
  };
  keyConceptName: string;
  keyConcept: string;
}

// TODO: Add answer statistics types (e.g., historical accuracy, attempt count)
