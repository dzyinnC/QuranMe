import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Filter,
  Loader2,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { QuranApiService } from '../services/quranApi';
import { SearchService } from '../services/searchService';
import { SearchMatch, SurahItem } from '../types/quran';

interface SearchPageProps {
  onNavigateToAyat: (surahNomor: number, ayatNomor: number) => void;
  onBack?: () => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onNavigateToAyat, onBack }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [surahList, setSurahList] = useState<SurahItem[]>([]);
  const [results, setResults] = useState<SearchMatch[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'surah' | 'ayat' | 'translation'>('all');
  const searchSeqRef = React.useRef(0);

  // Load surah list once
  useEffect(() => {
    QuranApiService.getSurahList()
      .then((data) => setSurahList(data))
      .catch(() => {});
  }, []);

  // Debounce query input (200ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 200);
    return () => clearTimeout(handler);
  }, [query]);

  // Execute search when debouncedQuery changes
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const currentSeq = ++searchSeqRef.current;
    let isMounted = true;
    setIsSearching(true);

    const run = async () => {
      const surahMatches = SearchService.searchSurahMetadata(debouncedQuery, surahList);
      const { matches: verseMatches } = await SearchService.searchVerses(
        debouncedQuery,
        surahList
      );

      if (isMounted && currentSeq === searchSeqRef.current) {
        setResults([...surahMatches, ...verseMatches]);
        setIsSearching(false);
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery, surahList]);

  // Filter results
  const filteredResults = useMemo(() => {
    if (filterType === 'all') return results;
    if (filterType === 'surah') return results.filter((r) => r.matchType === 'surah');
    if (filterType === 'translation') return results.filter((r) => r.matchType === 'translation');
    return results;
  }, [results, filterType]);

  const highlightMatch = (text: string, term: string) => {
    if (!term) return text;
    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <span key={i} className="text-[#0877B9] font-bold bg-[#BFE8FF]/40 rounded-xs px-0.5">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* 1. Header (Matching Reference Screen 8) */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-main)]">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-[var(--bg-card-subtle)] hover:bg-[var(--border-main)] text-[var(--text-main)] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Kembali"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-2xl font-extrabold text-[var(--text-main)] tracking-tight">
            Pencarian Global
          </h1>
        </div>
      </div>

      {/* 2. Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5 text-[#0EAAFC]" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari surat, ayat, arti, atau kata terjemahan..."
          className="w-full pl-11 pr-10 py-3.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-main)] text-sm text-[var(--text-main)] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0EAAFC]/30 focus:border-[#0EAAFC] transition-all shadow-xs"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[var(--text-main)] cursor-pointer"
            aria-label="Hapus kata kunci"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 3. Filter Chips: Semua | Surat | Ayat | Terjemahan */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            filterType === 'all'
              ? 'bg-[#0EAAFC] text-white shadow-xs'
              : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-main)] hover:border-slate-300'
          }`}
        >
          Semua
        </button>
        <button
          onClick={() => setFilterType('surah')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            filterType === 'surah'
              ? 'bg-[#0EAAFC] text-white shadow-xs'
              : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-main)] hover:border-slate-300'
          }`}
        >
          Surat
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
          onClick={() => setFilterType('translation')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            filterType === 'translation'
              ? 'bg-[#0EAAFC] text-white shadow-xs'
              : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-main)] hover:border-slate-300'
          }`}
        >
          Terjemahan
        </button>
      </div>

      {/* 4. Results List */}
      <div className="space-y-3">
        {debouncedQuery && (
          <div className="flex items-center justify-between text-xs font-bold text-[var(--text-muted)] pb-1">
            <span>Hasil Pencarian ({filteredResults.length})</span>
            {isSearching && (
              <span className="flex items-center gap-1.5 text-[#0EAAFC]">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Mencari...
              </span>
            )}
          </div>
        )}

        {!debouncedQuery ? (
          <div className="text-center py-16 p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] space-y-2">
            <Search className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-[var(--text-main)]">
              Mulai Pencarian
            </h3>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
              Ketik kata kunci untuk mencari di seluruh 114 surat dan 6.236 ayat terjemahan Al-Qur'an.
            </p>
          </div>
        ) : filteredResults.length === 0 && !isSearching ? (
          <div className="text-center py-16 p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] space-y-2">
            <Search className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-[var(--text-main)]">
              Tidak ada hasil ditemukan
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Coba kata kunci lain atau periksa ejaan kata.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredResults.map((item, idx) => (
              <div
                key={`${item.surahNomor}-${item.ayatNomor}-${idx}`}
                onClick={() => onNavigateToAyat(item.surahNomor, item.ayatNomor)}
                className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] hover:border-[#0EAAFC] transition-all cursor-pointer card-interactive"
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-[#EAF7EE] text-[#43B433] flex items-center justify-center shrink-0 shadow-2xs">
                    <BookOpen className="w-5 h-5" />
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[var(--text-main)] truncate">
                        {item.surahNamaLatin} · Ayat {item.ayatNomor}
                      </h4>
                    </div>

                    <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                      {highlightMatch(item.snippet, debouncedQuery)}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 pl-2 shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
