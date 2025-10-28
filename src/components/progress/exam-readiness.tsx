/**
 * Exam Readiness Component
 *
 * VERY BASIC readiness indicator
 * Just shows if you're ready based on simple criteria
 */

"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProgressStats } from "@/features/progress/hooks/use-progress-stats";
import { useWeakAreas } from "@/features/progress/hooks/use-weak-areas";
import { useRouter } from "next/navigation";

export function ExamReadiness() {
  const stats = useProgressStats();
  const weakAreas = useWeakAreas();
  const router = useRouter();

  // Simple readiness criteria
  const criteria = {
    questionsAnswered: {
      met: stats.questionsAnswered >= 150, // At least 150 questions attempted
      label: "Answer 150+ questions",
      current: stats.questionsAnswered,
      target: 150,
    },
    accuracy: {
      met: stats.overallAccuracy >= 75, // 75%+ accuracy
      label: "Maintain 75%+ accuracy",
      current: stats.overallAccuracy,
      target: 75,
    },
    streak: {
      met: stats.currentStreak >= 7, // 7+ day streak
      label: "Study for 7+ days",
      current: stats.currentStreak,
      target: 7,
    },
    weakAreas: {
      met: weakAreas.length < 10, // Less than 10 weak questions
      label: "Reduce weak areas",
      current: weakAreas.length,
      target: 10,
    },
  };

  // Count met criteria
  const metCount = Object.values(criteria).filter((c) => c.met).length;
  const totalCount = Object.values(criteria).length;
  const readinessPercentage = Math.round((metCount / totalCount) * 100);

  // Determine readiness level
  const isReady = readinessPercentage >= 75;

  return (
    <Card className="p-6">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Exam Readiness</h2>

        {/* Readiness circle */}
        <div className="py-6">
          <div
            className={`inline-flex items-center justify-center w-40 h-40 rounded-full ${
              isReady
                ? "bg-gradient-to-br from-green-400 to-green-600"
                : "bg-gradient-to-br from-yellow-400 to-orange-500"
            } text-white`}
          >
            <div className="text-center">
              <p className="text-5xl font-bold">{readinessPercentage}%</p>
              <p className="text-sm mt-1">
                {isReady ? "Ready!" : "Keep Going"}
              </p>
            </div>
          </div>
        </div>

        {/* Criteria checklist */}
        <div className="space-y-3 text-left">
          {Object.entries(criteria).map(([key, criterion]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{criterion.met ? "✅" : "⏳"}</span>
                <span className="text-sm font-medium text-gray-900">
                  {criterion.label}
                </span>
              </div>
              <span className="text-sm text-gray-600">
                {criterion.current}/{criterion.target}
              </span>
            </div>
          ))}
        </div>

        {/* Action button */}
        {isReady ? (
          <div className="pt-4">
            <p className="text-sm text-green-700 mb-3">
              🎉 You&apos;re ready to take the exam! Keep reviewing to maintain
              your skills.
            </p>
            <Button
              onClick={() => router.push("/study")}
              className="w-full"
              size="lg"
            >
              Continue Studying
            </Button>
          </div>
        ) : (
          <div className="pt-4">
            <p className="text-sm text-gray-600 mb-3">
              Keep studying to improve your readiness score!
            </p>
            <Button
              onClick={() => router.push("/study")}
              className="w-full"
              size="lg"
            >
              Start Studying
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

// TODO: Add personalized study recommendations
// TODO: Add estimated exam date calculator
