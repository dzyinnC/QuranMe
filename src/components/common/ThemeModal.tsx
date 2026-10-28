import React, { useState } from 'react';
import { Check, Sparkles, Sun, Moon, X } from 'lucide-react';
import { ThemeBackground } from '../../types/quran';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeBackground;
  onSelectTheme: (theme: ThemeBackground) => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
}) => {
  const [selected, setSelected] = useState<ThemeBackground>(currentTheme);

  if (!isOpen) return null;

  const handleApply = () => {
    onSelectTheme(selected);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-theme-title"
    >
      <div
        className="w-full sm:max-w-md bg-[var(--bg-card)] rounded-t-3xl sm:rounded-3xl border border-[var(--border-main)] shadow-2xl overflow-hidden modal-pop p-6 space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
          <div>
            <h3 id="modal-theme-title" className="text-xl font-bold text-[var(--text-main)]">
              Pilih Tema
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Ubah tampilan aplikasi sesuai dengan preferensi Anda
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[var(--bg-card-subtle)] hover:bg-[var(--border-main)] text-[var(--text-muted)] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Tutup dialog pilih tema"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Theme Options */}
        <div className="grid grid-cols-3 gap-3">
          {/* 1. Light Option */}
          <button
            type="button"
            onClick={() => setSelected('light')}
            className={`flex flex-col items-center text-center p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative group ${
              selected === 'light'
                ? 'border-[#0EAAFC] bg-[#E8F6FF]/50 shadow-xs'
                : 'border-[var(--border-main)] bg-[var(--bg-card)] hover:border-slate-300'
            }`}
          >
            {selected === 'light' && (
              <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#0EAAFC] text-white flex items-center justify-center text-[10px]">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
            <div className="w-12 h-16 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col items-center justify-center gap-1.5 p-1 mb-2.5">
              <Sun className="w-5 h-5 text-amber-500" />
              <div className="w-6 h-1 bg-slate-200 rounded-full" />
              <div className="w-4 h-1 bg-slate-100 rounded-full" />
            </div>
            <span className="text-xs font-bold text-[var(--text-main)]">Light</span>
            <span className="text-[10px] text-[var(--text-muted)] mt-0.5 leading-tight">
              Bersih & fokus
            </span>
          </button>

          {/* 2. Dark Option */}
          <button
            type="button"
            onClick={() => setSelected('dark')}
            className={`flex flex-col items-center text-center p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative group ${
              selected === 'dark'
                ? 'border-[#0EAAFC] bg-[#E8F6FF]/50 dark:bg-sky-950/30 shadow-xs'
                : 'border-[var(--border-main)] bg-[var(--bg-card)] hover:border-slate-300'
            }`}
          >
            {selected === 'dark' && (
              <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#0EAAFC] text-white flex items-center justify-center text-[10px]">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
            <div className="w-12 h-16 rounded-xl bg-[#121820] border border-slate-700 shadow-xs flex flex-col items-center justify-center gap-1.5 p-1 mb-2.5">
              <Moon className="w-5 h-5 text-sky-400" />
              <div className="w-6 h-1 bg-slate-700 rounded-full" />
              <div className="w-4 h-1 bg-slate-800 rounded-full" />
            </div>
            <span className="text-xs font-bold text-[var(--text-main)]">Dark</span>
            <span className="text-[10px] text-[var(--text-muted)] mt-0.5 leading-tight">
              Menenangkan mata
            </span>
          </button>

          {/* 3. Premium Gradient Option */}
          <button
            type="button"
            onClick={() => setSelected('premium')}
            className={`flex flex-col items-center text-center p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative group ${
              selected === 'premium'
                ? 'border-[#43B433] bg-[#EAF7EE] shadow-xs'
                : 'border-[var(--border-main)] bg-[var(--bg-card)] hover:border-emerald-300'
            }`}
          >
            {selected === 'premium' && (
              <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#43B433] text-white flex items-center justify-center text-[10px]">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
            <div className="w-12 h-16 rounded-xl bg-gradient-to-br from-[#BFE8FF] via-[#D8F7F1] to-[#DDF5E5] border border-emerald-200 shadow-xs flex flex-col items-center justify-center gap-1.5 p-1 mb-2.5">
              <Sparkles className="w-5 h-5 text-[#43B433]" />
              <div className="w-6 h-1 bg-[#0EAAFC]/40 rounded-full" />
              <div className="w-4 h-1 bg-[#43B433]/40 rounded-full" />
            </div>
            <span className="text-xs font-bold text-[var(--text-main)]">Premium Gradient</span>
            <span className="text-[10px] text-[var(--text-muted)] mt-0.5 leading-tight">
              Elegan & menenangkan
            </span>
          </button>
        </div>

        {/* Action Button */}
        <div>
          <button
            type="button"
            onClick={handleApply}
            className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#43B433] to-[#2E8B22] hover:from-[#3BA02C] hover:to-[#25751C] text-white font-bold text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Terapkan Tema</span>
          </button>
        </div>
      </div>
    </div>
  );
};
