/**
 * Exam Results Summary
 *
 * Detailed results breakdown by domain
 */

"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useExamStore } from "@/features/exam-sim/stores/exam-store";
import { calculateDomainResults } from "@/features/exam-sim/services/exam-grading";
import { useRouter } from "next/navigation";
import { cn, formatTime } from "@/lib/utils";

export function ExamResultsSummary() {
  const store = useExamStore();
  const router = useRouter();

  if (!store.isSubmitted) return null;

  // Calculate domain breakdown
  const domainResults = calculateDomainResults(
    store.questions.map((q) => ({
      question: q.question,
      selectedOptions: q.selectedOptions,
    }))
  );

  // Calculate time taken
  const timeTaken =
    store.startTime && store.endTime
      ? Math.floor((store.endTime.getTime() - store.startTime.getTime()) / 1000)
      : 0;

  const passed = (store.score || 0) >= 70;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Overall score card */}
        <Card className="p-8">
          <div className="text-center space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Exam Completed!
              </h1>
              <p className="text-gray-600">
                {passed
                  ? "Congratulations! You passed the exam."
                  : `Keep studying! You\\'ll pass next time.`}
              </p>
            </div>

            {/* Score circle */}
            <div className="py-6">
              <div
                className={cn(
                  "inline-flex items-center justify-center w-40 h-40 rounded-full",
                  passed
                    ? "bg-gradient-to-br from-green-400 to-green-600"
                    : "bg-gradient-to-br from-orange-400 to-red-500",
                  "text-white"
                )}
              >
                <div className="text-center">
                  <p className="text-5xl font-bold">{store.score}%</p>
                  <p className="text-sm mt-1">{passed ? "PASS" : "FAIL"}</p>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {store.correctAnswers}
                </p>
                <p className="text-xs text-gray-600 mt-1">Correct</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">
                  {store.incorrectAnswers}
                </p>
                <p className="text-xs text-gray-600 mt-1">Incorrect</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-600">
                  {store.unansweredQuestions}
                </p>
                <p className="text-xs text-gray-600 mt-1">Skipped</p>
              </div>
            </div>

            {/* Time taken */}
            <div className="text-sm text-gray-600">
              Time taken: {formatTime(timeTaken)} / 2 hours
            </div>
          </div>
        </Card>

        <Separator />

        {/* Domain breakdown */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Results by Domain
          </h2>

          <div className="space-y-4">
            {domainResults.map((domain) => (
              <div key={domain.domain}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">
                      {domain.domainName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {domain.correctAnswers}/{domain.totalQuestions} correct
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-lg font-bold",
                      domain.accuracyPercentage >= 70
                        ? "text-green-600"
                        : "text-red-600"
                    )}
                  >
                    {domain.accuracyPercentage}%
                  </span>
                </div>
                <Progress value={domain.accuracyPercentage} className="h-2" />
              </div>
            ))}
          </div>
        </Card>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => store.resetExam()}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            Take Another Exam
          </Button>
          <Button
            onClick={() => router.push("/progress")}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            View Progress
          </Button>
          <Button
            onClick={() => router.push("/study")}
            className="flex-1"
            size="lg"
          >
            Study More
          </Button>
        </div>
      </div>
    </div>
  );
}

// TODO: Add review incorrect answers mode
// TODO: Add export results as PDF
// TODO: Add detailed question-by-question breakdown
