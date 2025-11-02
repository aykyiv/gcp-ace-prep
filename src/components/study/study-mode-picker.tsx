/**
 * Study Mode Picker Component
 *
 * Allows user to choose between different study modes:
 * - New questions only
 * - Review due questions
 * - Mixed (new + review)
 * - Weak areas only
 */

"use client";

import { Card } from "@/components/ui/card";
import { useSessionConfig } from "@/features/quiz/hooks/use-session-config";
import { STUDY_MODES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function StudyModePicker() {
  const config = useSessionConfig();

  const modes = [
    {
      id: STUDY_MODES.NEW_QUESTIONS,
      title: "New Questions",
      description: `Learn new material you haven\'t seen before`,
      icon: "📚",
      recommended: false,
    },
    {
      id: STUDY_MODES.REVIEW_DUE,
      title: "Review Due",
      description: "Review questions scheduled for today",
      icon: "🔄",
      recommended: true,
    },
    {
      id: STUDY_MODES.MIXED,
      title: "Mixed",
      description: "Balanced mix of new and review (20/80 split)",
      icon: "🎯",
      recommended: false,
    },
    {
      id: STUDY_MODES.WEAK_AREAS,
      title: "Weak Areas",
      description: `Focus on questions you\'ve struggled with`,
      icon: "💪",
      recommended: false,
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Study Mode</h2>
        <p className="text-sm text-gray-600 mt-1">
          Choose how you want to study
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modes.map((mode) => (
          <Card
            key={mode.id}
            className={cn(
              "p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
              config.studyMode === mode.id
                ? "ring-2 ring-blue-500 border-blue-500 shadow-md"
                : "hover:border-gray-400"
            )}
            onClick={() => config.setStudyMode(mode.id)}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{mode.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{mode.title}</h3>
                  {mode.recommended && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      Recommended
                    </span>
                  )}
                  {config.studyMode === mode.id && (
                    <span className="text-blue-600 font-bold">✓</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{mode.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// TODO: Show estimated question counts for each mode
// TODO: Add tooltips explaining SuperMemo 2 scheduling
// TODO: Disable modes with 0 available questions
