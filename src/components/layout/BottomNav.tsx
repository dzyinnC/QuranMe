import React from 'react';
import { BookOpen, Bookmark, Home, Search, Settings } from 'lucide-react';
import { PageId } from './Header';

interface BottomNavProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'home' as PageId, label: 'Beranda', icon: Home },
    { id: 'surah-list' as PageId, label: 'Surat', icon: BookOpen },
    { id: 'search' as PageId, label: 'Cari', icon: Search },
    { id: 'bookmarks' as PageId, label: 'Bookmark', icon: Bookmark },
    { id: 'settings' as PageId, label: 'Pengaturan', icon: Settings },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--nav-bg)] border-t border-[var(--border-main)] px-2 py-1 pb-[max(env(safe-area-inset-bottom),0.5rem)] transition-colors duration-150"
      aria-label="Navigasi Bawah"
    >
      <div className="grid grid-cols-5 items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentPage === item.id ||
            (item.id === 'surah-list' && currentPage === 'reader');

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center min-h-[46px] py-1 transition-colors cursor-pointer active:scale-95 ${
                isActive ? 'text-[#0EAAFC]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span
                className={`text-[11px] mt-0.5 tracking-tight ${
                  isActive ? 'font-semibold text-[#0EAAFC]' : 'font-normal'
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
