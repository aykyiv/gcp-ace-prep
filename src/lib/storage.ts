/**
 * Browser Storage Service
 *
 * Handles all localStorage operations for persisting user progress,
 * session history, and settings. Provides type-safe storage with
 * error handling.
 */

import { STORAGE_KEYS } from "./constants";
import type {
  QuestionProgress,
  SM2Data,
} from "@/features/quiz/types/supermemo.types";
import type { SessionHistoryRecord } from "@/features/quiz/types/session.types";

// ==========================================================================
// SETTINGS STORAGE
// ==========================================================================

/**
 * User settings interface
 */
interface UserSettings {
  questionsPerSession: number;
  preferredDomains: string[];
  studyMode: string;
  // TODO: Add more settings as needed (theme, notifications, etc.)
}

// ==========================================================================
// STUDY STREAK STORAGE
// ==========================================================================

/**
 * Study streak data interface
 */
interface StudyStreakData {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string; // ISO date string
  studyDates: string[]; // Array of ISO date strings
}
/**
 * Generic storage wrapper with type safety
 */
class BrowserStorage {
  /**
   * Saves data to localStorage with error handling
   *
   * @param key - Storage key
   * @param data - Data to store (will be JSON stringified)
   */
  private save<T>(key: string, data: T): void {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Failed to save to localStorage (${key}):`, error);
      // TODO: Implement fallback storage (e.g., IndexedDB)
    }
  }

  /**
   * Loads data from localStorage with error handling
   *
   * @param key - Storage key
   * @param defaultValue - Default value if key doesn't exist
   * @returns Parsed data or default value
   */
  private load<T>(key: string, defaultValue: T): T {
    try {
      const serialized = localStorage.getItem(key);
      if (serialized === null) {
        return defaultValue;
      }
      return JSON.parse(serialized) as T;
    } catch (error) {
      console.error(`Failed to load from localStorage (${key}):`, error);
      return defaultValue;
    }
  }

  /**
   * Removes data from localStorage
   *
   * @param key - Storage key
   */
  private remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove from localStorage (${key}):`, error);
    }
  }

  // ==========================================================================
  // QUESTION PROGRESS STORAGE
  // ==========================================================================

  /**
   * Loads all question progress data
   *
   * @returns Map of questionId to SM2 data
   */
  loadQuestionProgress(): QuestionProgress {
    return this.load<QuestionProgress>(STORAGE_KEYS.QUESTION_PROGRESS, {});
  }

  /**
   * Saves all question progress data
   *
   * @param progress - Complete progress map
   */
  saveQuestionProgress(progress: QuestionProgress): void {
    this.save(STORAGE_KEYS.QUESTION_PROGRESS, progress);
  }

  /**
   * Gets progress for a single question
   *
   * @param questionId - Question ID
   * @returns SM2 data or null if not found
   */
  getQuestionProgress(questionId: string): SM2Data | null {
    const allProgress = this.loadQuestionProgress();
    return allProgress[questionId] || null;
  }

  /**
   * Updates progress for a single question
   *
   * @param questionId - Question ID
   * @param data - Updated SM2 data
   */
  updateQuestionProgress(questionId: string, data: SM2Data): void {
    const allProgress = this.loadQuestionProgress();
    allProgress[questionId] = data;
    this.saveQuestionProgress(allProgress);
  }

  /**
   * Deletes progress for a single question
   *
   * @param questionId - Question ID
   */
  deleteQuestionProgress(questionId: string): void {
    const allProgress = this.loadQuestionProgress();
    delete allProgress[questionId];
    this.saveQuestionProgress(allProgress);
  }

  /**
   * Clears all question progress (use with caution!)
   */
  clearAllProgress(): void {
    this.remove(STORAGE_KEYS.QUESTION_PROGRESS);
  }

  // ==========================================================================
  // SESSION HISTORY STORAGE
  // ==========================================================================

  /**
   * Loads session history
   *
   * @returns Array of session records
   */
  loadSessionHistory(): SessionHistoryRecord[] {
    const history = this.load<SessionHistoryRecord[]>(
      STORAGE_KEYS.SESSION_HISTORY,
      []
    );
    console.log("🚀 ~ BrowserStorage ~ loadSessionHistory ~ history:", history)
    // Convert date strings back to Date objects
    return history;
  }

  /**
   * Saves session history
   *
   * @param history - Array of session records
   */
  saveSessionHistory(history: SessionHistoryRecord[]): void {
    const serializableHistory = history.map((record) => ({
      ...record,
      date:
        record.date instanceof Date ? record.date.toISOString() : record.date,
    })) as unknown as SessionHistoryRecord[];
    console.log("🚀 ~ BrowserStorage ~ saveSessionHistory ~ serializableHistory:", serializableHistory)
    this.save(STORAGE_KEYS.SESSION_HISTORY, serializableHistory);
  }

  /**
   * Adds a new session record to history
   *
   * @param record - Session record to add
   */
  addSessionRecord(record: SessionHistoryRecord): void {
    const history = this.loadSessionHistory();
    console.log("🚀 ~ BrowserStorage ~ addSessionRecord ~ history:", history)
    const newRecord = {
      ...record,
      date: record.date.toISOString(),
    } as unknown as SessionHistoryRecord;
    history.push(newRecord);
    this.saveSessionHistory(history);
  }

  /**
   * Gets sessions from a specific date range
   *
   * @param startDate - Start date (inclusive)
   * @param endDate - End date (inclusive)
   * @returns Filtered session records
   */
  getSessionsByDateRange(
    startDate: Date,
    endDate: Date
  ): SessionHistoryRecord[] {
    const history = this.loadSessionHistory();
    return history.filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate >= startDate && recordDate <= endDate;
    });
  }

  /**
   * Loads user settings
   *
   * @returns User settings with defaults
   */
  loadSettings(): UserSettings {
    return this.load<UserSettings>(STORAGE_KEYS.SETTINGS, {
      questionsPerSession: 20,
      preferredDomains: [],
      studyMode: "mixed",
    });
  }

  /**
   * Saves user settings
   *
   * @param settings - User settings
   */
  saveSettings(settings: Partial<UserSettings>): void {
    const current = this.loadSettings();
    const updated = { ...current, ...settings };
    this.save(STORAGE_KEYS.SETTINGS, updated);
  }

  /**
   * Loads study streak data
   *
   * @returns Study streak data
   */
  loadStudyStreak(): StudyStreakData {
    return this.load<StudyStreakData>(STORAGE_KEYS.STUDY_STREAK, {
      currentStreak: 0,
      longestStreak: 0,
      lastStudyDate: "",
      studyDates: [],
    });
  }

  /**
   * Saves study streak data
   *
   * @param data - Study streak data
   */
  saveStudyStreak(data: StudyStreakData): void {
    this.save(STORAGE_KEYS.STUDY_STREAK, data);
  }

  /**
   * Updates study streak for today
   */
  updateStudyStreakForToday(): void {
    const data = this.loadStudyStreak();
    const today = new Date().toISOString().split("T")[0];

    // Check if already studied today
    if (data.lastStudyDate === today) {
      return; // Already counted for today
    }

    // Check if streak continues or breaks
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (data.lastStudyDate === yesterdayStr) {
      // Streak continues
      data.currentStreak += 1;
    } else {
      // Streak breaks, restart
      data.currentStreak = 1;
    }

    // Update longest streak if necessary
    if (data.currentStreak > data.longestStreak) {
      data.longestStreak = data.currentStreak;
    }

    // Update last study date and add to history
    data.lastStudyDate = today;
    data.studyDates.push(today);

    this.saveStudyStreak(data);
  }

  // ==========================================================================
  // UTILITY METHODS
  // ==========================================================================

  /**
   * Gets total storage size used (approximate)
   *
   * @returns Size in bytes
   */
  getStorageSize(): number {
    let total = 0;
    try {
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage.getItem(key)?.length || 0;
        }
      }
    } catch (error) {
      console.error("Failed to calculate storage size:", error);
    }
    return total;
  }

  /**
   * Clears all app data (nuclear option!)
   */
  clearAllData(): void {
    this.remove(STORAGE_KEYS.QUESTION_PROGRESS);
    this.remove(STORAGE_KEYS.SESSION_HISTORY);
    this.remove(STORAGE_KEYS.SETTINGS);
    this.remove(STORAGE_KEYS.STUDY_STREAK);
  }
}

// Export singleton instance
export const storage = new BrowserStorage();

// TODO: Implement data export/import for backup
// TODO: Add data migration for version updates
// TODO: Implement IndexedDB fallback for larger datasets
