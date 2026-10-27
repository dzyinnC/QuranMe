import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Filter,
  Info,
  Loader2,
  Search,
  Sparkles,
} from 'lucide-react';
import { QuranApiService } from '../services/quranApi';
import { SearchService } from '../services/searchService';
import { SearchMatch, SurahItem } from '../types/quran';

interface SearchPageProps {
  onNavigateToAyat: (surahNomor: number, ayatNomor: number) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onNavigateToAyat }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [surahList, setSurahList] = useState<SurahItem[]>([]);
  const [results, setResults] = useState<SearchMatch[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPartialIndex, setIsPartialIndex] = useState(false);
  const [indexedCount, setIndexedCount] = useState(0);
  const [filterType, setFilterType] = useState<'all' | 'surah' | 'translation'>('all');
  const searchSeqRef = React.useRef(0);

  // Load surah list once
  useEffect(() => {
    QuranApiService.getSurahList()
      .then((data) => setSurahList(data))
      .catch(() => {});
  }, []);

  // Debounce query input to avoid high CPU churn on rapid typing (220ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 220);
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
      // 1. Surah metadata search
      const surahMatches = SearchService.searchSurahMetadata(debouncedQuery, surahList);

      // 2. Verse translation search
      const { matches: verseMatches, isPartial, totalIndexed } = await SearchService.searchVerses(
        debouncedQuery,
        surahList,
        (count) => {
          if (isMounted && currentSeq === searchSeqRef.current) setIndexedCount(count);
        }
      );

      // Only commit if this is still the freshest search
      if (isMounted && currentSeq === searchSeqRef.current) {
        setIsPartialIndex(isPartial);
        setIndexedCount(totalIndexed);
        setResults([...surahMatches, ...verseMatches]);
        setIsSearching(false);
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery, surahList]);

  const filteredResults = useMemo(() => {
    if (filterType === 'surah') {
      return results.filter((r) => r.matchType === 'surah' || r.matchType === 'meaning');
    }
    if (filterType === 'translation') {
      return results.filter((r) => r.matchType === 'translation');
    }
    return results;
  }, [results, filterType]);

  const quickKeywords = [
    'Sabar',
    'Syukur',
    'Sholat',
    'Sedekah',
    'Orang Tua',
    'Surga',
    'Kiamat',
    'Rezeki',
  ];

  // Helper to highlight matching words in translation text
  const renderHighlightedSnippet = (snippet: string, term: string) => {
    if (!term) return snippet;
    const parts = snippet.split(new RegExp(`(${term})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === term.toLowerCase() ? (
            <mark
              key={i}
              className="bg-[#E8F6FF] text-[#0877B9] font-bold px-1 rounded border border-[#0EAAFC]/30"
            >
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Search Header */}
      <div className="space-y-2 pb-2 border-b border-[var(--border-main)]">
        <h1 className="text-2xl font-bold text-[var(--text-main)]">Pencarian Al-Qur'an</h1>
        <p className="text-xs text-[var(--text-muted)]">
          Cari nama surat, nomor surat, arti surat, format ayat (contoh: 2:255), atau kata kunci dalam terjemahan resmi Kemenag RI.
        </p>
      </div>

      {/* Input Box */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik kata kunci, topik, atau ayat (contoh: rahmat, rezeki, 18, 2:255)..."
            className="w-full pl-12 pr-12 py-3.5 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl text-sm text-[var(--text-main)] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0EAAFC]/40 focus:border-transparent shadow-sm transition-all"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer p-1 active:scale-90"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Quick Suggestions & Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 flex-wrap text-xs text-[var(--text-muted)]">
            <span className="text-[11px] font-medium mr-1">Saran topik:</span>
            {quickKeywords.map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-2.5 py-1 bg-[var(--bg-card)] border border-[var(--border-main)] hover:border-[#0EAAFC] hover:text-[#0EAAFC] rounded-xl transition-all cursor-pointer text-xs active:scale-95 shadow-2xs"
              >
                {tag}
              </button>
            ))}
          </div>

          {results.length > 0 && (
            <div className="flex items-center gap-1 p-1 bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] rounded-xl self-start sm:self-auto">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 text-xs rounded-lg cursor-pointer transition-all active:scale-95 ${
                  filterType === 'all'
                    ? 'bg-[#0EAAFC] text-white font-bold shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                Semua ({results.length})
              </button>
              <button
                onClick={() => setFilterType('surah')}
                className={`px-2.5 py-1 text-xs rounded-lg cursor-pointer transition-all active:scale-95 ${
                  filterType === 'surah'
                    ? 'bg-[#0EAAFC] text-white font-bold shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                Surat
              </button>
              <button
                onClick={() => setFilterType('translation')}
                className={`px-2.5 py-1 text-xs rounded-lg cursor-pointer transition-all active:scale-95 ${
                  filterType === 'translation'
                    ? 'bg-[#0EAAFC] text-white font-bold shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                Ayat
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Partial Index Info */}
      {isPartialIndex && results.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-main)] flex items-start gap-2.5 text-xs text-[var(--text-muted)] shadow-2xs">
          <Info className="w-4 h-4 text-[#0EAAFC] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-[var(--text-main)]">Cakupan Indeks: </span>
            Pencarian terjemahan saat ini memindai surat yang tersimpan di memori perangkat ({indexedCount} surat). Setiap surat yang Anda buka akan otomatis memperluas indeks pencarian secara instan.
          </div>
        </div>
      )}

      {/* Results List */}
      {isSearching ? (
        <div className="py-20 flex flex-col items-center justify-center text-[var(--text-muted)] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#0EAAFC]" />
          <p className="text-xs">Mencari di seluruh ayat dan data surat...</p>
        </div>
      ) : filteredResults.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] px-1">
            <span>Ditemukan <strong>{filteredResults.length}</strong> hasil pencarian</span>
            <span className="font-mono text-[11px]">Kata kunci: "{debouncedQuery}"</span>
          </div>

          <div className="space-y-3">
            {filteredResults.map((res, idx) => (
              <div
                key={`${res.surahNomor}-${res.ayatNomor}-${idx}`}
                onClick={() => onNavigateToAyat(res.surahNomor, res.ayatNomor)}
                className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] card-interactive hover:border-[#0EAAFC]/60 hover:shadow-md transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3 active:scale-[0.985] shadow-xs"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[var(--badge-blue-bg)] text-[#0877B9] font-mono">
                      QS. {res.surahNamaLatin} : {res.ayatNomor}
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      {res.matchType === 'surah'
                        ? 'Surat'
                        : res.matchType === 'meaning'
                        ? 'Arti Surat'
                        : 'Terjemahan Ayat'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[var(--text-main)] leading-relaxed line-clamp-3">
                    {renderHighlightedSnippet(res.snippet, debouncedQuery)}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <span className="text-xs font-semibold text-[#0EAAFC] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Buka Ayat</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : debouncedQuery.length >= 2 ? (
        <div className="py-16 text-center text-[var(--text-muted)] bg-[var(--bg-card)] rounded-3xl border border-[var(--border-main)] p-8 space-y-2 shadow-xs">
          <p className="text-base font-bold text-[var(--text-main)]">Tidak ada hasil untuk "{debouncedQuery}"</p>
          <p className="text-xs max-w-md mx-auto leading-relaxed">
            Pastikan ejaan kata sudah sesuai. Anda juga dapat mencari dengan format nomor surat dan ayat seperti <strong>2:255</strong> atau nama surat seperti <strong>Al-Mulk</strong>.
          </p>
        </div>
      ) : (
        <div className="py-16 text-center text-[var(--text-muted)] bg-[var(--bg-card)] rounded-3xl border border-[var(--border-main)] p-8 space-y-3 shadow-xs">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-[var(--text-main)]">Pencarian Teks Al-Qur'an</h3>
          <p className="text-xs max-w-sm mx-auto leading-relaxed">
            Masukkan kata, tema, atau nomor ayat yang ingin Anda pelajari untuk menemukan referensi ayat dan surat terkait dalam terjemahan resmi Al-Qur'an.
          </p>
        </div>
      )}
    </div>
  );
};
