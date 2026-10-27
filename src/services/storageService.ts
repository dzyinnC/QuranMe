import {
  BookmarkItem,
  DailyTilawahLog,
  DailyTilawahProgress,
  LastReadPosition,
  ThemeBackground,
  UserSettings,
} from '../types/quran';

const SETTINGS_KEY = 'quranme_settings_v1';
const LAST_READ_KEY = 'quranme_last_read_v1';
const BOOKMARKS_KEY = 'quranme_bookmarks_v1';
const NOTES_KEY = 'quranme_notes_v1';
const TILAWAH_PROGRESS_KEY = 'quranme_tilawah_progress_v2';
const TILAWAH_LOGS_KEY = 'quranme_tilawah_logs_v1';
const CACHE_SURAH_LIST_KEY = 'quranme_cache_surah_list_v1';
const CACHE_SURAH_DETAIL_PREFIX = 'quranme_cache_surah_';
const CACHE_TAFSIR_PREFIX = 'quranme_cache_tafsir_';

export const DEFAULT_SETTINGS: UserSettings = {
  arabicFontSize: 30,
  translationFontSize: 15,
  showLatin: true,
  showTranslation: true,
  defaultQari: '05', // Misyari Rasyid Al-Afasi
  dailyTargetAyat: 10,
  autoScrollSpeed: 2,
  themeBackground: 'light' as ThemeBackground,
};

export class StorageService {
  /* =========================================================================
   * User Settings
   * ========================================================================= */
  static getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (!data) return DEFAULT_SETTINGS;
      const parsed = JSON.parse(data);
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  static saveSettings(settings: Partial<UserSettings>): UserSettings {
    try {
      const current = this.getSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('Failed to save settings:', e);
      return DEFAULT_SETTINGS;
    }
  }

