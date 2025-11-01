/**
 * Stats Section
 *
 * Display app statistics (questions answered, users, etc.)
 * Uses real data from localStorage
 */

"use client";

import { storage } from "@/lib/storage";
import { useState, useEffect } from "react";

const initialStats = {
  questionsAnswered: 0,
  averageAccuracy: 0,
  totalSessions: 0,
  currentStreak: 0,
};

export function StatsSection() {
  // 1. Initialize state with server-safe values
  const [stats, setStats] = useState(initialStats);

  // 2. Use useEffect to run localStorage logic ONLY after the component mounts on the client
  useEffect(() => {
    // This function will ONLY run in the browser
    const loadStats = () => {
      const progress = storage.loadQuestionProgress();
      const sessions = storage.loadSessionHistory();
      const streak = storage.loadStudyStreak();

      const totalQuestionsAnswered = Object.values(progress).filter(
        (p) => p.totalAttempts > 0
      ).length;

      const totalCorrect = Object.values(progress).reduce(
        (sum, p) => sum + p.correctAttempts,
        0
      );
      const totalAttempts = Object.values(progress).reduce(
        (sum, p) => sum + p.totalAttempts,
        0
      );
      const averageAccuracy =
        totalAttempts > 0
          ? Math.round((totalCorrect / totalAttempts) * 100)
          : 0;

      const totalSessions = sessions.length;
      const currentStreak = streak.currentStreak;

      setStats({
        questionsAnswered: totalQuestionsAnswered,
        averageAccuracy,
        totalSessions,
        currentStreak,
      });
    };

    loadStats();

    // NOTE: Don't need to put 'storage' in the dependency array as it's a stable export.
    // If storage logic had dynamic dependencies, they'd go here.
  }, []); // Empty dependency array ensures it runs only once after mounting

  return (
    <section className="py-20 px-4 bg-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Your Learning Journey
          </h2>
          <p className="text-xl text-gray-600">
            Track your progress towards certification
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            {/* The suppressHydrationWarning is now less critical but can remain */}
            <p
              className="text-4xl font-bold text-blue-600 mb-2"
              suppressHydrationWarning
            >
              {stats.questionsAnswered}
            </p>
            <p className="text-gray-600">Questions Answered</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <p
              className="text-4xl font-bold text-green-600 mb-2"
              suppressHydrationWarning
            >
              {stats.averageAccuracy}%
            </p>
            <p className="text-gray-600">Average Accuracy</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <p
              className="text-4xl font-bold text-purple-600 mb-2"
              suppressHydrationWarning
            >
              {stats.totalSessions}
            </p>
            <p className="text-gray-600">Study Sessions</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <p
              className="text-4xl font-bold text-orange-600 mb-2"
              suppressHydrationWarning
            >
              {stats.currentStreak}
            </p>
            <p className="text-gray-600">Day Streak</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// TODO: Add animated counting effect
// TODO: Show comparison to target goals
