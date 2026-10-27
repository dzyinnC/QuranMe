import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  Calendar,
  Clock,
  Copy,
  Download,
  FileText,
  Flame,
  Search,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react';
import { toast } from '../components/common/Toast';
import { StorageService } from '../services/storageService';
import { BookmarkItem, DailyTilawahLog, LastReadPosition } from '../types/quran';

interface BookmarksPageProps {
  onNavigateToAyat: (surahNomor: number, ayatNomor: number) => void;
}

export const BookmarksPage: React.FC<BookmarksPageProps> = ({ onNavigateToAyat }) => {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'notes' | 'history'>('bookmarks');
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(StorageService.getBookmarks());
  const [notes, setNotes] = useState<Record<string, string>>(StorageService.getNotes());
  const [historyLogs, setHistoryLogs] = useState<DailyTilawahLog[]>(StorageService.getTilawahLogs());
  const lastRead: LastReadPosition | null = StorageService.getLastRead();

  useEffect(() => {
    const sync = () => {
      setHistoryLogs(StorageService.getTilawahLogs());
    };
    window.addEventListener('quranme_tilawah_updated', sync);
    return () => window.removeEventListener('quranme_tilawah_updated', sync);
  }, []);

  // Search & Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'surah'>('newest');

  const handleRemoveBookmark = (e: React.MouseEvent, b: BookmarkItem) => {
    e.stopPropagation();
    StorageService.removeBookmark(b.surahNomor, b.ayatNomor);
    const updated = StorageService.getBookmarks();
    setBookmarks(updated);
    toast.show(`Bookmark QS. ${b.surahNamaLatin}:${b.ayatNomor} dihapus`, 'info');
  };

  const handleRemoveNote = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    const [surahStr, ayatStr] = key.split('-');
    StorageService.saveNoteForAyat(Number(surahStr), Number(ayatStr), '');
    const updated = StorageService.getNotes();
    setNotes(updated);
    toast.show('Catatan tadabbur dihapus', 'info');
  };

  // Filtered & sorted bookmarks
  const processedBookmarks = useMemo(() => {
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
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === 'surah') {
      result.sort((a, b) => {
        if (a.surahNomor !== b.surahNomor) return a.surahNomor - b.surahNomor;
        return a.ayatNomor - b.ayatNomor;
      });
    }
    return result;
  }, [bookmarks, searchQuery, sortBy]);

  // Filtered notes
  const processedNotes = useMemo(() => {
    const list = Object.entries(notes).map(([key, text]) => {
      const [surahStr, ayatStr] = key.split('-');
      return {
        key,
        surahNomor: Number(surahStr),
        ayatNomor: Number(ayatStr),
        text,
      };
    });

    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (n) =>
        n.text.toLowerCase().includes(q) ||
        n.surahNomor.toString() === q ||
        n.ayatNomor.toString() === q
    );
  }, [notes, searchQuery]);

  const handleCopyAllBookmarks = async () => {
    if (bookmarks.length === 0) return;
    const text = bookmarks
      .map(
        (b, i) =>
          `${i + 1}. QS. ${b.surahNamaLatin}:${b.ayatNomor}\n${b.teksArab}\n"${b.teksIndonesia}"`
      )
      .join('\n\n');

    try {
      await navigator.clipboard.writeText(text);
      toast.show('Seluruh daftar bookmark berhasil disalin');
    } catch {
      toast.show('Gagal menyalin bookmark', 'info');
    }
  };

  // Calculate total historical ayats read
  const totalAyatsRead = useMemo(() => {
    return historyLogs.reduce((acc, log) => acc + (log.ayatCount || 0), 0);
  }, [historyLogs]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--border-main)]">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-main)]">Koleksi & Riwayat</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Daftar ayat yang Anda tandai, catatan tadabbur, dan rekam jejak tilawah
          </p>
        </div>

        {/* Local Storage Indicator */}
        <span className="text-[11px] text-[var(--text-muted)] bg-[var(--bg-card-subtle)] px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] self-start sm:self-auto font-medium">
          Tersimpan aman di perangkat lokal
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] rounded-2xl">
        <button
          onClick={() => {
            setActiveTab('bookmarks');
            setSearchQuery('');
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer active:scale-95 ${
            activeTab === 'bookmarks'
              ? 'bg-[#0EAAFC] text-white shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Bookmark ({bookmarks.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('notes');
            setSearchQuery('');
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer active:scale-95 ${
            activeTab === 'notes'
              ? 'bg-[#43B433] text-white shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Catatan ({Object.keys(notes).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer active:scale-95 ${
            activeTab === 'history'
              ? 'bg-[#0877B9] text-white shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Riwayat Tilawah</span>
        </button>
      </div>

      {/* Search & Action Bar for Bookmarks and Notes */}
      {(activeTab === 'bookmarks' || activeTab === 'notes') && (
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'bookmarks'
                  ? 'Cari nama surat atau terjemahan bookmark...'
                  : 'Cari dalam catatan tadabbur...'
              }
              className="w-full pl-9 pr-4 py-2 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl text-xs text-[var(--text-main)] focus:outline-none focus:border-[#0EAAFC] focus:ring-1 focus:ring-[#0EAAFC]"
            />
          </div>

          {activeTab === 'bookmarks' && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl px-2.5 py-1.5 text-xs text-[var(--text-muted)]">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent border-none text-xs text-[var(--text-main)] focus:outline-none cursor-pointer"
                >
                  <option value="newest">Terbaru</option>
                  <option value="oldest">Terlama</option>
                  <option value="surah">Urutan Surat</option>
                </select>
              </div>

              {bookmarks.length > 0 && (
                <button
                  onClick={handleCopyAllBookmarks}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--badge-blue-bg)] text-[#0877B9] hover:bg-[#0EAAFC] hover:text-white transition-all text-xs font-semibold cursor-pointer shrink-0 active:scale-95"
                  title="Salin semua bookmark"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Salin Semua</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 1: Bookmarks */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-3">
          {processedBookmarks.length === 0 ? (
            <div className="py-16 text-center text-[var(--text-muted)] bg-[var(--bg-card)] rounded-2xl border border-[var(--border-main)] p-8 space-y-3 shadow-xs">
              <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-semibold text-[var(--text-main)]">
                {bookmarks.length === 0 ? 'Belum Ada Bookmark' : 'Tidak Ada Bookmark yang Cocok'}
              </h3>
              <p className="text-xs max-w-sm mx-auto leading-relaxed">
                {bookmarks.length === 0
                  ? 'Saat membaca surat, tekan ikon bookmark pada ayat untuk menyimpannya ke daftar ini.'
                  : `Coba gunakan kata kunci pencarian yang lain.`}
              </p>
            </div>
          ) : (
            processedBookmarks.map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigateToAyat(item.surahNomor, item.ayatNomor)}
                className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] card-interactive hover:border-[#0EAAFC]/60 hover:shadow-md transition-all cursor-pointer group flex items-start justify-between gap-4 active:scale-[0.985] shadow-xs"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[var(--badge-blue-bg)] text-[#0877B9] font-mono">
                      QS. {item.surahNamaLatin} : {item.ayatNomor}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Ditandai {new Date(item.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <p
                    lang="ar"
                    dir="rtl"
                    className="font-arabic text-xl text-[var(--text-main)] text-right line-clamp-2 leading-relaxed"
                  >
                    {item.teksArab}
                  </p>

                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                    "{item.teksIndonesia}"
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => handleRemoveBookmark(e, item)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer active:scale-90"
                    title="Hapus Bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="p-2 text-[#0EAAFC] group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Notes */}
      {activeTab === 'notes' && (
        <div className="space-y-3">
          {processedNotes.length === 0 ? (
            <div className="py-16 text-center text-[var(--text-muted)] bg-[var(--bg-card)] rounded-2xl border border-[var(--border-main)] p-8 space-y-3 shadow-xs">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-semibold text-[var(--text-main)]">
                {Object.keys(notes).length === 0 ? 'Belum Ada Catatan Tadabbur' : 'Catatan Tidak Ditemukan'}
              </h3>
              <p className="text-xs max-w-sm mx-auto leading-relaxed">
                {Object.keys(notes).length === 0
                  ? 'Tekan tombol catatan pada ayat saat membaca untuk menuliskan renungan, tadabbur, atau pelajaran penting.'
                  : 'Coba ubah kata kunci pencarian catatan.'}
              </p>
            </div>
          ) : (
            processedNotes.map((item) => (
              <div
                key={item.key}
                onClick={() => onNavigateToAyat(item.surahNomor, item.ayatNomor)}
                className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] card-interactive hover:border-[#43B433]/60 hover:shadow-md transition-all cursor-pointer group flex items-start justify-between gap-4 active:scale-[0.985] shadow-xs"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[#EAF8E8] text-[#228B22] font-mono">
                      Surat ke-{item.surahNomor} : Ayat {item.ayatNomor}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)] leading-relaxed whitespace-pre-wrap font-sans">
                    {item.text}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => handleRemoveNote(e, item.key)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer active:scale-90"
                    title="Hapus Catatan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="p-2 text-[#43B433] group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: History & Activity */}
      {activeTab === 'history' && (
        <div className="space-y-5">
          {/* Active Last Read Spot */}
          {lastRead && (
            <div
              onClick={() => onNavigateToAyat(lastRead.surahNomor, lastRead.ayatNomor)}
              className="p-5 rounded-2xl bg-[var(--bg-card)] border-2 border-[#0EAAFC]/30 shadow-sm card-interactive flex items-center justify-between gap-4 cursor-pointer hover:border-[#0EAAFC] transition-all active:scale-[0.985]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0EAAFC] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#0877B9] tracking-wider">
                    Posisi Terakhir Membaca
                  </span>
                  <h3 className="text-base font-bold text-[var(--text-main)]">
                    {lastRead.surahNamaLatin} : Ayat {lastRead.ayatNomor}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Terakhir dibaca: {new Date(lastRead.timestamp).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold text-[#0EAAFC] flex items-center gap-1 shrink-0">
                <span>Lanjutkan</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          )}

          {/* Activity summary card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-main)] card-interactive flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[var(--badge-blue-bg)] text-[#0EAAFC] flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Hari Aktif Tilawah</span>
                <p className="text-lg font-bold text-[var(--text-main)] font-mono tabular-nums">
                  {historyLogs.length} hari tercatat
                </p>
              </div>
            </div>

            <div className="p-4 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-main)] card-interactive flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#EAF8E8] text-[#43B433] flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Total Ayat Terbaca</span>
                <p className="text-lg font-bold text-[var(--text-main)] font-mono tabular-nums">
                  {totalAyatsRead} ayat
                </p>
              </div>
            </div>
          </div>

          {/* Daily tilawah log table */}
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-main)] p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#43B433]" />
              Rekam Tilawah Harian
            </h3>

            {historyLogs.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] py-4 text-center">
                Belum ada rekam tilawah harian. Ayat yang Anda baca akan otomatis tercatat di sini.
              </p>
            ) : (
              <div className="divide-y divide-[var(--border-subtle)] max-h-96 overflow-y-auto">
                {historyLogs.slice().reverse().map((log) => (
                  <div key={log.date} className="py-2.5 flex items-center justify-between text-xs">
                    <span className="text-[var(--text-muted)] font-mono">
                      {new Date(log.date).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="font-semibold text-[var(--text-main)] font-mono tabular-nums">
                      {log.ayatCount} ayat dibaca
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
