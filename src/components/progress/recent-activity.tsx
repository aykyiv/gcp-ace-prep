/**
 * Recent Activity Component
 *
 * Simple list of recent study sessions
 */

"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProgressStats } from "@/features/progress/hooks/use-progress-stats";
import { formatDate, formatTime } from "@/lib/utils";

export function RecentActivity() {
  const stats = useProgressStats();
  const sessions = stats.recentSessions;

  if (sessions.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="text-5xl mb-3">📚</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          No Recent Activity
        </h3>
        <p className="text-sm text-gray-600">
          Start a study session to see your activity here
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Recent Sessions</h2>
        <p className="text-sm text-gray-600 mt-1">
          Your last 7 days of study activity
        </p>
      </div>

      <Card className="divide-y divide-gray-200">
        {sessions.map((session) => (
          <div key={session.sessionId} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(new Date(session.date))}
                </p>
                <p className="text-xs text-gray-500">
                  {formatTime(session.summary.timeSpentSeconds)}
                </p>
              </div>
              <Badge
                className={
                  session.summary.accuracyPercentage >= 70
                    ? "bg-green-100 text-green-800"
                    : "bg-orange-100 text-orange-800"
                }
              >
                {session.summary.accuracyPercentage}% correct
              </Badge>
            </div>

            {/* Session stats */}
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span>📝 {session.summary.answeredQuestions} questions</span>
              <span>✅ {session.summary.correctAnswers} correct</span>
              <span>❌ {session.summary.incorrectAnswers} incorrect</span>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// TODO: Add click to view session details
// TODO: Add filtering by date range
