/**
 * Exam Question Navigator
 *
 * Grid showing all questions with status indicators
 */

"use client";

import { Button } from "@/components/ui/button";
import { useExamStore } from "@/features/exam-sim/stores/exam-store";
import { cn } from "@/lib/utils";

export function ExamQuestionNavigator() {
  const store = useExamStore();

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">
        Question Navigator
      </h3>

      {/* Question grid */}
      <div className="grid grid-cols-10 gap-1.5">
        {store.questions.map((question, index) => (
          <Button
            key={index}
            onClick={() => store.setCurrentQuestion(index)}
            size="sm"
            variant="outline"
            className={cn(
              "h-9 w-9 p-0 text-xs font-semibold",
              // Current question
              store.currentQuestionIndex === index && "ring-2 ring-blue-500",
              // Answered
              question.answered &&
                "bg-green-100 border-green-300 text-green-800",
              // Flagged
              question.flagged &&
                "bg-yellow-100 border-yellow-300 text-yellow-800",
              // Unanswered
              !question.answered &&
                !question.flagged &&
                "bg-gray-50 text-gray-500"
            )}
          >
            {index + 1}
          </Button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-600 pt-2 border-t">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-green-100 border border-green-300" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-300" />
          <span>Flagged</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-gray-50 border border-gray-300" />
          <span>Unanswered</span>
        </div>
      </div>
    </div>
  );
}

// TODO: Add keyboard navigation (arrow keys)
// TODO: Add jump to next unanswered
