/**
 * Question Metadata Component
 *
 * Displays domain badge, difficulty indicator, and question type
 */

"use client";

import { Badge } from "@/components/ui/badge";
import { useDomain } from "@/features/quiz/hooks/use-domains";
import type { QuizQuestion } from "@/features/quiz/types/question.types";

interface QuestionMetadataProps {
  question: QuizQuestion;
}

export function QuestionMetadata({ question }: QuestionMetadataProps) {
  const { data: domain } = useDomain(question.domain);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Domain Badge */}
      {domain && (
        <Badge
          style={{
            backgroundColor: domain.bgColor,
            color: domain.color,
            borderColor: domain.color,
          }}
          className="border font-medium"
        >
          <span className="mr-1">{domain.icon}</span>
          {domain.shortName}
        </Badge>
      )}

      {/* Difficulty Badge */}
      <Badge
        className={
          question.difficulty === "easy"
            ? "bg-green-100 text-green-800 border-green-300"
            : question.difficulty === "medium"
            ? "bg-yellow-100 text-yellow-800 border-yellow-300"
            : "bg-red-100 text-red-800 border-red-300"
        }
      >
        {question.difficulty.charAt(0).toUpperCase() +
          question.difficulty.slice(1)}
      </Badge>

      {/* Question Type Badge */}
      <Badge variant="outline" className="bg-gray-50">
        {question.type === "multiple-choice"
          ? "Single Answer"
          : "Multiple Answers"}
      </Badge>
    </div>
  );
}

// TODO: Add hover tooltips with more information
// TODO: Add question ID display for debugging
