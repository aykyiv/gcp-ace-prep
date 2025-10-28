/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Answer Validation Service
 *
 * Validates user answers against correct answers and calculates
 * accuracy, partial credit, and provides detailed feedback.
 */

import type { QuizQuestion } from "../types/question.types";
import type {
  UserAnswer,
  AnswerValidationResult,
  AnswerFeedback,
} from "../types/answer.types";

/**
 * Validates a user's answer against the correct answer
 *
 * @param question - The quiz question
 * @param userAnswer - User's submitted answer
 * @returns Detailed validation result
 */
export function validateAnswer(
  question: QuizQuestion,
  userAnswer: UserAnswer
): AnswerValidationResult {
  const correctSet = new Set(question.correctAnswer);
  const selectedSet = new Set(userAnswer.selectedOptions);

  // Find overlaps and differences
  const correctSelections = userAnswer.selectedOptions.filter((opt) =>
    correctSet.has(opt)
  );
  const incorrectSelections = userAnswer.selectedOptions.filter(
    (opt) => !correctSet.has(opt)
  );
  const missedCorrectOptions = question.correctAnswer.filter(
    (opt) => !selectedSet.has(opt)
  );

  // Calculate metrics
  const correctCount = correctSelections.length;
  const totalCorrectCount = question.correctAnswer.length;
  const hasIncorrectSelections = incorrectSelections.length > 0;
  const hasMissedCorrect = missedCorrectOptions.length > 0;

  // Determine correctness
  const isCorrect =
    correctCount === totalCorrectCount && !hasIncorrectSelections;
  const isPartiallyCorrect = correctCount > 0 && !isCorrect;

  // Calculate accuracy percentage (for partial credit)
  let accuracyPercentage = 0;
  if (question.type === "multiple-select") {
    // For multiple select, consider both correct selections and incorrect selections
    const totalOptions = question.options.length;
    const correctWeight = correctCount / totalCorrectCount;
    const incorrectPenalty = incorrectSelections.length / totalOptions;
    accuracyPercentage = Math.max(0, (correctWeight - incorrectPenalty) * 100);
  } else {
    // For multiple choice, it's binary (0% or 100%)
    accuracyPercentage = isCorrect ? 100 : 0;
  }

  return {
    isCorrect,
    isPartiallyCorrect,
    correctOptions: question.correctAnswer,
    selectedOptions: userAnswer.selectedOptions,
    incorrectSelections,
    missedCorrectOptions,
    correctCount,
    totalCorrectCount,
    accuracyPercentage: Math.round(accuracyPercentage),
  };
}

/**
 * Creates answer feedback for UI display
 *
 * @param question - The quiz question
 * @param validation - Validation result
 * @returns Complete feedback object
 */
export function createAnswerFeedback(
  question: QuizQuestion,
  validation: AnswerValidationResult
): AnswerFeedback {
  // Build map of incorrect options to their explanations
  const incorrectReasons = new Map<string, string>();
  for (const optionId of validation.incorrectSelections) {
    const reason = question.explanation.incorrect[optionId];
    if (reason) {
      incorrectReasons.set(optionId, reason);
    }
  }

  // Also include explanations for missed correct options
  for (const optionId of validation.missedCorrectOptions) {
    if (!incorrectReasons.has(optionId)) {
      incorrectReasons.set(
        optionId,
        "This was a correct answer that you missed."
      );
    }
  }

  return {
    validation,
    explanation: {
      correct: question.explanation.correct,
      incorrectReasons,
    },
    keyConceptName: question.keyConceptName,
    keyConcept: question.keyConcept,
  };
}

/**
 * Determines if an option should be highlighted as correct
 *
 * @param optionId - Option ID to check
 * @param validation - Validation result
 * @returns True if option is correct
 */
export function isCorrectOption(
  optionId: string,
  validation: AnswerValidationResult
): boolean {
  return validation.correctOptions.includes(optionId);
}

/**
 * Determines if an option was selected by the user
 *
 * @param optionId - Option ID to check
 * @param validation - Validation result
 * @returns True if option was selected
 */
export function wasOptionSelected(
  optionId: string,
  validation: AnswerValidationResult
): boolean {
  return validation.selectedOptions.includes(optionId);
}

/**
 * Gets the CSS class for an option based on validation state
 *
 * @param optionId - Option ID
 * @param validation - Validation result
 * @returns Tailwind CSS class string
 */
export function getOptionStateClass(
  optionId: string,
  validation: AnswerValidationResult
): string {
  const isCorrect = isCorrectOption(optionId, validation);
  const wasSelected = wasOptionSelected(optionId, validation);

  if (isCorrect && wasSelected) {
    return "border-green-500 bg-green-50"; // Correctly selected
  }
  if (!isCorrect && wasSelected) {
    return "border-red-500 bg-red-50"; // Incorrectly selected
  }
  if (isCorrect && !wasSelected) {
    return "border-yellow-500 bg-yellow-50"; // Missed correct answer
  }
  return "border-gray-300"; // Not relevant
}

// TODO: Add function to calculate option-level statistics
// TODO: Add function to identify common mistake patterns
