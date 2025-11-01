/**
 * Exam Question Display
 *
 * Shows question WITHOUT immediate feedback (exam mode)
 */

"use client";

import { Badge } from "@/components/ui/badge";
import type { QuizQuestion } from "@/features/quiz/types/question.types";

interface ExamQuestionDisplayProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
}

export function ExamQuestionDisplay({
  question,
  questionNumber,
  totalQuestions,
}: ExamQuestionDisplayProps) {
  return (
    <div className="space-y-4">
      {/* Question header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">
          Question {questionNumber} of {totalQuestions}
        </span>

        {/* Question type badge */}
        <Badge
          variant="outline"
          className="bg-purple-50 text-purple-700 border-purple-300"
        >
          {question.type === "multiple-choice"
            ? "Single Answer"
            : "Multiple Answers"}
        </Badge>
      </div>

      {/* Scenario */}
      {question.scenario && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-1">Scenario:</p>
          <p className="text-sm text-blue-800">{question.scenario}</p>
        </div>
      )}

      {/* Question text */}
      <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
        <p className="text-lg font-semibold text-gray-900 leading-relaxed">
          {question.question}
        </p>

        {/* Multiple select warning */}
        {question.type === "multiple-select" && (
          <p className="mt-3 text-sm font-medium text-orange-600">
            ⚠️ Select ALL correct answers
          </p>
        )}
      </div>
    </div>
  );
}

// TODO: Add question ID display for reference
// TODO: Add difficulty indicator (if enabled)
