import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Compass,
  ExternalLink,
  MapPin,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Star,
  Volume2,
  Check,
  Copy,
} from 'lucide-react';
import { MosqueSilhouette } from '../components/common/IslamicOrnaments';
import { DAILY_DUAS, DuaItem } from '../data/duaData';
import { PrayerSchedule, PrayerTimeService } from '../services/prayerTimeService';
import { toast } from '../components/common/Toast';

interface IbadahPageProps {
  onBack: () => void;
}

const TASBIH_KEY = 'quranme_tasbih_count_v1';

export const IbadahPage: React.FC<IbadahPageProps> = ({ onBack }) => {
  const [schedule, setSchedule] = useState<PrayerSchedule>(PrayerTimeService.getSchedule());
  const [tasbihCount, setTasbihCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(TASBIH_KEY);
      return saved ? parseInt(saved, 10) : 33;
    } catch {
      return 33;
    }
  });

  const [activeDuaIndex, setActiveDuaIndex] = useState<number>(0);
  const [copiedDua, setCopiedDua] = useState(false);
  const [compassHeading, setCompassHeading] = useState<number>(292);

  // Sync prayer schedule
  useEffect(() => {
    setSchedule(PrayerTimeService.getSchedule());
    const interval = setInterval(() => {
      setSchedule(PrayerTimeService.getSchedule());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Listen to device orientation for authentic compass if available
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) {
        setCompassHeading(Math.round(e.alpha));
      }
    };

    if (typeof window !== 'undefined') {
      const win = window as any;
      if ('ondeviceorientationabsolute' in win) {
        win.addEventListener('deviceorientationabsolute', handleOrientation);
      } else if ('DeviceOrientationEvent' in win) {
        win.addEventListener('deviceorientation', handleOrientation);
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        const win = window as any;
        win.removeEventListener('deviceorientationabsolute', handleOrientation);
        win.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  const handleIncrementTasbih = () => {
    const next = tasbihCount + 1;
    setTasbihCount(next);
    try {
      localStorage.setItem(TASBIH_KEY, next.toString());
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(20);
      }
    } catch {}
  };

  const handleResetTasbih = () => {
    setTasbihCount(0);
    try {
      localStorage.setItem(TASBIH_KEY, '0');
      toast.show('Hitungan tasbih direset', 'info');
    } catch {}
  };

  const currentDua: DuaItem = DAILY_DUAS[activeDuaIndex] || DAILY_DUAS[0];

  const handleCopyDua = () => {
    const text = `${currentDua.arabic}\n\n"${currentDua.translation}" (${currentDua.source}) - via QuranMe`;
    navigator.clipboard.writeText(text);
    setCopiedDua(true);
    toast.show('Doa berhasil disalin', 'success');
    setTimeout(() => setCopiedDua(false), 2000);
  };

  const handleNextDua = () => {
    setActiveDuaIndex((prev) => (prev + 1) % DAILY_DUAS.length);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* 1. Header with Islamic Arch and Mosque Silhouette */}
      <div className="relative overflow-hidden rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6 shadow-xs flex items-center justify-between">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-[var(--bg-card-subtle)] hover:bg-[var(--border-main)] text-[var(--text-main)] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Kembali ke Beranda"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-extrabold text-[var(--text-main)] tracking-tight">
              Ibadah & Doa
            </h1>
          </div>
          <p className="text-xs text-[var(--text-muted)] pl-12 font-medium">
            Jaga konsistensi, raih keberkahan
          </p>
        </div>

        {/* Decorative Mosque Silhouette on top-right */}
        <div className="absolute right-2 -bottom-2 text-[#0EAAFC] pointer-events-none">
          <MosqueSilhouette className="w-36 h-20 text-[#0EAAFC]" opacity={0.18} />
        </div>
      </div>

      {/* 2. Card Jadwal Shalat */}
      <section className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6 shadow-xs space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#43B433] animate-pulse" />
            <h2 className="text-base font-bold text-[var(--text-main)]">Jadwal Shalat</h2>
          </div>
          <span className="text-xs font-semibold text-[#0EAAFC] bg-[#E8F6FF] dark:bg-sky-950/40 px-3 py-1 rounded-full">
            {schedule.dateFormatted}
          </span>
        </div>

        {/* 5 Prayer Columns */}
        <div className="grid grid-cols-5 gap-2 pt-2">
          {schedule.times.map((prayer) => {
            const isHighlighted = prayer.isActive || prayer.isUpcoming;
            return (
              <div
                key={prayer.id}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all text-center ${
                  prayer.isActive
                    ? 'bg-gradient-to-b from-[#43B433] to-[#2E8B22] text-white shadow-md scale-102 ring-2 ring-emerald-300/40'
                    : prayer.isUpcoming
                    ? 'bg-[#EAF7EE] text-[#2E8B22] border border-[#43B433]/30'
                    : 'bg-[var(--bg-card-subtle)] text-[var(--text-main)] border border-[var(--border-subtle)]'
                }`}
              >
                <span
                  className={`text-[11px] font-semibold uppercase tracking-wider mb-1 ${
                    prayer.isActive ? 'text-emerald-100' : 'text-[var(--text-muted)]'
                  }`}
                >
                  {prayer.name}
                </span>
                <span className="text-sm sm:text-base font-extrabold tracking-tight font-mono">
                  {prayer.time}
                </span>
                {prayer.isActive && (
                  <span className="text-[9px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full mt-1.5 uppercase">
                    Aktif
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#0EAAFC]" />
            {schedule.city}
          </span>
          <span>Metode Kemenag RI</span>
        </div>
      </section>

      {/* 3. Two Half-Cards Row: Arah Kiblat & Tasbih Digital */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Card: Arah Kiblat */}
        <div className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#0EAAFC]" />
              Arah Kiblat
            </h3>
            <span className="text-[11px] font-semibold text-[var(--text-muted)]">
              Makkah: 292°
            </span>
          </div>

          {/* Compass Dial */}
          <div className="relative flex items-center justify-center py-4">
            <div className="w-36 h-36 rounded-full border-4 border-dashed border-[#BFE8FF] dark:border-sky-900/40 relative flex items-center justify-center shadow-inner">
              {/* Compass Cardinal Points */}
              <span className="absolute top-1 text-[10px] font-bold text-slate-400">U</span>
              <span className="absolute bottom-1 text-[10px] font-bold text-slate-400">S</span>
              <span className="absolute right-2 text-[10px] font-bold text-slate-400">T</span>
              <span className="absolute left-2 text-[10px] font-bold text-slate-400">B</span>

              {/* Kaaba Arrow Needle */}
              <div
                className="w-1.5 h-24 rounded-full bg-gradient-to-t from-transparent via-[#0EAAFC] to-[#43B433] relative flex items-start justify-center transition-transform duration-300"
                style={{ transform: `rotate(${292 - (compassHeading % 360)}deg)` }}
              >
                {/* Arrowhead pointing to Kaaba */}
                <div className="w-4 h-4 bg-[#43B433] rotate-45 -mt-2 rounded-xs shadow-md" />
              </div>

              {/* Center Pivot Point */}
              <div className="absolute w-5 h-5 rounded-full bg-white dark:bg-slate-800 border-2 border-[#43B433] shadow-xs flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#0EAAFC]" />
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-xl font-extrabold text-[var(--text-main)] font-mono">
              292° <span className="text-sm font-semibold text-[#0EAAFC]">Barat Daya</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
              Arahkan perangkat sejajar dengan jarum hijau
            </p>
          </div>
        </div>

        {/* Right Card: Tasbih Digital */}
        <div className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#43B433]" />
              Tasbih Digital
            </h3>
            <span className="text-[11px] font-semibold text-[#43B433] bg-[#EAF7EE] px-2.5 py-0.5 rounded-full">
              Target 33x
            </span>
          </div>

          {/* Interactive Tap Dial */}
          <div className="flex items-center justify-center py-2">
            <button
              type="button"
              onClick={handleIncrementTasbih}
              className="w-36 h-36 rounded-full bg-gradient-to-br from-[#E8F6FF] via-[#FEFEFE] to-[#EAF7EE] dark:from-slate-800 dark:via-slate-850 dark:to-emerald-950/30 border-4 border-[#0EAAFC]/30 hover:border-[#43B433] shadow-md flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-all select-none group"
              aria-label="Tekan untuk menambah hitungan tasbih"
            >
              <span className="text-4xl font-black text-[var(--text-main)] tracking-tight font-mono group-hover:text-[#43B433] transition-colors">
                {tasbihCount}
              </span>
              <span className="text-[11px] font-semibold text-[#0EAAFC] mt-1">
                Ketuk untuk Hitung
              </span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleResetTasbih}
              className="px-4 py-2 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--border-main)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. Card: Doa Harian Ini */}
      <section className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6 sm:p-8 shadow-xs space-y-5 relative overflow-hidden">
        {/* Background Subtle Gradient & Minaret */}
        <div className="absolute right-0 bottom-0 pointer-events-none opacity-10">
          <MosqueSilhouette className="w-48 h-32 text-[#43B433]" opacity={1} />
        </div>

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#EAF7EE] text-[#43B433] flex items-center justify-center">
              <Star className="w-4 h-4 fill-[#43B433]" />
            </span>
            <div>
              <h2 className="text-base font-bold text-[var(--text-main)]">
                {currentDua.title}
              </h2>
              <span className="text-xs text-[#0EAAFC] font-semibold">{currentDua.source}</span>
            </div>
          </div>

          <button
            onClick={handleNextDua}
            className="text-xs font-semibold text-[#0EAAFC] hover:text-[#0877B9] flex items-center gap-1 cursor-pointer"
          >
            <span>Doa Lainnya &rsaquo;</span>
          </button>
        </div>

        {/* Dua Content */}
        <div className="space-y-4 text-center py-4 relative z-10">
          <div
            dir="rtl"
            className="font-arabic text-2xl sm:text-3xl text-[var(--text-main)] font-semibold leading-loose text-center"
          >
            {currentDua.arabic}
          </div>

          <div className="text-xs sm:text-sm font-medium text-[#0877B9] italic">
            {currentDua.transliteration}
          </div>

          <div className="text-xs sm:text-sm text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed">
            "{currentDua.translation}"
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)] relative z-10">
          <span className="text-[11px] text-[var(--text-muted)]">
            Doa {activeDuaIndex + 1} dari {DAILY_DUAS.length}
          </span>
          <button
            onClick={handleCopyDua}
            className="px-4 py-2 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--border-main)] text-xs font-semibold text-[var(--text-main)] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedDua ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedDua ? 'Tersalin' : 'Salin Doa'}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