  /* =========================================================================
   * Last Read Position (Reading bookmark / recovery)
   *
   * CRITICAL BUG FIX: Updating the last read position when navigating or
   * scrolling MUST NEVER increment the daily tilawah count. Reading position
   * tracking and tilawah completion are two completely distinct concepts.
   * ========================================================================= */
  static getLastRead(): LastReadPosition | null {
    try {
      const data = localStorage.getItem(LAST_READ_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static setLastRead(lastRead: LastReadPosition): void {
    try {
      localStorage.setItem(LAST_READ_KEY, JSON.stringify(lastRead));
      // NOTE: DO NOT call recordAyatRead() here!
    } catch (e) {
      console.warn('Failed to save last read:', e);
    }
  }

  /* =========================================================================
   * Bookmarks
   * ========================================================================= */
  static getBookmarks(): BookmarkItem[] {
    try {
      const data = localStorage.getItem(BOOKMARKS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static isBookmarked(surahNomor: number, ayatNomor: number): boolean {
    const list = this.getBookmarks();
    return list.some((b) => b.surahNomor === surahNomor && b.ayatNomor === ayatNomor);
  }

  static toggleBookmark(item: Omit<BookmarkItem, 'id' | 'createdAt'>): boolean {
    try {
      const list = this.getBookmarks();
      const existingIndex = list.findIndex(
        (b) => b.surahNomor === item.surahNomor && b.ayatNomor === item.ayatNomor
      );

      if (existingIndex >= 0) {
        list.splice(existingIndex, 1);
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list));
        return false; // removed
      } else {
        const newItem: BookmarkItem = {
          ...item,
          id: `${item.surahNomor}-${item.ayatNomor}`,
          createdAt: Date.now(),
        };
        list.unshift(newItem);
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list));
        return true; // added
      }
    } catch (e) {
      console.warn('Failed to toggle bookmark:', e);
      return false;
    }
  }

  static removeBookmark(surahNomor: number, ayatNomor: number): void {
    try {
      const list = this.getBookmarks().filter(
        (b) => !(b.surahNomor === surahNomor && b.ayatNomor === ayatNomor)
      );
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to remove bookmark:', e);
    }
  }

  /* =========================================================================
   * Notes / Tadabbur
   * ========================================================================= */
  static getNotes(): Record<string, string> {
    try {
      const data = localStorage.getItem(NOTES_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  static getNoteForAyat(surahNomor: number, ayatNomor: number): string {
    const notes = this.getNotes();
    return notes[`${surahNomor}-${ayatNomor}`] || '';
  }

  static saveNoteForAyat(surahNomor: number, ayatNomor: number, text: string): void {
    try {
      const notes = this.getNotes();
      const key = `${surahNomor}-${ayatNomor}`;
      if (text.trim() === '') {
        delete notes[key];
      } else {
        notes[key] = text.trim();
      }
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (e) {
      console.warn('Failed to save note:', e);
    }
  }

  /* =========================================================================
   * DAILY TILAWAH PROGRESS ENGINE (Strictly Unique Verse Tracking)
   *
   * Definition of progress: The exact number of UNIQUE verses completed
   * by the user on their local calendar date (YYYY-MM-DD).
   *
   * Guarantees:
   * 1. Initial count of the day is 0.
   * 2. Idempotent: Marking verse "1:1" five times still yields count = 1.
   * 3. Unmarking a verse decrements count accurately.
   * 4. Scrolling, loading surah, restoring last-read NEVER inflates count.
   * 5. Changing daily target modifies target without altering read count.
   * 6. Corrupt legacy count (such as 611) is sanitized safely.
   * ========================================================================= */

  static getTodayLocalDateString(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  static getTodayProgress(): DailyTilawahProgress {
    const today = this.getTodayLocalDateString();
    const settings = this.getSettings();

    try {
      const raw = localStorage.getItem(TILAWAH_PROGRESS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DailyTilawahProgress;
        if (parsed && parsed.date === today && Array.isArray(parsed.completedVerseIds)) {
          // Normalize and deduplicate IDs to be 100% resilient
          const uniqueIds = Array.from(new Set(parsed.completedVerseIds));
          return {
            date: today,
            completedVerseIds: uniqueIds,
            ayatCount: uniqueIds.length,
            targetAyat: settings.dailyTargetAyat || parsed.targetAyat || 10,
            lastUpdated: parsed.lastUpdated || Date.now(),
          };
        }
      }
    } catch (e) {
      console.warn('Failed to read tilawah progress v2:', e);
    }

    // Default pristine state for today
    const pristine: DailyTilawahProgress = {
      date: today,
      completedVerseIds: [],
      ayatCount: 0,
      targetAyat: settings.dailyTargetAyat || 10,
      lastUpdated: Date.now(),
    };

    // Sanitize any corrupt legacy data in v1 logs
    this.sanitizeLegacyLogs(today);
    return pristine;
  }

  private static sanitizeLegacyLogs(today: string): void {
    try {
      const logs = this.getTilawahLogs();
      const todayIndex = logs.findIndex((l) => l.date === today);
      if (todayIndex >= 0) {
        // If today's legacy log had an unreasonable inflated number (e.g. 611) without verified verse IDs
        if (logs[todayIndex].ayatCount > 150 && (!logs[todayIndex].completedVerseIds || logs[todayIndex].completedVerseIds.length === 0)) {
          console.warn(`Sanitizing corrupt legacy tilawah log for ${today} (${logs[todayIndex].ayatCount} -> 0)`);
          logs[todayIndex].ayatCount = 0;
          logs[todayIndex].completedVerseIds = [];
          localStorage.setItem(TILAWAH_LOGS_KEY, JSON.stringify(logs));
        }
      }
    } catch {
      // ignore
    }
  }

  static isAyatCompletedToday(surahNomor: number, ayatNomor: number): boolean {
    const progress = this.getTodayProgress();
    const verseId = `${surahNomor}:${ayatNomor}`;
    return progress.completedVerseIds.includes(verseId);
  }

  static markAyatCompleted(
    surahNomor: number,
    ayatNomor: number,
    completed: boolean
  ): { isCompleted: boolean; todayCount: number } {
    try {
      const progress = this.getTodayProgress();
      const verseId = `${surahNomor}:${ayatNomor}`;
      const idSet = new Set(progress.completedVerseIds);

      if (completed) {
        idSet.add(verseId);
      } else {
        idSet.delete(verseId);
      }

      const updatedIds = Array.from(idSet);
      const updatedProgress: DailyTilawahProgress = {
        date: progress.date,
        completedVerseIds: updatedIds,
        ayatCount: updatedIds.length,
        targetAyat: progress.targetAyat,
        lastUpdated: Date.now(),
      };

      // Save v2 progress
      localStorage.setItem(TILAWAH_PROGRESS_KEY, JSON.stringify(updatedProgress));

      // Sync to v1 logs for 7-day habit graph
      this.syncToLogs(updatedProgress);

      // Dispatch global event for reactive UI updates
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('quranme_tilawah_updated', { detail: updatedProgress })
        );
      }

      return { isCompleted: completed, todayCount: updatedProgress.ayatCount };
    } catch (e) {
      console.warn('Failed to mark ayat completion:', e);
      return { isCompleted: completed, todayCount: 0 };
    }
  }

  static toggleAyatCompletedToday(
    surahNomor: number,
    ayatNomor: number
  ): { isCompleted: boolean; todayCount: number } {
    const current = this.isAyatCompletedToday(surahNomor, ayatNomor);
    return this.markAyatCompleted(surahNomor, ayatNomor, !current);
  }

  static getTodayAyatCount(): number {
    return this.getTodayProgress().ayatCount;
  }

  private static syncToLogs(progress: DailyTilawahProgress): void {
    try {
      const logs = this.getTilawahLogs();
      const index = logs.findIndex((l) => l.date === progress.date);

      if (index >= 0) {
        logs[index].ayatCount = progress.ayatCount;
        logs[index].completedVerseIds = progress.completedVerseIds;
      } else {
        logs.push({
          date: progress.date,
          ayatCount: progress.ayatCount,
          completedVerseIds: progress.completedVerseIds,
        });
      }

      // keep last 60 days
      const trimmed = logs.slice(-60);
      localStorage.setItem(TILAWAH_LOGS_KEY, JSON.stringify(trimmed));
    } catch (e) {
      console.warn('Failed to sync tilawah logs:', e);
    }
  }

  static getTilawahLogs(): DailyTilawahLog[] {
    try {
      const data = localStorage.getItem(TILAWAH_LOGS_KEY);
      const logs: DailyTilawahLog[] = data ? JSON.parse(data) : [];
      // Ensure today's entry matches current v2 progress count
      const today = this.getTodayLocalDateString();
      const rawProgress = localStorage.getItem(TILAWAH_PROGRESS_KEY);
      if (rawProgress) {
        const p = JSON.parse(rawProgress) as DailyTilawahProgress;
        if (p && p.date === today && Array.isArray(p.completedVerseIds)) {
          const todayIndex = logs.findIndex((l) => l.date === today);
          if (todayIndex >= 0) {
            logs[todayIndex].ayatCount = p.completedVerseIds.length;
            logs[todayIndex].completedVerseIds = p.completedVerseIds;
          }
        }
      }
      return logs;
    } catch {
      return [];
    }
  }

  static resetTilawahToday(): void {
    const today = this.getTodayLocalDateString();
    const settings = this.getSettings();
    const resetProgress: DailyTilawahProgress = {
      date: today,
      completedVerseIds: [],
      ayatCount: 0,
      targetAyat: settings.dailyTargetAyat || 10,
      lastUpdated: Date.now(),
    };
    localStorage.setItem(TILAWAH_PROGRESS_KEY, JSON.stringify(resetProgress));
    this.syncToLogs(resetProgress);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('quranme_tilawah_updated', { detail: resetProgress })
      );
    }
  }

  /* =========================================================================
   * Cache utilities for instant offline rendering
   * ========================================================================= */
  static getCachedSurahList<T>(): T | null {
    try {
      const data = localStorage.getItem(CACHE_SURAH_LIST_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static setCachedSurahList<T>(data: T): void {
    try {
      localStorage.setItem(CACHE_SURAH_LIST_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to cache surah list:', e);
    }
  }

  static getCachedSurahDetail<T>(nomor: number): T | null {
    try {
      const data = localStorage.getItem(`${CACHE_SURAH_DETAIL_PREFIX}${nomor}`);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static setCachedSurahDetail<T>(nomor: number, data: T): void {
    try {
      localStorage.setItem(`${CACHE_SURAH_DETAIL_PREFIX}${nomor}`, JSON.stringify(data));
    } catch (e) {
      console.warn(`Failed to cache surah ${nomor}:`, e);
    }
  }

  static getCachedTafsir<T>(nomor: number): T | null {
    try {
      const data = localStorage.getItem(`${CACHE_TAFSIR_PREFIX}${nomor}`);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static setCachedTafsir<T>(nomor: number, data: T): void {
    try {
      localStorage.setItem(`${CACHE_TAFSIR_PREFIX}${nomor}`, JSON.stringify(data));
    } catch (e) {
      console.warn(`Failed to cache tafsir ${nomor}:`, e);
    }
  }

  static resetAllData(): void {
    try {
      localStorage.removeItem(SETTINGS_KEY);
      localStorage.removeItem(LAST_READ_KEY);
      localStorage.removeItem(BOOKMARKS_KEY);
      localStorage.removeItem(NOTES_KEY);
      localStorage.removeItem(TILAWAH_PROGRESS_KEY);
      localStorage.removeItem(TILAWAH_LOGS_KEY);
      localStorage.removeItem(CACHE_SURAH_LIST_KEY);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('quranme_tilawah_updated'));
      }
    } catch (e) {
      console.warn('Failed to reset data:', e);
    }
  }
}
