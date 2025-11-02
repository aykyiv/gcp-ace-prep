/**
 * Study Summary Component
 *
 * Preview of session configuration before starting
 */

"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSessionConfig } from "@/features/quiz/hooks/use-session-config";
import { useDomains } from "@/features/quiz/hooks/use-domains";
import { useRouter } from "next/navigation";
import { STUDY_MODES } from "@/lib/constants";
import { useMultipleDomainQuestions } from "@/features/quiz/hooks/use-questions";
import {
  filterByDifficulty,
  filterByType,
} from "@/features/quiz/services/question-scheduler";
import { useMemo } from "react";

export function StudySummary() {
  const config = useSessionConfig();
  const { data: allDomains } = useDomains();
  const router = useRouter();

  const selectedDomainDetails = allDomains?.filter((d) =>
    config.selectedDomains.includes(d.id)
  );

  const { data: allQuestions, isLoading: isQuestionsLoading } =
    useMultipleDomainQuestions(config.selectedDomains);

  const filteredQuestionCount = useMemo(() => {
    if (!allQuestions || allQuestions.length === 0) {
      return 0;
    }

    const filteredByDifficulty = filterByDifficulty(
      allQuestions,
      config.difficultyFilter
    );

    const filteredByType = filterByType(
      filteredByDifficulty,
      config.questionTypeFilter
    );

    // This is the true count of questions available for the session
    return filteredByType.length;
  }, [allQuestions, config.difficultyFilter, config.questionTypeFilter]);

  const isValid =
    config.selectedDomains.length > 0 && filteredQuestionCount > 0;

  const getStudyModeLabel = () => {
    switch (config.studyMode) {
      case STUDY_MODES.NEW_QUESTIONS:
        return "New Questions";
      case STUDY_MODES.REVIEW_DUE:
        return "Review Due";
      case STUDY_MODES.MIXED:
        return "Mixed (New + Review)";
      case STUDY_MODES.WEAK_AREAS:
        return "Weak Areas";
      default:
        return "Unknown";
    }
  };

  const handleStartSession = () => {
    if (!isValid) return;
    // Navigate to quiz page with config
    router.push("/quiz");
  };

  return (
    <Card className="p-6 sticky top-24">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Session Summary
      </h3>

      <div className="space-y-4">
        {/* Selected domains */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Selected Domains ({config.selectedDomains.length})
          </p>
          {config.selectedDomains.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No domains selected</p>
          ) : (
            <div className="space-y-1">
              {selectedDomainDetails?.map((domain) => (
                <div
                  key={domain.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <span>{domain.icon}</span>
                  <span className="text-gray-900">{domain.shortName}</span>
                  <span className="text-gray-500">
                    ({domain.totalQuestions} total in domain)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Study mode */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Study Mode</p>
          <p className="text-sm text-gray-900">{getStudyModeLabel()}</p>
        </div>

        <Separator />

        {/* Questions per session */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">
            Questions Per Session
          </p>
          <p className="text-sm text-gray-900">
            {config.questionsPerSession} questions
          </p>
          <p className="text-xs text-gray-500 mt-1">
            ~{Math.round(config.questionsPerSession * 1.5)} minutes
          </p>
        </div>

        {/* Filters (if any) */}
        {(config.difficultyFilter.length > 0 ||
          config.questionTypeFilter.length > 0) && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Active Filters
              </p>
              {config.difficultyFilter.length > 0 && (
                <p className="text-sm text-gray-600">
                  Difficulty: {config.difficultyFilter.join(", ")}
                </p>
              )}
              {config.questionTypeFilter.length > 0 && (
                <p className="text-sm text-gray-600">
                  Type:{" "}
                  {config.questionTypeFilter
                    .map((t) => (t === "multiple-choice" ? "MC" : "MS"))
                    .join(", ")}
                </p>
              )}
            </div>
          </>
        )}

        <Separator />

        {/* Total available questions (NOW FILTERED) */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-1">
            Available Questions (Filtered)
          </p>
          <p className="text-2xl font-bold text-blue-700">
            {isQuestionsLoading ? "Loading..." : filteredQuestionCount}
          </p>
          {!isQuestionsLoading &&
            filteredQuestionCount < config.questionsPerSession && (
              <p className="text-xs text-red-500 mt-1">
                Warning: Available questions ({filteredQuestionCount}) is less
                than your session size.
              </p>
            )}
        </div>

        {/* Start button */}
        <Button
          onClick={handleStartSession}
          disabled={!isValid || isQuestionsLoading}
          size="lg"
          className="w-full"
        >
          {isQuestionsLoading
            ? "Loading Questions..."
            : filteredQuestionCount === 0
            ? "No Questions Match Filters"
            : !isValid
            ? "Select at least one domain"
            : "Start Quiz Session"}
        </Button>

        {/* Reset button */}
        {config.selectedDomains.length > 0 && (
          <Button
            onClick={() => {
              config.clearDomains();
              config.clearFilters();
            }}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Reset Configuration
          </Button>
        )}
      </div>
    </Card>
  );
}

// TODO: Add estimated completion time based on average
// TODO: Show preview of first few questions
// TODO: Add save configuration preset option
