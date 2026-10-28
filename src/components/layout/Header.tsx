import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Compass,
  Home,
  Moon,
  Palette,
  Sparkles,
  Sun,
  User,
} from 'lucide-react';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { authService, UserProfile } from '../../services/authService';
import { StorageService } from '../../services/storageService';
import { ThemeBackground } from '../../types/quran';

export type PageId =
  | 'home'
  | 'surah-list'
  | 'ibadah'
  | 'qibla'
  | 'profile'
  | 'reader'
  | 'search'
  | 'bookmarks'
  | 'murottal'
  | 'history'
  | 'settings'
  | 'tajweed-edu';

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
  const [user, setUser] = useState<UserProfile | null>(authService.getCurrentUser());

  useEffect(() => {
    return authService.subscribe((u) => setUser(u));
  }, []);

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

        {/* Zone 2: Exactly 4 Main Menus (Desktop Navigation) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[var(--text-muted)]">
          {/* 1. Beranda */}
          <button
            onClick={() => onNavigate('home')}
            className={`flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors py-1 ${
              currentPage === 'home'
                ? 'text-[#0EAAFC] font-bold border-b-2 border-[#0EAAFC]'
                : 'hover:text-[var(--text-main)]'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Beranda</span>
          </button>

          {/* 2. Al-Qur'an */}
          <button
            onClick={() => onNavigate('surah-list')}
            className={`flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors py-1 ${
              currentPage === 'surah-list' || currentPage === 'reader'
                ? 'text-[#0EAAFC] font-bold border-b-2 border-[#0EAAFC]'
                : 'hover:text-[var(--text-main)]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Al-Qur'an</span>
          </button>

          {/* 3. Ibadah */}
          <button
            onClick={() => onNavigate('ibadah')}
            className={`flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors py-1 ${
              currentPage === 'ibadah'
                ? 'text-[#0EAAFC] font-bold border-b-2 border-[#0EAAFC]'
                : 'hover:text-[var(--text-main)]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#43B433]" />
            <span>Ibadah</span>
          </button>

          {/* 4. Arah Kiblat */}
          <button
            onClick={() => onNavigate('qibla')}
            className={`flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors py-1 ${
              currentPage === 'qibla'
                ? 'text-[#0EAAFC] font-bold border-b-2 border-[#0EAAFC]'
                : 'hover:text-[var(--text-main)]'
            }`}
          >
            <Compass className="w-4 h-4 text-[#0EAAFC]" />
            <span>Arah Kiblat</span>
          </button>
        </nav>

        {/* Zone 3: Actions & Profil Pengguna Button */}
        <div className="flex items-center gap-2.5 shrink-0">
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

          {/* User Profile Avatar / Hub Button */}
          <button
            onClick={() => onNavigate('profile')}
            className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full transition-all cursor-pointer active:scale-95 ${
              currentPage === 'profile'
                ? 'bg-[#E8F6FF] text-[#0EAAFC] ring-2 ring-[#0EAAFC]/30'
                : 'bg-[var(--bg-card-subtle)] hover:bg-[var(--border-main)] text-[var(--text-main)]'
            }`}
            title="Profil Pengguna & Pengaturan"
            aria-label="Buka Profil Pengguna"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#0EAAFC] to-[#43B433] text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
              {user ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
            </div>
            <span className="text-xs font-bold hidden sm:inline max-w-[100px] truncate">
              {user ? user.name : 'Profil'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

