import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookMarked,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Headphones,
  HelpCircle,
  Info,
  ListFilter,
  Loader2,
  Play,
  RotateCcw,
  Sliders,
  Type,
  Volume2,
} from 'lucide-react';
import { ALL_QARI, INDONESIAN_QARI, INTERNATIONAL_QARI, QariSource } from '../config/appConfig';
import { AudioState, audioService } from '../services/audioService';
import { QuranApiService } from '../services/quranApi';
import { StorageService } from '../services/storageService';
import { AyatItem, SurahDetail, UserSettings } from '../types/quran';
import { AutoScrollController } from '../components/quran/AutoScrollController';
import { NoteModal } from '../components/quran/NoteModal';
import { TafsirModal } from '../components/quran/TafsirModal';
import { VerseCard } from '../components/quran/VerseCard';
import { toast } from '../components/common/Toast';

interface ReaderPageProps {
  surahNomor: number;
  initialAyatNomor?: number;
  onNavigateSurah: (nomor: number, ayatNomor?: number) => void;
  onBackToList: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
}

const BATCH_SIZE = 40;

export const ReaderPage: React.FC<ReaderPageProps> = ({
  surahNomor,
  initialAyatNomor = 1,
  onNavigateSurah,
  onBackToList,
  settings,
  onUpdateSettings,
}) => {
  const [surahDetail, setSurahDetail] = useState<SurahDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [showAppearanceMenu, setShowAppearanceMenu] = useState<boolean>(false);
  const [showQariMenu, setShowQariMenu] = useState<boolean>(false);

  // Progressive rendering limit for long surahs
  const [visibleCount, setVisibleCount] = useState<number>(BATCH_SIZE);

  // Active audio state
  const [audioState, setAudioState] = useState<AudioState>(audioService.state);

  // Modals
  const [tafsirAyat, setTafsirAyat] = useState<number | null>(null);
  const [noteAyat, setNoteAyat] = useState<number | null>(null);

  // Local state for bookmarks and notes
  const [bookmarkedSet, setBookmarkedSet] = useState<Set<number>>(new Set());
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [completedAyatSet, setCompletedAyatSet] = useState<Set<number>>(new Set());
  const lastRecordedAyatRef = useRef<number>(0);

  // Auto-scroll indicator
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(false);

  // Sync today's completed verses for this surah
  useEffect(() => {
    const syncCompleted = () => {
      const progress = StorageService.getTodayProgress();
      const currentSurahCompleted = new Set<number>();
      for (const id of progress.completedVerseIds) {
        const [sStr, aStr] = id.split(':');
        if (Number(sStr) === surahNomor) {
          currentSurahCompleted.add(Number(aStr));
        }
      }
      setCompletedAyatSet(currentSurahCompleted);
    };

    syncCompleted();
    window.addEventListener('quranme_tilawah_updated', syncCompleted);
    return () => window.removeEventListener('quranme_tilawah_updated', syncCompleted);
  }, [surahNomor]);

  const handleToggleCompletedAyat = useCallback(
    (ayatNomor: number) => {
      const res = StorageService.toggleAyatCompletedToday(surahNomor, ayatNomor);
      const target = settings.dailyTargetAyat || 10;
      if (res.isCompleted) {
        toast.show(`Ayat ${ayatNomor} selesai dibaca (${res.todayCount}/${target} hari ini)`);
      } else {
        toast.show(`Tanda selesai ayat ${ayatNomor} dicabut (${res.todayCount}/${target})`, 'info');
      }
    },
    [surahNomor, settings.dailyTargetAyat]
  );

  // Subscribe to audioService
  useEffect(() => {
    const unsub = audioService.subscribe((state) => {
      setAudioState(state);
    });
    return unsub;
  }, []);

  // Fetch surah data
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    // Initial visible count: ensure it covers initialAyatNomor
    const targetMin = Math.max(BATCH_SIZE, initialAyatNomor + 10);
    setVisibleCount(targetMin);

    // Refresh bookmarks & notes
    const allBookmarks = StorageService.getBookmarks();
    const currentSurahBookmarks = new Set(
      allBookmarks
        .filter((b) => b.surahNomor === surahNomor)
        .map((b) => b.ayatNomor)
    );
    setBookmarkedSet(currentSurahBookmarks);
    setNotesMap(StorageService.getNotes());

    QuranApiService.getSurahDetail(surahNomor)
      .then((data) => {
        if (isMounted) {
          setSurahDetail(data);
          setIsLoading(false);

          // Update last read position
          StorageService.setLastRead({
            surahNomor: data.nomor,
            surahNamaLatin: data.namaLatin,
            ayatNomor: initialAyatNomor || 1,
            timestamp: Date.now(),
            totalAyat: data.jumlahAyat,
          });

          // Jump to initial ayat if specified
          if (initialAyatNomor && initialAyatNomor > 1) {
            setTimeout(() => {
              const el = document.getElementById(`ayat-${initialAyatNomor}`);
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 250);
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Gagal memuat detail surat');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [surahNomor, initialAyatNomor]);

  // Progressive loading as user scrolls down
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!sentinelRef.current || !surahDetail) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(surahDetail.jumlahAyat, prev + BATCH_SIZE));
        }
      },
      { rootMargin: '400px' }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [surahDetail]);

  // Throttled passive scroll listener for recording reading position
  useEffect(() => {
    if (!surahDetail || isLoading) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const verseElements = document.querySelectorAll('[id^="ayat-"]');
          for (let i = 0; i < verseElements.length; i++) {
            const el = verseElements[i];
            const rect = el.getBoundingClientRect();
            if (rect.top >= 0 && rect.top <= window.innerHeight * 0.4) {
              const id = el.id.replace('ayat-', '');
              const currentAyat = parseInt(id, 10);
              if (currentAyat && currentAyat !== lastRecordedAyatRef.current) {
                lastRecordedAyatRef.current = currentAyat;
                StorageService.setLastRead({
                  surahNomor: surahDetail.nomor,
                  surahNamaLatin: surahDetail.namaLatin,
                  ayatNomor: currentAyat,
                  timestamp: Date.now(),
                  totalAyat: surahDetail.jumlahAyat,
                });
              }
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [surahDetail, isLoading]);

  const handleBookmarkToggle = useCallback(
    (verse: AyatItem) => {
      if (!surahDetail) return;
      const isNowBookmarked = StorageService.toggleBookmark({
        surahNomor: surahDetail.nomor,
        surahNamaLatin: surahDetail.namaLatin,
        ayatNomor: verse.nomorAyat,
        teksArab: verse.teksArab,
        teksIndonesia: verse.teksIndonesia,
      });

      setBookmarkedSet((prev) => {
        const next = new Set(prev);
        if (isNowBookmarked) {
          next.add(verse.nomorAyat);
        } else {
          next.delete(verse.nomorAyat);
        }
        return next;
      });
    },
    [surahDetail]
  );

  const handlePlayFullSurah = (targetQariId?: string) => {
    if (!surahDetail) return;
    audioService.playFullSurah(
      surahDetail.nomor,
      surahDetail.namaLatin,
      surahDetail.audioFull,
      targetQariId
    );
  };

  const handleJumpToAyat = (ayatNum: number) => {
    // If ayat is beyond currently visible batch, expand visible count first
    if (ayatNum > visibleCount) {
      setVisibleCount(Math.min(surahDetail?.jumlahAyat || ayatNum, ayatNum + 15));
    }
    setTimeout(() => {
      const el = document.getElementById(`ayat-${ayatNum}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const currentQari = ALL_QARI.find((q) => q.id === audioState.currentQari);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in duration-150">
      {/* Floating Auto-Scroll Controls */}
      <AutoScrollController onStatusChange={setIsAutoScrolling} />

      {/* Reader Top Sticky Bar */}
      <div className="flex items-center justify-between gap-3 bg-[var(--bg-card)] p-3.5 rounded-2xl border border-[var(--border-main)] card-interactive shadow-xs backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToList}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-subtle)] transition-colors cursor-pointer active:scale-95"
            title="Kembali ke Daftar Surat"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <h2 className="text-sm sm:text-base font-bold text-[var(--text-main)] flex items-center gap-2">
              <span>{surahDetail ? surahDetail.namaLatin : `Surat ke-${surahNomor}`}</span>
              {surahDetail && (
                <span className="text-xs font-normal text-[var(--text-muted)]">({surahDetail.arti})</span>
              )}
            </h2>
            {surahDetail && (
              <p className="text-[11px] text-[var(--text-muted)]">
                {surahDetail.tempatTurun} · {surahDetail.jumlahAyat} Ayat
              </p>
            )}
          </div>
        </div>

        {/* Quick Reader Controls */}
        <div className="flex items-center gap-1.5">
          {/* Jump to ayat selector */}
          {surahDetail && (
            <select
              aria-label="Pilih nomor ayat"
              onChange={(e) => handleJumpToAyat(Number(e.target.value))}
              className="text-xs bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] rounded-xl px-2.5 py-1.5 text-[var(--text-main)] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0EAAFC]"
              defaultValue={initialAyatNomor}
            >
              <option disabled value="">Pilih Ayat</option>
              {Array.from({ length: surahDetail.jumlahAyat }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  Ayat {num}
                </option>
              ))}
            </select>
          )}

          {/* Audio Qari & Full Surah Button */}
          {surahDetail && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowQariMenu(!showQariMenu);
                  setShowAppearanceMenu(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[var(--badge-blue-bg)] text-[#0877B9] hover:bg-[#0EAAFC] hover:text-white transition-all cursor-pointer active:scale-95 shadow-2xs"
                title="Pilih Qari & Putar Murottal"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Murottal</span>
              </button>

              {/* Qari Popover */}
              {showQariMenu && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl shadow-xl p-3 z-50 animate-in fade-in duration-100 backdrop-blur-md">
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                    <span className="text-xs font-bold text-[var(--text-main)]">Putar Murottal Surat:</span>
                    <button
                      onClick={() => setShowQariMenu(false)}
                      className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>

                  <div className="mt-2 space-y-1 max-h-56 overflow-y-auto">
                    <span className="text-[10px] font-bold text-[#228B22] px-2 block pt-1">
                      QARI INDONESIA
                    </span>
                    {INDONESIAN_QARI.map((q) => {
                      const isAvail = !q.availableSurahs || q.availableSurahs.includes(surahNomor);
                      return (
                        <button
                          key={q.id}
                          onClick={() => {
                            handlePlayFullSurah(q.id);
                            setShowQariMenu(false);
                          }}
                          className="w-full text-left p-2 rounded-xl text-xs hover:bg-[#EAF8E8] transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <div className="min-w-0 pr-2">
                            <span className="font-semibold text-[#202124] block truncate">
                              {q.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {isAvail ? 'Tersedia Surat Ini' : 'Surat Terpilih'}
                            </span>
                          </div>
                          <Play className="w-3.5 h-3.5 text-[#43B433] shrink-0 fill-current" />
                        </button>
                      );
                    })}

                    <span className="text-[10px] font-bold text-[#0877B9] px-2 block pt-2 border-t border-slate-100">
                      QARI INTERNASIONAL (PER AYAT)
                    </span>
                    {INTERNATIONAL_QARI.slice(0, 3).map((q) => (
                      <button
                        key={q.id}
                        onClick={() => {
                          handlePlayFullSurah(q.id);
                          setShowQariMenu(false);
                        }}
                        className="w-full text-left p-2 rounded-xl text-xs hover:bg-[#E8F6FF] transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <span className="font-semibold text-[#202124] truncate">{q.name}</span>
                        <Play className="w-3.5 h-3.5 text-[#0EAAFC] shrink-0 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Appearance & Font Settings Toggle */}
          <button
            onClick={() => {
              setShowAppearanceMenu(!showAppearanceMenu);
              setShowQariMenu(false);
            }}
            className="p-2 rounded-xl text-[#5F6368] hover:text-[#202124] hover:bg-slate-100 transition-colors cursor-pointer relative active:scale-95"
            title="Pengaturan Tampilan Teks"
          >
            <Type className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Appearance Menu Popover */}
      {showAppearanceMenu && (
        <div className="p-4 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-main)] shadow-lg space-y-4 text-xs animate-in fade-in duration-150 backdrop-blur-md">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
            <span className="font-bold text-[var(--text-main)]">Pengaturan Teks & Tampilan</span>
            <button
              onClick={() => setShowAppearanceMenu(false)}
              className="text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
            >
              Tutup
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Arabic Font Size */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[#5F6368]">
                <span>Ukuran Teks Arab</span>
                <span className="font-mono">{settings.arabicFontSize}px</span>
              </div>
              <input
                type="range"
                min="22"
                max="44"
                step="2"
                value={settings.arabicFontSize}
                onChange={(e) => onUpdateSettings({ arabicFontSize: Number(e.target.value) })}
                className="w-full accent-[#0EAAFC] cursor-pointer"
              />
            </div>

            {/* Translation Font Size */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[#5F6368]">
                <span>Ukuran Terjemahan</span>
                <span className="font-mono">{settings.translationFontSize}px</span>
              </div>
              <input
                type="range"
                min="13"
                max="22"
                step="1"
                value={settings.translationFontSize}
                onChange={(e) => onUpdateSettings({ translationFontSize: Number(e.target.value) })}
                className="w-full accent-[#0EAAFC] cursor-pointer"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-[#202124]">
              <input
                type="checkbox"
                checked={settings.showLatin}
                onChange={(e) => onUpdateSettings({ showLatin: e.target.checked })}
                className="rounded accent-[#0EAAFC]"
              />
              <span>Tampilkan Transliterasi Latin</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-[#202124]">
              <input
                type="checkbox"
                checked={settings.showTranslation}
                onChange={(e) => onUpdateSettings({ showTranslation: e.target.checked })}
                className="rounded accent-[#0EAAFC]"
              />
              <span>Tampilkan Terjemahan Indonesia</span>
            </label>
          </div>
        </div>
      )}

      {/* Main Reading View */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center text-[#5F6368] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#0EAAFC]" />
          <p className="text-xs">Memuat ayat-ayat suci Al-Qur'an...</p>
        </div>
      ) : error ? (
        <div className="py-16 flex flex-col items-center justify-center text-center gap-3 bg-[var(--bg-card)] p-8 rounded-3xl border border-[var(--border-main)]">
          <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl max-w-md">{error}</p>
          <button
            onClick={() => {
              setIsLoading(true);
              setError(null);
              QuranApiService.getSurahDetail(surahNomor)
                .then((data) => {
                  setSurahDetail(data);
                  setIsLoading(false);
                })
                .catch((err) => {
                  setError(err.message);
                  setIsLoading(false);
                });
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-[#0EAAFC] text-white hover:bg-[#0877B9] cursor-pointer active:scale-95 transition-transform"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Coba Lagi</span>
          </button>
        </div>
      ) : surahDetail ? (
        <div className="space-y-6">
          {/* Surah Header Card */}
          <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0EAAFC]/10 via-[var(--bg-card)] to-[#43B433]/10 border border-[var(--border-main)] text-center space-y-3 shadow-sm card-interactive">
            <span
              lang="ar"
              dir="rtl"
              className="font-arabic text-3xl sm:text-5xl text-[var(--text-main)] block leading-tight"
            >
              {surahDetail.nama}
            </span>

            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-main)]">
              {surahDetail.namaLatin}
            </h1>

            <div className="flex items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
              <span>Arti: {surahDetail.arti}</span>
              <span>·</span>
              <span>Diturunkan di {surahDetail.tempatTurun}</span>
              <span>·</span>
              <span>{surahDetail.jumlahAyat} Ayat</span>
            </div>

            {/* Expandable Surah Description */}
            <div className="pt-2">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="text-xs font-semibold text-[#0EAAFC] hover:underline flex items-center gap-1 mx-auto cursor-pointer active:scale-95"
              >
                <Info className="w-3.5 h-3.5" />
                <span>{showInfo ? 'Sembunyikan Deskripsi Surat' : 'Baca Deskripsi & Asbabun Nuzul'}</span>
              </button>

              {showInfo && (
                <div
                  className="mt-4 p-4 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] text-xs text-left text-[var(--text-muted)] leading-relaxed max-w-2xl mx-auto shadow-xs"
                  dangerouslySetInnerHTML={{
                    __html: surahDetail.deskripsi
                      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, ''),
                  }}
                />
              )}
            </div>

            {/* Bismillah */}
            {surahDetail.nomor !== 1 && surahDetail.nomor !== 9 && (
              <div className="pt-4 border-t border-[var(--border-subtle)] mt-4">
                <p
                  lang="ar"
                  dir="rtl"
                  className="font-arabic text-2xl sm:text-3xl text-[var(--text-main)] leading-relaxed"
                >
                  بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1 italic">
                  Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.
                </p>
              </div>
            )}
          </div>

          {/* Verses List with Windowed Progressive Rendering */}
          <div className="space-y-4">
            {surahDetail.ayat.slice(0, visibleCount).map((verse) => {
              const isCurrentlyPlaying =
                audioState.isPlaying &&
                audioState.surahNomor === surahDetail.nomor &&
                audioState.ayatNomor === verse.nomorAyat;

              const noteKey = `${surahDetail.nomor}-${verse.nomorAyat}`;
              const noteText = notesMap[noteKey] || '';

              return (
                <VerseCard
                  key={verse.nomorAyat}
                  surahNomor={surahDetail.nomor}
                  surahNamaLatin={surahDetail.namaLatin}
                  totalAyat={surahDetail.jumlahAyat}
                  verse={verse}
                  allVerses={surahDetail.ayat}
                  arabicFontSize={settings.arabicFontSize}
                  translationFontSize={settings.translationFontSize}
                  showLatin={settings.showLatin}
                  showTranslation={settings.showTranslation}
                  isBookmarked={bookmarkedSet.has(verse.nomorAyat)}
                  isCompletedToday={completedAyatSet.has(verse.nomorAyat)}
                  onBookmarkToggle={() => handleBookmarkToggle(verse)}
                  onToggleCompletedToday={() => handleToggleCompletedAyat(verse.nomorAyat)}
                  onOpenTafsir={(ayatNum) => setTafsirAyat(ayatNum)}
                  onOpenNote={(ayatNum) => setNoteAyat(ayatNum)}
                  noteText={noteText}
                  isPlaying={isCurrentlyPlaying}
                />
              );
            })}
          </div>

          {/* Sentinel for progressive infinite loading */}
          {visibleCount < surahDetail.jumlahAyat && (
            <div ref={sentinelRef} className="py-6 text-center text-xs text-[#5F6368]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0EAAFC]" />
                <span>Memuat ayat berikutnya ({visibleCount} dari {surahDetail.jumlahAyat} ayat)...</span>
              </span>
            </div>
          )}

          {/* Bottom Surah Navigation */}
          <div className="pt-6 border-t border-[var(--border-main)] flex items-center justify-between gap-4">
            {surahDetail.suratSebelumnya ? (
              <button
                onClick={() =>
                  onNavigateSurah(surahDetail.suratSebelumnya ? surahDetail.suratSebelumnya.nomor : 1)
                }
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] text-xs font-semibold text-[var(--text-main)] hover:border-[#0EAAFC] hover:text-[#0EAAFC] transition-all cursor-pointer active:scale-95 shadow-2xs card-interactive"
              >
                <ChevronLeft className="w-4 h-4" />
                <div className="text-left hidden sm:block">
                  <span className="block text-[10px] text-slate-400">Surat Sebelumnya</span>
                  <span>{surahDetail.suratSebelumnya.namaLatin}</span>
                </div>
                <span className="sm:hidden">Sebelumnya</span>
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={onBackToList}
              className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
            >
              Semua Surat
            </button>

            {surahDetail.suratSelanjutnya ? (
              <button
                onClick={() =>
                  onNavigateSurah(surahDetail.suratSelanjutnya ? surahDetail.suratSelanjutnya.nomor : 1)
                }
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-[var(--border-main)] bg-[var(--bg-card)] text-xs font-semibold text-[var(--text-main)] hover:border-[#0EAAFC] hover:text-[#0EAAFC] transition-all cursor-pointer active:scale-95 shadow-2xs card-interactive"
              >
                <div className="text-right hidden sm:block">
                  <span className="block text-[10px] text-slate-400">Surat Selanjutnya</span>
                  <span>{surahDetail.suratSelanjutnya.namaLatin}</span>
                </div>
                <span className="sm:hidden">Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      ) : null}

      {/* Tafsir Modal */}
      {surahDetail && (
        <TafsirModal
          surahNomor={surahDetail.nomor}
          surahNamaLatin={surahDetail.namaLatin}
          totalAyat={surahDetail.jumlahAyat}
          initialAyatNomor={tafsirAyat || 1}
          isOpen={tafsirAyat !== null}
          onClose={() => setTafsirAyat(null)}
        />
      )}

      {/* Note Modal */}
      {surahDetail && noteAyat !== null && (
        <NoteModal
          surahNomor={surahDetail.nomor}
          surahNamaLatin={surahDetail.namaLatin}
          ayatNomor={noteAyat}
          initialText={notesMap[`${surahDetail.nomor}-${noteAyat}`] || ''}
          isOpen={noteAyat !== null}
          onClose={() => setNoteAyat(null)}
          onSave={(text) => {
            setNotesMap((prev) => ({
              ...prev,
              [`${surahDetail.nomor}-${noteAyat}`]: text,
            }));
            toast.show(text ? 'Catatan ayat berhasil disimpan' : 'Catatan dihapus');
          }}
        />
      )}
    </div>
  );
};
