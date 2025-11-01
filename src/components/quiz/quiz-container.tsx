/**
 * Quiz Container Component
 *
 * Main wrapper that orchestrates all quiz components
 * Connects components to quiz store and handles flow
 */

"use client";

import { useQuizStore } from "@/features/quiz/stores/quiz-store";
import { useAnswerSubmission } from "@/features/quiz/hooks/use-answer-submission";
import { useKeyboardShortcuts } from "@/features/quiz/hooks/use-keyboard-shortcuts";
import { QuestionDisplay } from "./question-display";
import { OptionsSingleChoice } from "./options-single-choice";
import { OptionsMultipleSelect } from "./options-multiple-select";
import { AnswerExplanation } from "./answer-explanation";
import { ConfidenceRating } from "./confidence-rating";
import { SubmitButton } from "./submit-button";
import { NavigationButtons } from "./navigation-buttons";
import { QuestionProgress } from "./question-progress";

export function QuizContainer() {
  const store = useQuizStore();
  const { submitAnswer, submitConfidenceRating, canSubmit } =
    useAnswerSubmission();

  // Enable keyboard shortcuts
  useKeyboardShortcuts(true);

  // Loading state
  if (!store.currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="text-4xl">📚</div>
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  const { currentQuestion, hasSubmitted, validationResult } = store;
  const isMultipleSelect = currentQuestion.type === "multiple-select";
  const isLastQuestion =
    store.currentQuestionIndex === store.questionIds.length - 1;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress bar */}
        <QuestionProgress
          currentQuestion={store.currentQuestionIndex + 1}
          totalQuestions={store.questionIds.length}
          answeredCount={store.answeredQuestions.size}
          correctCount={store.correctAnswers}
        />

        {/* Main quiz content */}
        <div className="mt-8 space-y-6">
          {/* Question */}
          <QuestionDisplay
            question={currentQuestion}
            questionNumber={store.currentQuestionIndex + 1}
            totalQuestions={store.questionIds.length}
          />

          {/* Options */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            {isMultipleSelect ? (
              <OptionsMultipleSelect
                options={currentQuestion.options}
                selectedOptions={store.selectedOptions}
                onToggle={(optionId) => store.toggleOption(optionId, true)}
                hasSubmitted={hasSubmitted}
                validationResult={validationResult}
              />
            ) : (
              <OptionsSingleChoice
                options={currentQuestion.options}
                selectedOptions={store.selectedOptions}
                onSelect={(optionId) => store.toggleOption(optionId, false)}
                hasSubmitted={hasSubmitted}
                validationResult={validationResult}
              />
            )}
          </div>

          {/* Submit button (before submission) */}
          {!hasSubmitted && (
            <div className="flex justify-center">
              <SubmitButton
                onClick={submitAnswer}
                disabled={!canSubmit}
                hasSubmitted={hasSubmitted}
              />
            </div>
          )}

          {/* Answer explanation (after submission) */}
          {hasSubmitted && validationResult && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <AnswerExplanation
                question={currentQuestion}
                validationResult={validationResult}
              />
            </div>
          )}

          {/* Confidence rating (after submission) */}
          {hasSubmitted && validationResult && !store.confidenceRating && (
            <ConfidenceRating onRate={submitConfidenceRating} />
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between items-center pt-4">
            <NavigationButtons
              onSkip={store.skipQuestion}
              onNext={store.nextQuestion}
              showSkip={!hasSubmitted}
              showNext={hasSubmitted && store.confidenceRating !== null}
              isLastQuestion={isLastQuestion}
            />

            {/* Keyboard hints */}
            <div className="text-xs text-gray-500">
              <p>
                Shortcuts: A-E (select), Enter (submit), 1-4 (rate), S (skip)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// TODO: Add session completion modal
// TODO: Add pause/resume functionality
// TODO: Add progress save to localStorage
