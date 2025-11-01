/**
 * Confidence Rating Component
 *
 * SuperMemo 2 difficulty rating buttons (Again/Hard/Good/Easy)
 * Only shown after answer explanation
 */

"use client";

import { Button } from "@/components/ui/button";
import { DIFFICULTY_RATINGS, DIFFICULTY_LABELS } from "@/lib/constants";
import type { DifficultyRating } from "@/features/quiz/types/supermemo.types";

interface ConfidenceRatingProps {
  onRate: (rating: DifficultyRating) => void;
  disabled?: boolean;
}

export function ConfidenceRating({
  onRate,
  disabled = false,
}: ConfidenceRatingProps) {
  const ratings = [
    {
      value: DIFFICULTY_RATINGS.AGAIN,
      label: DIFFICULTY_LABELS[DIFFICULTY_RATINGS.AGAIN],
      description: "I got it wrong",
      className: "rating-button rating-again",
      shortcut: "1",
    },
    {
      value: DIFFICULTY_RATINGS.HARD,
      label: DIFFICULTY_LABELS[DIFFICULTY_RATINGS.HARD],
      description: "I struggled",
      className: "rating-button rating-hard",
      shortcut: "2",
    },
    {
      value: DIFFICULTY_RATINGS.GOOD,
      label: DIFFICULTY_LABELS[DIFFICULTY_RATINGS.GOOD],
      description: "I got it right",
      className: "rating-button rating-good",
      shortcut: "3",
    },
    {
      value: DIFFICULTY_RATINGS.EASY,
      label: DIFFICULTY_LABELS[DIFFICULTY_RATINGS.EASY],
      description: "I knew it instantly",
      className: "rating-button rating-easy",
      shortcut: "4",
    },
  ];

  return (
    <div className="space-y-4 mt-6 p-6 bg-gray-50 border-2 border-gray-200 rounded-lg">
      <div className="space-y-1">
        <h3 className="font-semibold text-gray-900">How confident were you?</h3>
        <p className="text-sm text-gray-600">
          Rate your confidence to optimize review scheduling
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {ratings.map((rating) => (
          <Button
            key={rating.value}
            onClick={() => onRate(rating.value)}
            disabled={disabled}
            className={rating.className + " min-h-18"}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="font-semibold">{rating.label}</span>
              <span className="text-xs opacity-90">{rating.description}</span>
              <span className="text-xs opacity-75">
                Press {rating.shortcut}
              </span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}

// TODO: Add hover tooltips explaining SuperMemo 2 intervals
// TODO: Add visual preview of next review date
