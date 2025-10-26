/**
 * Application-wide constants
 * Includes exam specs, SuperMemo 2 parameters, domain metadata
 */

// ============================================================================
// EXAM SPECIFICATIONS
// ============================================================================

export const EXAM_SPECS = {
  DURATION_MINUTES: 120,
  MIN_QUESTIONS: 50,
  MAX_QUESTIONS: 60,
  PASSING_SCORE: 0.7, // 70%
  LANGUAGE: "English",
} as const;

// ============================================================================
// SUPERMEMO 2 ALGORITHM PARAMETERS
// ============================================================================

export const SM2_CONFIG = {
  // Initial ease factor for new questions
  INITIAL_EASE: 2.5,

  // Minimum ease factor to prevent "ease hell"
  MIN_EASE: 1.3,

  // Maximum interval in days (beyond exam date)
  MAX_INTERVAL: 180,

  // First review interval after initial learning (days)
  FIRST_INTERVAL: 1,

  // Second review interval after first successful review (days)
  SECOND_INTERVAL: 6,

  // Multipliers for difficulty ratings
  MULTIPLIERS: {
    AGAIN: 0, // Reset to day 1
    HARD: 1.2,
    GOOD: 2.5,
    EASY: 2.8,
  },

  // Ease factor adjustments based on rating
  EASE_ADJUSTMENTS: {
    AGAIN: -0.2,
    HARD: -0.15,
    GOOD: 0,
    EASY: 0.15,
  },
} as const;

// ============================================================================
// DIFFICULTY RATINGS
// ============================================================================

export const DIFFICULTY_RATINGS = {
  AGAIN: 0,
  HARD: 3,
  GOOD: 4,
  EASY: 5,
} as const;

export const DIFFICULTY_LABELS = {
  [DIFFICULTY_RATINGS.AGAIN]: "Again",
  [DIFFICULTY_RATINGS.HARD]: "Hard",
  [DIFFICULTY_RATINGS.GOOD]: "Good",
  [DIFFICULTY_RATINGS.EASY]: "Easy",
} as const;

// ============================================================================
// GCP DOMAINS
// ============================================================================

export const DOMAINS = {
  COMPUTE_ENGINE: "compute-engine",
  IAM: "iam",
  NETWORKING: "networking",
  STORAGE: "storage",
  GKE: "gke",
  MONITORING: "monitoring-logging",
  APP_ENGINE: "app-engine-cloud-run",
  DATA_ANALYTICS: "data-analytics",
  DEVELOPER_TOOLS: "developer-tools",
} as const;

export const DOMAIN_METADATA = {
  [DOMAINS.COMPUTE_ENGINE]: {
    name: "Compute Engine & VMs",
    color: "#3b82f6",
    icon: "🖥️",
    examPercentage: 25,
    totalQuestions: 50,
  },
  [DOMAINS.IAM]: {
    name: "Identity & Access Management",
    color: "#a855f7",
    icon: "🔐",
    examPercentage: 18,
    totalQuestions: 36,
  },
  [DOMAINS.NETWORKING]: {
    name: "Networking",
    color: "#14b8a6",
    icon: "🌐",
    examPercentage: 15,
    totalQuestions: 30,
  },
  [DOMAINS.STORAGE]: {
    name: "Storage Services",
    color: "#f97316",
    icon: "💾",
    examPercentage: 12,
    totalQuestions: 24,
  },
  [DOMAINS.GKE]: {
    name: "Google Kubernetes Engine",
    color: "#1e40af",
    icon: "☸️",
    examPercentage: 10,
    totalQuestions: 20,
  },
  [DOMAINS.MONITORING]: {
    name: "Monitoring & Logging",
    color: "#eab308",
    icon: "📊",
    examPercentage: 8,
    totalQuestions: 16,
  },
  [DOMAINS.APP_ENGINE]: {
    name: "App Engine & Cloud Run",
    color: "#ec4899",
    icon: "🚀",
    examPercentage: 5,
    totalQuestions: 10,
  },
  [DOMAINS.DATA_ANALYTICS]: {
    name: "Data & Analytics",
    color: "#6366f1",
    icon: "📈",
    examPercentage: 4,
    totalQuestions: 8,
  },
  [DOMAINS.DEVELOPER_TOOLS]: {
    name: "Developer Tools",
    color: "#6b7280",
    icon: "🛠️",
    examPercentage: 3,
    totalQuestions: 6,
  },
} as const;

// ============================================================================
// QUESTION TYPES
// ============================================================================

export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: "multiple-choice",
  MULTIPLE_SELECT: "multiple-select",
} as const;

// ============================================================================
// DIFFICULTY LEVELS
// ============================================================================

export const DIFFICULTY_LEVELS = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
} as const;

// ============================================================================
// STUDY MODES
// ============================================================================

export const STUDY_MODES = {
  NEW_QUESTIONS: "new",
  REVIEW_DUE: "review",
  MIXED: "mixed",
  WEAK_AREAS: "weak",
} as const;

// ============================================================================
// SESSION CONFIGURATION
// ============================================================================

export const SESSION_CONFIG = {
  QUESTIONS_PER_SESSION_OPTIONS: [10, 20, 30, 50],
  DEFAULT_QUESTIONS_PER_SESSION: 20,
  NEW_REVIEW_RATIO: 0.2, // 20% new, 80% review
  MAX_DAILY_NEW_QUESTIONS: 50,
} as const;

// ============================================================================
// PROGRESS THRESHOLDS
// ============================================================================

export const PROGRESS_THRESHOLDS = {
  MASTERY_INTERVAL_DAYS: 21, // Questions with interval > 21 days are "mastered"
  MASTERY_EASE_FACTOR: 2.5, // Questions with ease > 2.5 are "mastered"
  WEAK_QUESTION_EASE: 2.0, // Questions with ease < 2.0 are "weak"
  EXAM_READY_PERCENTAGE: 80, // 80% mastery to be exam-ready
} as const;

// ============================================================================
// BROWSER STORAGE KEYS
// ============================================================================

export const STORAGE_KEYS = {
  QUESTION_PROGRESS: "gcp_ace_question_progress",
  SESSION_HISTORY: "gcp_ace_session_history",
  SETTINGS: "gcp_ace_settings",
  STUDY_STREAK: "gcp_ace_study_streak",
} as const;

// TODO: Add more constants as features are implemented (e.g., color themes, animation durations)
