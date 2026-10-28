import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Headphones,
  Mic2,
  MoreVertical,
  Music,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
} from 'lucide-react';
import { ALL_QARI, INDONESIAN_QARI, INTERNATIONAL_QARI, QariSource } from '../config/appConfig';
import { audioService, AudioState } from '../services/audioService';
import { QuranApiService } from '../services/quranApi';
import { SurahItem } from '../types/quran';

interface MurottalPageProps {
  onBack: () => void;
  onOpenSurah: (surahNomor: number) => void;
}

export const MurottalPage: React.FC<MurottalPageProps> = ({ onBack, onOpenSurah }) => {
  const [activeTab, setActiveTab] = useState<'qari' | 'surat'>('qari');
  const [audioState, setAudioState] = useState<AudioState>(audioService.state);
  const [surahs, setSurahs] = useState<SurahItem[]>([]);
  const [selectedSurahNomor, setSelectedSurahNomor] = useState<number>(1);

  // Sync audio state
  useEffect(() => {
    return audioService.subscribe((state) => {
      setAudioState({ ...state });
    });
  }, []);

  // Fetch surah list for selector
  useEffect(() => {
    QuranApiService.getSurahList()
      .then((data) => setSurahs(data))
      .catch(() => {});
  }, []);

  const handlePlayQari = (qari: QariSource, surahNum: number = 1) => {
    const targetSurah = surahs.find((s) => s.nomor === surahNum) || {
      nomor: 1,
      namaLatin: 'Al-Fatihah',
    };
    audioService.setQari(qari.id);
    audioService.playFullSurah(targetSurah.nomor, targetSurah.namaLatin, undefined, qari.id);
  };

  const handleTogglePlay = () => {
    audioService.togglePlay();
  };

  const currentQariObj =
    ALL_QARI.find((q) => q.id === audioState.currentQari) || INDONESIAN_QARI[0];

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-200">
      {/* 1. Header */}
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
            Murottal Al-Qur'an
          </h1>
        </div>

        {/* Tab Pills: Qari | Surat */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)]">
          <button
            onClick={() => setActiveTab('qari')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'qari'
                ? 'bg-[#0EAAFC] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Qari
          </button>
          <button
            onClick={() => setActiveTab('surat')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'surat'
                ? 'bg-[#0EAAFC] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Surat
          </button>
        </div>
      </div>

      {/* 2. Active Now Playing Banner if Audio is Loaded */}
      {audioState.surahNomor && (
        <section className="rounded-3xl bg-gradient-to-r from-[#0EAAFC]/15 via-[#BFE8FF]/20 to-[#43B433]/15 border border-[#0EAAFC]/30 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0EAAFC] to-[#43B433] text-white flex items-center justify-center shadow-md">
                <Headphones className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#43B433] uppercase tracking-wider block">
                  {audioState.isPlaying ? 'Sedang Diputar' : 'Jeda'}
                </span>
                <h3 className="text-lg font-bold text-[var(--text-main)]">
                  {audioState.surahNamaLatin} {audioState.ayatNomor ? `· Ayat ${audioState.ayatNomor}` : '· Full Surat'}
                </h3>
                <span className="text-xs text-[var(--text-muted)]">
                  {currentQariObj.name} ({currentQariObj.country})
                </span>
              </div>
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={handleTogglePlay}
              className="w-12 h-12 rounded-full bg-[#43B433] hover:bg-[#369628] text-white flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer"
              aria-label={audioState.isPlaying ? 'Jeda Audio' : 'Putar Audio'}
            >
              {audioState.isPlaying ? (
                <Pause className="w-5 h-5 fill-white" />
              ) : (
                <Play className="w-5 h-5 fill-white ml-0.5" />
              )}
            </button>
          </div>

          {/* Scrubber & Duration */}
          <div className="space-y-1">
            <input
              type="range"
              min={0}
              max={audioState.duration || 100}
              value={audioState.currentTime || 0}
              onChange={(e) => audioService.seek(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#43B433]"
            />
            <div className="flex justify-between text-[11px] font-mono text-[var(--text-muted)]">
              <span>{formatTime(audioState.currentTime)}</span>
              <span>{formatTime(audioState.duration)}</span>
            </div>
          </div>
        </section>
      )}

      {/* Tab: Qari Content */}
      {activeTab === 'qari' && (
        <div className="space-y-8">
          {/* Section: Qari Indonesia (min 5 verified) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#43B433]" />
                Qari Indonesia
              </h2>
              <span className="text-xs font-semibold text-[#0EAAFC]">
                {INDONESIAN_QARI.length} Qari Tersedia
              </span>
            </div>

            <div className="space-y-2.5">
              {INDONESIAN_QARI.map((qari) => {
                const isSelected = audioState.currentQari === qari.id;
                const isPlayingThis = isSelected && audioState.isPlaying;

                return (
                  <div
                    key={qari.id}
                    className={`flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-card)] border transition-all card-interactive ${
                      isSelected
                        ? 'border-[#43B433] bg-[#EAF7EE]/30 shadow-xs'
                        : 'border-[var(--border-main)] hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Avatar Circle */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#BFE8FF] to-[#DDF5E5] border-2 border-white dark:border-slate-700 shadow-xs flex items-center justify-center font-bold text-[#0877B9] text-base shrink-0">
                        {qari.name.charAt(0)}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-[var(--text-main)]">
                            {qari.name}
                          </h3>
                          <span className="text-[10px] font-bold text-[#43B433] bg-[#EAF7EE] px-2 py-0.5 rounded-full">
                            Indonesia
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">
                          {qari.style || 'Lantunan Khas Nusantara'}
                        </p>
                        <span className="text-[10px] text-slate-400 block">
                          Tersedia {qari.availableSurahs?.length || 114} surat pilihan
                        </span>
                      </div>
                    </div>

                    {/* Play/Pause Action Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (isPlayingThis) {
                          audioService.togglePlay();
                        } else {
                          handlePlayQari(qari, 1);
                        }
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-xs transition-transform active:scale-95 cursor-pointer ${
                        isPlayingThis
                          ? 'bg-[#43B433] text-white animate-pulse'
                          : 'bg-[#E8F6FF] text-[#0EAAFC] hover:bg-[#0EAAFC] hover:text-white'
                      }`}
                      aria-label={`Putar murottal ${qari.name}`}
                    >
                      {isPlayingThis ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Qari Internasional */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0EAAFC]" />
                Qari Internasional
              </h2>
              <span className="text-xs font-semibold text-[#0EAAFC]">
                {INTERNATIONAL_QARI.length} Qari Tersedia
              </span>
            </div>

            <div className="space-y-2.5">
              {INTERNATIONAL_QARI.map((qari) => {
                const isSelected = audioState.currentQari === qari.id;
                const isPlayingThis = isSelected && audioState.isPlaying;

                return (
                  <div
                    key={qari.id}
                    className={`flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-card)] border transition-all card-interactive ${
                      isSelected
                        ? 'border-[#0EAAFC] bg-[#E8F6FF]/30 shadow-xs'
                        : 'border-[var(--border-main)] hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#DDF3FF] to-[#E0F2FE] border-2 border-white dark:border-slate-700 shadow-xs flex items-center justify-center font-bold text-[#0877B9] text-base shrink-0">
                        {qari.name.charAt(0)}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-[var(--text-main)]">
                            {qari.name}
                          </h3>
                          <span className="text-[10px] font-bold text-[#0EAAFC] bg-[#E8F6FF] px-2 py-0.5 rounded-full">
                            {qari.country}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">
                          {qari.style || 'Tartil Internasional'}
                        </p>
                        <span className="text-[10px] text-slate-400 block">
                          Lengkap 114 Surat & 6.236 Ayat
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (isPlayingThis) {
                          audioService.togglePlay();
                        } else {
                          handlePlayQari(qari, 1);
                        }
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-xs transition-transform active:scale-95 cursor-pointer ${
                        isPlayingThis
                          ? 'bg-[#0EAAFC] text-white animate-pulse'
                          : 'bg-[#EAF7EE] text-[#43B433] hover:bg-[#43B433] hover:text-white'
                      }`}
                      aria-label={`Putar murottal ${qari.name}`}
                    >
                      {isPlayingThis ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Surat Content */}
      {activeTab === 'surat' && (
        <div className="space-y-3">
          <h2 className="text-base font-bold text-[var(--text-main)]">
            Pilih Surat untuk Murottal
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {surahs.map((surah) => (
              <div
                key={surah.nomor}
                onClick={() => {
                  audioService.playFullSurah(surah.nomor, surah.namaLatin);
                }}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] hover:border-[#0EAAFC] cursor-pointer transition-all card-interactive"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#E8F6FF] text-[#0EAAFC] font-bold text-xs flex items-center justify-center">
                    {surah.nomor}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-main)]">
                      {surah.namaLatin}
                    </h3>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      {surah.arti} · {surah.jumlahAyat} ayat
                    </span>
                  </div>
                </div>

                <Play className="w-4 h-4 text-[#43B433]" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
