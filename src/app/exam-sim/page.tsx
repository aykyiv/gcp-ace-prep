/**
 * Exam Simulation Page
 *
 * Full exam simulation with 50 questions, 2-hour timer
 * Mimics real GCP ACE exam conditions
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExamTimer } from "@/components/exam-sim/exam-timer";
import { ExamQuestionNavigator } from "@/components/exam-sim/exam-question-navigator";
import { ExamQuestionDisplay } from "@/components/exam-sim/exam-question-display";
import { ExamAnswerSelector } from "@/components/exam-sim/exam-answer-selector";
import { ExamFlagButton } from "@/components/exam-sim/exam-flag-button";
import { ExamSubmitDialog } from "@/components/exam-sim/exam-submit-dialog";
import { ExamResultsSummary } from "@/components/exam-sim/exam-results-summary";
import { useExamSession } from "@/features/exam-sim/hooks/use-exam-session";
import { useExamStore } from "@/features/exam-sim/stores/exam-store";

export default function ExamSimPage() {
  const store = useExamStore();
  const { isLoading, isInitialized } = useExamSession(50);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  // Show results if exam is submitted
  if (store.isSubmitted) {
    return <ExamResultsSummary />;
  }

  // Loading state
  if (isLoading || !isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-pulse">📝</div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Generating Exam...
          </h2>
          <p className="text-gray-600">
            Creating your 50-question exam simulation
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = store.questions[store.currentQuestionIndex];
  if (!currentQuestion) return null;

  // Navigation helpers
  const goToPrevious = () => {
    if (store.currentQuestionIndex > 0) {
      store.setCurrentQuestion(store.currentQuestionIndex - 1);
    }
  };

  const goToNext = () => {
    if (store.currentQuestionIndex < store.questions.length - 1) {
      store.setCurrentQuestion(store.currentQuestionIndex + 1);
    }
  };

  const handleSelectOption = (optionId: string) => {
    const isMultipleSelect =
      currentQuestion.question.type === "multiple-select";
    store.selectOption(store.currentQuestionIndex, optionId, isMultipleSelect);
  };

  const handleSubmit = () => {
    store.submitExam();
    setShowSubmitDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-900">
                GCP ACE Exam Simulation
              </h1>
              <span className="text-sm text-gray-500">
                Question {store.currentQuestionIndex + 1} of{" "}
                {store.questions.length}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <ExamTimer />
              <Button
                onClick={() => setShowSubmitDialog(true)}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                Submit Exam
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left column - Question */}
          <div className="lg:col-span-3 space-y-6">
            {/* Question display */}
            <ExamQuestionDisplay
              question={currentQuestion.question}
              questionNumber={store.currentQuestionIndex + 1}
              totalQuestions={store.questions.length}
            />

            {/* Answer options */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <ExamAnswerSelector
                options={currentQuestion.question.options}
                selectedOptions={currentQuestion.selectedOptions}
                isMultipleSelect={
                  currentQuestion.question.type === "multiple-select"
                }
                onSelect={handleSelectOption}
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  onClick={goToPrevious}
                  disabled={store.currentQuestionIndex === 0}
                  variant="outline"
                >
                  ← Previous
                </Button>
                <ExamFlagButton />
              </div>
              <Button
                onClick={goToNext}
                disabled={
                  store.currentQuestionIndex === store.questions.length - 1
                }
              >
                Next →
              </Button>
            </div>
          </div>

          {/* Right column - Navigator (sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-4 rounded-lg border border-gray-200 sticky top-24">
              <ExamQuestionNavigator />
            </div>
          </div>
        </div>
      </div>

      {/* Submit confirmation dialog */}
      <ExamSubmitDialog
        isOpen={showSubmitDialog}
        onClose={() => setShowSubmitDialog(false)}
        onConfirm={handleSubmit}
      />
    </div>
  );
}

// TODO: Add exit confirmation dialog
// TODO: Add pause/resume functionality
// TODO: Add fullscreen mode
