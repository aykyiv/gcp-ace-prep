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
import GCPColoredSpinner from "@/components/ui/loadingSpinner";
import { saveSessionToHistory } from "@/features/quiz/services/session-service";
import { storage } from "@/lib/storage";
import { useSessionSummary } from "@/features/quiz/hooks/use-session-summary";

export default function QuizPage() {
  const router = useRouter();
  const config = useSessionConfig();
  const store = useQuizStore();
  // --- 1. Session Config Selectors (Stability Fix) ---
  // ✅ FIX: Use selectors to get specific config values instead of whole store
  // This prevents creating new config objects on every render and ensures stability.
  const selectedDomains = useSessionConfig((state) => state.selectedDomains);
  const questionsPerSession = useSessionConfig(
    (state) => state.questionsPerSession
  );
  const studyMode = useSessionConfig((state) => state.studyMode);
  const difficultyFilter = useSessionConfig((state) => state.difficultyFilter);
  const questionTypeFilter = useSessionConfig(
    (state) => state.questionTypeFilter
  );
  const tagFilter = useSessionConfig((state) => state.tagFilter);
  const getConfig = useSessionConfig((state) => state.getConfig); // A utility function is also selected

  // --- 2. Quiz Store Selectors (Performance Fix) ---
  // ✅ FIX: Use selector instead of whole store to prevent unnecessary re-renders
  const resetSession = useQuizStore((state) => state.resetSession);
  const currentQuestionIndex = useQuizStore(
    (state) => state.currentQuestionIndex
  );
  const questionIds = useQuizStore((state) => state.questionIds);
  const confidenceRating = useQuizStore((state) => state.confidenceRating);

  // --- 3. Local State and Hooks ---
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const summary = useSessionSummary();
  const [sessionSaved, setSessionSaved] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- 4. Unmount Cleanup Effect ---
  // ✅ FIX: Reset session on component unmount (when navigating away)
  useEffect(() => {
    return () => {
      console.log("[QuizPage] Unmounting - resetting session");
      resetSession();
    };
  }, [resetSession]);

  // --- 5. Stable Session Config Object ---
  // ✅ FIX: Build session config from specific selector values using useMemo.
  // This creates a stable object reference that only changes when the underlying values truly change.
  const sessionConfig = useMemo(
    () => ({
      domains: selectedDomains,
      questionsPerSession,
      studyMode,
      // Conditionally set filters to undefined if empty to simplify logic elsewhere
      difficultyFilter:
        difficultyFilter.length > 0 ? difficultyFilter : undefined,
      questionTypeFilter:
        questionTypeFilter.length > 0 ? questionTypeFilter : undefined,
      tagFilter: tagFilter.length > 0 ? tagFilter : undefined,
    }),
    [
      selectedDomains,
      questionsPerSession,
      studyMode,
      difficultyFilter,
      questionTypeFilter,
      tagFilter,
    ]
  );

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

    if (isComplete && summary && !sessionSaved) {
      // CRITICAL FIX: Save the session history and update the streak here.
      const configForSave = getConfig();

      console.log("[QuizPage] Session complete - saving to history");

      saveSessionToHistory(configForSave, summary);

      storage.updateStudyStreakForToday();

      setSessionSaved(true);

      setShowCompletionModal(true);
    } else if (isComplete) {
      // Show modal if completed and already saved (e.g., component remounts)

      setShowCompletionModal(true);
    }
  }, [
    currentQuestionIndex,

    questionIds.length,

    confidenceRating,

    summary,

    sessionSaved,

    getConfig,
  ]);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-2">
          <GCPColoredSpinner size="large" color="blue" />
        </div>
      </div>
    );
  }

  // Loading state
  if (session.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="text-6xl" suppressHydrationWarning>
            ☁️
          </div>
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
          <div className="text-6xl" suppressHydrationWarning>
            ⚠️
          </div>
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
          <div className="text-6xl" suppressHydrationWarning>
            📭
          </div>
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
