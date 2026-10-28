import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Award,
  BookMarked,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Compass,
  FileCheck,
  HelpCircle,
  Info,
  Layers,
  ListOrdered,
  Palette,
  RotateCcw,
  Search,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { IslamicCornerMotif, MosqueSilhouette } from '../components/common/IslamicOrnaments';
import { toast } from '../components/common/Toast';
import {
  LearningStepModule,
  STEP_BY_STEP_MODULES,
  TAJWEED_CURRICULUM,
  TajweedLesson,
  WAQAF_GUIDE_DATA,
  WaqafGuideItem,
} from '../data/tajweedCurriculum';
import { TAJWEED_RULES, WAQAF_MARKERS } from '../services/tajweedService';

interface TajweedEducationPageProps {
  onBack: () => void;
  onOpenSurah?: (surahNomor: number) => void;
}

const STORAGE_KEY_COMPLETED_LESSONS = 'quranme_completed_tajweed_lessons_v1';
const STORAGE_KEY_COMPLETED_STEPS = 'quranme_completed_step_modules_v1';

export const TajweedEducationPage: React.FC<TajweedEducationPageProps> = ({
  onBack,
  onOpenSurah,
}) => {
  const [activeTab, setActiveTab] = useState<'kurikulum' | 'waqaf' | 'bertahap' | 'legenda'>(
    'kurikulum'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<TajweedLesson | null>(null);

  // Lesson quiz state
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Completed tracking persisted in localStorage
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPLETED_LESSONS);
      return saved ? new Set(JSON.parse(saved)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  const [completedStepIds, setCompletedStepIds] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPLETED_STEPS);
      return saved ? new Set(JSON.parse(saved)) : new Set<number>();
    } catch {
      return new Set<number>();
    }
  });

  const toggleLessonCompleted = (id: string) => {
    setCompletedLessonIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.show('Pelajaran ditandai belum selesai');
      } else {
        next.add(id);
        toast.show('Alhamdulillah! Pelajaran selesai dipelajari');
      }
      try {
        localStorage.setItem(STORAGE_KEY_COMPLETED_LESSONS, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  };

  const toggleStepCompleted = (stepNum: number) => {
    setCompletedStepIds((prev) => {
      const next = new Set(prev);
      if (next.has(stepNum)) {
        next.delete(stepNum);
      } else {
        next.add(stepNum);
        toast.show(`Modul ${stepNum} selesai dipelajari`);
      }
      try {
        localStorage.setItem(STORAGE_KEY_COMPLETED_STEPS, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  };

  // Filter lessons based on search
  const filteredLessons = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return TAJWEED_CURRICULUM;
    return TAJWEED_CURRICULUM.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.penjelasanLengkap.some((p) => p.toLowerCase().includes(q)) ||
        (item.arabicExample && item.arabicExample.includes(q))
    );
  }, [searchQuery]);

  const handleOpenLesson = (lesson: TajweedLesson) => {
    setSelectedLesson(lesson);
    setQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const handleQuizSubmit = () => {
    if (quizAnswer === null) return;
    setQuizSubmitted(true);
    if (selectedLesson && quizAnswer === selectedLesson.quiz.correctIndex) {
      toast.show('Jawaban Benar! Maasyaa Allah');
      if (!completedLessonIds.has(selectedLesson.id)) {
        toggleLessonCompleted(selectedLesson.id);
      }
    } else {
      toast.show('Belum tepat, silakan baca penjelasannya kembali');
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-200">
      {/* 1. Header Banner with Arabesque Motif */}
      <div className="relative overflow-hidden rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6 sm:p-7 shadow-xs">
        <div className="absolute right-0 top-0 text-[#0EAAFC] pointer-events-none opacity-20">
          <IslamicCornerMotif className="w-36 h-36 text-[#0EAAFC]" opacity={1} />
        </div>

        <div className="flex items-start justify-between relative z-10 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <button
                onClick={onBack}
                className="w-8 h-8 rounded-full bg-[var(--bg-card-subtle)] hover:bg-[var(--border-main)] flex items-center justify-center transition-colors cursor-pointer mr-1"
                aria-label="Kembali ke halaman sebelumnya"
              >
                <ArrowLeft className="w-4 h-4 text-[var(--text-main)]" />
              </button>
              <span className="text-xs font-bold text-[#0EAAFC] tracking-wide uppercase">
                Pusat Pembelajaran Al-Qur'an
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
              Belajar Tajwid & Waqaf
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium max-w-xl">
              Panduan komprehensif kaidah tajwid, makharijul huruf, tanda waqaf Mushaf Standar Indonesia, dan kurikulum tilawah bertahap.
            </p>
          </div>

          <div className="hidden sm:flex flex-col items-end shrink-0">
            <span className="text-xs text-[var(--text-muted)] font-medium">Progres Teori</span>
            <span className="text-lg font-black text-[#43B433] font-mono">
              {completedLessonIds.size} / {TAJWEED_CURRICULUM.length} Bab
            </span>
          </div>
        </div>
      </div>

      {/* 2. Educational Talaqqi Disclaimer Box */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#E8F6FF] dark:bg-sky-950/20 border border-[#0EAAFC]/30 text-xs sm:text-sm leading-relaxed text-[#0877B9] dark:text-sky-300">
        <Info className="w-5 h-5 shrink-0 text-[#0EAAFC] mt-0.5" />
        <div>
          <span className="font-bold block mb-0.5">Catatan Penting Pembelajaran Al-Qur'an:</span>
          Aplikasi ini memfasilitasi pembelajaran teori hukum tajwid dan pemahaman tanda waqaf. Namun tilawah Al-Qur'an yang sempurna tetap wajib ditalaqqikan (*musyafahah*) secara langsung di hadapan guru Al-Qur'an yang kompeten bersanad untuk mengoreksi artikulasi makhraj dan ketepatan suara.
        </div>
      </div>

      {/* 3. Navigation Tabs (Kurikulum, Tanda Waqaf, Belajar Bertahap, Legenda Tajwid) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[var(--bg-card-subtle)] p-1.5 rounded-2xl border border-[var(--border-main)]">
        <button
          onClick={() => setActiveTab('kurikulum')}
          className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'kurikulum'
              ? 'bg-[#0EAAFC] text-white shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>15 Bab Tajwid</span>
        </button>

        <button
          onClick={() => setActiveTab('waqaf')}
          className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'waqaf'
              ? 'bg-[#0EAAFC] text-white shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <BookMarked className="w-4 h-4" />
          <span>Waqaf & Ibtida</span>
        </button>

        <button
          onClick={() => setActiveTab('bertahap')}
          className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'bertahap'
              ? 'bg-[#0EAAFC] text-white shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <ListOrdered className="w-4 h-4" />
          <span>Belajar Bertahap</span>
        </button>

        <button
          onClick={() => setActiveTab('legenda')}
          className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'legenda'
              ? 'bg-[#0EAAFC] text-white shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Kaidah & Warna</span>
        </button>
      </div>

      {/* --- TAB 1: 15 BAB ILMU TAJWID --- */}
      {activeTab === 'kurikulum' && (
        <div className="space-y-4">
          {/* Search Bar for Tajweed Curriculum */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5 text-[#0EAAFC]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari bab tajwid (misal: ikhfa, makhraj, mad lazim, sifat huruf)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] text-sm text-[var(--text-main)] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0EAAFC]/30 focus:border-[#0EAAFC] transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLessons.map((lesson) => {
              const isCompleted = completedLessonIds.has(lesson.id);
              return (
                <div
                  key={lesson.id}
                  onClick={() => handleOpenLesson(lesson)}
                  className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] hover:border-[#0EAAFC] p-5 shadow-xs transition-all cursor-pointer card-interactive group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          lesson.level === 'Pemula'
                            ? 'bg-[#EAF7EE] text-[#43B433]'
                            : lesson.level === 'Menengah'
                            ? 'bg-[#E8F6FF] text-[#0EAAFC]'
                            : 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
                        }`}
                      >
                        Tingkat: {lesson.level}
                      </span>

                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#43B433]">
                          <CheckCircle2 className="w-4 h-4 fill-[#43B433] text-white" />
                          <span>Selesai</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-[var(--text-main)] group-hover:text-[#0EAAFC] transition-colors">
                      {lesson.title}
                    </h3>

                    <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                      {lesson.summary}
                    </p>

                    {lesson.arabicSnippet && (
                      <div className="pt-1 font-arabic text-right text-base text-[#0EAAFC] font-semibold">
                        {lesson.arabicSnippet}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <span className="truncate max-w-[200px]">{lesson.rujukanKitab}</span>
                    <span className="inline-flex items-center gap-1 text-[#0EAAFC] font-bold group-hover:translate-x-1 transition-transform">
                      Pelajari <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- TAB 2: TANDA WAQAF & IBTIDA (STANDAR KEMENAG RI) --- */}
      {activeTab === 'waqaf' && (
        <div className="space-y-5">
          <div className="p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] space-y-3">
            <h2 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-[#0EAAFC]" />
              <span>Panduan Tanda Waqaf Mushaf Standar Indonesia</span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              Tanda waqaf dirumuskan oleh para ulama qira'at dan Lajnah Pentashihan Mushaf Al-Qur'an Kementerian Agama Republik Indonesia sebagai petunjuk tempat berhenti (waqaf), menyambung (washal), dan memulai kembali bacaan (ibtida) yang selaras dengan kesempurnaan makna ayat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WAQAF_GUIDE_DATA.map((w) => (
              <div
                key={w.simbol}
                className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] p-5 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#E8F6FF] dark:bg-sky-950/40 text-[#0EAAFC] font-arabic font-black text-2xl flex items-center justify-center border border-[#0EAAFC]/30 shadow-xs">
                      {w.simbol}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[var(--text-main)]">{w.nama}</h3>
                      <span className="text-xs font-semibold text-[#0EAAFC]">{w.kategori}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs sm:text-sm">
                  <p className="text-[var(--text-main)] leading-relaxed">
                    <span className="font-bold">Definisi:</span> {w.definisi}
                  </p>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    <span className="font-bold text-[var(--text-main)]">Hukum:</span> {w.hukumBacaan}
                  </p>
                </div>

                {/* Ayat Example */}
                <div className="p-3.5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#43B433]">
                    <span>Contoh: QS. {w.contohAyat.surah} Ayat {w.contohAyat.ayat}</span>
                  </div>
                  <p className="font-arabic text-right text-base text-[var(--text-main)] leading-loose" dir="rtl">
                    {w.contohAyat.potonganArab}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] italic">
                    "{w.contohAyat.arti}"
                  </p>
                  <div className="pt-2 text-xs text-[#0877B9] dark:text-sky-300 font-medium border-t border-[var(--border-subtle)]">
                    <span className="font-bold">Panduan Ibtida:</span> {w.contohAyat.panduanIbtida}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 3: BELAJAR MEMBACA BERTAHAP (13 MODUL) --- */}
      {activeTab === 'bertahap' && (
        <div className="space-y-5">
          <div className="p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                <ListOrdered className="w-5 h-5 text-[#43B433]" />
                <span>Kurikulum Belajar Membaca Bertahap (13 Modul)</span>
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Dari pemula hingga mahir, dirancang untuk membangun kemahiran tilawah secara terstruktur.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-[var(--text-muted)] font-medium">Selesai</span>
              <p className="text-lg font-black text-[#43B433] font-mono">
                {completedStepIds.size} / 13
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {STEP_BY_STEP_MODULES.map((mod) => {
              const isDone = completedStepIds.has(mod.step);
              return (
                <div
                  key={mod.step}
                  className={`rounded-3xl p-5 border transition-all ${
                    isDone
                      ? 'bg-[var(--bg-card)] border-[#43B433]/50 shadow-2xs'
                      : 'bg-[var(--bg-card)] border-[var(--border-main)] hover:border-[#0EAAFC]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-xl bg-[#EAF7EE] text-[#43B433] font-bold text-xs flex items-center justify-center font-mono">
                          {mod.step}
                        </span>
                        <h3 className="text-base font-bold text-[var(--text-main)]">{mod.title}</h3>
                      </div>

                      <p className="text-xs sm:text-sm text-[#0877B9] font-medium">
                        <span className="font-bold">Target:</span> {mod.targetPemahaman}
                      </p>

                      <div className="space-y-1 pt-1">
                        <span className="text-xs font-bold text-[var(--text-muted)]">Materi Pokok:</span>
                        <ul className="list-disc list-inside text-xs text-[var(--text-main)] space-y-0.5">
                          {mod.materiPokok.map((m, idx) => (
                            <li key={idx}>{m}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)]">
                          <span className="font-bold text-[#43B433] block mb-0.5">Latihan Mandiri:</span>
                          <span className="text-[var(--text-muted)]">{mod.latihanMandiri}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)]">
                          <span className="font-bold text-[#0EAAFC] block mb-0.5">Evaluasi Kelulusan:</span>
                          <span className="text-[var(--text-muted)]">{mod.evaluasi}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleStepCompleted(mod.step)}
                      className={`p-2.5 rounded-2xl border transition-all cursor-pointer shrink-0 ${
                        isDone
                          ? 'bg-[#EAF7EE] border-[#43B433] text-[#43B433]'
                          : 'bg-[var(--bg-card-subtle)] border-[var(--border-main)] text-[var(--text-muted)] hover:text-[#43B433]'
                      }`}
                      title={isDone ? 'Batalkan status selesai' : 'Tandai modul selesai'}
                    >
                      <CheckCircle2 className={`w-6 h-6 ${isDone ? 'fill-[#43B433] text-white' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- TAB 4: LEGENDA & KAIDAH WARNA TAJWID --- */}
      {activeTab === 'legenda' && (
        <div className="space-y-5">
          <div className="p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] space-y-2">
            <h2 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#0EAAFC]" />
              <span>Sistem Pewarnaan & Kaidah Tajwid QuranMe</span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              QuranMe menggunakan penandaan tajwid standar digital (Hafs 'an 'Asim) yang selaras dengan data Quran Foundation / Quran.com API v4. Setiap kelompok hukum memiliki kode warna dan durasi bacaan yang baku.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(TAJWEED_RULES).map(([key, rule]) => (
              <div
                key={key}
                className="p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-4 h-4 rounded-full shadow-2xs shrink-0"
                      style={{ backgroundColor: rule.colorBadge }}
                    />
                    <h3 className="text-base font-bold text-[var(--text-main)]">{rule.name}</h3>
                  </div>
                  {rule.durasi && (
                    <span
                      className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: rule.bgColor,
                        color: rule.textColor,
                        border: `1px solid ${rule.borderColor}`,
                      }}
                    >
                      {rule.durasi}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs sm:text-sm">
                  <p className="text-[var(--text-main)]">
                    <span className="font-bold text-[var(--text-muted)]">Sebab Kaidah:</span> {rule.alasan}
                  </p>
                  <p className="text-[var(--text-main)]">
                    <span className="font-bold text-[#43B433]">Cara Membaca:</span> {rule.caraBaca}
                  </p>
                  {rule.huruf && (
                    <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-[var(--text-muted)] text-xs">Huruf:</span>
                      {rule.huruf.map((h, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-[var(--bg-card-subtle)] text-xs font-arabic font-bold text-[#0EAAFC] border border-[var(--border-subtle)]"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-[11px] text-[var(--text-muted)] pt-1 italic border-t border-[var(--border-subtle)] mt-2">
                    {rule.rujukanKitab}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- LESSON DETAIL MODAL & PRACTICE QUIZ --- */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[var(--bg-card)] rounded-3xl border border-[var(--border-main)] shadow-2xl p-6 sm:p-7 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
              <div>
                <span className="text-xs font-bold text-[#0EAAFC] uppercase tracking-wide">
                  Materi Tajwid Terstruktur
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[var(--text-main)]">
                  {selectedLesson.title}
                </h2>
                <span className="text-xs text-[var(--text-muted)]">{selectedLesson.rujukanKitab}</span>
              </div>
              <button
                onClick={() => setSelectedLesson(null)}
                className="w-9 h-9 rounded-full bg-[var(--bg-card-subtle)] hover:bg-[var(--border-main)] text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Tutup jendela materi"
              >
                ✕
              </button>
            </div>

            {/* Arabic Example Card */}
            {selectedLesson.arabicSnippet && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0EAAFC]/10 to-[#43B433]/10 border border-[#0EAAFC]/20 text-center space-y-1">
                <p className="font-arabic text-2xl text-[var(--text-main)] font-bold">
                  {selectedLesson.arabicSnippet}
                </p>
                {selectedLesson.transliteration && (
                  <p className="text-xs text-[var(--text-muted)] italic">
                    {selectedLesson.transliteration}
                  </p>
                )}
              </div>
            )}

            {/* Content Points */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[var(--text-main)]">Penjelasan Mendalam:</h3>
              <div className="space-y-2 text-xs sm:text-sm text-[var(--text-main)] leading-relaxed">
                {selectedLesson.penjelasanLengkap.map((p, idx) => (
                  <p key={idx} className="p-2.5 rounded-xl bg-[var(--bg-card-subtle)]">
                    {p}
                  </p>
                ))}
              </div>
            </div>

            {/* Important Rules */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-[#43B433]">Kaidah Kunci & Praktik:</h3>
              <ul className="list-disc list-inside text-xs sm:text-sm text-[var(--text-muted)] space-y-1">
                {selectedLesson.kaidahPenting.map((k, idx) => (
                  <li key={idx}>{k}</li>
                ))}
              </ul>
            </div>

            {/* Common Mistakes */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">
                Kekeliruan Yang Sering Terjadi:
              </h3>
              <ul className="list-disc list-inside text-xs sm:text-sm text-[var(--text-muted)] space-y-1">
                {selectedLesson.kesalahanUmum.map((e, idx) => (
                  <li key={idx}>{e}</li>
                ))}
              </ul>
            </div>

            {/* Practice Quiz */}
            <div className="p-5 rounded-2xl bg-[#EAF7EE]/60 dark:bg-emerald-950/20 border border-[#43B433]/30 space-y-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#43B433]" />
                <h4 className="text-sm font-bold text-[var(--text-main)]">
                  Kuis Latihan Pemahaman
                </h4>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-[var(--text-main)]">
                {selectedLesson.quiz.question}
              </p>

              <div className="space-y-2">
                {selectedLesson.quiz.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!quizSubmitted) setQuizAnswer(idx);
                    }}
                    disabled={quizSubmitted}
                    className={`w-full text-left p-3 rounded-xl text-xs sm:text-sm font-medium border transition-all cursor-pointer ${
                      quizAnswer === idx
                        ? 'bg-[#0EAAFC] text-white border-[#0EAAFC]'
                        : 'bg-[var(--bg-card)] border-[var(--border-main)] hover:border-[#0EAAFC] text-[var(--text-main)]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={quizAnswer === null}
                  className="w-full py-2.5 rounded-xl bg-[#43B433] hover:bg-[#349b26] disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  Periksa Jawaban
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-1 text-xs">
                  <span
                    className={`font-bold block ${
                      quizAnswer === selectedLesson.quiz.correctIndex
                        ? 'text-[#43B433]'
                        : 'text-red-500'
                    }`}
                  >
                    {quizAnswer === selectedLesson.quiz.correctIndex
                      ? '✓ Jawaban Anda Benar!'
                      : '✗ Jawaban Belum Tepat'}
                  </span>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    {selectedLesson.quiz.explanation}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
              <button
                onClick={() => toggleLessonCompleted(selectedLesson.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  completedLessonIds.has(selectedLesson.id)
                    ? 'bg-[#EAF7EE] text-[#43B433]'
                    : 'bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[#43B433]'
                }`}
              >
                {completedLessonIds.has(selectedLesson.id)
                  ? '✓ Sudah Selesai'
                  : 'Tandai Selesai'}
              </button>

              <button
                onClick={() => setSelectedLesson(null)}
                className="px-5 py-2 rounded-xl bg-[#0EAAFC] text-white text-xs font-bold shadow-xs hover:bg-[#0877B9] transition-all cursor-pointer"
              >
                Tutup Materi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
