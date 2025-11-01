/**
 * Question Progress Bar
 *
 * Shows session progress at the top of the quiz
 */

"use client";

import { Progress } from "@/components/ui/progress";

interface QuestionProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
}

export function QuestionProgress({
  currentQuestion,
  totalQuestions,
  answeredCount,
  correctCount,
}: QuestionProgressProps) {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;
  const accuracyPercentage =
    answeredCount > 0 ? (correctCount / answeredCount) * 100 : 0;

  return (
    <div className="space-y-3 pb-6 border-b border-gray-200">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">
            Progress: {currentQuestion} / {totalQuestions}
          </span>
          <span className="text-gray-500">
            {Math.round(progressPercentage)}% complete
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Statistics */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Answered:</span>
          <span className="font-semibold text-gray-900">{answeredCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Correct:</span>
          <span className="font-semibold text-green-600">{correctCount}</span>
        </div>
        {answeredCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Accuracy:</span>
            <span className="font-semibold text-blue-600">
              {Math.round(accuracyPercentage)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// TODO: Add estimated time remaining
// TODO: Add domain breakdown of progress
