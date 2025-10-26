/**
 * Question Display Component
 *
 * Shows the question text, scenario (if any), and metadata
 */

"use client";

import type { QuizQuestion } from "@/features/quiz/types/question.types";
import { QuestionMetadata } from "./question-metadata";

interface QuestionDisplayProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
}

export function QuestionDisplay({
  question,
  questionNumber,
  totalQuestions,
}: QuestionDisplayProps) {
  return (
    <div className="space-y-4">
      {/* Question number and metadata */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">
          Question {questionNumber} of {totalQuestions}
        </span>
        <QuestionMetadata question={question} />
      </div>

      {/* Scenario (if present) */}
      {question.scenario && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-1">Scenario:</p>
          <p className="md:text-xl text-sm text-blue-800">{question.scenario}</p>
        </div>
      )}

      {/* Question text */}
      <div className="p-6 bg-white border-2 border-gray-200 rounded-lg shadow-sm">
        <p className="text-lg font-semibold text-gray-900 leading-relaxed">
          {question.question}
        </p>

        {/* Multiple select indicator */}
        {question.type === "multiple-select" && (
          <p className="mt-3 text-sm font-medium text-orange-600">
            ⚠️ Select ALL correct answers
          </p>
        )}
      </div>
    </div>
  );
}

// TODO: Add question bookmarking functionality
// TODO: Add text-to-speech for question reading
