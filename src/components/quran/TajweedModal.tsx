import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Info,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react';
import {
  TAJWEED_RULES,
  TajweedRuleInfo,
  TajweedToken,
  WAQAF_MARKERS,
} from '../../services/tajweedService';
import { AyatItem } from '../../types/quran';

interface TajweedModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRule?: TajweedRuleInfo | null;
  selectedTokenText?: string;
  ayatNomor?: number;
  surahNamaLatin?: string;
  verse?: AyatItem | null;
  tokens?: TajweedToken[];
  onOpenEducationCenter?: () => void;
}

export const TajweedModal: React.FC<TajweedModalProps> = ({
  isOpen,
  onClose,
  selectedRule,
  selectedTokenText,
  ayatNomor,
  surahNamaLatin,
  verse,
  tokens,
  onOpenEducationCenter,
}) => {
  if (!isOpen) return null;

  // Extract all unique rules present in this verse if viewing verse-level tajweed
  const verseRules = React.useMemo(() => {
    if (!tokens) return [];
    const map = new Map<string, { rule: TajweedRuleInfo; samples: string[] }>();
    for (const t of tokens) {
      if (t.rule) {
        if (!map.has(t.rule.className)) {
          map.set(t.rule.className, { rule: t.rule, samples: [t.text] });
        } else {
          const entry = map.get(t.rule.className)!;
          if (!entry.samples.includes(t.text)) {
            entry.samples.push(t.text);
          }
        }
      }
    }
    return Array.from(map.values());
  }, [tokens]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[var(--bg-card)] rounded-t-3xl sm:rounded-3xl border border-[var(--border-main)] shadow-2xl p-6 space-y-5 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0EAAFC]" />
              <span className="text-xs font-bold text-[#0EAAFC] tracking-wide uppercase">
                {surahNamaLatin ? `${surahNamaLatin} : Ayat ${ayatNomor}` : 'Hukum Tajwid'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-[var(--text-main)]">
              {selectedRule ? selectedRule.name : `Tajwid Ayat ${ayatNomor}`}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--bg-card-subtle)] hover:bg-[var(--border-main)] text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center justify-center cursor-pointer transition-colors"
            aria-label="Tutup jendela tajwid"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Highlighted Word / Token if opened via token click */}
        {selectedTokenText && selectedRule && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0EAAFC]/10 to-[#43B433]/10 border border-[#0EAAFC]/30 text-center space-y-1">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase block">
              Potongan Lafaz:
            </span>
            <p className="font-arabic text-3xl font-bold text-[var(--text-main)] py-1" dir="rtl">
              {selectedTokenText}
            </p>
            {selectedRule.durasi && (
              <span
                className="inline-block text-xs font-bold px-3 py-0.5 rounded-full"
                style={{
                  backgroundColor: selectedRule.bgColor,
                  color: selectedRule.textColor,
                  border: `1px solid ${selectedRule.borderColor}`,
                }}
              >
                Durasi: {selectedRule.durasi}
              </span>
            )}
          </div>
        )}

        {/* Selected Single Rule Details */}
        {selectedRule ? (
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="p-3.5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] space-y-1">
              <span className="font-bold text-[var(--text-muted)] block">Alasan Kaidah Berlaku:</span>
              <p className="text-[var(--text-main)] leading-relaxed">{selectedRule.alasan}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] space-y-1">
              <span className="font-bold text-[#43B433] block">Cara Melafalkan:</span>
              <p className="text-[var(--text-main)] leading-relaxed">{selectedRule.caraBaca}</p>
            </div>

            {selectedRule.huruf && selectedRule.huruf.length > 0 && (
              <div className="p-3 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)]">
                <span className="font-bold text-[var(--text-muted)] block mb-1">
                  Huruf-Huruf Terkait:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedRule.huruf.map((h, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-[var(--bg-card)] font-arabic font-bold text-sm text-[#0EAAFC] border border-[var(--border-subtle)] shadow-2xs"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 text-[11px] text-[var(--text-muted)] italic border-t border-[var(--border-subtle)]">
              <span className="font-bold">Rujukan Kaidah:</span> {selectedRule.rujukanKitab}
            </div>
          </div>
        ) : (
          /* Multi-rule summary for this verse */
          <div className="space-y-4">
            <div className="text-xs text-[var(--text-muted)]">
              Ditemukan <span className="font-bold text-[#0EAAFC]">{verseRules.length} hukum tajwid</span> pada ayat ini:
            </div>

            <div className="space-y-2.5 max-h-[45vh] overflow-y-auto pr-1">
              {verseRules.map(({ rule, samples }, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: rule.colorBadge }}
                      />
                      <h4 className="text-xs sm:text-sm font-bold text-[var(--text-main)]">
                        {rule.name}
                      </h4>
                    </div>
                    {rule.durasi && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                        {rule.durasi}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-[var(--text-muted)]">Contoh di ayat:</span>
                    {samples.map((s, sIdx) => (
                      <span
                        key={sIdx}
                        className="font-arabic font-bold text-xs px-2 py-0.5 rounded-md"
                        style={{
                          backgroundColor: rule.bgColor,
                          color: rule.textColor,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                    {rule.alasan}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3">
          {onOpenEducationCenter && (
            <button
              onClick={() => {
                onClose();
                onOpenEducationCenter();
              }}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#0EAAFC] hover:underline cursor-pointer"
            >
              <span>Buka Pusat Belajar Tajwid Lengkap</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onClose}
            className="ml-auto px-5 py-2 rounded-xl bg-[#0EAAFC] text-white text-xs font-bold shadow-xs hover:bg-[#0877B9] transition-all cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
