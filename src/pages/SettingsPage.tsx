import React, { useState } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  Download,
  Info,
  Moon,
  Palette,
  RotateCcw,
  Sliders,
  Sparkles,
  Sun,
  Trash2,
  Volume2,
} from 'lucide-react';
import { ALL_QARI, APP_CONFIG, BRAND_IDENTITY, INDONESIAN_QARI, INTERNATIONAL_QARI } from '../config/appConfig';
import { DEFAULT_SETTINGS, StorageService } from '../services/storageService';
import { UserSettings } from '../types/quran';
import { PWAInstallButton } from '../components/common/PWAInstallButton';
import { toast } from '../components/common/Toast';

interface SettingsPageProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onResetAllData: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
  onResetAllData,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [qariFilter, setQariFilter] = useState<'all' | 'idn' | 'intl'>('idn');

  const handleReset = () => {
    onResetAllData();
    setShowResetConfirm(false);
    toast.show('Data lokal dan preferensi berhasil direset', 'info');
  };

  const displayedQari =
    qariFilter === 'idn'
      ? INDONESIAN_QARI
      : qariFilter === 'intl'
      ? INTERNATIONAL_QARI
      : ALL_QARI;

  const currentTheme = settings.themeBackground || 'light';

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="pb-2 border-b border-[var(--border-main)]">
        <h1 className="text-2xl font-bold text-[var(--text-main)]">Pengaturan</h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Sesuaikan sistem background, tipografi mushaf, qari murottal (termasuk Qari Indonesia), target tilawah harian, dan preferensi aplikasi
        </p>
      </div>

      {/* Group 0: 3 Background QuranMe System */}
      <section className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-main)] p-5 sm:p-6 space-y-4 shadow-sm card-interactive">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#0EAAFC]" />
              <span>Sistem 3 Background QuranMe</span>
            </h2>
            <span className="text-[11px] font-semibold text-[#0EAAFC] bg-[var(--badge-blue-bg)] px-2.5 py-0.5 rounded-full border border-[var(--border-subtle)]">
              {currentTheme === 'light'
                ? 'Standard Light'
                : currentTheme === 'dark'
                ? 'Standard Dark'
                : 'Premium Aurora'}
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Pilih karakter visual sesuai kenyamanan mata dan spesifikasi perangkat Anda:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* 1. Standard Light */}
          <button
            onClick={() => {
              onUpdateSettings({ themeBackground: 'light' });
              toast.show('Standard Light aktif: Putih bersih, 100% ringan');
            }}
            className={`p-4 rounded-2xl border text-left cursor-pointer transition-all active:scale-[0.97] flex flex-col justify-between relative overflow-hidden group ${
              currentTheme === 'light'
                ? 'border-[#0EAAFC] bg-white ring-2 ring-[#0EAAFC]/30 shadow-md'
                : 'border-[#E5E7EB] bg-white hover:border-[#0EAAFC]/50 hover:bg-slate-50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#202124]">
                  <Sun className="w-4 h-4 text-[#0EAAFC]" />
                  Standard Light
                </span>
                {currentTheme === 'light' && (
                  <span className="w-5 h-5 rounded-full bg-[#0EAAFC] text-white flex items-center justify-center text-[10px]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#5F6368] leading-relaxed">
                Putih bersih, kontras tinggi, zero-blur. Paling ringan dan hemat baterai untuk ponsel berspesifikasi rendah.
              </p>
            </div>
            <div className="mt-4 p-2 bg-[#F7FAFC] border border-[#E5E7EB] rounded-xl flex items-center justify-between">
              <span className="text-[11px] font-arabic text-[#202124]">الْحَمْدُ لِلّٰهِ</span>
              <span className="text-[9px] text-[#0877B9] font-mono font-bold bg-[#E8F6FF] px-1.5 py-0.5 rounded">
                100% Ringan
              </span>
            </div>
          </button>

          {/* 2. Standard Dark */}
          <button
            onClick={() => {
              onUpdateSettings({ themeBackground: 'dark' });
              toast.show('Standard Dark aktif: Hitam nyaman untuk mata');
            }}
            className={`p-4 rounded-2xl border text-left cursor-pointer transition-all active:scale-[0.97] flex flex-col justify-between relative overflow-hidden group ${
              currentTheme === 'dark'
                ? 'border-[#0EAAFC] bg-[#1C2025] ring-2 ring-[#0EAAFC]/40 shadow-md'
                : 'border-[#2D333B] bg-[#1C2025] hover:border-[#0EAAFC]/50 hover:bg-[#252B33]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F1F3F4]">
                  <Moon className="w-4 h-4 text-[#0EAAFC]" />
                  Standard Dark
                </span>
                {currentTheme === 'dark' && (
                  <span className="w-5 h-5 rounded-full bg-[#0EAAFC] text-white flex items-center justify-center text-[10px]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#9AA0A6] leading-relaxed">
                Latar hitam pekat nyaman untuk membaca malam hari, ramah mata OLED tanpa animasi berat.
              </p>
            </div>
            <div className="mt-4 p-2 bg-[#121417] border border-[#2D333B] rounded-xl flex items-center justify-between">
              <span className="text-[11px] font-arabic text-[#F1F3F4]">الْحَمْدُ لِلّٰهِ</span>
              <span className="text-[9px] text-[#60C5FF] font-mono font-bold bg-[#0EAAFC]/20 px-1.5 py-0.5 rounded">
                Mode Malam
              </span>
            </div>
          </button>

          {/* 3. Premium Gradient - Soft Magical Aurora Standout */}
          <button
            onClick={() => {
              onUpdateSettings({ themeBackground: 'premium' });
              toast.show('Mode Premium Aurora aktif: Gradasi lembut & aesthetic');
            }}
            className={`p-4 rounded-2xl border text-left cursor-pointer transition-all active:scale-[0.97] flex flex-col justify-between relative overflow-hidden group ${
              currentTheme === 'premium'
                ? 'border-[#0EAAFC] bg-gradient-to-br from-[#E6F5FC] via-white to-[#EFFCF4] ring-2 ring-[#0EAAFC]/40 shadow-lg'
                : 'border-[#CFE2FE] bg-gradient-to-br from-[#F0F9FF] to-[#F5FBFE] hover:border-[#0EAAFC]'
            }`}
          >
            {/* Visual Aurora Mini Accent */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-[#0EAAFC]/30 to-[#43B433]/30 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A202C]">
                  <Sparkles className="w-4 h-4 text-[#43B433]" />
                  Premium Gradient
                </span>
                {currentTheme === 'premium' ? (
                  <span className="w-5 h-5 rounded-full bg-[#0EAAFC] text-white flex items-center justify-center text-[10px]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-[#0877B9] bg-[#E8F6FF] px-1.5 py-0.5 rounded-full">
                    Aesthetic
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#4A5568] leading-relaxed">
                "Soft Magical Aurora" dinamis dengan gradasi langit biru muda, toska sejuk, dan mint segar. Kartu translucent elegan.
              </p>
            </div>

            {/* Live Aurora Preview Strip */}
            <div className="mt-4 p-2.5 bg-gradient-to-r from-[#BFE8FF]/70 via-[#D8F7F1]/80 to-[#DDF5E5]/70 border border-[#0EAAFC]/30 rounded-xl flex items-center justify-between shadow-2xs backdrop-blur-xs relative z-10">
              <span className="text-[11px] font-arabic font-bold text-[#1A202C]">الْحَمْدُ لِلّٰهِ</span>
              <span className="text-[9px] text-[#228B22] font-mono font-bold bg-white/90 px-1.5 py-0.5 rounded shadow-2xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#43B433] animate-pulse" />
                Soft Aurora
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* Group 1: Typography & Reading Display */}
      <section className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-main)] p-5 sm:p-6 space-y-5 shadow-sm card-interactive">
        <h2 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#0EAAFC]" />
          <span>Tampilan & Tipografi Membaca</span>
        </h2>

        {/* Live Preview Box */}
        <div className="p-4 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] space-y-2">
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
            Pratinjau Teks
          </span>
          <p
            lang="ar"
            dir="rtl"
            className="font-arabic text-[var(--text-main)] text-right leading-loose"
            style={{ fontSize: `${settings.arabicFontSize}px` }}
          >
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>
          {settings.showLatin && (
            <p className="text-xs text-[#0877B9] italic">
              Bismillāhir-raḥmānir-raḥīm(i).
            </p>
          )}
          {settings.showTranslation && (
            <p
              className="text-[var(--text-main)] leading-relaxed"
              style={{ fontSize: `${settings.translationFontSize}px` }}
            >
              Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang.
            </p>
          )}
        </div>

        {/* Arabic Font Size Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="font-semibold text-[var(--text-main)]">Ukuran Teks Arab</span>
            <span className="font-mono tabular-nums font-bold text-[#0EAAFC]">
              {settings.arabicFontSize} px
            </span>
          </div>
          <input
            type="range"
            min="22"
            max="44"
            step="2"
            value={settings.arabicFontSize}
            onChange={(e) => onUpdateSettings({ arabicFontSize: Number(e.target.value) })}
            className="w-full accent-[#0EAAFC] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[var(--text-muted)]">
            <span>Kecil (22px)</span>
            <span>Standar (30px)</span>
            <span>Besar (44px)</span>
          </div>
        </div>

        {/* Translation Font Size Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="font-semibold text-[var(--text-main)]">Ukuran Terjemahan Indonesia</span>
            <span className="font-mono tabular-nums font-bold text-[#0EAAFC]">
              {settings.translationFontSize} px
            </span>
          </div>
          <input
            type="range"
            min="13"
            max="22"
            step="1"
            value={settings.translationFontSize}
            onChange={(e) => onUpdateSettings({ translationFontSize: Number(e.target.value) })}
            className="w-full accent-[#0EAAFC] cursor-pointer"
          />
        </div>

        {/* Visibility Toggles */}
        <div className="pt-2 border-t border-[var(--border-subtle)] space-y-3 text-xs">
          <label className="flex items-center justify-between cursor-pointer p-1 rounded-xl hover:bg-[var(--bg-card-subtle)] transition-colors">
            <div>
              <span className="font-medium text-[var(--text-main)] block">Tampilkan Transliterasi Latin</span>
              <span className="text-[11px] text-[var(--text-muted)]">Membantu pelafalan huruf dan tanda baca Arab</span>
            </div>
            <input
              type="checkbox"
              checked={settings.showLatin}
              onChange={(e) => onUpdateSettings({ showLatin: e.target.checked })}
              className="w-4 h-4 rounded accent-[#0EAAFC]"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer p-1 rounded-xl hover:bg-[var(--bg-card-subtle)] transition-colors">
            <div>
              <span className="font-medium text-[var(--text-main)] block">Tampilkan Terjemahan Indonesia</span>
              <span className="text-[11px] text-[var(--text-muted)]">Terjemahan resmi Kementerian Agama Republik Indonesia</span>
            </div>
            <input
              type="checkbox"
              checked={settings.showTranslation}
              onChange={(e) => onUpdateSettings({ showTranslation: e.target.checked })}
              className="w-4 h-4 rounded accent-[#0EAAFC]"
            />
          </label>
        </div>
      </section>

      {/* Group 2: Audio Murottal & Qari (With Indonesian Qari Highlight) */}
      <section className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-main)] p-5 sm:p-6 space-y-4 shadow-sm card-interactive">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#43B433]" />
              <span>Qari Murottal Pilihan</span>
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Pilih qari favorit Anda (tersedia 5 Qari Indonesia terverifikasi):
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-1 bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] rounded-xl self-start sm:self-auto text-xs">
            <button
              onClick={() => setQariFilter('idn')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer font-medium transition-all active:scale-95 ${
                qariFilter === 'idn'
                  ? 'bg-[#43B433] text-white font-bold shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Qari Indonesia ({INDONESIAN_QARI.length})
            </button>
            <button
              onClick={() => setQariFilter('intl')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer font-medium transition-all active:scale-95 ${
                qariFilter === 'intl'
                  ? 'bg-[#0EAAFC] text-white font-bold shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Internasional ({INTERNATIONAL_QARI.length})
            </button>
            <button
              onClick={() => setQariFilter('all')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer font-medium transition-all active:scale-95 ${
                qariFilter === 'all'
                  ? 'bg-[#202124] text-white font-bold shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Semua
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {displayedQari.map((qari) => {
            const isSelected = settings.defaultQari === qari.id;
            return (
              <button
                key={qari.id}
                onClick={() => {
                  onUpdateSettings({ defaultQari: qari.id });
                  toast.show(`Qari aktif diubah: ${qari.name}`);
                }}
                className={`p-3.5 rounded-2xl border text-left flex items-start justify-between cursor-pointer transition-all active:scale-[0.98] ${
                  isSelected
                    ? 'border-[#0EAAFC] bg-[var(--badge-blue-bg)] text-[#0877B9] ring-2 ring-[#0EAAFC]/30 shadow-xs'
                    : 'border-[var(--border-main)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)]'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold truncate">{qari.name}</span>
                    {qari.isIndonesian && (
                      <span className="text-[9px] bg-[#EAF8E8] text-[#228B22] px-1 py-0.2 rounded font-bold shrink-0">
                        Indonesia
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[var(--text-muted)] block mt-0.5">
                    {qari.style || qari.country}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Sumber: {qari.sourceName}
                  </span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#0EAAFC] shrink-0 mt-0.5" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* Group 3: Tilawah Target */}
      <section className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-main)] p-5 sm:p-6 space-y-4 shadow-sm card-interactive">
        <h2 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#0EAAFC]" />
          <span>Target Tilawah Harian</span>
        </h2>
        <p className="text-xs text-[var(--text-muted)]">
          Tentukan berapa ayat yang ingin Anda baca setiap hari untuk istiqomah:
        </p>

        <div className="grid grid-cols-4 gap-2">
          {[5, 10, 20, 50].map((target) => (
            <button
              key={target}
              onClick={() => {
                onUpdateSettings({ dailyTargetAyat: target });
                toast.show(`Target tilawah diatur ke ${target} ayat/hari`);
              }}
              className={`py-2 text-xs font-semibold rounded-2xl border transition-all cursor-pointer active:scale-95 ${
                settings.dailyTargetAyat === target
                  ? 'border-[#43B433] bg-[#EAF8E8] text-[#228B22] font-bold shadow-xs'
                  : 'border-[var(--border-main)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)]'
              }`}
            >
              {target} Ayat
            </button>
          ))}
        </div>
      </section>

      {/* Group 4: PWA Installation */}
      <section className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-main)] p-5 sm:p-6 space-y-3 shadow-sm card-interactive">
        <h2 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
          <Download className="w-4 h-4 text-[#0EAAFC]" />
          <span>Aplikasi Progressive Web App (PWA)</span>
        </h2>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          Pasang QuranMe langsung di layar ponsel atau desktop Anda agar dapat dibuka secara mandiri seperti aplikasi asli tanpa bilah browser.
        </p>
        <div className="pt-1">
          <PWAInstallButton variant="settings" />
        </div>
      </section>

      {/* Group 5: Data Storage & Reset */}
      <section className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-main)] p-5 sm:p-6 space-y-4 shadow-sm card-interactive">
        <h2 className="text-sm font-bold text-red-600 flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-red-500" />
          <span>Hapus Data Lokal & Reset</span>
        </h2>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          Semua catatan ayat, bookmark, riwayat membaca, dan cache surat tersimpan di penyimpanan lokal browser Anda. Menghapus data ini akan mengembalikan aplikasi ke kondisi awal.
        </p>

        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-2xl text-xs font-semibold transition-all active:scale-95 cursor-pointer"
          >
            Hapus Semua Data & Reset Pengaturan
          </button>
        ) : (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-red-700 font-bold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Konfirmasi Penghapusan Data</span>
            </div>
            <p className="text-red-600">
              Apakah Anda yakin ingin menghapus seluruh bookmark, catatan tadabbur, dan riwayat tilawah? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleReset}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl cursor-pointer active:scale-95 transition-transform"
              >
                Ya, Hapus Semua
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer active:scale-95 transition-transform"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Group 6: Brand & Data Verification Note */}
      <section className="p-5 sm:p-6 rounded-3xl bg-[var(--bg-card-subtle)] border border-[var(--border-main)] text-xs text-[var(--text-muted)] space-y-2">
        <div className="flex items-center gap-2 text-[var(--text-main)] font-bold">
          <Info className="w-4 h-4 text-[#0EAAFC]" />
          <span>Tentang {APP_CONFIG.appName}</span>
        </div>
        <p className="leading-relaxed">
          {BRAND_IDENTITY.description}
        </p>
        <div className="pt-1 text-[11px] text-slate-400 space-y-0.5">
          <p>• Teks Arab & Terjemahan: Mushaf Standar Indonesia Kemenag RI via equran.id API</p>
          <p>• Audio Murottal: equran.id API & Internet Archive Indonesian Qari Collections</p>
          <p>• Sumber Tafsir: Tafsir Lengkap Kemenag RI</p>
          <p>• Versi Aplikasi: 3.1.0 Production Enhanced (Aurora & Motion)</p>
        </div>
      </section>
    </div>
  );
};
