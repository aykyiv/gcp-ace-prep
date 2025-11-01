/**
 * Study Streak Display Component
 *
 * Simple streak counter with calendar-style visualization
 */

"use client";

import { Card } from "@/components/ui/card";
import { useProgressStats } from "@/features/progress/hooks/use-progress-stats";

export function StudyStreakDisplay() {
  const stats = useProgressStats();

  // Check if studied today
  const today = new Date().toISOString().split("T")[0];
  const studiedToday = stats.lastStudyDate === today;

  return (
    <Card className="p-6">
      <div className="text-center space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Study Streak
          </h2>
          <p className="text-sm text-gray-600">
            Keep it up! Consistency is key.
          </p>
        </div>

        {/* Current streak */}
        <div className="py-6">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-red-500 text-white">
            <div className="text-center">
              <p className="text-5xl font-bold">{stats.currentStreak}</p>
              <p className="text-sm">days</p>
            </div>
          </div>
        </div>

        {/* Streak info */}
        <div className="flex items-center justify-around pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600">Longest Streak</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.longestStreak}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Today</p>
            <p className="text-2xl">{studiedToday ? "✅" : "⏰"}</p>
          </div>
        </div>

        {/* Motivation message */}
        {!studiedToday && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              💪 Study today to maintain your streak!
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

// TODO: Add last 7 days mini calendar view
// TODO: Add streak milestones (7, 30, 100 days)
