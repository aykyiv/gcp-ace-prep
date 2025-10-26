/**
 * Quiz Page (Updated)
 *
 * Now uses session configuration from study page
 */

"use client";

import { useState, useEffect, useMemo } from "react"; // ✅ useMemo added
import { useRouter } from "next/navigation";
import { QuizContainer } from "@/components/quiz/quiz-container";
import { SessionCompletionModal } from "@/components/quiz/session-completion-modal";
import { useQuizSession } from "@/features/quiz/hooks/use-quiz-session";
import { useSessionConfig } from "@/features/quiz/hooks/use-session-config";
import { useQuizStore } from "@/features/quiz/stores/quiz-store";

export default function QuizPage() {
  const router = useRouter();
  const config = useSessionConfig();
  const store = useQuizStore();
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Get session config - MEMOIZED to ensure a stable object reference
  const sessionConfig = useMemo(() => {
    return config.getConfig();
  }, [config]);

  // Validate configuration (only runs if domains array reference or router changes)
  useEffect(() => {
    if (sessionConfig.domains.length === 0) {
      // No domains selected, redirect to study page
      router.push("/study");
    }
  }, [sessionConfig.domains, router]); // sessionConfig.domains is safe here if it's a primitive array

  // Initialize quiz session (runs only when sessionConfig reference changes)
  const session = useQuizSession(sessionConfig);

  // Check if session is complete
  useEffect(() => {
    const isComplete =
      store.questionIds.length > 0 &&
      store.currentQuestionIndex >= store.questionIds.length - 1 &&
      store.confidenceRating !== null;

    if (isComplete) {
      setShowCompletionModal(true);
    }
  }, [
    store.currentQuestionIndex,
    store.questionIds.length,
    store.confidenceRating,
  ]);

  

  // Loading state
  if (session.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="text-6xl" suppressHydrationWarning>☁️</div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Loading Quiz Session...
          </h2>
          <p className="text-gray-600">Preparing your questions</p>
        </div>
      </div>
    );
  }

  // Error state
  if (session.error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="text-6xl" suppressHydrationWarning>⚠️</div>
          <h2 className="text-2xl font-semibold text-red-600">
            Error Loading Quiz
          </h2>
          <p className="text-gray-600">
            {session.error instanceof Error
              ? session.error.message
              : "Unknown error"}
          </p>
          <button
            onClick={() => router.push("/study")}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Back to Study Configuration
          </button>
        </div>
      </div>
    );
  }

  // No questions available
  if (!session.currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="text-6xl" suppressHydrationWarning>📭</div>
          <h2 className="text-2xl font-semibold text-gray-800">
            No Questions Available
          </h2>
          <p className="text-gray-600">
            Please adjust your filters or select different domains
          </p>
          <button
            onClick={() => router.push("/study")}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Back to Study Configuration
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <QuizContainer />
      <SessionCompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
      />
    </>
  );
}

// TODO: Add exit confirmation dialog
// TODO: Add session pause/resume
// TODO: Add session timer display
