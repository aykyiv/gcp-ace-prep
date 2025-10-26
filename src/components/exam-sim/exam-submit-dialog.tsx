/**
 * Exam Submit Dialog
 *
 * Confirmation before submitting exam
 */

"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useExamStore } from "@/features/exam-sim/stores/exam-store";
import { Separator } from "@/components/ui/separator";

interface ExamSubmitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ExamSubmitDialog({
  isOpen,
  onClose,
  onConfirm,
}: ExamSubmitDialogProps) {
  const store = useExamStore();

  // Calculate statistics
  const totalQuestions = store.questions.length;
  const answeredCount = store.questions.filter((q) => q.answered).length;
  const unansweredCount = totalQuestions - answeredCount;
  const flaggedCount = store.questions.filter((q) => q.flagged).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Submit Exam?</DialogTitle>
          <DialogDescription>
            Are you sure you want to submit your exam? You cannot change answers
            after submission.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        {/* Statistics */}
        <div className="space-y-3 py-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Questions:</span>
            <span className="font-semibold text-gray-900">
              {totalQuestions}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Answered:</span>
            <span className="font-semibold text-green-600">
              {answeredCount}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Unanswered:</span>
            <span className="font-semibold text-red-600">
              {unansweredCount}
            </span>
          </div>
          {flaggedCount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Flagged for Review:</span>
              <span className="font-semibold text-yellow-600">
                {flaggedCount}
              </span>
            </div>
          )}
        </div>

        {/* Warning if unanswered */}
        {unansweredCount > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              ⚠️ You have {unansweredCount} unanswered question
              {unansweredCount !== 1 ? "s" : ""}. These will be marked as
              incorrect.
            </p>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Continue Exam
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Submit Exam
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// TODO: Add review unanswered button
// TODO: Add review flagged button
