import React from 'react';
import {
  BookOpen,
  Bookmark,
  Compass,
  Headphones,
  History,
  Home,
  Moon,
  Palette,
  Search,
  Settings,
  Sparkles,
  Sun,
} from 'lucide-react';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { StorageService } from '../../services/storageService';
import { ThemeBackground } from '../../types/quran';

export type PageId =
  | 'home'
  | 'surah-list'
  | 'reader'
  | 'search'
  | 'bookmarks'
  | 'settings'
  | 'ibadah'
  | 'murottal'
  | 'history';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId, surahNomor?: number, ayatNomor?: number) => void;
  theme?: ThemeBackground;
  onToggleTheme?: () => void;
  onOpenThemeModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  theme = 'light',
  onToggleTheme,
  onOpenThemeModal,
}) => {
  const lastRead = StorageService.getLastRead();

  return (
    <header className="sticky top-0 z-40 bg-[var(--header-bg)] border-b border-[var(--border-main)] transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left cursor-pointer group shrink-0"
        >
          <img
            src="/icon.png"
            alt="QuranMe"
            className="w-8 h-8 rounded-full shadow-xs object-cover"
          />
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-[#0EAAFC] group-hover:text-[#0877B9] transition-colors leading-tight">
              Quran<span className="text-[#43B433]">Me</span>
            </span>
            <span className="text-[10px] text-[var(--text-muted)] -mt-0.5 hidden sm:inline">
              Al-Qur'an Digital
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-[var(--text-muted)]">
          <button
            onClick={() => onNavigate('home')}
            className={`flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors py-1 ${
              currentPage === 'home'
                ? 'text-[#0EAAFC] font-semibold border-b-2 border-[#0EAAFC]'
                : 'hover:text-[var(--text-main)]'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Beranda</span>
          </button>

          <button
            onClick={() => onNavigate('surah-list')}
            className={`flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors py-1 ${
              currentPage === 'surah-list' || currentPage === 'reader'
                ? 'text-[#0EAAFC] font-semibold border-b-2 border-[#0EAAFC]'
                : 'hover:text-[var(--text-main)]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Al-Qur'an</span>
          </button>

          <button
            onClick={() => onNavigate('murottal')}
            className={`flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors py-1 ${
              currentPage === 'murottal'
                ? 'text-[#0EAAFC] font-semibold border-b-2 border-[#0EAAFC]'
                : 'hover:text-[var(--text-main)]'
            }`}
          >
            <Headphones className="w-4 h-4" />
            <span>Murottal</span>
          </button>

          <button
            onClick={() => onNavigate('ibadah')}
            className={`flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors py-1 ${
              currentPage === 'ibadah'
                ? 'text-[#0EAAFC] font-semibold border-b-2 border-[#0EAAFC]'
                : 'hover:text-[var(--text-main)]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Ibadah & Doa</span>
          </button>

          <button
            onClick={() => onNavigate('bookmarks')}
            className={`flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors py-1 ${
              currentPage === 'bookmarks'
                ? 'text-[#0EAAFC] font-semibold border-b-2 border-[#0EAAFC]'
                : 'hover:text-[var(--text-main)]'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Bookmark</span>
          </button>

          <button
            onClick={() => onNavigate('history')}
            className={`flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors py-1 ${
              currentPage === 'history'
                ? 'text-[#0EAAFC] font-semibold border-b-2 border-[#0EAAFC]'
                : 'hover:text-[var(--text-main)]'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Riwayat</span>
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className={`flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors py-1 ${
              currentPage === 'settings'
                ? 'text-[#0EAAFC] font-semibold border-b-2 border-[#0EAAFC]'
                : 'hover:text-[var(--text-main)]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Pengaturan</span>
          </button>
        </nav>

        {/* Zone 3: Quick Theme Switcher & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme Palette Button (Opens official Screen 10 Modal) */}
          <button
            onClick={onOpenThemeModal || onToggleTheme}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-subtle)] transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
            title={`Tema saat ini: ${
              theme === 'light'
                ? 'Standard Light'
                : theme === 'dark'
                ? 'Standard Dark'
                : 'Premium Gradient'
            }. Klik untuk memilih tema.`}
            aria-label="Buka dialog pilih tema"
          >
            {theme === 'light' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : theme === 'dark' ? (
              <Moon className="w-4 h-4 text-sky-400" />
            ) : (
              <Sparkles className="w-4 h-4 text-[#43B433]" />
            )}
            <Palette className="w-3.5 h-3.5 opacity-60 hidden sm:inline" />
          </button>

          <PWAInstallButton variant="header" />

          {lastRead ? (
            <button
              onClick={() => onNavigate('reader', lastRead.surahNomor, lastRead.ayatNomor)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-[var(--badge-blue-bg)] text-[var(--badge-blue-text)] hover:bg-[#0EAAFC] hover:text-white transition-all cursor-pointer whitespace-nowrap active:scale-95"
              title={`Lanjut membaca: ${lastRead.surahNamaLatin} Ayat ${lastRead.ayatNomor}`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lanjut:</span>
              <span className="font-semibold truncate max-w-[120px]">{lastRead.surahNamaLatin} : {lastRead.ayatNomor}</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('reader', 1, 1)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#0EAAFC] text-white hover:bg-[#0877B9] transition-colors cursor-pointer whitespace-nowrap active:scale-95"
            >
              Mulai Baca
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
