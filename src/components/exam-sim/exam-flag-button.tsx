/**
 * Exam Flag Button
 *
 * Mark question for later review
 */

"use client";

import { Button } from "@/components/ui/button";
import { useExamStore } from "@/features/exam-sim/stores/exam-store";

export function ExamFlagButton() {
  const store = useExamStore();
  const currentQuestion = store.questions[store.currentQuestionIndex];
  const isFlagged = currentQuestion?.flagged || false;

  const handleToggleFlag = () => {
    store.toggleFlag(store.currentQuestionIndex);
  };

  return (
    <Button
      onClick={handleToggleFlag}
      variant={isFlagged ? "default" : "outline"}
      size="sm"
      className={isFlagged ? "bg-yellow-500 hover:bg-yellow-600" : ""}
    >
      <span className="mr-2">{isFlagged ? "🚩" : "⚑"}</span>
      {isFlagged ? "Flagged for Review" : "Flag for Review"}
    </Button>
  );
}

// TODO: Add keyboard shortcut (F key)
