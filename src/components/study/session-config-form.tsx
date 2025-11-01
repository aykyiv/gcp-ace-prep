/**
 * Session Configuration Form
 *
 * Allows user to set questions per session and other preferences
 */

"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSessionConfig } from "@/features/quiz/hooks/use-session-config";
import { SESSION_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SessionConfigForm() {
  const config = useSessionConfig();

  return (
    <div className="space-y-6">
      {/* Questions per session */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Questions Per Session
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            How many questions do you want to practice?
          </p>
        </div>

        <RadioGroup
          value={config.questionsPerSession.toString()}
          onValueChange={(value) =>
            config.setQuestionsPerSession(parseInt(value))
          }
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SESSION_CONFIG.QUESTIONS_PER_SESSION_OPTIONS.map((count) => (
              <div
                key={count}
                className={cn(
                  "relative flex items-center space-x-2 p-4 border-2 rounded-lg cursor-pointer transition-all",
                  config.questionsPerSession === count
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-400"
                )}
                onClick={() => config.setQuestionsPerSession(count)}
              >
                <RadioGroupItem
                  value={count.toString()}
                  id={`count-${count}`}
                />
                <Label
                  htmlFor={`count-${count}`}
                  className="flex-1 cursor-pointer font-medium text-center"
                >
                  {count} questions
                  <span className="block text-xs text-gray-500 mt-1">
                    ~{Math.round(count * 1.5)} min
                  </span>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

// TODO: Add custom question count input
// TODO: Show estimated completion time more accurately
// TODO: Add session duration limit option
