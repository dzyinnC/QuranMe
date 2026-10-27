import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle,
  Clock,
  Compass,
  Filter,
  Layers,
  Loader2,
  Play,
  RotateCcw,
  Search,
  Volume2,
} from 'lucide-react';
import { JUZ_LIST, JuzItem } from '../data/juzData';
import { audioService } from '../services/audioService';
import { QuranApiService } from '../services/quranApi';
import { StorageService } from '../services/storageService';
import { SurahItem } from '../types/quran';

interface SurahListPageProps {
  onSelectSurah: (nomor: number, ayatNomor?: number) => void;
}

export const SurahListPage: React.FC<SurahListPageProps> = ({ onSelectSurah }) => {
  const [activeTab, setActiveTab] = useState<'surat' | 'juz'>('surat');
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

  // Filter surahs with useMemo for zero layout recalculation overhead
  const filteredSurahs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return surahs.filter((surah) => {
      const matchesSearch =
        !q ||
        surah.namaLatin.toLowerCase().includes(q) ||
        surah.arti.toLowerCase().includes(q) ||
        surah.nomor.toString() === q ||
        surah.nama.includes(q);

      const matchesType =
        filterType === 'all' ||
        surah.tempatTurun.toLowerCase() === filterType.toLowerCase();

      return matchesSearch && matchesType;
    });
  }, [surahs, searchQuery, filterType]);

  // Filter juz list
  const filteredJuz = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return JUZ_LIST;
    return JUZ_LIST.filter(
      (j) =>
        j.juz.toString() === q ||
        j.latinName.toLowerCase().includes(q) ||
        j.startSurahName.toLowerCase().includes(q) ||
        j.endSurahName.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handlePlayFull = (e: React.MouseEvent, surah: SurahItem) => {
    e.stopPropagation();
    if (surah.audioFull) {
      audioService.playFullSurah(surah.nomor, surah.namaLatin, surah.audioFull);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--border-main)]">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-main)]">Al-Qur'an 30 Juz</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Jelajahi ayat-ayat suci berdasarkan urutan 114 Surat atau pembagian 30 Juz
          </p>
        </div>

        {/* View Mode Segmented Control: Surat vs Juz */}
        <div className="flex items-center gap-1 p-1 bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('surat')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer active:scale-95 ${
              activeTab === 'surat'
                ? 'bg-[#0EAAFC] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>114 Surat</span>
          </button>
          <button
            onClick={() => setActiveTab('juz')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer active:scale-95 ${
              activeTab === 'juz'
                ? 'bg-[#43B433] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>30 Juz</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'surat'
                ? 'Cari nama surat atau nomor (contoh: Al-Baqarah, Sapi Betina, 2)...'
                : 'Cari juz atau nama surat dalam juz (contoh: Juz 30, Al-Kahf)...'
            }
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl text-xs sm:text-sm text-[var(--text-main)] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0EAAFC]/40 focus:border-transparent transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer p-1"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Filter Segmented Control (Only for Surat tab) */}
        {activeTab === 'surat' && (
          <div className="flex items-center gap-1 p-1 bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] rounded-2xl self-start">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all cursor-pointer active:scale-95 ${
                filterType === 'all'
                  ? 'bg-[#0EAAFC] text-white font-semibold shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterType('Mekah')}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all cursor-pointer active:scale-95 ${
                filterType === 'Mekah'
                  ? 'bg-[#0EAAFC] text-white font-semibold shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Makkiyyah
            </button>
            <button
              onClick={() => setFilterType('Madinah')}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all cursor-pointer active:scale-95 ${
                filterType === 'Madinah'
                  ? 'bg-[#0EAAFC] text-white font-semibold shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Madaniyyah
            </button>
          </div>
        )}
      </div>

      {/* Content State: SURAT TAB */}
      {activeTab === 'surat' && (
        <>
          {isLoading ? (
            /* Lightweight Skeleton Grid (12 items) */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] flex items-center justify-between gap-3 animate-pulse"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-200/60" />
                    <div className="space-y-1.5">
                      <div className="w-24 h-4 bg-slate-200/70 rounded" />
                      <div className="w-32 h-3 bg-slate-200/50 rounded" />
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-slate-200/60 rounded" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="py-16 flex flex-col items-center justify-center text-center gap-3 bg-[var(--bg-card)] rounded-3xl border border-[var(--border-main)] p-8">
              <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl max-w-md">{error}</p>
              <button
                onClick={() => {
                  setIsLoading(true);
                  setError(null);
                  QuranApiService.getSurahList()
                    .then((data) => {
                      setSurahs(data);
                      setIsLoading(false);
                    })
                    .catch((err) => {
                      setError(err.message);
                      setIsLoading(false);
                    });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-[#0EAAFC] text-white hover:bg-[#0877B9] cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Coba Lagi</span>
              </button>
            </div>
          ) : filteredSurahs.length === 0 ? (
            <div className="py-16 text-center text-[var(--text-muted)] bg-[var(--bg-card)] rounded-3xl border border-[var(--border-main)] p-8">
              <p className="text-sm font-semibold text-[var(--text-main)]">Tidak ada surat yang cocok</p>
              <p className="text-xs mt-1">Coba kata kunci lain atau ubah filter tempat turun surat.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('all');
                }}
                className="mt-3 text-xs font-semibold text-[#0EAAFC] hover:underline cursor-pointer"
              >
                Reset Pencarian & Filter
              </button>
            </div>
          ) : (
            /* Grid of 114 Surahs */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredSurahs.map((surah) => {
                const isCurrentLastRead = lastRead?.surahNomor === surah.nomor;

                return (
                  <div
                    key={surah.nomor}
                    onClick={() => onSelectSurah(surah.nomor, 1)}
                    className={`p-4 rounded-2xl border bg-[var(--bg-card)] card-interactive cursor-pointer group flex items-center justify-between gap-3 active:scale-[0.985] shadow-xs ${
                      isCurrentLastRead
                        ? 'border-[#0EAAFC] ring-2 ring-[#0EAAFC]/30 shadow-md'
                        : 'border-[var(--border-main)] hover:border-[#0EAAFC]/60'
                    }`}
                  >
                    {/* Left: Number + Details */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs font-mono tabular-nums shrink-0 transition-colors ${
                          isCurrentLastRead
                            ? 'bg-[#0EAAFC] text-white shadow-xs'
                            : 'bg-[var(--badge-blue-bg)] text-[#0877B9] group-hover:bg-[#0EAAFC] group-hover:text-white'
                        }`}
                      >
                        {surah.nomor}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-[var(--text-main)] group-hover:text-[#0EAAFC] transition-colors truncate">
                            {surah.namaLatin}
                          </h3>
                          {isCurrentLastRead && (
                            <span className="text-[9px] text-[#0877B9] bg-[var(--badge-blue-bg)] px-1.5 py-0.5 rounded-full font-bold shrink-0">
                              Terakhir Dibaca
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mt-0.5 truncate">
                          <span>{surah.arti}</span>
                          <span>·</span>
                          <span>{surah.jumlahAyat} ayat</span>
                          <span>·</span>
                          <span className="text-[11px] text-slate-400">{surah.tempatTurun}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Arabic Name + Audio Play Trigger */}
                    <div className="flex flex-col items-end shrink-0 pl-2">
                      <span
                        lang="ar"
                        dir="rtl"
                        className="font-arabic text-base sm:text-lg text-[var(--text-main)] leading-tight"
                      >
                        {surah.nama}
                      </span>

                      <button
                        onClick={(e) => handlePlayFull(e, surah)}
                        className="mt-1 p-1.5 rounded-lg text-slate-400 hover:text-[#0EAAFC] hover:bg-[var(--badge-blue-bg)] transition-colors cursor-pointer active:scale-90"
                        title={`Putar audio murottal ${surah.namaLatin}`}
                        aria-label={`Putar audio murottal ${surah.namaLatin}`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Content State: JUZ TAB */}
      {activeTab === 'juz' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredJuz.map((juzItem) => (
            <div
              key={juzItem.juz}
              onClick={() => onSelectSurah(juzItem.startSurah, juzItem.startAyat)}
              className="p-5 rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] card-interactive hover:border-[#43B433]/70 hover:shadow-md cursor-pointer group flex flex-col justify-between space-y-3 active:scale-[0.985] shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-[#EAF8E8] text-[#228B22] font-bold text-xs flex items-center justify-center font-mono">
                      {juzItem.juz}
                    </span>
                    <h3 className="text-sm font-bold text-[var(--text-main)] group-hover:text-[#43B433] transition-colors">
                      Juz {juzItem.juz}
                    </h3>
                  </div>
                  <span
                    lang="ar"
                    dir="rtl"
                    className="font-arabic text-sm text-[#0877B9]"
                  >
                    {juzItem.arabicName}
                  </span>
                </div>

                <p className="text-xs text-[var(--text-muted)] font-medium">
                  {juzItem.latinName}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                <div className="text-[11px] truncate pr-2">
                  <span>Mulai: <strong>{juzItem.startSurahName} : {juzItem.startAyat}</strong></span>
                  <span className="block text-slate-400">
                    s/d {juzItem.endSurahName} : {juzItem.endAyat}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-[#43B433] shrink-0 group-hover:translate-x-1 transition-transform">
                  Buka Juz →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
