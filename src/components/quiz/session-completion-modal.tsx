/**
 * Session Completion Modal
 *
 * Shows session results and provides next action options
 */

"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSessionSummary } from "@/features/quiz/hooks/use-session-summary";
import { useRouter } from "next/navigation";
import { cn, formatTime } from "@/lib/utils";
import { useQuizStore } from "@/features/quiz/stores/quiz-store";

interface SessionCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SessionCompletionModal({
  isOpen,
  onClose,
}: SessionCompletionModalProps) {
  const summary = useSessionSummary();
  const router = useRouter();
  const store = useQuizStore();

  if (!summary) return null;
  // Calculate pass/fail (70% threshold)

  const passed = summary.accuracyPercentage >= 70;

  const handleNewSession = () => {
    store.resetSession();
    onClose();
    router.push("/study");
  };

  const handleReviewIncorrect = () => {
    // TODO: Implement review incorrect questions feature
    onClose();
  };

  const handleViewProgress = () => {
    onClose();
    router.push("/progress");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {passed ? "🎉 Great Job!" : "📚 Keep Learning!"}
          </DialogTitle>
          <DialogDescription>
            {passed
              ? `You\\'re making excellent progress!`
              : "Review your mistakes and try again."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Overall score */}
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Overall Accuracy</p>
            <p
              className={cn(
                "text-5xl font-bold",
                passed ? "text-green-600" : "text-orange-600"
              )}
            >
              {summary.accuracyPercentage}%
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {passed ? "Pass (≥70% required)" : "Below passing threshold"}
            </p>
          </div>

          <Separator />

          {/* Statistics grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {summary.answeredQuestions}
              </p>
              <p className="text-xs text-gray-600 mt-1">Questions Answered</p>
            </div>

            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {summary.correctAnswers}
              </p>
              <p className="text-xs text-gray-600 mt-1">Correct Answers</p>
            </div>

            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">
                {summary.incorrectAnswers}
              </p>
              <p className="text-xs text-gray-600 mt-1">Incorrect Answers</p>
            </div>

            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-600">
                {summary.skippedQuestions}
              </p>
              <p className="text-xs text-gray-600 mt-1">Skipped</p>
            </div>
          </div>

          <Separator />

          {/* Time spent */}
          <div className="text-center">
            <p className="text-sm text-gray-600">Time Spent</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {formatTime(summary.timeSpentSeconds)}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-2">
          <Button onClick={handleNewSession} className="w-full" size="lg">
            Start New Session
          </Button>

          {summary.incorrectAnswers > 0 && (
            <Button
              onClick={handleReviewIncorrect}
              variant="outline"
              className="w-full"
            >
              Review Incorrect Questions ({summary.incorrectAnswers})
            </Button>
          )}

          <Button
            onClick={handleViewProgress}
            variant="outline"
            className="w-full"
          >
            View Progress Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// TODO: Add domain breakdown chart
// TODO: Add comparison to previous sessions
// TODO: Add social sharing options
// TODO: Add certificate generation for high scores
