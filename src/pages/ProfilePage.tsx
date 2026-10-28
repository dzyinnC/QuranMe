import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Award,
  Bell,
  Bookmark,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Headphones,
  History,
  Info,
  LogOut,
  Mail,
  Moon,
  Palette,
  Shield,
  ShieldCheck,
  Sliders,
  Sparkles,
  Sun,
  Target,
  Trash2,
  User,
  Volume2,
} from 'lucide-react';
import { AuthModal } from '../components/auth/AuthModal';
import { MosqueSilhouette } from '../components/common/IslamicOrnaments';
import { toast } from '../components/common/Toast';
import { PageId } from '../components/layout/Header';
import { authService, UserProfile } from '../services/authService';
import { azanAudioService, AZAN_AUDIO_OPTIONS } from '../services/azanAudioService';
import { StorageService } from '../services/storageService';
import { ThemeBackground, UserSettings } from '../types/quran';

interface ProfilePageProps {
  onNavigate: (page: PageId, surahNomor?: number, ayatNomor?: number) => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onResetAllData: () => void;
  onOpenThemeModal?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onNavigate,
  settings,
  onUpdateSettings,
  onResetAllData,
  onOpenThemeModal,
}) => {
  const [user, setUser] = useState<UserProfile | null>(authService.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register' | 'verify'>('login');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Subscribe to auth state
  useEffect(() => {
    return authService.subscribe((u) => {
      setUser(u);
    });
  }, []);

  const handleLogout = () => {
    authService.logout();
    toast.show('Anda telah keluar dari akun. Mode Tamu aktif.');
  };

  const currentTheme = settings.themeBackground || 'light';

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

  const handleReset = () => {
    onResetAllData();
    setShowResetConfirm(false);
    toast.show('Data lokal dan preferensi berhasil direset', 'info');
  };

  const bookmarksCount = StorageService.getBookmarks().length;
  const todayAyatCount = StorageService.getTodayAyatCount();

  return (
    <div className="space-y-6 pb-28 animate-in fade-in duration-200">
      {/* 1. Header with Islamic Silhouette */}
      <div className="relative overflow-hidden rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6 shadow-xs flex items-center justify-between">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F6FF] text-[#0EAAFC] flex items-center justify-center shadow-xs">
              <User className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[var(--text-main)] tracking-tight">
                Profil Pengguna
              </h1>
              <p className="text-xs text-[var(--text-muted)] font-medium">
                Pusat akun, koleksi, riwayat, dan preferensi aplikasi
              </p>
            </div>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 text-[#0EAAFC] pointer-events-none opacity-20">
          <MosqueSilhouette className="w-36 h-24 text-[#0EAAFC]" opacity={1} />
        </div>
      </div>

      {/* 2. Account Profile Card (Logged-in vs Guest Mode) */}
      <section className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6 shadow-xs relative overflow-hidden">
        {user ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#0EAAFC] to-[#43B433] p-0.5 shadow-xs">
                  <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center font-black text-[#0877B9] text-xl">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-[var(--text-main)]">{user.name}</h2>
                    {user.isVerified ? (
                      <span className="text-[10px] font-bold text-[#43B433] bg-[#EAF7EE] px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                        Terverifikasi
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setAuthInitialMode('verify');
                          setIsAuthModalOpen(true);
                        }}
                        className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full hover:underline cursor-pointer"
                      >
                        Verifikasi Email
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">{user.email}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-2xl bg-[var(--bg-card-subtle)] hover:bg-red-50 hover:text-red-600 text-xs font-bold text-[var(--text-muted)] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F6FF] text-[#0EAAFC] flex items-center justify-center font-bold text-base shadow-xs">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[var(--text-main)]">Mode Tamu</h3>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      Penyimpanan Lokal
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Daftar akun gratis untuk mencadangkan tilawah dan bookmark Anda di cloud
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setAuthInitialMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-full bg-[#0EAAFC] hover:bg-[#0877B9] text-white text-xs font-bold shadow-xs transition-transform active:scale-95 cursor-pointer"
                >
                  Masuk Akun
                </button>
                <button
                  onClick={() => {
                    setAuthInitialMode('register');
                    setIsAuthModalOpen(true);
                  }}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-full bg-[#43B433] hover:bg-[#349b26] text-white text-xs font-bold shadow-xs transition-transform active:scale-95 cursor-pointer"
                >
                  Daftar Baru
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. Section: Koleksi & Riwayat Tilawah */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] px-1">
          Koleksi & Riwayat Tilawah
        </h3>

        <div className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] divide-y divide-[var(--border-subtle)] overflow-hidden shadow-xs">
          {/* Murottal & Qari */}
          <div
            onClick={() => onNavigate('murottal')}
            className="flex items-center justify-between p-4 sm:p-5 hover:bg-[var(--bg-card-subtle)] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#DDF3FF] text-[#0EAAFC] flex items-center justify-center">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-[var(--text-main)] block">
                  Murottal Al-Qur'an & Qari
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  Pilihan Qari Indonesia & Internasional terlengkap
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          {/* Bookmark & Catatan */}
          <div
            onClick={() => onNavigate('bookmarks')}
            className="flex items-center justify-between p-4 sm:p-5 hover:bg-[var(--bg-card-subtle)] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#DDF5E5] text-[#43B433] flex items-center justify-center">
                <Bookmark className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-[var(--text-main)] block">
                  Bookmark & Catatan Ayat ({bookmarksCount})
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  Ayat-ayat favorit yang Anda tandai
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          {/* Riwayat Bacaan */}
          <div
            onClick={() => onNavigate('history')}
            className="flex items-center justify-between p-4 sm:p-5 hover:bg-[var(--bg-card-subtle)] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#E8F6FF] text-[#0877B9] flex items-center justify-center">
                <History className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-[var(--text-main)] block">
                  Riwayat Bacaan & Statistik
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  Hari ini: {todayAyatCount} ayat selesai dibaca
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          {/* Pusat Belajar Tajwid & Waqaf */}
          <div
            onClick={() => onNavigate('tajweed-edu')}
            className="flex items-center justify-between p-4 sm:p-5 hover:bg-[var(--bg-card-subtle)] transition-colors cursor-pointer border-t border-[var(--border-subtle)]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0EAAFC]/20 to-[#43B433]/20 text-[#0EAAFC] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#0EAAFC]" />
              </div>
              <div>
                <span className="text-sm font-bold text-[var(--text-main)] block">
                  Pusat Belajar Tajwid & Waqaf
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  15 Bab kaidah tajwid, tanda waqaf Kemenag RI, & kuis
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </section>

      {/* 4. Section: Sistem Background & Tema */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Sistem Background & Tema
          </h3>
          <button
            onClick={onOpenThemeModal}
            className="text-xs font-bold text-[#0EAAFC] hover:underline cursor-pointer"
          >
            Lihat Dialog &rsaquo;
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Light Card */}
          <button
            type="button"
            onClick={() => handleSelectTheme('light')}
            className={`flex flex-col items-center text-center p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
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
            <Sun className="w-6 h-6 text-amber-500 mb-1.5" />
            <span className="text-xs font-bold text-[var(--text-main)]">Light</span>
            <span className="text-[10px] text-[var(--text-muted)]">Bersih & fokus</span>
          </button>

          {/* Dark Card */}
          <button
            type="button"
            onClick={() => handleSelectTheme('dark')}
            className={`flex flex-col items-center text-center p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
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
            <Moon className="w-6 h-6 text-sky-400 mb-1.5" />
            <span className="text-xs font-bold text-[var(--text-main)]">Dark</span>
            <span className="text-[10px] text-[var(--text-muted)]">Menenangkan</span>
          </button>

          {/* Premium Gradient Card */}
          <button
            type="button"
            onClick={() => handleSelectTheme('premium')}
            className={`flex flex-col items-center text-center p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
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
            <Sparkles className="w-6 h-6 text-[#43B433] mb-1.5" />
            <span className="text-xs font-bold text-[var(--text-main)]">Premium</span>
            <span className="text-[10px] text-[var(--text-muted)]">Magical Aurora</span>
          </button>
        </div>
      </section>

      {/* 5. Section: Tipografi Mushaf & Pembacaan */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] px-1">
          Pengaturan Teks & Pembacaan
        </h3>

        <div className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] divide-y divide-[var(--border-subtle)] overflow-hidden shadow-xs">
          {/* Ukuran Teks Arab */}
          <div className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-[var(--text-main)] block">
                Ukuran Teks Arab
              </span>
              <span className="text-xs text-[var(--text-muted)]">
                Kenyamanan membaca huruf hijaiyah
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
                Ukuran Terjemahan
              </span>
              <span className="text-xs text-[var(--text-muted)]">
                Keterbacaan terjemahan Kemenag RI
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
                Transliterasi Latin Fonetik
              </span>
              <span className="text-xs text-[var(--text-muted)]">
                Tampilkan ejaan latin di bawah ayat
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
        </div>
      </section>

      {/* 6. Section: Pengelolaan Data Lokal */}
      <section className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[var(--text-main)]">
          Pengelolaan Data Lokal & Bantuan
        </h3>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          Seluruh data pembacaan tersimpan aman di peramban Anda. Anda dapat mereset data kapan saja.
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
              <span>Konfirmasi Hapus Data</span>
            </div>
            <p className="text-[11px] text-red-600/80 dark:text-red-300">
              Tindakan ini akan mengosongkan riwayat tilawah, bookmark, dan pengaturan lokal.
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

        <div className="pt-3 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] space-y-1">
          <p>
            <strong>QuranMe v3.3</strong> · Sumber data Al-Qur'an: EQuran.id API v2 & Kemenag RI
          </p>
          <p>Kalkulasi Jadwal Salat & Kalender: Metode Astronomis MABIMS Kemenag RI</p>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authInitialMode}
      />
    </div>
  );
};
