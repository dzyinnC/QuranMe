import React, { useMemo, useState } from 'react';
import {
  Bookmark,
  BookOpen,
  Calendar,
  ChevronRight,
  FileText,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { IslamicCornerMotif } from '../components/common/IslamicOrnaments';
import { toast } from '../components/common/Toast';
import { StorageService } from '../services/storageService';
import { BookmarkItem } from '../types/quran';

interface BookmarksPageProps {
  onNavigateToAyat: (surahNomor: number, ayatNomor: number) => void;
}

export const BookmarksPage: React.FC<BookmarksPageProps> = ({ onNavigateToAyat }) => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(StorageService.getBookmarks());
  const [filterType, setFilterType] = useState<'all' | 'ayat' | 'surat' | 'catatan'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleRemoveBookmark = (e: React.MouseEvent, b: BookmarkItem) => {
    e.stopPropagation();
    StorageService.removeBookmark(b.surahNomor, b.ayatNomor);
    const updated = StorageService.getBookmarks();
    setBookmarks(updated);
    toast.show(`Bookmark QS. ${b.surahNamaLatin}:${b.ayatNomor} dihapus`, 'info');
  };

  const filteredBookmarks = useMemo(() => {
    let result = [...bookmarks];
    const q = searchQuery.trim().toLowerCase();

    if (q) {
      result = result.filter(
        (b) =>
          b.surahNamaLatin.toLowerCase().includes(q) ||
          b.teksIndonesia.toLowerCase().includes(q) ||
          b.ayatNomor.toString() === q
      );
    }

    if (filterType === 'catatan') {
      result = result.filter((b) => Boolean(b.note));
    }

    return result;
  }, [bookmarks, searchQuery, filterType]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* 1. Header with Islamic Motif (Matching Reference Screen 6) */}
      <div className="relative overflow-hidden rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6 shadow-xs flex items-center justify-between">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-[#DDF5E5] text-[#43B433] flex items-center justify-center">
              <Bookmark className="w-5 h-5 fill-[#43B433]" />
            </span>
            <h1 className="text-2xl font-extrabold text-[var(--text-main)] tracking-tight">
              Bookmark
            </h1>
          </div>
          <p className="text-xs text-[var(--text-muted)] pl-13 font-medium">
            Kumpulan ayat favorit dan penanda bacaan Anda
          </p>
        </div>

        <div className="absolute right-0 top-0 text-[#43B433] pointer-events-none opacity-20">
          <IslamicCornerMotif className="w-28 h-28 text-[#43B433]" opacity={1} />
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="space-y-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4 text-[#0EAAFC]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari dalam bookmark..."
            className="w-full pl-11 pr-10 py-3 rounded-full bg-[var(--bg-card)] border border-[var(--border-main)] text-sm text-[var(--text-main)] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0EAAFC]/30 focus:border-[#0EAAFC] transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[var(--text-main)] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills: Semua | Ayat | Surat | Catatan */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-[#0EAAFC] text-white shadow-xs'
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-main)] hover:border-slate-300'
            }`}
          >
            Semua ({bookmarks.length})
          </button>
          <button
            onClick={() => setFilterType('ayat')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterType === 'ayat'
                ? 'bg-[#0EAAFC] text-white shadow-xs'
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-main)] hover:border-slate-300'
            }`}
          >
            Ayat
          </button>
          <button
            onClick={() => setFilterType('surat')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterType === 'surat'
                ? 'bg-[#0EAAFC] text-white shadow-xs'
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-main)] hover:border-slate-300'
            }`}
          >
            Surat
          </button>
          <button
            onClick={() => setFilterType('catatan')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterType === 'catatan'
                ? 'bg-[#0EAAFC] text-white shadow-xs'
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-main)] hover:border-slate-300'
            }`}
          >
            Catatan
          </button>
        </div>
      </div>

      {/* 3. Bookmarks List */}
      {filteredBookmarks.length === 0 ? (
        <div className="text-center py-16 p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] space-y-2">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-[var(--text-main)]">
            Belum ada bookmark tersimpan
          </h3>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
            Tandai ayat favorit saat membaca untuk membukanya kembali kapan saja dengan cepat.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookmarks.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigateToAyat(item.surahNomor, item.ayatNomor)}
              className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] hover:border-[#43B433] transition-all cursor-pointer card-interactive"
            >
              <div className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
                {/* Book Icon in Green Squircle */}
                <div className="w-11 h-11 rounded-2xl bg-[#EAF7EE] text-[#43B433] flex items-center justify-center shrink-0 shadow-2xs">
                  <BookOpen className="w-5 h-5" />
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[var(--text-main)] truncate">
                      {item.surahNamaLatin} · Ayat {item.ayatNomor}
                    </h3>
                  </div>

                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                    "{item.teksIndonesia}"
                  </p>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item.createdAt)}
                    </span>
                    <span>·</span>
                    <span>{item.note ? 'Catatan pribadi' : 'Tanpa catatan'}</span>
                  </div>
                </div>
              </div>

              {/* Actions & Chevron */}
              <div className="flex items-center gap-2 pl-3 shrink-0">
                <button
                  type="button"
                  onClick={(e) => handleRemoveBookmark(e, item)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                  title="Hapus bookmark"
                  aria-label="Hapus bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
