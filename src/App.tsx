/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Header, PageId } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { OfflineBanner } from './components/common/OfflineBanner';
import { ToastContainer, toast } from './components/common/Toast';
import { MiniPlayer } from './components/audio/MiniPlayer';
import { HomePage } from './pages/HomePage';
import { SurahListPage } from './pages/SurahListPage';
import { ReaderPage } from './pages/ReaderPage';
import { SearchPage } from './pages/SearchPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { SettingsPage } from './pages/SettingsPage';
import { StorageService } from './services/storageService';
import { audioService } from './services/audioService';
import { ThemeBackground, UserSettings } from './types/quran';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [selectedSurahNomor, setSelectedSurahNomor] = useState<number>(1);
  const [selectedAyatNomor, setSelectedAyatNomor] = useState<number>(1);
  const [settings, setSettings] = useState<UserSettings>(StorageService.getSettings());

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

  const handleCycleTheme = () => {
    const current = settings.themeBackground || 'light';
    const next: ThemeBackground =
      current === 'light' ? 'dark' : current === 'dark' ? 'premium' : 'light';
    handleUpdateSettings({ themeBackground: next });
    const label =
      next === 'light'
        ? 'Standard Light (Putih)'
        : next === 'dark'
        ? 'Standard Dark (Hitam)'
        : 'Premium Gradient';
    toast.show(`Tema diubah: ${label}`);
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
          <div className="aurora-blob-3" />
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
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-28 md:pb-16 relative z-10">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={(p, s, a) => handleNavigate(p, s, a)}
            settings={settings}
          />
        )}

        {currentPage === 'surah-list' && (
          <SurahListPage
            onSelectSurah={(surahNum) => {
              handleNavigate('reader', surahNum, 1);
            }}
          />
        )}

        {currentPage === 'reader' && (
          <ReaderPage
            surahNomor={selectedSurahNomor}
            initialAyatNomor={selectedAyatNomor}
            onNavigateSurah={(surahNum, ayatNum = 1) => {
              handleNavigate('reader', surahNum, ayatNum);
            }}
            onBackToList={() => setCurrentPage('surah-list')}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        )}

        {currentPage === 'search' && (
          <SearchPage
            onNavigateToAyat={(sNum, aNum) => {
              handleNavigate('reader', sNum, aNum);
            }}
          />
        )}

        {currentPage === 'bookmarks' && (
          <BookmarksPage
            onNavigateToAyat={(sNum, aNum) => {
              handleNavigate('reader', sNum, aNum);
            }}
          />
        )}

        {currentPage === 'settings' && (
          <SettingsPage
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResetAllData={handleResetAllData}
          />
        )}
      </main>

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
