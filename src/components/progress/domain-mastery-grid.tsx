/**
 * Domain Mastery Grid Component
 *
 * Simple grid showing mastery % per domain
 */

"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useDomains } from "@/features/quiz/hooks/use-domains";
import { useDomainQuestions } from "@/features/quiz/hooks/use-questions";
import { calculateDomainMastery } from "@/features/progress/services/progress-service";
import { useState } from "react";

export function DomainMasteryGrid() {
  const { data: domains } = useDomains();
  const [showMasteryCriteria, setShowMasteryCriteria] = useState(false);

  if (!domains) {
    return <div className="text-center py-8">Loading domains...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Domain Mastery</h2>
        <p className="text-sm text-gray-600 mt-1">
          Your progress in each GCP domain
        </p>
        {/* simple collapsible */}
        <button
          className="text-xs text-gray-500 mt-1"
          onClick={() => {
            setShowMasteryCriteria(!showMasteryCriteria);
          }}
        >
          {showMasteryCriteria ? "Hide" : "Show"} Mastery Criteria{" "}
          <span> {showMasteryCriteria ? "↑" : "↓"}</span>
        </button>

        <p
          className="text-xs text-gray-500 mt-1 "
          style={{
            display: showMasteryCriteria ? "block" : "none",
          }}
        >
          Mastery is defined as having an interval of at least 21 days, an ease
          factor of at least 2.5, and at least 3 correct answers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {domains.map((domain) => (
          <DomainMasteryCard key={domain.id} domain={domain} />
        ))}
      </div>
    </div>
  );
}

/**
 * Individual domain mastery card
 */
function DomainMasteryCard({ domain }: { domain: any }) {
  const { data: questions } = useDomainQuestions(domain.id);

  const mastery = questions
    ? calculateDomainMastery(questions.map((q) => q.id))
    : 0;

  // Determine color based on mastery level
  const getMasteryColor = () => {
    if (mastery >= 80) return "text-green-600";
    if (mastery >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="p-5">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{domain.icon}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">
            {domain.shortName}
          </h3>
          <p className="text-xs text-gray-500">
            {domain.examPercentage}% of exam
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Mastery</span>
          <span className={`text-2xl font-bold ${getMasteryColor()}`}>
            {mastery}%
          </span>
        </div>
        <Progress value={mastery} className="h-2" />
        <p className="text-xs text-gray-500">
          {questions?.length || 0} total questions
        </p>
      </div>
    </Card>
  );
}

// TODO: Add click to filter weak questions by domain
// TODO: Add estimated time to mastery
