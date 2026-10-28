import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Bell,
  Bookmark,
  BookOpen,
  ChevronRight,
  Clock,
  Compass,
  Headphones,
  Pause,
  Play,
  Search,
  Sparkles,
  Target,
  User,
  Volume2,
} from 'lucide-react';
import {
  IslamicCornerMotif,
  MosqueSilhouette,
  RehalQuranIllustration,
  TilawahProgressGauge,
} from '../components/common/IslamicOrnaments';
import { PageId } from '../components/layout/Header';
import { BRAND_IDENTITY } from '../config/appConfig';
import { audioService } from '../services/audioService';
import { authService, UserProfile } from '../services/authService';
import { StorageService } from '../services/storageService';
import { LastReadPosition, UserSettings } from '../types/quran';

interface HomePageProps {
  onNavigate: (page: PageId, surahNomor?: number, ayatNomor?: number) => void;
  settings: UserSettings;
  onOpenThemeModal?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, settings, onOpenThemeModal }) => {
  const lastRead: LastReadPosition | null = StorageService.getLastRead();
  const [todayAyatCount, setTodayAyatCount] = useState<number>(StorageService.getTodayAyatCount());
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(audioService.state.isPlaying);
  const [user, setUser] = useState<UserProfile | null>(authService.getCurrentUser());
  const dailyTarget = settings.dailyTargetAyat || 20;

  // Sync Tilawah Progress across tabs and reader
  useEffect(() => {
    const handleUpdate = () => {
      setTodayAyatCount(StorageService.getTodayAyatCount());
    };
    window.addEventListener('quranme_tilawah_updated', handleUpdate);
    return () => window.removeEventListener('quranme_tilawah_updated', handleUpdate);
  }, []);

  // Sync auth state
  useEffect(() => {
    return authService.subscribe((u) => {
      setUser(u);
    });
  }, []);

  // Sync audio play state
  useEffect(() => {
    return audioService.subscribe((state) => {
      setIsPlayingAudio(state.isPlaying);
    });
  }, []);

  // Derived tilawah statistics
  const sisaAyat = Math.max(0, dailyTarget - todayAyatCount);
  const percentage = Math.min(100, Math.round((todayAyatCount / dailyTarget) * 100));

  // Contextual Greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 3 && hour < 11) return 'Selamat Pagi';
    if (hour >= 11 && hour < 15) return 'Selamat Siang';
    if (hour >= 15 && hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  }, []);

  const displayName = user?.nama || user?.name || 'Ahmad';

  const handleToggleMurottal = () => {
    if (audioService.state.surahNomor) {
      audioService.togglePlay();
    } else {
      // Default to Al-Baqarah 185 or last read
      const surahNum = lastRead ? lastRead.surahNomor : 2;
      const surahName = lastRead ? lastRead.surahNamaLatin : 'Al-Baqarah';
      audioService.playFullSurah(surahNum, surahName);
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* 1. Top Header: Assalamu'alaikum Greeting + Mosque Silhouette */}
      <div className="relative overflow-hidden rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6 sm:p-7 shadow-xs">
        {/* Subtle Mosque Silhouette Backdrop */}
        <div className="absolute right-3 -bottom-2 text-[#0EAAFC] pointer-events-none opacity-20">
          <MosqueSilhouette className="w-40 h-24 text-[#0EAAFC]" opacity={1} />
        </div>

        <div className="flex items-center justify-between relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#0EAAFC] tracking-wide">
                {greeting}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#43B433]" />
              <span className="text-xs text-[var(--text-muted)]">{displayName}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
              Assalamu'alaikum, {displayName}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium">
              Semoga hari ini penuh keberkahan
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('profile')}
              className="w-11 h-11 rounded-2xl bg-[var(--bg-card-subtle)] hover:bg-[var(--border-main)] text-[var(--text-muted)] hover:text-[#0EAAFC] flex items-center justify-center transition-all cursor-pointer border border-[var(--border-main)] hover:border-[#0EAAFC]/50 group"
              title="Profil & Pengaturan Akun"
              aria-label="Buka Profil Pengguna"
            >
              <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Hero Card: "Lanjutkan Membaca" (Matching Reference Screen 1) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0EAAFC] via-[#38BDF8] to-[#43B433] p-6 sm:p-8 text-white shadow-lg card-interactive">
        {/* Islamic Decorative Glow and Pattern */}
        <div className="absolute -right-8 -bottom-8 pointer-events-none opacity-30">
          <IslamicCornerMotif className="w-48 h-48 text-white" opacity={1} />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-md">
            <span className="text-xs font-bold text-white/80 uppercase tracking-wider block">
              Lanjutkan Membaca
            </span>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              {lastRead ? `${lastRead.surahNamaLatin} · Ayat ${lastRead.ayatNomor}` : 'Al-Baqarah · Ayat 185'}
            </h2>

            <div className="pt-2">
              <button
                onClick={() =>
                  onNavigate('reader', lastRead?.surahNomor || 2, lastRead?.ayatNomor || 185)
                }
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#43B433] hover:bg-[#349b26] text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer border border-white/30"
              >
                <span>Lanjutkan</span>
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>

          {/* Rehal Illustration with glowing bookstand */}
          <div className="shrink-0 self-end sm:self-center drop-shadow-md">
            <RehalQuranIllustration className="w-32 h-28 sm:w-36 h-32" />
          </div>
        </div>
      </section>

      {/* 3. Card: "Target Tilawah Hari Ini" (Matching Reference Screen 1) */}
      <section
        onClick={() => onNavigate('history')}
        className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6 sm:p-7 shadow-xs cursor-pointer card-interactive hover:border-[#43B433]/50 transition-all"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#43B433]" />
            <h3 className="text-base font-bold text-[var(--text-main)]">
              Target Tilawah Hari Ini
            </h3>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center pt-5">
          {/* Circular Gauge */}
          <div className="sm:col-span-5 flex justify-center sm:justify-start">
            <TilawahProgressGauge
              current={todayAyatCount}
              target={dailyTarget}
              size={120}
              strokeWidth={11}
            />
          </div>

          {/* Breakdown Stats */}
          <div className="sm:col-span-7 grid grid-cols-3 gap-3">
            {/* Stat 1: Ayat Dibaca */}
            <div className="flex flex-col items-center sm:items-start p-3 rounded-2xl bg-[#EAF7EE] border border-[#43B433]/20 text-center sm:text-left">
              <span className="text-sm font-extrabold text-[#43B433] font-mono leading-none">
                {todayAyatCount} ayat
              </span>
              <span className="text-[11px] text-[var(--text-muted)] mt-1 font-medium">
                Dibaca
              </span>
            </div>

            {/* Stat 2: Sisa Ayat */}
            <div className="flex flex-col items-center sm:items-start p-3 rounded-2xl bg-[#FFF5EB] dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-center sm:text-left">
              <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400 font-mono leading-none">
                {sisaAyat} ayat
              </span>
              <span className="text-[11px] text-[var(--text-muted)] mt-1 font-medium">
                Sisa
              </span>
            </div>

            {/* Stat 3: Persentase Selesai */}
            <div className="flex flex-col items-center sm:items-start p-3 rounded-2xl bg-[#E8F6FF] border border-[#0EAAFC]/20 text-center sm:text-left">
              <span className="text-sm font-extrabold text-[#0EAAFC] font-mono leading-none">
                {percentage}%
              </span>
              <span className="text-[11px] text-[var(--text-muted)] mt-1 font-medium">
                Target
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Quick Action Grid: 4 Squircle Pastel Cards (Surat, Cari, Bookmark, Audio) */}
      <section className="grid grid-cols-4 gap-3 sm:gap-4">
        {/* Button 1: Surat */}
        <button
          onClick={() => onNavigate('surah-list')}
          className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] hover:border-[#0EAAFC] transition-all card-interactive group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#E8F6FF] text-[#0EAAFC] flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
            <BookOpen className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-[var(--text-main)]">Surat</span>
        </button>

        {/* Button 2: Cari */}
        <button
          onClick={() => onNavigate('search')}
          className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] hover:border-[#0EAAFC] transition-all card-interactive group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#D8F7F1] text-[#0877B9] flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
            <Search className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-[var(--text-main)]">Cari</span>
        </button>

        {/* Button 3: Bookmark */}
        <button
          onClick={() => onNavigate('bookmarks')}
          className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] hover:border-[#43B433] transition-all card-interactive group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#DDF5E5] text-[#43B433] flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
            <Bookmark className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-[var(--text-main)]">Bookmark</span>
        </button>

        {/* Button 4: Audio / Murottal */}
        <button
          onClick={() => onNavigate('murottal')}
          className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] hover:border-[#43B433] transition-all card-interactive group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#DDF3FF] text-[#0EAAFC] flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
            <Volume2 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-[var(--text-main)]">Audio</span>
        </button>
      </section>

      {/* 5. Card: "Lanjutkan Murottal" (Matching Reference Screen 1) */}
      <section className="flex items-center justify-between p-4 sm:p-5 rounded-3xl bg-[#EAF7EE]/70 dark:bg-emerald-950/20 border border-[#43B433]/30 shadow-xs card-interactive">
        <div
          onClick={() => onNavigate('murottal')}
          className="flex items-center gap-3.5 cursor-pointer flex-1"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#43B433] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Headphones className="w-5 h-5" />
          </div>

          <div>
            <span className="text-xs font-bold text-[var(--text-main)] block">
              Lanjutkan Murottal
            </span>
            <span className="text-[11px] text-[var(--text-muted)] font-medium">
              {lastRead ? `${lastRead.surahNamaLatin} · Ayat ${lastRead.ayatNomor}` : 'Al-Baqarah · Ayat 185'}
            </span>
          </div>
        </div>

        {/* Circular Green Play Button */}
        <button
          type="button"
          onClick={handleToggleMurottal}
          className="w-11 h-11 rounded-full bg-[#43B433] hover:bg-[#349b26] text-white flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
          aria-label={isPlayingAudio ? 'Jeda Murottal' : 'Putar Murottal'}
        >
          {isPlayingAudio ? (
            <Pause className="w-5 h-5 fill-white" />
          ) : (
            <Play className="w-5 h-5 fill-white ml-0.5" />
          )}
        </button>
      </section>
    </div>
  );
};
