import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  Check,
  ChevronRight,
  Download,
  Info,
  Moon,
  RotateCcw,
  Sliders,
  Sparkles,
  Sun,
  Trash2,
  Type,
  User,
  Volume2,
} from 'lucide-react';
import { MosqueSilhouette } from '../components/common/IslamicOrnaments';
import { PWAInstallButton } from '../components/common/PWAInstallButton';
import { toast } from '../components/common/Toast';
import { ALL_QARI, INDONESIAN_QARI, INTERNATIONAL_QARI } from '../config/appConfig';
import { StorageService } from '../services/storageService';
import { ThemeBackground, UserSettings } from '../types/quran';

interface SettingsPageProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onResetAllData: () => void;
  onBack?: () => void;
  onOpenThemeModal?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
  onResetAllData,
  onBack,
  onOpenThemeModal,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const currentTheme = settings.themeBackground || 'light';

  const handleReset = () => {
    onResetAllData();
    setShowResetConfirm(false);
    toast.show('Data lokal dan preferensi berhasil direset', 'info');
  };

  const handleSelectTheme = (theme: ThemeBackground) => {
    onUpdateSettings({ themeBackground: theme });
    const label =
      theme === 'light'
        ? 'Standard Light (Putih)'
        : theme === 'dark'
        ? 'Standard Dark (Hitam)'
        : 'Premium Gradient';
    toast.show(`Tema diubah: ${label}`);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* 1. Header (Matching Reference Screen 9) */}
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
            Pengaturan
          </h1>
        </div>
      </div>

      {/* 2. User Profile Card (Matching Reference Screen 9) */}
      <div className="relative overflow-hidden rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] p-5 sm:p-6 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#0EAAFC] to-[#43B433] p-0.5 shadow-xs">
            <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center font-bold text-[#0877B9] text-xl">
              A
            </div>
          </div>

          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-[var(--text-main)]">Ahmad</h2>
            <p className="text-xs text-[var(--text-muted)]">ahmad@example.com</p>
            <span className="text-[10px] font-semibold text-[#43B433] bg-[#EAF7EE] px-2 py-0.5 rounded-full inline-block">
              Akun Aktif
            </span>
          </div>
        </div>

        {/* Subtle Mosque Silhouette watermark */}
        <div className="absolute right-0 bottom-0 text-[#0EAAFC] pointer-events-none opacity-15">
          <MosqueSilhouette className="w-32 h-20 text-[#0EAAFC]" opacity={1} />
        </div>
      </div>

      {/* 3. Account & Notifications List Items */}
      <div className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] divide-y divide-[var(--border-subtle)] overflow-hidden shadow-xs">
        <div className="flex items-center justify-between p-4 sm:p-5 hover:bg-[var(--bg-card-subtle)] transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-[#0EAAFC]" />
            <span className="text-sm font-semibold text-[var(--text-main)]">
              Akun & Profil
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        <div className="flex items-center justify-between p-4 sm:p-5 hover:bg-[var(--bg-card-subtle)] transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-[#43B433]" />
            <span className="text-sm font-semibold text-[var(--text-main)]">
              Notifikasi Pengingat
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* 4. Section: Sistem Background & Tema (3 Visual Cards Matching Reference Screen 9) */}
      <section className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0EAAFC]" />
            <h3 className="text-sm font-bold text-[var(--text-main)]">
              Sistem Background & Tema
            </h3>
          </div>
          <button
            onClick={onOpenThemeModal}
            className="text-xs font-semibold text-[#0EAAFC] hover:text-[#0877B9] cursor-pointer"
          >
            Pilih Tema &rsaquo;
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Light Card */}
          <button
            type="button"
            onClick={() => handleSelectTheme('light')}
            className={`flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
              currentTheme === 'light'
                ? 'border-[#0EAAFC] bg-[#E8F6FF]/60 shadow-xs'
                : 'border-[var(--border-main)] bg-[var(--bg-card)] hover:border-slate-300'
            }`}
          >
            {currentTheme === 'light' && (
              <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#0EAAFC] text-white flex items-center justify-center text-[10px]">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
            <Sun className="w-6 h-6 text-amber-500 mb-2" />
            <span className="text-xs font-bold text-[var(--text-main)]">Light</span>
            <span className="text-[10px] text-[var(--text-muted)] mt-0.5">Bersih & fokus</span>
          </button>

          {/* Dark Card */}
          <button
            type="button"
            onClick={() => handleSelectTheme('dark')}
            className={`flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
              currentTheme === 'dark'
                ? 'border-[#0EAAFC] bg-slate-900 shadow-xs'
                : 'border-[var(--border-main)] bg-[var(--bg-card)] hover:border-slate-300'
            }`}
          >
            {currentTheme === 'dark' && (
              <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#0EAAFC] text-white flex items-center justify-center text-[10px]">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
            <Moon className="w-6 h-6 text-sky-400 mb-2" />
            <span className="text-xs font-bold text-[var(--text-main)]">Dark</span>
            <span className="text-[10px] text-[var(--text-muted)] mt-0.5">Menenangkan</span>
          </button>

          {/* Premium Gradient Card */}
          <button
            type="button"
            onClick={() => handleSelectTheme('premium')}
            className={`flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
              currentTheme === 'premium'
                ? 'border-[#43B433] bg-[#EAF7EE] shadow-xs'
                : 'border-[var(--border-main)] bg-[var(--bg-card)] hover:border-emerald-300'
            }`}
          >
            {currentTheme === 'premium' && (
              <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#43B433] text-white flex items-center justify-center text-[10px]">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
            <Sparkles className="w-6 h-6 text-[#43B433] mb-2" />
            <span className="text-xs font-bold text-[var(--text-main)]">Premium</span>
            <span className="text-[10px] text-[var(--text-muted)] mt-0.5">Magical Aurora</span>
          </button>
        </div>
      </section>

      {/* 5. Reading Preferences: Typography & Toggles */}
      <section className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] divide-y divide-[var(--border-subtle)] overflow-hidden shadow-xs">
        {/* Ukuran Teks Arab */}
        <div className="p-4 sm:p-5 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-sm font-semibold text-[var(--text-main)] block">
              Ukuran Teks Arab
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              Sesuaikan keterbacaan huruf hijaiyah
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min={24}
              max={44}
              value={settings.arabicFontSize || 32}
              onChange={(e) => onUpdateSettings({ arabicFontSize: parseInt(e.target.value, 10) })}
              className="w-24 sm:w-32 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0EAAFC]"
            />
            <span className="text-xs font-bold text-[#0EAAFC] font-mono min-w-[42px] text-right">
              {settings.arabicFontSize || 32} px
            </span>
          </div>
        </div>

        {/* Ukuran Terjemahan Indonesia */}
        <div className="p-4 sm:p-5 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-sm font-semibold text-[var(--text-main)] block">
              Ukuran Terjemahan Indonesia
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              Kenyamanan membaca arti perkata
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min={13}
              max={22}
              value={settings.translationFontSize || 15}
              onChange={(e) =>
                onUpdateSettings({ translationFontSize: parseInt(e.target.value, 10) })
              }
              className="w-24 sm:w-32 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0EAAFC]"
            />
            <span className="text-xs font-bold text-[#0EAAFC] font-mono min-w-[42px] text-right">
              {settings.translationFontSize || 15} px
            </span>
          </div>
        </div>

        {/* Toggle Transliterasi Latin */}
        <div className="p-4 sm:p-5 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-sm font-semibold text-[var(--text-main)] block">
              Tampilan Transliterasi Latin
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              Panduan bacaan fonetik latin Indonesia
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showLatin}
              onChange={(e) => onUpdateSettings({ showLatin: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#43B433]"></div>
          </label>
        </div>
      </section>

      {/* 6. Tilawah Target & Default Qari */}
      <section className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[var(--text-main)]">
          Target Tilawah & Murottal Bawaan
        </h3>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1.5">
              Target Tilawah Harian (Ayat per Hari)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 20, 30].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onUpdateSettings({ dailyTargetAyat: t })}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    settings.dailyTargetAyat === t
                      ? 'bg-[#43B433] text-white shadow-xs'
                      : 'bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {t} Ayat
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <label className="text-xs font-semibold text-[var(--text-muted)] block mb-1.5">
              Qari Murottal Default
            </label>
            <select
              value={settings.defaultQari}
              onChange={(e) => onUpdateSettings({ defaultQari: e.target.value })}
              className="w-full p-3 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-main)] text-xs font-medium text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[#0EAAFC]/30"
            >
              <optgroup label="Qari Indonesia">
                {INDONESIAN_QARI.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.name} (Indonesia)
                  </option>
                ))}
              </optgroup>
              <optgroup label="Qari Internasional">
                {INTERNATIONAL_QARI.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.name} ({q.country})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
      </section>

      {/* 7. Local Data Management */}
      <section className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[var(--text-main)]">
          Pengelolaan Data Lokal
        </h3>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          Seluruh riwayat, bookmark, dan catatan disimpan di memori perangkat lokal Anda.
        </p>

        {!showResetConfirm ? (
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2.5 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset Seluruh Data Lokal</span>
          </button>
        ) : (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 space-y-3">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>Konfirmasi Hapus Seluruh Data</span>
            </div>
            <p className="text-[11px] text-red-600/80 dark:text-red-300">
              Tindakan ini akan mengosongkan riwayat bacaan, bookmark, dan catatan pribadi Anda.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
              >
                Ya, Reset Sekarang
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-[var(--text-main)] text-xs font-bold border border-slate-200 cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
