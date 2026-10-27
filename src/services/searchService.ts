import { SearchMatch, SurahDetail, SurahItem } from '../types/quran';
import { QuranApiService } from './quranApi';
import { StorageService } from './storageService';

// Text normalization helper
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export class SearchService {
  /**
   * Cari berdasarkan nama surat, arti, atau nomor surat
   */
  static searchSurahMetadata(query: string, surahList: SurahItem[]): SearchMatch[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const normQ = normalizeText(q);
    const results: SearchMatch[] = [];

    // Jika query adalah angka, cek nomor surat
    const num = parseInt(q, 10);
    if (!isNaN(num) && num >= 1 && num <= 114) {
      const match = surahList.find((s) => s.nomor === num);
      if (match) {
        results.push({
          surahNomor: match.nomor,
          surahNamaLatin: match.namaLatin,
          ayatNomor: 1,
          teksArab: match.nama,
          teksIndonesia: `Surat ke-${match.nomor}: ${match.arti} (${match.jumlahAyat} ayat) · ${match.tempatTurun}`,
          matchType: 'surah',
          snippet: `Surat ${match.namaLatin} (${match.arti})`,
        });
      }
    }

    for (const s of surahList) {
      const normLatin = normalizeText(s.namaLatin);
      const normArti = normalizeText(s.arti);

      const matchedLatin = normLatin.includes(normQ) || s.namaLatin.toLowerCase().includes(q);
      const matchedArti = normArti.includes(normQ);
      const matchedArab = s.nama.includes(query.trim());

      if ((matchedLatin || matchedArti || matchedArab) && !results.some((r) => r.surahNomor === s.nomor)) {
        results.push({
          surahNomor: s.nomor,
          surahNamaLatin: s.namaLatin,
          ayatNomor: 1,
          teksArab: s.nama,
          teksIndonesia: `Arti: ${s.arti} · ${s.tempatTurun} · ${s.jumlahAyat} ayat`,
          matchType: matchedArti ? 'meaning' : 'surah',
          snippet: matchedArti ? `Arti: "${s.arti}"` : `Surat ${s.namaLatin}`,
        });
      }
    }

    return results;
  }

  /**
   * Cari kata atau frasa dalam terjemahan ayat di seluruh surat yang telah dicache/dibuka
   * Juga mendukung pencarian spesifik seperti "2:255" (Al-Baqarah ayat 255)
   */
  static async searchVerses(
    query: string,
    surahList: SurahItem[],
    onProgress?: (indexedSurah: number, total: number) => void
  ): Promise<{ matches: SearchMatch[]; isPartial: boolean; totalIndexed: number }> {
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      return { matches: [], isPartial: false, totalIndexed: 0 };
    }

    const matches: SearchMatch[] = [];

    // Deteksi pola pencarian "Surat:Ayat", misal "2:255" atau "18:10"
    const verseRefPattern = /^(\d{1,3})[:\s](\d{1,3})$/;
    const refMatch = cleanQuery.match(verseRefPattern);
    if (refMatch) {
      const sNum = parseInt(refMatch[1], 10);
      const aNum = parseInt(refMatch[2], 10);
      if (sNum >= 1 && sNum <= 114) {
        try {
          const detail = await QuranApiService.getSurahDetail(sNum);
          const verse = detail.ayat.find((a) => a.nomorAyat === aNum);
          if (verse) {
            matches.push({
              surahNomor: sNum,
              surahNamaLatin: detail.namaLatin,
              ayatNomor: aNum,
              teksArab: verse.teksArab,
              teksIndonesia: verse.teksIndonesia,
              matchType: 'translation',
              snippet: verse.teksIndonesia,
            });
            return { matches, isPartial: false, totalIndexed: 1 };
          }
        } catch {
          // ignore
        }
      }
    }

    let indexedCount = 0;
    const lowerQ = cleanQuery.toLowerCase();
    const maxResults = 60; // Batasi untuk menjaga performa rendering

    for (let i = 1; i <= 114; i++) {
      if (matches.length >= maxResults) break;

      const cached = StorageService.getCachedSurahDetail<SurahDetail>(i);
      if (cached && cached.ayat) {
        indexedCount++;
        for (const verse of cached.ayat) {
          if (matches.length >= maxResults) break;

          const textLower = verse.teksIndonesia.toLowerCase();
          if (textLower.includes(lowerQ)) {
            const idx = textLower.indexOf(lowerQ);
            const start = Math.max(0, idx - 40);
            const end = Math.min(verse.teksIndonesia.length, idx + lowerQ.length + 50);
            const snippet =
              (start > 0 ? '...' : '') +
              verse.teksIndonesia.substring(start, end) +
              (end < verse.teksIndonesia.length ? '...' : '');

            matches.push({
              surahNomor: cached.nomor,
              surahNamaLatin: cached.namaLatin,
              ayatNomor: verse.nomorAyat,
              teksArab: verse.teksArab,
              teksIndonesia: verse.teksIndonesia,
              matchType: 'translation',
              snippet,
            });
          }
        }
      }
    }

    if (onProgress) {
      onProgress(indexedCount, surahList.length || 114);
    }

    const isPartial = indexedCount < 114;
    return { matches, isPartial, totalIndexed: indexedCount };
  }
}
