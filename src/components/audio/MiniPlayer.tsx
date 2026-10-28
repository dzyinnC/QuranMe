import React, { useEffect, useState } from 'react';
import {
  Check,
  ChevronDown,
  Gauge,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
  X,
} from 'lucide-react';
import { ALL_QARI, INDONESIAN_QARI, INTERNATIONAL_QARI, QariSource } from '../../config/appConfig';
import { audioService, AudioState } from '../../services/audioService';

interface MiniPlayerProps {
  onOpenSurah?: (surahNomor: number, ayatNomor?: number) => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({ onOpenSurah }) => {
  const [audioState, setAudioState] = useState<AudioState>(audioService.state);
  const [showQariDropdown, setShowQariDropdown] = useState(false);
  const [showSpeedDropdown, setShowSpeedDropdown] = useState(false);
  const [activeQariTab, setActiveQariTab] = useState<'all' | 'idn' | 'intl'>('all');

  useEffect(() => {
    const unsubscribe = audioService.subscribe((state) => {
      setAudioState(state);
    });
    return unsubscribe;
  }, []);

  if (!audioState.surahNomor && !audioState.isPlaying && !audioState.isLoading) {
    return null;
  }

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = audioState.duration > 0 ? (audioState.currentTime / audioState.duration) * 100 : 0;
  const currentQariObj = ALL_QARI.find((q) => q.id === audioState.currentQari);

  const filteredQari =
    activeQariTab === 'idn'
      ? INDONESIAN_QARI
      : activeQariTab === 'intl'
      ? INTERNATIONAL_QARI
      : ALL_QARI;

  return (
    <div className="fixed bottom-[64px] md:bottom-6 left-3 right-3 md:left-auto md:right-6 md:w-96 z-40 bg-[var(--bg-card)] rounded-2xl shadow-xl border border-[var(--border-main)] text-[var(--text-main)] overflow-hidden transition-all duration-200 animate-in fade-in slide-in-from-bottom-3">
      {/* Progress Bar with hover tooltip */}
      <div
        className="w-full bg-[#E5E7EB] h-1.5 cursor-pointer relative group"
        onClick={(e) => {
          if (!audioState.duration) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const clickPos = (e.clientX - rect.left) / rect.width;
          audioService.seek(clickPos * audioState.duration);
        }}
      >
        <div
          className="bg-[#0EAAFC] h-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-3.5">
        <div className="flex items-center justify-between gap-3">
          {/* Track Info with Animated Wave */}
          <div
            className="flex-1 min-w-0 cursor-pointer group"
            onClick={() => {
              if (audioState.surahNomor && onOpenSurah) {
                onOpenSurah(audioState.surahNomor, audioState.ayatNomor || undefined);
              }
            }}
          >
            <div className="flex items-center gap-1.5">
              {audioState.isPlaying ? (
                <div className="flex items-end gap-0.5 h-3 shrink-0">
                  <span className="w-0.5 h-2.5 bg-[#43B433] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-0.5 h-3 bg-[#43B433] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-0.5 h-1.5 bg-[#43B433] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : (
                <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
              )}

              <p className="text-xs font-bold text-[#202124] truncate group-hover:text-[#0EAAFC] transition-colors">
                {audioState.surahNamaLatin || `Surat ke-${audioState.surahNomor}`}
                {audioState.ayatNomor ? ` : Ayat ${audioState.ayatNomor}` : ' (Surat Penuh)'}
              </p>
            </div>

            <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-[#5F6368]">
              {currentQariObj?.isIndonesian && (
                <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-[#EAF8E8] text-[#228B22] border border-[#43B433]/30">
                  Qari IDN
                </span>
              )}
              <span className="truncate">{audioService.getQariName()}</span>
              <span>·</span>
              <span className="font-mono tabular-nums shrink-0">
                {formatTime(audioState.currentTime)} / {formatTime(audioState.duration)}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Prev Track (verse mode only) */}
            {audioState.playMode === 'verse' && (
              <button
                onClick={() => audioService.prevTrack()}
                className="p-1.5 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer active:scale-95"
                title="Ayat Sebelumnya"
              >
                <SkipBack className="w-4 h-4" />
              </button>
            )}

            {/* Play/Pause Button */}
            <button
              onClick={() => audioService.togglePlayPause()}
              disabled={audioState.isLoading}
              className="w-9 h-9 rounded-full bg-[#0EAAFC] hover:bg-[#0877B9] text-white flex items-center justify-center shadow-xs transition-transform active:scale-90 cursor-pointer disabled:opacity-60"
              title={audioState.isPlaying ? 'Jeda' : 'Putar'}
            >
              {audioState.isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : audioState.isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </button>

            {/* Next Track (verse mode only) */}
            {audioState.playMode === 'verse' && (
              <button
                onClick={() => audioService.nextTrack()}
                className="p-1.5 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer active:scale-95"
                title="Ayat Selanjutnya"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            )}

            {/* Playback speed trigger */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSpeedDropdown(!showSpeedDropdown);
                  setShowQariDropdown(false);
                }}
                className="p-1.5 text-slate-500 hover:text-[#0EAAFC] transition-colors cursor-pointer font-mono text-[11px]"
                title="Kecepatan Audio"
              >
                {audioState.playbackRate}x
              </button>

              {showSpeedDropdown && (
                <div className="absolute right-0 bottom-full mb-2 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl shadow-lg p-1.5 w-24 z-50 backdrop-blur-md">
                  <span className="block text-[10px] text-slate-400 font-semibold px-2 py-0.5">
                    Kecepatan
                  </span>
                  {[0.75, 1.0, 1.25, 1.5].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => {
                        audioService.setPlaybackRate(rate);
                        setShowSpeedDropdown(false);
                      }}
                      className={`w-full text-left px-2 py-1 text-xs rounded-lg cursor-pointer transition-colors active:scale-95 ${
                        audioState.playbackRate === rate
                          ? 'bg-[#E8F6FF] text-[#0877B9] font-bold'
                          : 'hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)]'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Qari Selector Dropdown Trigger */}
            <button
              onClick={() => {
                setShowQariDropdown(!showQariDropdown);
                setShowSpeedDropdown(false);
              }}
              className="p-1.5 text-slate-500 hover:text-[#0EAAFC] transition-colors cursor-pointer active:scale-95"
              title="Ganti Qari Murottal"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* Close / Stop */}
            <button
              onClick={() => {
                audioService.stop();
                setShowQariDropdown(false);
                setShowSpeedDropdown(false);
              }}
              className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer active:scale-95"
              title="Tutup Pemutar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Error message */}
        {audioState.error && (
          <p className="mt-2 text-[11px] text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200/60 leading-relaxed">
            {audioState.error}
          </p>
        )}

        {/* Qari Selection Panel */}
        {showQariDropdown && (
          <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] space-y-2 animate-in fade-in duration-100">
            {/* Filter Tabs */}
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-bold text-[#202124]">Pilih Qari Murottal:</span>
              <div className="flex items-center gap-1 text-[10px]">
                <button
                  onClick={() => setActiveQariTab('all')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    activeQariTab === 'all'
                      ? 'bg-[#0EAAFC] text-white font-bold'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setActiveQariTab('idn')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    activeQariTab === 'idn'
                      ? 'bg-[#43B433] text-white font-bold'
                      : 'bg-[#EAF8E8] text-[#228B22]'
                  }`}
                >
                  Qari Indonesia ({INDONESIAN_QARI.length})
                </button>
                <button
                  onClick={() => setActiveQariTab('intl')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    activeQariTab === 'intl'
                      ? 'bg-[#0EAAFC] text-white font-bold'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Internasional
                </button>
              </div>
            </div>

            {/* Qari List */}
            <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto pr-1">
              {filteredQari.map((qari) => {
                const isSelected = audioState.currentQari === qari.id;

                return (
                  <button
                    key={qari.id}
                    onClick={() => {
                      audioService.setQari(qari.id);
                      setShowQariDropdown(false);
                      // If a surah is currently active in full-surah mode, resume with new qari
                      if (audioState.surahNomor && audioState.playMode === 'surah') {
                        audioService.playFullSurah(
                          audioState.surahNomor,
                          audioState.surahNamaLatin,
                          undefined,
                          qari.id
                        );
                      }
                    }}
                    className={`text-left text-xs p-2 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#E8F6FF] text-[#0877B9] font-semibold border border-[#0EAAFC]/30'
                        : 'hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)]'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate">{qari.name}</span>
                        {qari.isIndonesian && (
                          <span className="text-[9px] bg-[#EAF8E8] text-[#228B22] px-1 py-0.2 rounded font-bold shrink-0">
                            Indonesia
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {qari.style || qari.country} · {qari.playbackMode === 'per-ayah' ? 'Per Ayat & Full Surat' : 'Full Surat'}
                      </span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#0EAAFC] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
