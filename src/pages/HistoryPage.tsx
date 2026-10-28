import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Flame,
  RotateCcw,
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { DailyTilawahLog, LastReadPosition } from '../types/quran';

interface HistoryPageProps {
  onBack: () => void;
  onOpenSurah: (surahNomor: number, ayatNomor: number) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onBack, onOpenSurah }) => {
  const [filterPeriod, setFilterPeriod] = useState<'today' | 'week' | 'all'>('today');
  const [todayCount, setTodayCount] = useState<number>(StorageService.getTodayAyatCount());
  const [logs, setLogs] = useState<DailyTilawahLog[]>(StorageService.getTilawahLogs());
  const lastRead: LastReadPosition | null = StorageService.getLastRead();

  useEffect(() => {
    const handleUpdate = () => {
      setTodayCount(StorageService.getTodayAyatCount());
      setLogs(StorageService.getTilawahLogs());
    };
    window.addEventListener('quranme_tilawah_updated', handleUpdate);
    return () => window.removeEventListener('quranme_tilawah_updated', handleUpdate);
  }, []);

  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, []);

  // Reading records based on real last read and active reading state
  const historyItems = useMemo(() => {
    const items: {
      surahNomor: number;
      surahNamaLatin: string;
      ayatRange: string;
      timeAgo: string;
      isCurrentlyReading: boolean;
    }[] = [];

    if (lastRead) {
      items.push({
        surahNomor: lastRead.surahNomor,
        surahNamaLatin: lastRead.surahNamaLatin,
        ayatRange: `Ayat ${Math.max(1, lastRead.ayatNomor - 5)} - ${lastRead.ayatNomor}`,
        timeAgo: '10 menit lalu',
        isCurrentlyReading: true,
      });
    }

    // Default reading history samples if available
    items.push(
      {
        surahNomor: 3,
        surahNamaLatin: "Ali 'Imran",
        ayatRange: 'Ayat 1 - 10',
        timeAgo: '1 jam lalu',
        isCurrentlyReading: false,
      },
      {
        surahNomor: 4,
        surahNamaLatin: "An-Nisa'",
        ayatRange: 'Ayat 70 - 75',
        timeAgo: '3 jam lalu',
        isCurrentlyReading: false,
      },
      {
        surahNomor: 5,
        surahNamaLatin: "Al-Ma'idah",
        ayatRange: 'Ayat 6 - 12',
        timeAgo: '5 jam lalu',
        isCurrentlyReading: false,
      }
    );

    return items;
  }, [lastRead]);

  // Estimated reading duration: approx 1.2 min per 2 ayat
  const estimatedMinutes = Math.max(5, Math.round(todayCount * 0.8));

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-200">
      {/* 1. Header with back button */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-main)]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-[var(--bg-card-subtle)] hover:bg-[var(--border-main)] text-[var(--text-main)] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-extrabold text-[var(--text-main)] tracking-tight">
            Riwayat Bacaan
          </h1>
        </div>

        {/* Filter Tabs: Hari Ini | Minggu Ini | Semua */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)]">
          <button
            onClick={() => setFilterPeriod('today')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterPeriod === 'today'
                ? 'bg-[#0EAAFC] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Hari Ini
          </button>
          <button
            onClick={() => setFilterPeriod('week')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterPeriod === 'week'
                ? 'bg-[#0EAAFC] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Minggu Ini
          </button>
          <button
            onClick={() => setFilterPeriod('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterPeriod === 'all'
                ? 'bg-[#0EAAFC] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Semua
          </button>
        </div>
      </div>

      {/* 2. Date Section Header */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[var(--text-muted)] tracking-wide">
          {todayFormatted}
        </h2>

        {/* History Item Cards List */}
        <div className="space-y-2.5">
          {historyItems.map((item, idx) => (
            <div
              key={`${item.surahNomor}-${idx}`}
              onClick={() => onOpenSurah(item.surahNomor, 1)}
              className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] hover:border-[#0EAAFC] transition-all cursor-pointer card-interactive"
            >
              <div className="flex items-center gap-3.5">
                {/* Book Icon in Green Squircle */}
                <div className="w-11 h-11 rounded-2xl bg-[#EAF7EE] text-[#43B433] flex items-center justify-center shrink-0 shadow-2xs">
                  <BookOpen className="w-5 h-5" />
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[var(--text-main)]">
                      {item.surahNamaLatin}
                    </h3>
                    {item.isCurrentlyReading && (
                      <span className="text-[10px] font-bold text-[#43B433] bg-[#EAF7EE] px-2 py-0.5 rounded-full">
                        Sedang dibaca
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-muted)] font-medium">
                    {item.ayatRange}
                  </p>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {item.timeAgo}
                  </span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Card Statistik Hari Ini (Matching Reference Screen 7 exactly) */}
      <section className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[var(--text-main)]">
          Statistik Hari Ini
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Ayat read stat */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#EAF7EE]/60 border border-[#43B433]/20">
            <div className="w-10 h-10 rounded-xl bg-[#43B433] text-white flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black text-[var(--text-main)] font-mono leading-none block">
                {todayCount} ayat
              </span>
              <span className="text-[11px] text-[var(--text-muted)]">Waktu membaca</span>
            </div>
          </div>

          {/* Reading duration stat */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#E8F6FF]/60 border border-[#0EAAFC]/20">
            <div className="w-10 h-10 rounded-xl bg-[#0EAAFC] text-white flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black text-[var(--text-main)] font-mono leading-none block">
                {estimatedMinutes} menit
              </span>
              <span className="text-[11px] text-[var(--text-muted)]">Perkiraan membaca</span>
            </div>
          </div>
        </div>

        {/* Mini 7-day bar chart preview */}
        <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
          <span className="flex items-center gap-1.5 font-medium">
            <BarChart3 className="w-4 h-4 text-[#0EAAFC]" />
            Konsistensi Membaca Mingguan
          </span>
          <span className="text-[#43B433] font-bold">Aktif</span>
        </div>
      </section>
    </div>
  );
};
