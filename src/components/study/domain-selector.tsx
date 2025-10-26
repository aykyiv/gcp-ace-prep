/**
 * Domain Selector Component
 *
 * Interactive grid of domain cards for selection
 * Shows domain info, question count, and selection state
 */

"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDomains } from "@/features/quiz/hooks/use-domains";
import { useSessionConfig } from "@/features/quiz/hooks/use-session-config";
import { cn } from "@/lib/utils";

export function DomainSelector() {
  const { data: domains, isLoading } = useDomains();
  const config = useSessionConfig();

  if (isLoading) {
    return <div className="text-center py-8">Loading domains...</div>;
  }

  if (!domains || domains.length === 0) {
    return <div className="text-center py-8">No domains available</div>;
  }

  // Helper: Check if domain is selected
  const isSelected = (domainId: string) => {
    return config.selectedDomains.includes(domainId as any);
  };

  // Helper: Select/deselect all domains
  const handleSelectAll = () => {
    if (config.selectedDomains.length === domains.length) {
      config.clearDomains();
    } else {
      config.setAllDomains(domains.map((d) => d.id));
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with select all button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Select Study Domains
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Choose one or more GCP domains to practice
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleSelectAll}
          className="shrink-0"
        >
          {config.selectedDomains.length === domains.length
            ? "Deselect All"
            : "Select All"}
        </Button>
      </div>

      {/* Domain grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {domains.map((domain) => (
          <Card
            key={domain.id}
            className={cn(
              "p-5 cursor-pointer transition-all duration-200 hover:shadow-lg",
              isSelected(domain.id)
                ? "ring-2 shadow-md"
                : "hover:border-gray-400"
            )}
            style={{
              borderColor: isSelected(domain.id) ? domain.color : undefined,
            }}
            onClick={() => config.toggleDomain(domain.id)}
          >
            {/* Header with icon and title */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{domain.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 leading-tight">
                    {domain.shortName}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {domain.examPercentage}% of exam
                  </p>
                </div>
              </div>

              {/* Selection indicator */}
              {isSelected(domain.id) && (
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: domain.color }}
                >
                  ✓
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {domain.description}
            </p>

            {/* Metadata badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {domain.totalQuestions} questions
              </Badge>
              <Badge variant="outline" className="text-xs">
                ~{domain.estimatedStudyHours}h study
              </Badge>
            </div>

            {/* Key topics preview */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Key topics:</p>
              <div className="flex flex-wrap gap-1">
                {domain.keyTopics.slice(0, 3).map((topic, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: domain.bgColor,
                      color: domain.color,
                    }}
                  >
                    {topic}
                  </span>
                ))}
                {domain.keyTopics.length > 3 && (
                  <span className="text-xs text-gray-400">
                    +{domain.keyTopics.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Selected count */}
      {config.selectedDomains.length > 0 && (
        <div className="text-center">
          <Badge variant="secondary" className="text-sm px-4 py-2">
            {config.selectedDomains.length} domain
            {config.selectedDomains.length !== 1 ? "s" : ""} selected
          </Badge>
        </div>
      )}
    </div>
  );
}

// TODO: Add domain progress indicators (mastery %)
// TODO: Add "Recommended" badge for weak domains
// TODO: Add search/filter for domains
