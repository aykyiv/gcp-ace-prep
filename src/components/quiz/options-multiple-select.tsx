/**
 * Multiple Select Options Component (Checkboxes)
 *
 * For multiple select questions with multiple correct answers
 */

"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { QuestionOption } from "@/features/quiz/types/question.types";
import type { AnswerValidationResult } from "@/features/quiz/types/answer.types";
import { cn } from "@/lib/utils";

interface OptionsMultipleSelectProps {
  options: QuestionOption[];
  selectedOptions: string[];
  onToggle: (optionId: string) => void;
  hasSubmitted: boolean;
  validationResult: AnswerValidationResult | null;
  disabled?: boolean;
}

export function OptionsMultipleSelect({
  options,
  selectedOptions,
  onToggle,
  hasSubmitted,
  validationResult,
  disabled = false,
}: OptionsMultipleSelectProps) {
  /**
   * Get the CSS class for an option based on its state
   */
  const getOptionClass = (optionId: string) => {
    const isSelected = selectedOptions.includes(optionId);
    const isCorrect = validationResult?.correctOptions.includes(optionId);
    const isIncorrect =
      validationResult?.incorrectSelections.includes(optionId);
    const isMissed = validationResult?.missedCorrectOptions.includes(optionId);

    if (!hasSubmitted) {
      return cn(
        "quiz-option quiz-option-unselected",
        isSelected && "quiz-option-selected"
      );
    }

    // After submission
    if (isCorrect && isSelected) {
      return "quiz-option quiz-option-correct animate-scale-check";
    }
    if (isIncorrect) {
      return "quiz-option quiz-option-incorrect animate-shake";
    }
    if (isMissed) {
      return "quiz-option quiz-option-partial"; // Missed correct answer
    }
    return "quiz-option quiz-option-unselected opacity-60";
  };

  /**
   * Get icon to display for each option state
   */
  const getOptionIcon = (optionId: string) => {
    if (!hasSubmitted) return null;

    const isCorrect = validationResult?.correctOptions.includes(optionId);
    const isSelected = selectedOptions.includes(optionId);
    const isIncorrect =
      validationResult?.incorrectSelections.includes(optionId);
    const isMissed = validationResult?.missedCorrectOptions.includes(optionId);

    if (isCorrect && isSelected) {
      return <span className="text-green-600 font-bold text-xl">✓</span>;
    }
    if (isIncorrect) {
      return <span className="text-red-600 font-bold text-xl">✗</span>;
    }
    if (isMissed) {
      return <span className="text-yellow-600 font-bold text-xl">→</span>;
    }
    return null;
  };

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <div
          key={option.id}
          className={getOptionClass(option.id)}
          onClick={() => !disabled && !hasSubmitted && onToggle(option.id)}
        >
          <Checkbox
            id={option.id}
            checked={selectedOptions.includes(option.id)}
            onCheckedChange={() => onToggle(option.id)}
            disabled={disabled || hasSubmitted}
            className="shrink-0"
          />
          <Label
            htmlFor={option.id}
            className="flex-1 cursor-pointer text-base leading-relaxed"
          >
            <span className="font-medium text-gray-700 mr-2">{option.id}.</span>
            {option.text}
          </Label>
          {getOptionIcon(option.id)}
        </div>
      ))}
    </div>
  );
}

// TODO: Add "select all" / "clear all" buttons
// TODO: Show count of selected vs required
