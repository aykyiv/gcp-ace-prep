/**
 * Weak Areas List Component
 *
 * Simple list of questions that need more practice
 */

"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWeakAreas } from "@/features/progress/hooks/use-weak-areas";
import { useDomain } from "@/features/quiz/hooks/use-domains";
import { useRouter } from "next/navigation";

export function WeakAreasList() {
  const weakQuestions = useWeakAreas();
  const router = useRouter();

  if (weakQuestions.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="text-5xl mb-3">🎉</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          No Weak Areas!
        </h3>
        <p className="text-sm text-gray-600">
          You&apos;re doing great! All questions are at a good level.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Weak Areas</h2>
          <p className="text-sm text-gray-600 mt-1">
            Questions that need more practice
          </p>
        </div>
        <Badge variant="destructive" className="text-sm">
          {weakQuestions.length} questions
        </Badge>
      </div>

      <Card className="divide-y divide-gray-200">
        {weakQuestions.slice(0, 10).map((question) => (
          <WeakQuestionItem key={question.id} question={question} />
        ))}
      </Card>

      {weakQuestions.length > 10 && (
        <p className="text-sm text-gray-500 text-center">
          Showing 10 of {weakQuestions.length} weak areas
        </p>
      )}

      {/* Practice button */}
      <div className="text-center pt-4">
        <Button
          onClick={() => router.push("/study")}
          size="lg"
          variant="outline"
        >
          Practice Weak Areas
        </Button>
      </div>
    </div>
  );
}

/**
 * Individual weak question item
 */
function WeakQuestionItem({ question }: { question: any }) {
  const { data: domain } = useDomain(question.domain);

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {domain && (
              <Badge
                style={{
                  backgroundColor: domain.bgColor,
                  color: domain.color,
                  borderColor: domain.color,
                }}
                className="border text-xs"
              >
                {domain.icon} {domain.shortName}
              </Badge>
            )}
            <Badge
              className={
                question.difficulty === "hard"
                  ? "bg-red-100 text-red-800"
                  : question.difficulty === "medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }
            >
              {question.difficulty}
            </Badge>
          </div>
          <p className="text-sm text-gray-900 line-clamp-2">
            {question.question}
          </p>
        </div>
      </div>
    </div>
  );
}

// TODO: Add "Practice Now" button per question
// TODO: Add sorting options
// TODO: Add filtering by domain
