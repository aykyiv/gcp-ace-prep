/**
 * Exam Answer Selector
 *
 * Options WITHOUT validation feedback (no colors/icons until submission)
 */

"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { QuestionOption } from "@/features/quiz/types/question.types";
import { cn } from "@/lib/utils";

interface ExamAnswerSelectorProps {
  options: QuestionOption[];
  selectedOptions: string[];
  isMultipleSelect: boolean;
  onSelect: (optionId: string) => void;
}

export function ExamAnswerSelector({
  options,
  selectedOptions,
  isMultipleSelect,
  onSelect,
}: ExamAnswerSelectorProps) {
  if (isMultipleSelect) {
    return (
      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = selectedOptions.includes(option.id);

          return (
            <div
              key={option.id}
              className={cn(
                "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-400 bg-white"
              )}
              onClick={() => onSelect(option.id)}
            >
              <Checkbox
                id={option.id}
                checked={isSelected}
                onCheckedChange={() => onSelect(option.id)}
              />
              <Label
                htmlFor={option.id}
                className="flex-1 cursor-pointer text-base leading-relaxed"
              >
                <span className="font-medium text-gray-700 mr-2">
                  {option.id}.
                </span>
                {option.text}
              </Label>
            </div>
          );
        })}
      </div>
    );
  }

  // Single choice (radio buttons)
  return (
    <RadioGroup value={selectedOptions[0] || ""} onValueChange={onSelect}>
      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = selectedOptions.includes(option.id);

          return (
            <div
              key={option.id}
              className={cn(
                "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-400 bg-white"
              )}
              onClick={() => onSelect(option.id)}
            >
              <RadioGroupItem value={option.id} id={option.id} />
              <Label
                htmlFor={option.id}
                className="flex-1 cursor-pointer text-base leading-relaxed"
              >
                <span className="font-medium text-gray-700 mr-2">
                  {option.id}.
                </span>
                {option.text}
              </Label>
            </div>
          );
        })}
      </div>
    </RadioGroup>
  );
}

// TODO: Add keyboard shortcuts (A-E keys)
// TODO: Add visual transition on selection
