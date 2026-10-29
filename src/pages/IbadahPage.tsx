import React, { useEffect, useState } from 'react';
import {
  Bell,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Copy,
  MapPin,
  Music,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Star,
  Volume2,
} from 'lucide-react';
import { MosqueSilhouette } from '../components/common/IslamicOrnaments';
import { toast } from '../components/common/Toast';
import { DAILY_DUAS, DuaItem } from '../data/duaData';
import {
  azanAudioService,
  AZAN_AUDIO_OPTIONS,
  AzanAudioOption,
  AzanPlayerState,
  PrayerNotifSetting,
} from '../services/azanAudioService';
import {
  HijriDate,
  HijriService,
  IslamicHoliday,
} from '../services/hijriService';
import {
  INDONESIAN_CITIES,
  PrayerCity,
  PrayerSchedule,
  PrayerTimeService,
} from '../services/prayerTimeService';

interface IbadahPageProps {
  onBack?: () => void;
}

const TASBIH_KEY = 'quranme_tasbih_count_v2';

export const IbadahPage: React.FC<IbadahPageProps> = () => {
  const [activeTab, setActiveTab] = useState<'jadwal' | 'kalender' | 'doa'>('jadwal');
  const [schedule, setSchedule] = useState<PrayerSchedule>(PrayerTimeService.getSchedule());
  const [selectedCity, setSelectedCity] = useState<PrayerCity>(() =>
    PrayerTimeService.getSelectedCity()
  );
  const [showCityPicker, setShowCityPicker] = useState<boolean>(false);

  // Azan Audio & Notif Settings
  const [selectedAzanId, setSelectedAzanId] = useState<string>(() =>
    azanAudioService.getSelectedAudioId()
  );
  const [azanState, setAzanState] = useState<AzanPlayerState>({
    currentPlayingId: null,
    isPlaying: false,
    isLoading: false,
    currentTime: 0,
    duration: 0,
    volume: 0.85,
    isBoosted: true,
    errorMessage: null,
  });
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [prayerNotifs, setPrayerNotifs] = useState<Record<string, PrayerNotifSetting>>(() =>
    azanAudioService.getPrayerSettings()
  );
  const [showAudioMenu, setShowAudioMenu] = useState<boolean>(false);

  // Hijri Date & Holidays
  const [hijriToday, setHijriToday] = useState<HijriDate>(() => HijriService.gregorianToHijri());
  const [holidays, setHolidays] = useState<IslamicHoliday[]>(() =>
    HijriService.getIslamicHolidays()
  );
  const [holidayReminders, setHolidayReminders] = useState<Record<string, boolean>>(() =>
    HijriService.getReminderPreferences()
  );

  // Countdown timer in seconds
  const [countdown, setCountdown] = useState<number>(schedule.countdownSeconds);

  // Tasbih
  const [tasbihCount, setTasbihCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(TASBIH_KEY);
      return saved ? parseInt(saved, 10) : 33;
    } catch {
      return 33;
    }
  });

  // Duas
  const [activeDuaIndex, setActiveDuaIndex] = useState<number>(0);
  const [copiedDua, setCopiedDua] = useState(false);

  // Sync Azan audio play state
  useEffect(() => {
    return azanAudioService.subscribe((state) => {
      setAzanState(state);
      setPlayingAudioId(state.currentPlayingId);
    });
  }, []);

  // Update schedule every 30 seconds and tick countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          const fresh = PrayerTimeService.getSchedule(new Date(), selectedCity);
          setSchedule(fresh);
          return fresh.countdownSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedCity]);

  const handleSelectCity = (city: PrayerCity) => {
    setSelectedCity(city);
    PrayerTimeService.setSelectedCity(city.id);
    const updated = PrayerTimeService.getSchedule(new Date(), city);
    setSchedule(updated);
    setCountdown(updated.countdownSeconds);
    setShowCityPicker(false);
    toast.show(`Lokasi diatur ke: ${city.name}`);
  };

  const handleTogglePrayerNotif = (prayerId: string) => {
    const current = prayerNotifs[prayerId];
    if (!current) return;
    const updated = {
      ...prayerNotifs,
      [prayerId]: {
        ...current,
        enabled: !current.enabled,
      },
    };
    setPrayerNotifs(updated);
    azanAudioService.savePrayerSettings(updated);
    toast.show(
      `Pengingat salat ${prayerId.toUpperCase()} ${
        !current.enabled ? 'diaktifkan' : 'dinonaktifkan'
      }`
    );
  };

  const handleSelectAzan = (option: AzanAudioOption) => {
    setSelectedAzanId(option.id);
    azanAudioService.setSelectedAudioId(option.id);
    toast.show(`Suara pengingat: ${option.name}`);
  };

  const handlePreviewAudio = (e: React.MouseEvent, option: AzanAudioOption) => {
    e.stopPropagation();
    azanAudioService.playPreview(option);
  };

  const handleToggleHolidayReminder = (holId: string) => {
    const newState = HijriService.toggleReminder(holId);
    setHolidayReminders({ ...holidayReminders, [holId]: newState });
    toast.show(`Pengingat hari besar ${newState ? 'diaktifkan' : 'dinonaktifkan'}`);
  };

  const handleIncrementTasbih = () => {
    const next = tasbihCount + 1;
    setTasbihCount(next);
    try {
      localStorage.setItem(TASBIH_KEY, next.toString());
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(25);
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
    toast.show('Doa berhasil disalin ke papan klip');
    setTimeout(() => setCopiedDua(false), 2000);
  };

  // Format countdown seconds into HH:MM:SS
  const formatCountdown = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-28 animate-in fade-in duration-200">
      {/* 1. Header with Islamic Arch and Tab Selector */}
      <div className="relative overflow-hidden rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 relative z-10">
          <h1 className="text-2xl font-black text-[var(--text-main)] tracking-tight">
            Ibadah
          </h1>
          <p className="text-xs text-[var(--text-muted)] font-medium">
            Jadwal salat, azan pengingat, kalender Hijriah & doa harian
          </p>
        </div>

        {/* Tab Pills: Jadwal Salat | Kalender Hijriah | Doa & Tasbih */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] relative z-10 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('jadwal')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'jadwal'
                ? 'bg-[#0EAAFC] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Jadwal Salat
          </button>
          <button
            onClick={() => setActiveTab('kalender')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'kalender'
                ? 'bg-[#0EAAFC] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Kalender Hijriah
          </button>
          <button
            onClick={() => setActiveTab('doa')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'doa'
                ? 'bg-[#0EAAFC] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Doa & Tasbih
          </button>
        </div>

        <div className="absolute right-0 bottom-0 text-[#0EAAFC] pointer-events-none opacity-15">
          <MosqueSilhouette className="w-36 h-24 text-[#0EAAFC]" opacity={1} />
        </div>
      </div>

      {/* =========================================================================
       * TAB 1: JADWAL & PENGINGAT SALAT REAL-TIME
       * ========================================================================= */}
      {activeTab === 'jadwal' && (
        <div className="space-y-6">
          {/* Card: Live Next Prayer Countdown & City Selector */}
          <section className="rounded-3xl bg-gradient-to-r from-[#0EAAFC]/15 via-[#BFE8FF]/25 to-[#43B433]/15 border border-[#0EAAFC]/30 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#43B433] animate-ping" />
                <span className="text-xs font-bold text-[#0877B9] uppercase tracking-wider">
                  Salat Berikutnya: {schedule.nextPrayer.name}
                </span>
              </div>

              {/* City Selector Button */}
              <button
                onClick={() => setShowCityPicker(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-main)] text-xs font-bold text-[var(--text-main)] hover:border-[#0EAAFC] cursor-pointer shadow-2xs"
              >
                <MapPin className="w-3.5 h-3.5 text-[#0EAAFC]" />
                <span>{selectedCity.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
              <div>
                <div className="text-3xl sm:text-5xl font-black text-[var(--text-main)] font-mono tracking-tight">
                  {formatCountdown(countdown)}
                </div>
                <span className="text-xs text-[var(--text-muted)] mt-1 block">
                  Pukul {schedule.nextPrayer.time} {selectedCity.zoneName} · {schedule.dateFormatted}
                </span>
              </div>

              {/* Azan Sound Trigger Button */}
              <button
                onClick={() => setShowAudioMenu(!showAudioMenu)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[var(--bg-card)] border border-[#43B433]/40 text-xs font-bold text-[var(--text-main)] hover:bg-[#EAF7EE] transition-colors shadow-2xs cursor-pointer self-start sm:self-auto"
              >
                <Volume2 className="w-4 h-4 text-[#43B433]" />
                <span>Atur Suara Azan</span>
              </button>
            </div>
          </section>

          {/* Azan Sound Selection Drawer / Accordion */}
          {showAudioMenu && (
            <section className="rounded-3xl bg-[var(--bg-card)] border border-[#43B433]/40 p-6 shadow-xs space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <div>
                  <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                    <Music className="w-5 h-5 text-[#43B433]" />
                    <span>Pilihan Suara Pengingat & Rekaman Azan</span>
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Pemisahan tegas antara rekaman azan lengkap, nada notifikasi pendek, dan mode senyap.
                  </p>
                </div>
                <button
                  onClick={() => setShowAudioMenu(false)}
                  className="text-xs font-bold text-slate-400 hover:text-[var(--text-main)] cursor-pointer"
                >
                  Tutup
                </button>
              </div>

              {/* Error Banner if audio failed to load/play */}
              {azanState.errorMessage && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800 text-xs sm:text-sm text-amber-800 dark:text-amber-200 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="font-bold block">Pemberitahuan Audio:</span>
                  </div>
                  <p>{azanState.errorMessage}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        const opt = azanAudioService.getSelectedAudioOption();
                        azanAudioService.playPreview(opt);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer active:scale-95 transition-all shadow-xs"
                    >
                      Coba Putar Ulang
                    </button>
                    <button
                      onClick={() => azanAudioService.stop()}
                      className="px-3 py-1.5 rounded-xl bg-[var(--bg-card)] border border-amber-300 text-xs font-semibold text-[var(--text-main)] cursor-pointer"
                    >
                      Tutup Pesan
                    </button>
                  </div>
                </div>
              )}

              {/* Active Audio Playback Control Strip */}
              {azanState.isPlaying && (
                <div className="p-4 rounded-2xl bg-[#E8F6FF] dark:bg-sky-950/20 border border-[#0EAAFC]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#0EAAFC] text-white flex items-center justify-center animate-pulse shrink-0">
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[var(--text-main)] block">
                        Sedang Diputar: {AZAN_AUDIO_OPTIONS.find((o) => o.id === azanState.currentPlayingId)?.name || 'Audio'}
                      </span>
                      <span className="text-[11px] text-[#0877B9] font-mono">
                        {Math.floor(azanState.currentTime)} detik {azanState.duration > 0 ? `/ ${Math.floor(azanState.duration)} detik` : ''}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Volume Slider */}
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                      <span>Volume:</span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={azanState.volume}
                        onChange={(e) => azanAudioService.setVolume(parseFloat(e.target.value))}
                        className="w-20 accent-[#0EAAFC] cursor-pointer"
                        title="Pengaturan volume azan"
                      />
                    </div>

                    <button
                      onClick={() => azanAudioService.stop()}
                      className="px-3 py-1.5 rounded-xl bg-[#0EAAFC] hover:bg-[#0877B9] text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
                    >
                      Hentikan
                    </button>
                  </div>
                </div>
              )}

              {/* Category 1: Rekaman Lantunan Azan Lengkap */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0877B9] block px-1">
                  1. Rekaman Lantunan Azan Otentik
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AZAN_AUDIO_OPTIONS.filter((o) => o.category === 'indonesia' || o.category === 'international').map((opt) => {
                    const isSelected = selectedAzanId === opt.id;
                    const isPlayingThis = playingAudioId === opt.id;

                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelectAzan(opt)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                          isSelected
                            ? 'border-[#43B433] bg-[#EAF7EE]/50 shadow-xs ring-1 ring-[#43B433]/30'
                            : 'border-[var(--border-main)] hover:border-slate-300 bg-[var(--bg-card)]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-[var(--text-main)]">
                                {opt.name}
                              </span>
                              {isSelected && (
                                <CheckCircle2 className="w-4 h-4 text-[#43B433] shrink-0" />
                              )}
                            </div>
                            <span className="text-[11px] font-semibold text-[#0877B9] block">
                              {opt.reciterName}
                            </span>
                            <span className="text-[10px] text-[var(--text-muted)] font-mono block">
                              Durasi: {opt.durationApprox} · {opt.sourceName}
                            </span>
                          </div>

                          {/* Preview / Stop Button */}
                          <button
                            type="button"
                            onClick={(e) => handlePreviewAudio(e, opt)}
                            className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-2xs cursor-pointer ${
                              isPlayingThis
                                ? 'bg-[#43B433] text-white animate-pulse'
                                : 'bg-[var(--bg-card-subtle)] text-[#0EAAFC] hover:bg-[#0EAAFC] hover:text-white border border-[var(--border-subtle)]'
                            }`}
                            title={isPlayingThis ? 'Hentikan Pratinjau' : 'Dengarkan Rekaman Azan'}
                            aria-label={isPlayingThis ? 'Hentikan audio azan' : 'Dengarkan rekaman azan'}
                          >
                            {isPlayingThis ? (
                              <Pause className="w-4 h-4 fill-current" />
                            ) : (
                              <Play className="w-4 h-4 fill-current ml-0.5" />
                            )}
                          </button>
                        </div>

                        <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                          {opt.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category 2 & 3: Nada Notifikasi Pendek & Mode Senyap */}
              <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] block px-1">
                  2. Pilihan Lainnya (Bukan Rekaman Azan)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AZAN_AUDIO_OPTIONS.filter((o) => o.category === 'soft-chime' || o.category === 'silent').map((opt) => {
                    const isSelected = selectedAzanId === opt.id;
                    const isPlayingThis = playingAudioId === opt.id;

                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelectAzan(opt)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                          isSelected
                            ? 'border-[#0EAAFC] bg-[#E8F6FF]/50 shadow-xs'
                            : 'border-[var(--border-main)] hover:border-slate-300 bg-[var(--bg-card)]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-[var(--text-main)]">
                                {opt.name}
                              </span>
                              {isSelected && (
                                <CheckCircle2 className="w-4 h-4 text-[#0EAAFC] shrink-0" />
                              )}
                            </div>
                            <span className="text-[10px] text-[var(--text-muted)] font-mono block">
                              {opt.sourceName}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => handlePreviewAudio(e, opt)}
                            className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-2xs cursor-pointer ${
                              isPlayingThis
                                ? 'bg-[#0EAAFC] text-white animate-pulse'
                                : 'bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-subtle)]'
                            }`}
                            title={isPlayingThis ? 'Hentikan' : 'Tes Suara'}
                            aria-label="Tes suara"
                          >
                            {isPlayingThis ? (
                              <Pause className="w-4 h-4 fill-current" />
                            ) : (
                              <Play className="w-4 h-4 fill-current ml-0.5" />
                            )}
                          </button>
                        </div>

                        <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                          {opt.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Informative Platform Audio Notice */}
              <div className="p-3.5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] leading-relaxed space-y-1">
                <span className="font-bold text-[var(--text-main)] block">Keterbatasan Teknis Latar Belakang (Background Audio):</span>
                Pemutaran audio azan otomatis saat aplikasi diminimalkan atau layar mati dibatasi oleh kebijakan hemat daya peramban seluler (Mobile Web / PWA). Aplikasi akan selalu menampilkan notifikasi pengingat, dan Anda dapat menekan notifikasi tersebut untuk langsung membuka aplikasi dan mengumandangkan azan.
              </div>
            </section>
          )}

          {/* 5 Prayer Columns Card with Reminder Toggle */}
          <section className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#0EAAFC]" />
                Jadwal Salat Harian
              </h2>
              <span className="text-xs text-[var(--text-muted)]">
                Metode Resmi Kemenag RI (Subuh 20°, Isya 18°)
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2 sm:gap-3 pt-2">
              {schedule.times.map((prayer) => {
                const isHighlighted = prayer.isActive;
                const notif = prayerNotifs[prayer.id];

                return (
                  <div
                    key={prayer.id}
                    className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl transition-all text-center relative ${
                      isHighlighted
                        ? 'bg-gradient-to-b from-[#43B433] to-[#2E8B22] text-white shadow-md scale-102 ring-2 ring-emerald-300/40'
                        : prayer.isUpcoming
                        ? 'bg-[#EAF7EE] text-[#2E8B22] border border-[#43B433]/30'
                        : 'bg-[var(--bg-card-subtle)] text-[var(--text-main)] border border-[var(--border-subtle)]'
                    }`}
                  >
                    <span
                      className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 ${
                        isHighlighted ? 'text-emerald-100' : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {prayer.name}
                    </span>
                    <span className="text-sm sm:text-lg font-black font-mono tracking-tight">
                      {prayer.time}
                    </span>

                    {/* Toggle Reminder Bell */}
                    <button
                      type="button"
                      onClick={() => handleTogglePrayerNotif(prayer.id)}
                      className={`mt-2 p-1.5 rounded-full transition-colors cursor-pointer ${
                        notif?.enabled
                          ? isHighlighted
                            ? 'bg-white/20 text-white'
                            : 'bg-[#E8F6FF] text-[#0EAAFC]'
                          : 'text-slate-300 hover:text-slate-500'
                      }`}
                      title={notif?.enabled ? 'Pengingat aktif' : 'Pengingat nonaktif'}
                    >
                      <Bell
                        className={`w-3.5 h-3.5 ${notif?.enabled ? 'fill-current' : ''}`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* =========================================================================
       * TAB 2: KALENDER HIJRIAH & HARI BESAR ISLAM
       * ========================================================================= */}
      {activeTab === 'kalender' && (
        <div className="space-y-6">
          {/* Today's Hijri Banner */}
          <section className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6 shadow-xs flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0EAAFC]" />
                <span className="text-xs font-bold text-[#0EAAFC] uppercase tracking-wider">
                  Kalender Hijriah Hari Ini
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-main)]">
                {hijriToday.formatted}
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Kriteria Visibilitas Hilal MABIMS (Tinggi 3°, Elongasi 6.4°)
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#EAF7EE] border border-[#43B433]/30 text-xs font-bold text-[#228B22]">
              Tahun 1447 H
            </div>
          </section>

          {/* Islamic Holidays List */}
          <section className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                Daftar Hari Besar Islam & Pengingat
              </h3>
              <span className="text-xs text-[var(--text-muted)]">
                Tahun 1447 H - 1448 H
              </span>
            </div>

            <div className="space-y-3">
              {holidays.map((hol) => {
                const isReminderOn = holidayReminders[hol.id];

                return (
                  <div
                    key={hol.id}
                    className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-main)] hover:border-[#0EAAFC] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-[var(--text-main)]">
                          {hol.name}
                        </h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            hol.status === 'verified'
                              ? 'bg-[#EAF7EE] text-[#228B22]'
                              : hol.status === 'pending'
                              ? 'bg-amber-50 text-amber-600 border border-amber-200'
                              : 'bg-[#E8F6FF] text-[#0877B9]'
                          }`}
                        >
                          {hol.statusText}
                        </span>
                      </div>

                      <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                        {hol.description}
                      </p>

                      <span className="text-[11px] font-mono font-semibold text-[#0EAAFC] block pt-0.5">
                        Perkiraan Masehi: {hol.approxGregorianDate}
                      </span>
                    </div>

                    {/* Toggle Reminder */}
                    <button
                      type="button"
                      onClick={() => handleToggleHolidayReminder(hol.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer self-start sm:self-auto shrink-0 ${
                        isReminderOn
                          ? 'bg-[#EAF7EE] text-[#228B22] border border-[#43B433]/30'
                          : 'bg-white dark:bg-slate-800 text-[var(--text-muted)] border border-[var(--border-main)]'
                      }`}
                    >
                      <Bell className={`w-3.5 h-3.5 ${isReminderOn ? 'fill-current' : ''}`} />
                      <span>{isReminderOn ? 'Pengingat Aktif' : 'Aktifkan'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* =========================================================================
       * TAB 3: DOA HARIAN & TASBIH DIGITAL
       * ========================================================================= */}
      {activeTab === 'doa' && (
        <div className="space-y-6">
          {/* Card: Tasbih Digital Interaktif */}
          <section className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6 shadow-xs flex flex-col items-center justify-between space-y-4 text-center">
            <div className="flex items-center justify-between w-full">
              <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#43B433]" />
                Tasbih Digital
              </h3>
              <span className="text-[11px] font-semibold text-[#43B433] bg-[#EAF7EE] px-2.5 py-0.5 rounded-full">
                Target 33x / 99x
              </span>
            </div>

            <div className="py-2">
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
          </section>

          {/* Card: Doa Harian Ini */}
          <section className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6 sm:p-8 shadow-xs space-y-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
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
                onClick={() => setActiveDuaIndex((prev) => (prev + 1) % DAILY_DUAS.length)}
                className="text-xs font-semibold text-[#0EAAFC] hover:text-[#0877B9] flex items-center gap-1 cursor-pointer"
              >
                <span>Doa Lainnya &rsaquo;</span>
              </button>
            </div>

            <div className="space-y-4 text-center py-4">
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

            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
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
      )}

      {/* Modal / Dialog Pilihan Kota Manual */}
      {showCityPicker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-[var(--bg-card)] rounded-3xl border border-[var(--border-main)] shadow-2xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <div>
                <h3 className="text-lg font-bold text-[var(--text-main)]">Pilih Kota Wilayah</h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Jadwal salat dihitung otomatis sesuai koordinat kota
                </p>
              </div>
              <button
                onClick={() => setShowCityPicker(false)}
                className="w-8 h-8 rounded-full bg-[var(--bg-card-subtle)] hover:bg-[var(--border-main)] flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {INDONESIAN_CITIES.map((c) => {
                const isSelected = selectedCity.id === c.id;

                return (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCity(c)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#0EAAFC] bg-[#E8F6FF]/60 shadow-xs'
                        : 'border-[var(--border-subtle)] hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-[var(--text-main)] block">
                        {c.name}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">
                        Zona {c.zoneName} (UTC+{c.timezone})
                      </span>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-[#0EAAFC]" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
