/**
 * Progress Dashboard Page
 *
 * BASIC progress tracking dashboard
 * Simple layout with key metrics
 */

"use client";

import { DomainMasteryGrid } from "@/components/progress/domain-mastery-grid";
import { StudyStreakDisplay } from "@/components/progress/study-streak-display";
import { WeakAreasList } from "@/components/progress/weak-areas-list";
import { RecentActivity } from "@/components/progress/recent-activity";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { ExamReadiness } from "@/components/progress/exam-readiness";
import dynamic from "next/dynamic";

const OverallStatsDynamic = dynamic(
  () =>
    import("@/components/progress/overall-stats").then(
      (mod) => mod.OverallStats
    ),
  { ssr: false } // Crucial flag: disables server-side rendering
);

export default function ProgressPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Progress</h1>
            <p className="text-gray-600 mt-2">
              Track your GCP ACE exam preparation journey
            </p>
          </div>
          <Button onClick={() => router.push("/study")} size="lg">
            Start Studying
          </Button>
        </div>

        {/* Overall statistics */}
        <section>
          <OverallStatsDynamic />
        </section>

        <Separator />

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Domain mastery */}
            <section>
              <DomainMasteryGrid />
            </section>

            <Separator />

            {/* Weak areas */}
            <section>
              <WeakAreasList />
            </section>

            <Separator />

            {/* Recent activity */}
            <section>
              <RecentActivity />
            </section>
          </div>

          {/* Right column - Sidebar */}
          <div className="space-y-8">
            {/* Study streak */}
            <section>
              <StudyStreakDisplay />
            </section>
            <section>
              <ExamReadiness />
            </section>

            {/* Quick actions card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
              <h3 className="font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <Button
                onClick={() => router.push("/study")}
                className="w-full"
                variant="outline"
              >
                📚 New Study Session
              </Button>
              <Button
                onClick={() => router.push("/quiz")}
                className="w-full"
                variant="outline"
              >
                💪 Practice Weak Areas
              </Button>
            </div>

            {/* Study tips */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="font-semibold text-blue-900 mb-3">
                💡 Study Tips
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Study 20-30 questions daily</li>
                <li>• Focus on weak domains</li>
                <li>• Maintain your streak</li>
                <li>• Review incorrect answers</li>
                <li>• Aim for 80%+ mastery</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// TODO: Add comparison with previous week
// TODO: Add goal setting feature
