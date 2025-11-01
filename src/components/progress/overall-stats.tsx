/**
 * Overall Statistics Component
 *
 * Simple cards showing key metrics
 */

"use client";

import { Card } from "@/components/ui/card";
import { useProgressStats } from "@/features/progress/hooks/use-progress-stats";
import { formatTime } from "@/lib/utils";

export function OverallStats() {
  const stats = useProgressStats();

  const statCards = [
    {
      label: "Questions Answered",
      value: stats.questionsAnswered,
      subtext: `out of ${stats.totalQuestions} total`,
      icon: "📝",
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Overall Accuracy",
      value: `${stats.overallAccuracy}%`,
      subtext:
        stats.overallAccuracy >= 70
          ? "Above passing threshold"
          : "Keep practicing!",
      icon: "🎯",
      color:
        stats.overallAccuracy >= 70
          ? "bg-green-50 text-green-600"
          : "bg-orange-50 text-orange-600",
    },
    {
      label: "Study Streak",
      value: `${stats.currentStreak} days`,
      subtext: `Longest: ${stats.longestStreak} days`,
      icon: "🔥",
      color: "bg-red-50 text-red-600",
    },
    {
      label: "Total Study Time",
      value: formatTime(stats.totalStudyTime),
      subtext: "Across all sessions",
      icon: "⏱️",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className={`text-3xl p-2 rounded-lg ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            {stat.label}
          </h3>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
          <p className="text-xs text-gray-500">{stat.subtext}</p>
        </Card>
      ))}
    </div>
  );
}

// TODO: Add clickable cards that navigate to details
// TODO: Add comparison arrows (up/down from last week)
