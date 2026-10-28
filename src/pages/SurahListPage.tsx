import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Compass,
  Filter,
  Loader2,
  RotateCcw,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { IslamicCornerMotif } from '../components/common/IslamicOrnaments';
import { QuranApiService } from '../services/quranApi';
import { StorageService } from '../services/storageService';
import { SurahItem } from '../types/quran';

interface SurahListPageProps {
  onSelectSurah: (nomor: number, ayatNomor?: number) => void;
  onBack?: () => void;
  onOpenTajweedEdu?: () => void;
}

export const SurahListPage: React.FC<SurahListPageProps> = ({
  onSelectSurah,
  onBack,
  onOpenTajweedEdu,
}) => {
  const [surahs, setSurahs] = useState<SurahItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'Mekah' | 'Madinah'>('all');

  const lastRead = StorageService.getLastRead();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    QuranApiService.getSurahList()
      .then((data) => {
        if (isMounted) {
          setSurahs(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Gagal memuat daftar surat');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter surahs with useMemo for smooth responsiveness
  const filteredSurahs = useMemo(() => {
    return surahs.filter((surah) => {
      // 1. Text Search matching
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        surah.namaLatin.toLowerCase().includes(query) ||
        surah.arti.toLowerCase().includes(query) ||
        surah.nomor.toString() === query;

      // 2. City Filter matching
      const matchesCity =
        filterType === 'all' ||
        (filterType === 'Mekah' &&
          (surah.tempatTurun === 'Mekah' || surah.tempatTurun === 'mekah')) ||
        (filterType === 'Madinah' &&
          (surah.tempatTurun === 'Madinah' || surah.tempatTurun === 'madinah'));

      return matchesSearch && matchesCity;
    });
  }, [surahs, searchQuery, filterType]);

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* 1. Header with Islamic Corner Motif (Matching Reference Screen 2) */}
      <div className="relative overflow-hidden rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6 shadow-xs flex items-center justify-between">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="w-9 h-9 rounded-full bg-[var(--bg-card-subtle)] hover:bg-[var(--border-main)] text-[var(--text-main)] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Kembali"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-2xl font-extrabold text-[var(--text-main)] tracking-tight">
              Daftar Surah
            </h1>
          </div>
          <p className="text-xs text-[var(--text-muted)] pl-1 font-medium">
            114 Surat · 30 Juz · Mushaf Standar Indonesia
          </p>
        </div>

        {/* Delicate Arabesque Ornament on top-right */}
        <div className="absolute right-0 top-0 text-[#0EAAFC] pointer-events-none opacity-20">
          <IslamicCornerMotif className="w-28 h-28 text-[#0EAAFC]" opacity={1} />
        </div>
      </div>

      {/* 2. Search Field Pill (Matching Reference Screen 2) */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5 text-[#0EAAFC]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama surah, nomor atau arti..."
          className="w-full pl-11 pr-10 py-3.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-main)] text-sm text-[var(--text-main)] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0EAAFC]/30 focus:border-[#0EAAFC] transition-all shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[var(--text-main)] cursor-pointer"
            aria-label="Hapus kata kunci pencarian"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 3. Filter Chips: Semua | Makkiyah | Madaniyah */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            filterType === 'all'
              ? 'bg-[#0EAAFC] text-white shadow-xs'
              : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-main)] hover:border-slate-300'
          }`}
        >
          Semua
        </button>
        <button
          onClick={() => setFilterType('Mekah')}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            filterType === 'Mekah'
              ? 'bg-[#0EAAFC] text-white shadow-xs'
              : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-main)] hover:border-slate-300'
          }`}
        >
          Makkiyah
        </button>
        <button
          onClick={() => setFilterType('Madinah')}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            filterType === 'Madinah'
              ? 'bg-[#0EAAFC] text-white shadow-xs'
              : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-main)] hover:border-slate-300'
          }`}
        >
          Madaniyah
        </button>
      </div>

      {/* Educational Banner: Pusat Belajar Tajwid & Waqaf */}
      {onOpenTajweedEdu && (
        <div
          onClick={onOpenTajweedEdu}
          className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[#0EAAFC]/10 via-[var(--bg-card)] to-[#43B433]/10 border border-[#0EAAFC]/30 hover:border-[#0EAAFC] transition-all cursor-pointer card-interactive shadow-xs group"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0EAAFC] to-[#43B433] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-[var(--text-main)] group-hover:text-[#0EAAFC] transition-colors">
                  Pusat Belajar Tajwid & Waqaf
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF7EE] text-[#43B433]">
                  15 Bab Lengkap
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Kaidah makhraj, sifat huruf, tanda waqaf Kemenag RI, & kuis latihan interaktif.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0EAAFC] group-hover:translate-x-1 transition-all" />
        </div>
      )}

      {/* 4. Surah List Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)] space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#0EAAFC]" />
          <p className="text-xs">Memuat 114 surat Al-Qur'an...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 p-6 rounded-3xl bg-[var(--bg-card)] border border-red-200 space-y-3">
          <p className="text-sm text-red-500 font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 rounded-full bg-[#0EAAFC] text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      ) : filteredSurahs.length === 0 ? (
        <div className="text-center py-16 p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] space-y-2">
          <Search className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-[var(--text-main)]">Surat tidak ditemukan</h3>
          <p className="text-xs text-[var(--text-muted)]">
            Tidak ada surat yang sesuai dengan kata kunci "{searchQuery}"
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSurahs.map((surah) => {
            const isLastReadSurah = lastRead && lastRead.surahNomor === surah.nomor;

            return (
              <div
                key={surah.nomor}
                onClick={() => onSelectSurah(surah.nomor, isLastReadSurah ? lastRead.ayatNomor : 1)}
                className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-[var(--bg-card)] border transition-all cursor-pointer card-interactive ${
                  isLastReadSurah
                    ? 'border-[#43B433] bg-[#EAF7EE]/30 shadow-xs'
                    : 'border-[var(--border-main)] hover:border-[#0EAAFC]'
                }`}
              >
                {/* Left: Number circle & Info */}
                <div className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
                  {/* Number in circle */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 shadow-2xs ${
                      isLastReadSurah
                        ? 'bg-[#43B433] text-white'
                        : 'bg-[#D8F7F1] text-[#0877B9]'
                    }`}
                  >
                    {surah.nomor}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-arabic text-base sm:text-lg font-bold text-[var(--text-main)] leading-none">
                        {surah.nama}
                      </span>
                      {isLastReadSurah && (
                        <span className="text-[10px] font-bold text-[#43B433] bg-[#EAF7EE] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#43B433]" />
                          Terakhir dibaca
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="font-bold text-[var(--text-main)] truncate">
                        {surah.namaLatin}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[var(--text-muted)] truncate">
                        {surah.arti}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Ayat Count, Place Badge & Chevron */}
                <div className="flex items-center gap-2.5 sm:gap-4 shrink-0 pl-2">
                  <div className="text-right">
                    <span className="text-xs font-semibold text-[var(--text-muted)] block">
                      {surah.jumlahAyat} ayat
                    </span>
                    <span className="text-[10px] font-semibold text-[#43B433] bg-[#EAF7EE] px-2 py-0.5 rounded-full inline-block mt-0.5">
                      {surah.tempatTurun}
                    </span>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
