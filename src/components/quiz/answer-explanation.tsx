/**
 * Answer Explanation Component
 *
 * Shows correct answer explanation and why wrong answers are incorrect
 * Only displayed after answer submission
 */

"use client";

import { Separator } from "@/components/ui/separator";
import type { QuizQuestion } from "@/features/quiz/types/question.types";
import type { AnswerValidationResult } from "@/features/quiz/types/answer.types";
import { cn } from "@/lib/utils";

interface AnswerExplanationProps {
  question: QuizQuestion;
  validationResult: AnswerValidationResult;
}

export function AnswerExplanation({
  question,
  validationResult,
}: AnswerExplanationProps) {
  const { isCorrect, isPartiallyCorrect, accuracyPercentage } =
    validationResult;

  return (
    <div className="space-y-4 mt-6">
      {/* Result banner */}
      <div
        className={cn(
          "p-4 rounded-lg border-2 font-semibold",
          isCorrect
            ? "bg-green-50 border-green-500 text-green-900"
            : isPartiallyCorrect
            ? "bg-yellow-50 border-yellow-500 text-yellow-900"
            : "bg-red-50 border-red-500 text-red-900"
        )}
      >
        {isCorrect ? (
          <span className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span>Correct! Well done.</span>
          </span>
        ) : isPartiallyCorrect ? (
          <span className="flex items-center gap-2">
            <span className="text-2xl">⚠</span>
            <span>Partially Correct ({accuracyPercentage}%)</span>
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <span className="text-2xl">✗</span>
            <span>Incorrect. Review the explanation below.</span>
          </span>
        )}
      </div>

      <Separator />

      {/* Correct answer explanation */}
      <div className="space-y-2">
        <h3 className="font-semibold text-green-900 text-lg">
          ✅ Correct Answer
        </h3>
        <p className="text-gray-800 leading-relaxed">
          {question.explanation.correct}
        </p>
      </div>

      {/* Incorrect options explanations */}
      {Object.keys(question.explanation.incorrect).length > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            <h3 className="font-semibold text-red-900 text-lg">
              ❌ Why Other Options Are Incorrect
            </h3>
            {Object.entries(question.explanation.incorrect).map(
              ([optionId, reason]) => (
                <div key={optionId} className="space-y-1">
                  <p className="font-medium text-gray-700">
                    Option {optionId}:
                  </p>
                  <p className="text-gray-600 leading-relaxed pl-4">{reason}</p>
                </div>
              )
            )}
          </div>
        </>
      )}

      {/* Key concept */}
      <Separator />
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <span>💡</span>
          Key Concept: {question.keyConceptName}
        </h3>
        <p className="text-blue-800 leading-relaxed">{question.keyConcept}</p>
      </div>

      {/* Official documentation link */}
      <div className="text-sm text-gray-600">
        <a
          href={question.officialDocsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
        >
          📖 Official GCP Documentation
          <span className="text-xs">↗</span>
        </a>
      </div>
    </div>
  );
}

// TODO: Add "Report Issue" button for incorrect explanations
// TODO: Add related questions section
