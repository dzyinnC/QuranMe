import React from 'react';
import { BookOpen, Bookmark, Compass, Home, Sparkles, User } from 'lucide-react';
import { PageId } from './Header';

interface BottomNavProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'home' as PageId, label: 'Beranda', icon: Home },
    { id: 'surah-list' as PageId, label: "Al-Qur'an", icon: BookOpen },
    { id: 'ibadah' as PageId, label: 'Ibadah', icon: Sparkles },
    { id: 'qibla' as PageId, label: 'Arah Kiblat', icon: Compass },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--nav-bg)] border-t border-[var(--border-main)] px-3 py-1.5 pb-[max(env(safe-area-inset-bottom),0.5rem)] transition-colors duration-150 backdrop-blur-md"
      aria-label="Navigasi Bawah"
    >
      <div className="grid grid-cols-4 items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentPage === item.id ||
            (item.id === 'surah-list' && currentPage === 'reader');

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center min-h-[46px] py-1 transition-all cursor-pointer active:scale-95 ${
                isActive
                  ? 'text-[#0EAAFC]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-colors ${
                  isActive ? 'bg-[#E8F6FF] dark:bg-sky-950/40 text-[#0EAAFC]' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight ${
                  isActive ? 'font-bold text-[#0EAAFC]' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
