/**
 * Question Type Filter Component
 *
 * Allows filtering by multiple choice vs multiple select
 */

"use client";

import { Badge } from "@/components/ui/badge";
import { useSessionConfig } from "@/features/quiz/hooks/use-session-config";
import { QUESTION_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function QuestionTypeFilter() {
  const config = useSessionConfig();

  const types = [
    {
      id: QUESTION_TYPES.MULTIPLE_CHOICE,
      label: "Multiple Choice",
      description: "Single correct answer",
      icon: "🔘",
    },
    {
      id: QUESTION_TYPES.MULTIPLE_SELECT,
      label: "Multiple Select",
      description: "Multiple correct answers",
      icon: "☑️",
    },
  ];

  const isSelected = (type: string) => {
    return config.questionTypeFilter.includes(type as any);
  };

  const handleClearAll = () => {
    config.questionTypeFilter = [];
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Question Type Filter
          </h3>
          <p className="text-sm text-gray-600 mt-0.5">
            Optional: Practice specific question types
          </p>
        </div>
        {config.questionTypeFilter.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear filter
          </button>
        )}
      </div>

      <div className="flex gap-3 flex-wrap">
        {types.map((type) => (
          <Badge
            key={type.id}
            className={cn(
              "cursor-pointer px-4 py-2 text-sm border-2 transition-all",
              "bg-purple-100 text-purple-800 border-purple-300",
              isSelected(type.id)
                ? "ring-2 ring-offset-2 ring-purple-500"
                : "opacity-60 hover:opacity-100"
            )}
            onClick={() => config.toggleQuestionType(type.id as any)}
          >
            <span className="mr-2">{type.icon}</span>
            <div className="flex flex-col items-start">
              <span className="font-medium">{type.label}</span>
              <span className="text-xs opacity-80">{type.description}</span>
            </div>
            {isSelected(type.id) && <span className="ml-2 font-bold">✓</span>}
          </Badge>
        ))}
      </div>

      {config.questionTypeFilter.length === 0 && (
        <p className="text-xs text-gray-500 italic">
          Both types included (no filter)
        </p>
      )}
    </div>
  );
}

// TODO: Show question count per type
// TODO: Add statistics (accuracy by type)
