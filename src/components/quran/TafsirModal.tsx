import React, { useEffect, useState } from 'react';
import { BookMarked, ChevronLeft, ChevronRight, Loader2, RotateCcw, X } from 'lucide-react';
import { QuranApiService } from '../../services/quranApi';
import { TafsirDetail, TafsirVerse } from '../../types/quran';

interface TafsirModalProps {
  surahNomor: number;
  surahNamaLatin: string;
  totalAyat: number;
  initialAyatNomor: number;
  isOpen: boolean;
  onClose: () => void;
}

export const TafsirModal: React.FC<TafsirModalProps> = ({
  surahNomor,
  surahNamaLatin,
  totalAyat,
  initialAyatNomor,
  isOpen,
  onClose,
}) => {
  const [selectedAyat, setSelectedAyat] = useState<number>(initialAyatNomor);
  const [tafsirData, setTafsirData] = useState<TafsirDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedAyat(initialAyatNomor);
  }, [initialAyatNomor]);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    QuranApiService.getSurahTafsir(surahNomor)
      .then((data) => {
        if (isMounted) {
          setTafsirData(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Gagal memuat tafsir');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [surahNomor, isOpen]);

  if (!isOpen) return null;

  const currentVerseTafsir: TafsirVerse | undefined = tafsirData?.tafsir?.find(
    (t) => t.ayat === selectedAyat
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4">
      <div className="w-full max-w-2xl bg-[var(--bg-card)] rounded-2xl shadow-2xl border border-[var(--border-main)] text-[var(--text-main)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border-main)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EAF8E8] text-[#43B433] flex items-center justify-center">
              <BookMarked className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#202124]">
                Tafsir Kemenag RI
              </h3>
              <p className="text-xs text-[#5F6368]">
                {surahNamaLatin} : Ayat {selectedAyat} dari {totalAyat}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verse Selector Strip */}
        <div className="px-5 py-2.5 bg-[#F7FAFC] border-b border-[#E5E7EB] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedAyat((prev) => Math.max(1, prev - 1))}
              disabled={selectedAyat <= 1}
              className="p-1.5 rounded-lg border border-[#E5E7EB] bg-white text-[#5F6368] hover:text-[#202124] disabled:opacity-40 cursor-pointer"
              title="Ayat Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedAyat((prev) => Math.min(totalAyat, prev + 1))}
              disabled={selectedAyat >= totalAyat}
              className="p-1.5 rounded-lg border border-[#E5E7EB] bg-white text-[#5F6368] hover:text-[#202124] disabled:opacity-40 cursor-pointer"
              title="Ayat Selanjutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="ayat-select" className="text-xs text-[#5F6368]">
              Pilih Ayat:
            </label>
            <select
              id="ayat-select"
              value={selectedAyat}
              onChange={(e) => setSelectedAyat(Number(e.target.value))}
              className="text-xs border border-[#E5E7EB] rounded-lg px-2.5 py-1 bg-white text-[#202124] focus:outline-none focus:ring-1 focus:ring-[#0EAAFC]"
            >
              {Array.from({ length: totalAyat }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  Ayat {num}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Body content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center text-[#5F6368] gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#0EAAFC]" />
              <p className="text-xs">Memuat tafsir resmi Kemenag...</p>
            </div>
          ) : error ? (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
              <p className="text-xs text-red-600 bg-red-50 p-3 rounded-lg max-w-md">{error}</p>
              <button
                onClick={() => {
                  setIsLoading(true);
                  setError(null);
                  QuranApiService.getSurahTafsir(surahNomor)
                    .then((d) => {
                      setTafsirData(d);
                      setIsLoading(false);
                    })
                    .catch((e) => {
                      setError(e.message);
                      setIsLoading(false);
                    });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#0EAAFC] text-white hover:bg-[#0877B9]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Coba Lagi</span>
              </button>
            </div>
          ) : currentVerseTafsir ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#5F6368] border-b border-[#E5E7EB] pb-2">
                <span className="font-semibold text-[#0EAAFC]">Ayat {selectedAyat}</span>
                <span>Sumber: Kemenag RI</span>
              </div>
              <div className="text-sm text-[#202124] leading-relaxed whitespace-pre-line font-normal">
                {currentVerseTafsir.teks}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-[#5F6368]">
              Tafsir untuk ayat ini belum tersedia dari data sumber.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#F7FAFC] border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#5F6368]">
          <span>Tafsir Tahlili / Ringkas Kementerian Agama Republik Indonesia</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-[#202124] bg-white border border-[#E5E7EB] hover:bg-slate-50 rounded-lg cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
