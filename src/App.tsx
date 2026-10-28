/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Header, PageId } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { OfflineBanner } from './components/common/OfflineBanner';
import { ToastContainer, toast } from './components/common/Toast';
import { ThemeModal } from './components/common/ThemeModal';
import { MiniPlayer } from './components/audio/MiniPlayer';
import { HomePage } from './pages/HomePage';
import { SurahListPage } from './pages/SurahListPage';
import { ReaderPage } from './pages/ReaderPage';
import { SearchPage } from './pages/SearchPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { SettingsPage } from './pages/SettingsPage';
import { IbadahPage } from './pages/IbadahPage';
import { QiblaPage } from './pages/QiblaPage';
import { ProfilePage } from './pages/ProfilePage';
import { TajweedEducationPage } from './pages/TajweedEducationPage';
import { MurottalPage } from './pages/MurottalPage';
import { HistoryPage } from './pages/HistoryPage';
import { StorageService } from './services/storageService';
import { audioService } from './services/audioService';
import { ThemeBackground, UserSettings } from './types/quran';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [selectedSurahNomor, setSelectedSurahNomor] = useState<number>(1);
  const [selectedAyatNomor, setSelectedAyatNomor] = useState<number>(1);
  const [settings, setSettings] = useState<UserSettings>(StorageService.getSettings());
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);

  // Apply theme dynamically to document element
  useEffect(() => {
    const theme = settings.themeBackground || 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }, [settings.themeBackground]);

  // Initialize audio service default qari from settings
  useEffect(() => {
    if (settings.defaultQari) {
      audioService.setQari(settings.defaultQari);
    }
  }, [settings.defaultQari]);

  const handleNavigate = (page: PageId, surahNomor?: number, ayatNomor?: number) => {
    setCurrentPage(page);
    if (surahNomor) {
      setSelectedSurahNomor(surahNomor);
    }
    if (ayatNomor) {
      setSelectedAyatNomor(ayatNomor);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = StorageService.saveSettings(newSettings);
    setSettings(updated);
    if (newSettings.defaultQari) {
      audioService.setQari(newSettings.defaultQari);
    }
  };

  const handleApplyTheme = (theme: ThemeBackground) => {
    handleUpdateSettings({ themeBackground: theme });
    const label =
      theme === 'light'
        ? 'Standard Light (Putih)'
        : theme === 'dark'
        ? 'Standard Dark (Hitam)'
        : 'Premium Gradient';
    toast.show(`Tema diubah: ${label}`);
  };

  const handleCycleTheme = () => {
    const current = settings.themeBackground || 'light';
    const next: ThemeBackground =
      current === 'light' ? 'dark' : current === 'dark' ? 'premium' : 'light';
    handleApplyTheme(next);
  };

  const handleResetAllData = () => {
    StorageService.resetAllData();
    const freshSettings = StorageService.getSettings();
    setSettings(freshSettings);
    audioService.stop();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-main)] flex flex-col font-sans selection:bg-[#E8F6FF] selection:text-[#0877B9] transition-colors duration-150 relative">
      {/* Soft Magical Aurora Ambient Canvas (renders only when Premium Gradient is active) */}
      {settings.themeBackground === 'premium' && (
        <div className="aurora-container pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">
          <div className="aurora-blob-1" />
          <div className="aurora-blob-2" />
          <div className="aurora-overlay" />
        </div>
      )}

      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Offline Status Alert */}
      <OfflineBanner />

      {/* Primary Top Bar (Desktop & Mobile Header) */}
      <Header
        currentPage={currentPage}
        onNavigate={(p, s, a) => handleNavigate(p, s, a)}
        theme={settings.themeBackground || 'light'}
        onToggleTheme={handleCycleTheme}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-28 md:pb-16 relative z-10">
        {/* Layar 1 — Beranda / Dashboard */}
        {currentPage === 'home' && (
          <HomePage
            onNavigate={(p, s, a) => handleNavigate(p, s, a)}
            settings={settings}
            onOpenThemeModal={() => setIsThemeModalOpen(true)}
          />
        )}

        {/* Layar 2 — Daftar Surah */}
        {currentPage === 'surah-list' && (
          <SurahListPage
            onSelectSurah={(surahNum, ayatNum = 1) => {
              handleNavigate('reader', surahNum, ayatNum);
            }}
            onOpenTajweedEdu={() => handleNavigate('tajweed-edu')}
          />
        )}

        {/* Layar 3 — Membaca Al-Qur'an (Reader) */}
        {currentPage === 'reader' && (
          <ReaderPage
            surahNomor={selectedSurahNomor}
            initialAyatNomor={selectedAyatNomor}
            onNavigateSurah={(surahNum, ayatNum = 1) => {
              handleNavigate('reader', surahNum, ayatNum);
            }}
            onBackToList={() => setCurrentPage('surah-list')}
            onOpenTajweedEdu={() => handleNavigate('tajweed-edu')}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        )}

        {/* Layar Tambahan — Pusat Belajar Tajwid & Waqaf */}
        {currentPage === 'tajweed-edu' && (
          <TajweedEducationPage
            onBack={() => handleNavigate('surah-list')}
            onOpenSurah={(sNum) => handleNavigate('reader', sNum, 1)}
          />
        )}

        {/* Layar 4 — Murottal Al-Qur'an */}
        {currentPage === 'murottal' && (
          <MurottalPage
            onBack={() => handleNavigate('home')}
            onOpenSurah={(surahNum) => {
              handleNavigate('reader', surahNum, 1);
            }}
          />
        )}

        {/* Layar 5 — Ibadah & Doa */}
        {currentPage === 'ibadah' && (
          <IbadahPage
            onBack={() => handleNavigate('home')}
          />
        )}

        {/* Layar Tambahan — Arah Kiblat (Menu Utama #4) */}
        {currentPage === 'qibla' && (
          <QiblaPage
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {/* Layar Tambahan — Profil Pengguna & Pusat Akun/Pengaturan */}
        {(currentPage === 'profile' || currentPage === 'settings') && (
          <ProfilePage
            onNavigate={(p, s, a) => handleNavigate(p, s, a)}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResetAllData={handleResetAllData}
            onOpenThemeModal={() => setIsThemeModalOpen(true)}
          />
        )}

        {/* Layar 6 — Bookmark */}
        {currentPage === 'bookmarks' && (
          <BookmarksPage
            onNavigateToAyat={(sNum, aNum) => {
              handleNavigate('reader', sNum, aNum);
            }}
          />
        )}

        {/* Layar 7 — Riwayat Bacaan */}
        {currentPage === 'history' && (
          <HistoryPage
            onBack={() => handleNavigate('home')}
            onOpenSurah={(sNum, aNum) => {
              handleNavigate('reader', sNum, aNum);
            }}
          />
        )}

        {/* Layar 8 — Pencarian Global */}
        {currentPage === 'search' && (
          <SearchPage
            onNavigateToAyat={(sNum, aNum) => {
              handleNavigate('reader', sNum, aNum);
            }}
            onBack={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Layar 10 — Dialog Pilih Tema (Pilih Tema Modal) */}
      <ThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={settings.themeBackground || 'light'}
        onSelectTheme={handleApplyTheme}
      />

      {/* Floating Audio MiniPlayer (active when audio is loaded/playing) */}
      <MiniPlayer
        onOpenSurah={(sNum, aNum) => {
          handleNavigate('reader', sNum, aNum || 1);
        }}
      />

      {/* Mobile-Only Bottom Nav (Hidden on Desktop) */}
      <BottomNav
        currentPage={currentPage}
        onNavigate={(p) => handleNavigate(p)}
      />
    </div>
  );
}
