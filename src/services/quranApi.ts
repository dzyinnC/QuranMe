import { SurahDetail, SurahItem, TafsirDetail } from '../types/quran';
import { StorageService } from './storageService';

const BASE_URL = 'https://equran.id/api/v2';
const REQUEST_TIMEOUT_MS = 9000;

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// In-memory cache for zero-latency retrieval within session
let memorySurahList: SurahItem[] | null = null;
const memorySurahDetails = new Map<number, SurahDetail>();
const memoryTafsir = new Map<number, TafsirDetail>();

// In-flight request deduplication map
const inFlightRequests = new Map<string, Promise<any>>();

async function fetchWithTimeout(url: string, timeoutMs: number = REQUEST_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

async function fetchWithRetry<T>(url: string, retries: number = 2): Promise<T> {
  // Deduplicate identical simultaneous requests
  if (inFlightRequests.has(url)) {
    return inFlightRequests.get(url) as Promise<T>;
  }

  const promise = (async () => {
    let lastError: unknown;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetchWithTimeout(url);
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }
        const json: ApiResponse<T> = await response.json();
        if (json.code !== 200 || !json.data) {
          throw new Error(json.message || 'Format data API tidak valid');
        }
        return json.data;
      } catch (err) {
        lastError = err;
        if (attempt < retries) {
          await new Promise((res) => setTimeout(res, 400 * (attempt + 1)));
        }
      }
    }
    throw lastError;
  })();

  inFlightRequests.set(url, promise);
  try {
    const result = await promise;
    return result;
  } finally {
    inFlightRequests.delete(url);
  }
}

export class QuranApiService {
  /**
   * Mengambil daftar seluruh 114 surat dari API equran.id
   * Mendukung in-memory cache dan localStorage fallback untuk performa instan
   */
  static async getSurahList(): Promise<SurahItem[]> {
    if (memorySurahList && memorySurahList.length > 0) {
      return memorySurahList;
    }

    const cached = StorageService.getCachedSurahList<SurahItem[]>();
    if (cached && cached.length > 0) {
      memorySurahList = cached;
    }

    try {
      const data = await fetchWithRetry<SurahItem[]>(`${BASE_URL}/surat`);
      if (Array.isArray(data) && data.length > 0) {
        memorySurahList = data;
        StorageService.setCachedSurahList(data);
        return data;
      }
      if (memorySurahList) return memorySurahList;
      throw new Error('Daftar surat kosong');
    } catch (err) {
      if (memorySurahList && memorySurahList.length > 0) {
        return memorySurahList;
      }
      throw new Error('Gagal memuat daftar surat. Silakan periksa koneksi internet Anda.');
    }
  }

  /**
   * Mengambil detail satu surat lengkap beserta ayat-ayatnya
   */
  static async getSurahDetail(nomor: number): Promise<SurahDetail> {
    if (nomor < 1 || nomor > 114) {
      throw new Error('Nomor surat tidak valid (harus 1-114)');
    }

    if (memorySurahDetails.has(nomor)) {
      return memorySurahDetails.get(nomor)!;
    }

    const cached = StorageService.getCachedSurahDetail<SurahDetail>(nomor);
    if (cached) {
      memorySurahDetails.set(nomor, cached);
    }

    try {
      const data = await fetchWithRetry<SurahDetail>(`${BASE_URL}/surat/${nomor}`);
      if (data && data.ayat && Array.isArray(data.ayat)) {
        memorySurahDetails.set(nomor, data);
        StorageService.setCachedSurahDetail(nomor, data);
        return data;
      }
      if (memorySurahDetails.has(nomor)) {
        return memorySurahDetails.get(nomor)!;
      }
      throw new Error(`Data ayat surat ke-${nomor} tidak ditemukan`);
    } catch (err) {
      if (memorySurahDetails.has(nomor)) {
        return memorySurahDetails.get(nomor)!;
      }
      throw new Error(`Gagal memuat surat ke-${nomor}. Silakan coba lagi.`);
    }
  }

  /**
   * Mengambil tafsir resmi Kemenag per surat
   */
  static async getSurahTafsir(nomor: number): Promise<TafsirDetail> {
    if (nomor < 1 || nomor > 114) {
      throw new Error('Nomor surat tidak valid (harus 1-114)');
    }

    if (memoryTafsir.has(nomor)) {
      return memoryTafsir.get(nomor)!;
    }

    const cached = StorageService.getCachedTafsir<TafsirDetail>(nomor);
    if (cached) {
      memoryTafsir.set(nomor, cached);
    }

    try {
      const data = await fetchWithRetry<TafsirDetail>(`${BASE_URL}/tafsir/${nomor}`);
      if (data && data.tafsir && Array.isArray(data.tafsir)) {
        memoryTafsir.set(nomor, data);
        StorageService.setCachedTafsir(nomor, data);
        return data;
      }
      if (memoryTafsir.has(nomor)) {
        return memoryTafsir.get(nomor)!;
      }
      throw new Error(`Data tafsir surat ke-${nomor} tidak ditemukan`);
    } catch (err) {
      if (memoryTafsir.has(nomor)) {
        return memoryTafsir.get(nomor)!;
      }
      throw new Error(`Gagal memuat tafsir surat ke-${nomor}. Silakan coba lagi.`);
    }
  }
}
