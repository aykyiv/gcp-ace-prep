/**
 * Navigation Buttons Component
 *
 * Skip and Next buttons for quiz navigation
 */

"use client";

import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  onSkip: () => void;
  onNext: () => void;
  showSkip: boolean; // Show skip before submission
  showNext: boolean; // Show next after confidence rating
  isLastQuestion: boolean;
}

export function NavigationButtons({
  onSkip,
  onNext,
  showSkip,
  showNext,
  isLastQuestion,
}: NavigationButtonsProps) {
  return (
    <div className="flex items-center gap-3">
      {showSkip && (
        <Button onClick={onSkip} variant="outline" size="lg" className="px-6">
          Skip Question
        </Button>
      )}

      {showNext && (
        <Button
          onClick={onNext}
          size="lg"
          className="px-8 bg-green-600 hover:bg-green-700"
        >
          {isLastQuestion ? "Finish Session" : "Next Question"}
        </Button>
      )}
    </div>
  );
}

// TODO: Add session completion modal when clicking "Finish Session"
// TODO: Add undo skip functionality
