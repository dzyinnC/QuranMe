export interface SurahItem {
  nomor: number;
  nama: string; // Teks Arab, mis. "الفاتحة"
  namaLatin: string; // Mis. "Al-Fatihah"
  jumlahAyat: number;
  tempatTurun: "Mekah" | "Madinah" | string;
  arti: string; // Mis. "Pembukaan"
  deskripsi: string;
  audioFull: Record<string, string>;
}

export interface AyatItem {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
}

export interface SurahNavAdjacent {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
}

export interface SurahDetail extends SurahItem {
  ayat: AyatItem[];
  suratSelanjutnya: SurahNavAdjacent | false;
  suratSebelumnya: SurahNavAdjacent | false;
}

export interface TafsirVerse {
  ayat: number;
  teks: string;
}

export interface TafsirDetail {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  tafsir: TafsirVerse[];
}

export interface BookmarkItem {
  id: string; // `${surahNomor}-${ayatNomor}`
  surahNomor: number;
  surahNamaLatin: string;
  ayatNomor: number;
  teksArab: string;
  teksIndonesia: string;
  note?: string;
  createdAt: number;
}

export interface LastReadPosition {
  surahNomor: number;
  surahNamaLatin: string;
  ayatNomor: number;
  timestamp: number;
  totalAyat: number;
}

export type ThemeBackground = 'light' | 'dark' | 'premium';

export interface DailyTilawahProgress {
  date: string; // YYYY-MM-DD (local user date)
  completedVerseIds: string[]; // Set of unique verse identifiers, e.g. ["1:1", "1:2", "2:255"]
  ayatCount: number; // completedVerseIds.length
  targetAyat: number;
  lastUpdated: number;
}

export interface DailyTilawahLog {
  date: string; // YYYY-MM-DD
  ayatCount: number;
  completedVerseIds?: string[];
}

export interface UserSettings {
  arabicFontSize: number; // 22 to 44 (default 30)
  translationFontSize: number; // 13 to 22 (default 15)
  showLatin: boolean; // default true
  showTranslation: boolean; // default true
  defaultQari: string; // "05" (Misyari)
  dailyTargetAyat: number; // e.g. 10 ayat per day
  autoScrollSpeed: number; // 1 to 5 (pixels per tick)
  themeBackground: ThemeBackground; // 'light' | 'dark' | 'premium'
}

export interface SearchMatch {
  surahNomor: number;
  surahNamaLatin: string;
  ayatNomor: number;
  teksArab: string;
  teksIndonesia: string;
  matchType: "surah" | "meaning" | "translation";
  snippet: string;
}
