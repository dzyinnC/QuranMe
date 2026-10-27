import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  BookMarked,
  BookOpen,
  Bookmark,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  Flame,
  Headphones,
  Layers,
  Music,
  Play,
  Search,
  Sparkles,
  Target,
  Volume2,
} from 'lucide-react';
import { BRAND_IDENTITY, INDONESIAN_QARI } from '../config/appConfig';
import { audioService } from '../services/audioService';
import { StorageService } from '../services/storageService';
import { LastReadPosition, UserSettings } from '../types/quran';
import { PageId } from '../components/layout/Header';

interface HomePageProps {
  onNavigate: (page: PageId, surahNomor?: number, ayatNomor?: number) => void;
  settings: UserSettings;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, settings }) => {
  const lastRead: LastReadPosition | null = StorageService.getLastRead();
  const lastAudio = audioService.state.lastPlayed;
  const bookmarks = StorageService.getBookmarks();
  const notesCount = Object.keys(StorageService.getNotes()).length;
  const [todayAyatCount, setTodayAyatCount] = useState<number>(StorageService.getTodayAyatCount());
  const dailyTarget = settings.dailyTargetAyat || 10;
  const targetProgress = Math.min(100, Math.round((todayAyatCount / dailyTarget) * 100));

  useEffect(() => {
    const handleUpdate = () => {
      setTodayAyatCount(StorageService.getTodayAyatCount());
    };
    window.addEventListener('quranme_tilawah_updated', handleUpdate);
    return () => window.removeEventListener('quranme_tilawah_updated', handleUpdate);
  }, []);

  // Contextual time greeting and date
  const [greeting, setGreeting] = useState('');
  const [currentDateFormatted, setCurrentDateFormatted] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 3 && hour < 6) setGreeting('Selamat Menjelang Subuh');
    else if (hour >= 6 && hour < 11) setGreeting('Selamat Pagi');
    else if (hour >= 11 && hour < 15) setGreeting('Selamat Siang');
    else if (hour >= 15 && hour < 18) setGreeting('Selamat Sore');
    else setGreeting('Selamat Malam');

    const now = new Date();
    setCurrentDateFormatted(
      now.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    );
  }, []);

  // 7-Day real reading activity graph data
  const weeklyData = useMemo(() => {
    const logs = StorageService.getTilawahLogs();
    const days: { label: string; date: string; count: number; isToday: boolean }[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      const found = logs.find((l) => l.date === iso);
      const dayName = d.toLocaleDateString('id-ID', { weekday: 'short' });
      days.push({
        label: dayName,
        date: iso,
        count: found ? found.ayatCount : 0,
        isToday: i === 0,
      });
    }
    return days;
  }, [todayAyatCount]);

  // Featured surahs with benefits
  const featuredSurahs = [
    { nomor: 1, name: 'Al-Fatihah', arti: 'Pembukaan', fadhilah: 'Ummul Qur\'an', ayat: 7 },
    { nomor: 18, name: 'Al-Kahf', arti: 'Gua', fadhilah: 'Sunnah Hari Jum\'at', ayat: 110 },
    { nomor: 36, name: 'Yasin', arti: 'Yasin', fadhilah: 'Jantung Al-Qur\'an', ayat: 83 },
    { nomor: 55, name: 'Ar-Rahman', arti: 'Maha Pemurah', fadhilah: 'Nikmat Allah', ayat: 78 },
    { nomor: 56, name: 'Al-Waqi\'ah', arti: 'Hari Kiamat', fadhilah: 'Kelapangan Rezeki', ayat: 96 },
    { nomor: 67, name: 'Al-Mulk', arti: 'Kerajaan', fadhilah: 'Pelindung Siksa Kubur', ayat: 30 },
  ];

  // Daily contemplative authentic Quranic verse
  const dailyVerse = {
    surahNomor: 2,
    surahNamaLatin: 'Al-Baqarah',
    ayatNomor: 286,
    teksArab: 'لَا يُكَلِّفُ اللّٰهُ نَفْسًا اِلَّا وُسْعَهَا ۗ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ',
    teksIndonesia: 'Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya. Dia mendapat (pahala) dari (kebajikan) yang dikerjakannya dan dia mendapat (siksa) dari (kejahatan) yang diperbuatnya.',
  };

  const handlePlayIndonesianQari = (qariId: string, surahNum: number, surahName: string) => {
    audioService.setQari(qariId);
    audioService.playFullSurah(surahNum, surahName, undefined, qariId);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
      {/* 1. Contextual Hero Welcome & Primary Navigation */}
      <section className="relative overflow-hidden rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6 sm:p-10 shadow-sm card-interactive">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0EAAFC] via-[#38BDF8] to-[#43B433]" />
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-[#0EAAFC] tracking-wide uppercase">
              {greeting}
            </span>
            <span className="text-xs text-slate-300">·</span>
            <span className="text-xs text-[var(--text-muted)] font-medium">
              {currentDateFormatted}
            </span>
            <span className="text-xs text-slate-300 hidden sm:inline">·</span>
            <span className="text-xs text-[#43B433] font-semibold hidden sm:inline">
              Al-Qur'an 30 Juz
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-main)] tracking-tight text-balance">
            {BRAND_IDENTITY.tagline}
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed max-w-2xl">
            {BRAND_IDENTITY.description}
          </p>

          {/* Action Buttons Row */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {lastRead ? (
              <button
                onClick={() => onNavigate('reader', lastRead.surahNomor, lastRead.ayatNomor)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#0EAAFC] hover:bg-[#0877B9] text-white text-xs sm:text-sm font-semibold transition-transform active:scale-95 shadow-md cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Lanjutkan: {lastRead.surahNamaLatin} (Ayat {lastRead.ayatNomor})</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>
            ) : (
              <button
                onClick={() => onNavigate('reader', 1, 1)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#0EAAFC] hover:bg-[#0877B9] text-white text-xs sm:text-sm font-semibold transition-transform active:scale-95 shadow-md cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Mulai Membaca Surat Al-Fatihah</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>
            )}

            <button
              onClick={() => onNavigate('surah-list')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)] border border-[var(--border-main)] text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer shadow-2xs"
            >
              <Compass className="w-4 h-4 text-[#0EAAFC]" />
              <span>Daftar 114 Surat & 30 Juz</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Highlights Row: Last Read + Tilawah Target + Lanjutkan Murottal */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1: Last Read Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] shadow-sm card-interactive flex flex-col justify-between hover:border-[#0EAAFC]/60 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[var(--text-muted)] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#0EAAFC]" />
                Posisi Terakhir Membaca
              </span>
              {lastRead && (
                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(lastRead.timestamp).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              )}
            </div>

            {lastRead ? (
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[var(--text-main)]">
                  {lastRead.surahNamaLatin}
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Ayat ke-<strong>{lastRead.ayatNomor}</strong> dari {lastRead.totalAyat} ayat
                </p>

                {/* Surah reading progress bar */}
                <div className="w-full bg-[var(--border-subtle)] h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-[#0EAAFC] h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, Math.round((lastRead.ayatNomor / lastRead.totalAyat) * 100))}%`,
                    }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 block text-right font-mono">
                  {Math.min(100, Math.round((lastRead.ayatNomor / lastRead.totalAyat) * 100))}% surat selesai
                </span>
              </div>
            ) : (
              <div className="py-3 text-[var(--text-muted)]">
                <p className="text-sm font-semibold text-[var(--text-main)]">Belum ada riwayat baca</p>
                <p className="text-xs mt-1 leading-relaxed">
                  Buka surat pilihan untuk mencatat otomatis posisi terakhir tilawah Anda.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[var(--border-subtle)] mt-3">
            <button
              onClick={() => onNavigate('reader', lastRead?.surahNomor || 1, lastRead?.ayatNomor || 1)}
              className="text-xs font-semibold text-[#0EAAFC] hover:text-[#0877B9] flex items-center gap-1 cursor-pointer active:scale-95 transition-transform"
            >
              <span>{lastRead ? 'Lanjutkan membaca' : 'Mulai dari awal'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Daily Tilawah Target */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] shadow-sm card-interactive flex flex-col justify-between hover:border-[#43B433]/60 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[var(--text-muted)] flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[#43B433]" />
                Target Tilawah Hari Ini
              </span>
              <span className="text-xs font-bold text-[#228B22] font-mono bg-[#EAF8E8] px-2 py-0.5 rounded-full border border-[#43B433]/20">
                {targetProgress}%
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[var(--text-main)] tabular-nums font-mono">
                  {todayAyatCount}
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  / {dailyTarget} ayat hari ini
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[var(--border-subtle)] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#43B433] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${targetProgress}%` }}
                />
              </div>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {targetProgress >= 100
                  ? 'Alhamdulillah! Target tilawah hari ini telah terpenuhi.'
                  : `Tersisa ${Math.max(0, dailyTarget - todayAyatCount)} ayat lagi untuk memenuhi target tilawah hari ini.`}
              </p>
              <span className="text-[10px] text-slate-400 block font-medium">
                ✓ Dihitung akurat berdasarkan ayat unik yang Anda selesaikan
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border-subtle)] mt-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('settings')}
                className="text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
              >
                Ubah Target
              </button>
              {todayAyatCount > 0 && (
                <button
                  onClick={() => {
                    StorageService.resetTilawahToday();
                  }}
                  className="text-slate-400 hover:text-red-500 cursor-pointer text-[11px]"
                  title="Reset hitungan ayat hari ini ke 0"
                >
                  Reset Hari Ini
                </button>
              )}
            </div>
            <span className="text-[#43B433] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
            </span>
          </div>
        </div>

        {/* Card 3: Lanjutkan Murottal / Audio History */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] shadow-sm card-interactive flex flex-col justify-between hover:border-[#0EAAFC]/60 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[var(--text-muted)] flex items-center gap-1.5">
                <Headphones className="w-4 h-4 text-[#0EAAFC]" />
                Lanjutkan Murottal
              </span>
              <span className="text-[10px] text-[#0877B9] bg-[var(--badge-blue-bg)] px-2 py-0.5 rounded-full font-bold">
                Audio Play
              </span>
            </div>

            {lastAudio ? (
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[var(--text-main)] truncate">
                  {lastAudio.surahNamaLatin}
                </h3>
                <p className="text-xs text-[var(--text-muted)] truncate">
                  Qari: <strong>{lastAudio.qariName}</strong>
                </p>
                <p className="text-[11px] text-slate-400">
                  {lastAudio.ayatNomor ? `Ayat ${lastAudio.ayatNomor}` : 'Surat Lengkap'} · Terakhir diputar
                </p>
              </div>
            ) : (
              <div className="py-2 text-[var(--text-muted)] space-y-1">
                <h3 className="text-sm font-semibold text-[var(--text-main)]">Murottal Berkualitas Tinggi</h3>
                <p className="text-xs leading-relaxed">
                  Pilih qari internasional atau 5 qari Indonesia untuk mendengarkan bacaan merdu Al-Qur'an.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[var(--border-subtle)] mt-3">
            {lastAudio ? (
              <button
                onClick={() =>
                  audioService.playFullSurah(
                    lastAudio.surahNomor,
                    lastAudio.surahNamaLatin,
                    undefined,
                    lastAudio.qariId
                  )
                }
                className="text-xs font-semibold text-[#0EAAFC] hover:text-[#0877B9] flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Putar Ulang {lastAudio.surahNamaLatin}</span>
              </button>
            ) : (
              <button
                onClick={() => audioService.playFullSurah(1, 'Al-Fatihah')}
                className="text-xs font-semibold text-[#0EAAFC] hover:text-[#0877B9] flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Putar Murottal Al-Fatihah</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 3. Real 7-Day Tilawah Habit Tracker Bar Chart */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] shadow-sm card-interactive space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-[var(--border-subtle)]">
          <div>
            <h2 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0EAAFC]" />
              <span>Aktivitas Tilawah 7 Hari Terakhir</span>
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Rekam jejak konsistensi membaca Al-Qur'an Anda di perangkat ini
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="text-[#0877B9] bg-[var(--badge-blue-bg)] px-2.5 py-1 rounded-xl">
              Total Hari Ini: {todayAyatCount} ayat
            </span>
          </div>
        </div>

        {/* 7-Day Bar Chart */}
        <div className="grid grid-cols-7 gap-2 pt-2">
          {weeklyData.map((d) => {
            const maxAyat = Math.max(dailyTarget, ...weeklyData.map((w) => w.count));
            const heightPercent = maxAyat > 0 ? Math.min(100, Math.round((d.count / maxAyat) * 100)) : 0;
            const isCompleted = d.count >= dailyTarget && d.count > 0;

            return (
              <div key={d.date} className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-mono tabular-nums">
                  {d.count > 0 ? `${d.count}` : '-'}
                </span>

                {/* Bar */}
                <div className="w-full max-w-[36px] h-24 bg-[var(--bg-card-subtle)] rounded-xl overflow-hidden flex flex-col justify-end p-0.5 border border-[var(--border-subtle)]">
                  <div
                    className={`w-full rounded-lg transition-all duration-300 ${
                      isCompleted
                        ? 'bg-[#43B433]'
                        : d.count > 0
                        ? 'bg-[#0EAAFC]'
                        : 'bg-transparent'
                    }`}
                    style={{ height: `${Math.max(4, heightPercent)}%` }}
                  />
                </div>

                <span
                  className={`text-[11px] font-medium ${
                    d.isToday ? 'text-[#0EAAFC] font-bold' : 'text-[var(--text-muted)]'
                  }`}
                >
                  {d.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Indonesian Qari Showcase Section (Min 5 Verified Reciters) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] shadow-sm card-interactive space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#43B433]" />
              <h2 className="text-lg font-bold text-[var(--text-main)]">Katalog Murottal Qari Indonesia</h2>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              5 Qari terkemuka Indonesia dengan sumber audio terverifikasi siap diputar
            </p>
          </div>
          <span className="text-[11px] font-bold text-[#228B22] bg-[#EAF8E8] px-3 py-1 rounded-full self-start sm:self-auto border border-[#43B433]/30">
            5 Qari Terverifikasi
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {INDONESIAN_QARI.map((qari) => (
            <div
              key={qari.id}
              className="p-4 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] hover:border-[#0EAAFC] hover:shadow-xs transition-all flex flex-col justify-between space-y-3 group card-interactive"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h3 className="text-sm font-bold text-[var(--text-main)] group-hover:text-[#0EAAFC] transition-colors truncate">
                    {qari.name}
                  </h3>
                  <span className="text-[10px] bg-[#EAF8E8] text-[#228B22] font-bold px-1.5 py-0.5 rounded shrink-0">
                    IDN
                  </span>
                </div>
                <p className="text-[11px] text-[#0877B9] font-medium">{qari.style}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1.5 line-clamp-2 leading-relaxed">
                  {qari.bio}
                </p>
              </div>

              <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400">
                  {qari.availableSurahs?.length || 0} Surat Tersedia
                </span>
                <button
                  onClick={() => {
                    const firstSurah = qari.availableSurahs?.[0] || 1;
                    const surahName = firstSurah === 1 ? 'Al-Fatihah' : firstSurah === 36 ? 'Yasin' : `Surat ke-${firstSurah}`;
                    handlePlayIndonesianQari(qari.id, firstSurah, surahName);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0EAAFC] hover:bg-[#0877B9] text-white font-semibold text-xs transition-transform active:scale-95 cursor-pointer shadow-xs"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Dengarkan</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Featured Surahs Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-main)]">Pilihan Surat & Waktu Utamanya</h2>
            <p className="text-xs text-[var(--text-muted)]">Surat-surat dengan fadhilah yang sering dibaca umat Islam</p>
          </div>
          <button
            onClick={() => onNavigate('surah-list')}
            className="text-xs font-semibold text-[#0EAAFC] hover:text-[#0877B9] flex items-center gap-1 cursor-pointer active:scale-95 transition-transform"
          >
            <span>Semua 114 Surat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {featuredSurahs.map((surah) => (
            <button
              key={surah.nomor}
              onClick={() => onNavigate('reader', surah.nomor, 1)}
              className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] hover:border-[#0EAAFC] hover:shadow-sm transition-all text-left flex flex-col justify-between group cursor-pointer active:scale-95 card-interactive"
            >
              <div>
                <span className="text-[11px] font-bold text-[#0EAAFC] font-mono">
                  {surah.nomor.toString().padStart(3, '0')}
                </span>
                <h4 className="text-sm font-bold text-[var(--text-main)] group-hover:text-[#0EAAFC] transition-colors mt-1">
                  {surah.name}
                </h4>
                <p className="text-xs text-[var(--text-muted)] truncate">{surah.arti}</p>
                <span className="mt-2 inline-block text-[10px] text-[#228B22] bg-[#EAF8E8] px-1.5 py-0.5 rounded font-medium truncate max-w-full">
                  {surah.fadhilah}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-[var(--border-subtle)]">
                {surah.ayat} ayat
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 6. Ayat Renungan Hari Ini (Authentic Verified Verse) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] shadow-sm card-interactive space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0EAAFC]" />
            <span className="text-xs font-bold text-[var(--text-main)]">Ayat Renungan Hari Ini</span>
          </div>
          <span className="text-xs font-semibold text-[#0877B9] font-mono bg-[var(--badge-blue-bg)] px-2.5 py-0.5 rounded-full">
            QS. {dailyVerse.surahNamaLatin} : {dailyVerse.ayatNomor}
          </span>
        </div>

        <div className="py-2">
          <p
            lang="ar"
            dir="rtl"
            className="font-arabic text-xl sm:text-2xl text-[var(--text-main)] text-right leading-loose"
          >
            {dailyVerse.teksArab}
          </p>
        </div>

        <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed italic">
          "{dailyVerse.teksIndonesia}"
        </p>

        <div className="pt-2 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400">Terjemahan Resmi Kementerian Agama RI</span>
          <button
            onClick={() => onNavigate('reader', dailyVerse.surahNomor, dailyVerse.ayatNomor)}
            className="font-semibold text-[#0EAAFC] hover:text-[#0877B9] flex items-center gap-1 cursor-pointer active:scale-95 transition-transform"
          >
            <span>Buka Ayat di Surah</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
