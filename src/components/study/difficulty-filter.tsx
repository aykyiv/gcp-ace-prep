/**
 * Difficulty Filter Component
 *
 * Allows filtering questions by difficulty level
 */

"use client";

import { Badge } from "@/components/ui/badge";
import { useSessionConfig } from "@/features/quiz/hooks/use-session-config";
import { DIFFICULTY_LEVELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function DifficultyFilter() {
  const config = useSessionConfig();

  const difficulties = [
    {
      id: DIFFICULTY_LEVELS.EASY,
      label: "Easy",
      color: "bg-green-100 text-green-800 border-green-300",
      icon: "😊",
    },
    {
      id: DIFFICULTY_LEVELS.MEDIUM,
      label: "Medium",
      color: "bg-yellow-100 text-yellow-800 border-yellow-300",
      icon: "🤔",
    },
    {
      id: DIFFICULTY_LEVELS.HARD,
      label: "Hard",
      color: "bg-red-100 text-red-800 border-red-300",
      icon: "😰",
    },
  ];

  const isSelected = (difficulty: string) => {
    return config.difficultyFilter.includes(difficulty as any);
  };

  const handleClearAll = () => {
    config.setAllDifficulties([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Difficulty Filter
          </h3>
          <p className="text-sm text-gray-600 mt-0.5">
            Optional: Filter by difficulty level
          </p>
        </div>
        {config.difficultyFilter.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear filter
          </button>
        )}
      </div>

      <div className="flex gap-3 flex-wrap">
        {difficulties.map((difficulty) => (
          <Badge
            key={difficulty.id}
            className={cn(
              "cursor-pointer px-4 py-2 text-sm border-2 transition-all",
              difficulty.color,
              isSelected(difficulty.id)
                ? "ring-2 ring-offset-2 ring-blue-500"
                : "opacity-60 hover:opacity-100"
            )}
            onClick={() => config.toggleDifficulty(difficulty.id as any)}
          >
            <span className="mr-2">{difficulty.icon}</span>
            {difficulty.label}
            {isSelected(difficulty.id) && (
              <span className="ml-2 font-bold">✓</span>
            )}
          </Badge>
        ))}
      </div>

      {config.difficultyFilter.length === 0 && (
        <p className="text-xs text-gray-500 italic">
          All difficulties included (no filter)
        </p>
      )}
    </div>
  );
}

// TODO: Show available question count per difficulty
// TODO: Add recommended difficulty based on progress
