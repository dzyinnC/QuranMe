import React, { memo, useState } from 'react';
import {
  BookMarked,
  Bookmark,
  Check,
  CheckCircle2,
  Copy,
  FileText,
  Pause,
  Play,
  Share2,
} from 'lucide-react';
import { audioService } from '../../services/audioService';
import { AyatItem } from '../../types/quran';
import { toast } from '../common/Toast';

interface VerseCardProps {
  surahNomor: number;
  surahNamaLatin: string;
  totalAyat: number;
  verse: AyatItem;
  allVerses: AyatItem[];
  arabicFontSize: number;
  translationFontSize: number;
  showLatin: boolean;
  showTranslation: boolean;
  isBookmarked: boolean;
  isCompletedToday?: boolean;
  onBookmarkToggle: () => void;
  onToggleCompletedToday?: () => void;
  onOpenTafsir: (ayatNomor: number) => void;
  onOpenNote: (ayatNomor: number) => void;
  noteText?: string;
  isPlaying?: boolean;
}

export const VerseCard: React.FC<VerseCardProps> = memo(
  ({
    surahNomor,
    surahNamaLatin,
    verse,
    allVerses,
    arabicFontSize,
    translationFontSize,
    showLatin,
    showTranslation,
    isBookmarked,
    isCompletedToday = false,
    onBookmarkToggle,
    onToggleCompletedToday,
    onOpenTafsir,
    onOpenNote,
    noteText,
    isPlaying = false,
  }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      const formatted = `${verse.teksArab}\n\n"${verse.teksIndonesia}"\n(QS. ${surahNamaLatin}: ${verse.nomorAyat})\n\nDibagikan via QuranMe`;
      try {
        await navigator.clipboard.writeText(formatted);
        setCopied(true);
        toast.show(`Ayat ${verse.nomorAyat} disalin ke papan klip`);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.show('Gagal menyalin teks', 'info');
      }
    };

    const handleShare = async () => {
      const formatted = `${verse.teksArab}\n\n"${verse.teksIndonesia}"\n(QS. ${surahNamaLatin}: ${verse.nomorAyat})\n\nDibagikan via QuranMe`;
      if (navigator.share) {
        try {
          await navigator.share({
            title: `QS. ${surahNamaLatin}: ${verse.nomorAyat}`,
            text: formatted,
            url: window.location.href,
          });
        } catch {
          handleCopy();
        }
      } else {
        handleCopy();
      }
    };

    const handlePlay = () => {
      if (isPlaying) {
        audioService.togglePlayPause();
      } else {
        audioService.playVerse(surahNomor, surahNamaLatin, verse, allVerses);
      }
    };

    const handleBookmark = () => {
      onBookmarkToggle();
      toast.show(
        isBookmarked
          ? `Bookmark QS. ${surahNamaLatin}:${verse.nomorAyat} dihapus`
          : `QS. ${surahNamaLatin}:${verse.nomorAyat} disimpan ke Bookmark`
      );
    };

    return (
      <article
        id={`ayat-${verse.nomorAyat}`}
        className={`p-4 sm:p-6 rounded-2xl border transition-all duration-200 card-interactive shadow-xs ${
          isPlaying
            ? 'bg-[#E8F6FF]/70 border-[#0EAAFC] shadow-sm ring-2 ring-[#0EAAFC]/30'
            : isCompletedToday
            ? 'bg-[var(--bg-card)] border-[#43B433]/50 shadow-2xs'
            : 'bg-[var(--bg-card)] border-[var(--border-main)] hover:border-[#0EAAFC]/50'
        }`}
      >
        {/* Top action & reference bar */}
        <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-[var(--border-subtle)]">
          {/* Ayat Number Tag & Indicators */}
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center font-mono tabular-nums transition-colors ${
                isPlaying
                  ? 'bg-[#0EAAFC] text-white shadow-xs'
                  : isCompletedToday
                  ? 'bg-[#EAF8E8] text-[#228B22] font-semibold'
                  : 'bg-[var(--badge-blue-bg)] text-[var(--badge-blue-text)]'
              }`}
            >
              {verse.nomorAyat}
            </div>

            <span className="text-xs text-[var(--text-muted)] hidden sm:inline">
              {surahNamaLatin} : {verse.nomorAyat}
            </span>

            {/* Read completion badge if marked today */}
            {isCompletedToday && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#228B22] bg-[#EAF8E8] px-2 py-0.5 rounded-md">
                <Check className="w-3 h-3 stroke-[2.5px]" />
                <span className="hidden sm:inline">Selesai hari ini</span>
              </span>
            )}

            {/* Audio Wave Playing Indicator */}
            {isPlaying && (
              <div className="flex items-end gap-0.5 h-3.5 px-1 ml-1" title="Sedang diputar">
                <span className="w-0.5 h-2 bg-[#0EAAFC] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-0.5 h-3.5 bg-[#0EAAFC] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-0.5 h-2.5 bg-[#0EAAFC] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
          </div>

          {/* Action Buttons with active scale micro-interactions */}
          <div className="flex items-center gap-1 text-[var(--text-muted)]">
            {/* Mark Tilawah Complete / Unmark Toggle */}
            {onToggleCompletedToday && (
              <button
                onClick={onToggleCompletedToday}
                className={`p-2 rounded-xl transition-all cursor-pointer active:scale-95 ${
                  isCompletedToday
                    ? 'bg-[#EAF8E8] text-[#228B22] hover:bg-[#EAF8E8]/80'
                    : 'hover:bg-[var(--bg-card-subtle)] hover:text-[#43B433]'
                }`}
                title={isCompletedToday ? 'Batalkan tanda selesai hari ini' : 'Tandai selesai dibaca hari ini'}
                aria-label={isCompletedToday ? 'Batalkan tanda selesai' : 'Tandai selesai'}
              >
                <CheckCircle2
                  className={`w-4 h-4 ${isCompletedToday ? 'stroke-[2.5px] fill-[#EAF8E8]' : ''}`}
                />
              </button>
            )}

            {/* Audio Play/Pause */}
            <button
              onClick={handlePlay}
              className={`p-2 rounded-xl transition-all cursor-pointer active:scale-95 ${
                isPlaying
                  ? 'bg-[#0EAAFC] text-white shadow-xs'
                  : 'hover:bg-[var(--bg-card-subtle)] hover:text-[#0EAAFC]'
              }`}
              title={isPlaying ? 'Jeda Audio Ayat' : 'Putar Audio Ayat'}
              aria-label={isPlaying ? 'Jeda audio ayat' : 'Putar audio ayat'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Tafsir */}
            <button
              onClick={() => onOpenTafsir(verse.nomorAyat)}
              className="p-2 rounded-xl hover:bg-[var(--bg-card-subtle)] hover:text-[#43B433] transition-all cursor-pointer active:scale-95"
              title="Buka Tafsir Kemenag"
              aria-label="Buka tafsir"
            >
              <BookMarked className="w-4 h-4" />
            </button>

            {/* Bookmark */}
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-xl transition-all cursor-pointer active:scale-95 ${
                isBookmarked
                  ? 'text-[#0EAAFC] hover:text-[#0877B9]'
                  : 'hover:bg-[var(--bg-card-subtle)] hover:text-[var(--text-main)]'
              }`}
              title={isBookmarked ? 'Hapus dari Bookmark' : 'Simpan ke Bookmark'}
              aria-label={isBookmarked ? 'Hapus bookmark' : 'Simpan bookmark'}
            >
              <Bookmark
                className={`w-4 h-4 ${isBookmarked ? 'fill-[#0EAAFC]' : ''}`}
              />
            </button>

            {/* Note */}
            <button
              onClick={() => onOpenNote(verse.nomorAyat)}
              className={`p-2 rounded-xl transition-all cursor-pointer active:scale-95 ${
                noteText
                  ? 'text-[#43B433] bg-[#EAF8E8]'
                  : 'hover:bg-[var(--bg-card-subtle)] hover:text-[var(--text-main)]'
              }`}
              title={noteText ? 'Lihat/Edit Catatan' : 'Tambah Catatan Ayat'}
              aria-label="Catatan ayat"
            >
              <FileText className="w-4 h-4" />
            </button>

            {/* Copy */}
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl hover:bg-[var(--bg-card-subtle)] hover:text-[var(--text-main)] transition-all cursor-pointer active:scale-95"
              title="Salin Ayat & Terjemahan"
              aria-label="Salin ayat"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-2 rounded-xl hover:bg-[var(--bg-card-subtle)] hover:text-[var(--text-main)] transition-all cursor-pointer active:scale-95"
              title="Bagikan Ayat"
              aria-label="Bagikan ayat"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Arabic Text (dir="rtl" and lang="ar") */}
        <div className="py-2.5">
          <p
            lang="ar"
            dir="rtl"
            className="font-arabic text-[var(--text-main)] text-right leading-[2.3] tracking-wide"
            style={{ fontSize: `${arabicFontSize}px` }}
          >
            {verse.teksArab}
          </p>
        </div>

        {/* Transliteration (Latin) */}
        {showLatin && verse.teksLatin && (
          <div className="pt-2 text-xs sm:text-sm text-[#0877B9] font-normal leading-relaxed italic">
            {verse.teksLatin}
          </div>
        )}

        {/* Indonesian Translation */}
        {showTranslation && verse.teksIndonesia && (
          <div
            className="pt-2 text-[var(--text-main)] leading-relaxed"
            style={{ fontSize: `${translationFontSize}px` }}
          >
            {verse.teksIndonesia}
          </div>
        )}

        {/* Action Toolbar Pills (Salin | Bookmark | Bagikan | Tafsir) matching Reference Screen 3 */}
        <div className="pt-4 mt-3 border-t border-[var(--border-subtle)] flex items-center justify-between sm:justify-start gap-2 sm:gap-3 flex-wrap">
          {/* Salin Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-card-subtle)] hover:bg-[var(--border-main)] transition-colors cursor-pointer active:scale-95"
            aria-label="Salin ayat"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin' : 'Salin'}</span>
          </button>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={handleBookmark}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer active:scale-95 ${
              isBookmarked
                ? 'bg-[#E8F6FF] text-[#0EAAFC]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-card-subtle)] hover:bg-[var(--border-main)]'
            }`}
            aria-label="Bookmark ayat"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#0EAAFC]' : ''}`} />
            <span>Bookmark</span>
          </button>

          {/* Bagikan Button */}
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-card-subtle)] hover:bg-[var(--border-main)] transition-colors cursor-pointer active:scale-95"
            aria-label="Bagikan ayat"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Bagikan</span>
          </button>

          {/* Tafsir Button */}
          <button
            type="button"
            onClick={() => onOpenTafsir(verse.nomorAyat)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#43B433] bg-[#EAF7EE] hover:bg-[#d8f0dd] transition-colors cursor-pointer active:scale-95"
            aria-label="Buka tafsir"
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>Tafsir</span>
          </button>
        </div>

        {/* Personal Note Callout if present */}
        {noteText && (
          <div
            onClick={() => onOpenNote(verse.nomorAyat)}
            className="mt-3.5 p-3 rounded-xl bg-[#EAF8E8] border border-[#43B433]/30 text-xs text-[var(--text-main)] flex items-start gap-2 cursor-pointer hover:bg-[#EAF8E8]/80 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-[#43B433] mt-0.5 shrink-0" />
            <div className="flex-1">
              <span className="font-semibold text-[#228B22] block mb-0.5">Catatan Anda:</span>
              <p className="line-clamp-2 italic text-[var(--text-muted)]">{noteText}</p>
            </div>
          </div>
        )}
      </article>
    );
  },
  (prev, next) => {
    return (
      prev.verse.nomorAyat === next.verse.nomorAyat &&
      prev.isPlaying === next.isPlaying &&
      prev.isBookmarked === next.isBookmarked &&
      prev.isCompletedToday === next.isCompletedToday &&
      prev.noteText === next.noteText &&
      prev.arabicFontSize === next.arabicFontSize &&
      prev.translationFontSize === next.translationFontSize &&
      prev.showLatin === next.showLatin &&
      prev.showTranslation === next.showTranslation
    );
  }
);
