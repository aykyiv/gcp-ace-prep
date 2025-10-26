/**
 * Study Configuration Page
 *
 * Main page for configuring quiz sessions before starting
 */

"use client";

import { DomainSelector } from "@/components/study/domain-selector";
import { StudyModePicker } from "@/components/study/study-mode-picker";
import { SessionConfigForm } from "@/components/study/session-config-form";
import { DifficultyFilter } from "@/components/study/difficulty-filter";
import { QuestionTypeFilter } from "@/components/study/question-type-filter";
import { StudySummary } from "@/components/study/study-summary";
import { Separator } from "@/components/ui/separator";

export default function StudyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Configure Your Study Session
          </h1>
          <p className="text-gray-600 mt-2">
            Select domains, study mode, and preferences to start learning
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Configuration */}
          <div className="lg:col-span-2 space-y-8">
            {/* Domain selection */}
            <section>
              <DomainSelector />
            </section>

            <Separator />

            {/* Study mode */}
            <section>
              <StudyModePicker />
            </section>

            <Separator />

            {/* Session configuration */}
            <section>
              <SessionConfigForm />
            </section>

            <Separator />

            {/* Optional filters */}
            <section className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Optional Filters
              </h2>
              <DifficultyFilter />
              <QuestionTypeFilter />
            </section>
          </div>

          {/* Right column - Summary (sticky) */}
          <div className="lg:col-span-1 ">
            <StudySummary />
          </div>
        </div>
      </div>
    </div>
  );
}

// TODO: Add "Quick Start" presets (e.g., "Daily Review")
// TODO: Add recent configurations history
// TODO: Add domain recommendations based on weak areas
