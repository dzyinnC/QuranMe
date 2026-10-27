import React, { useState } from 'react';
import { Download, Share2, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface Props {
  variant?: 'header' | 'button' | 'settings';
}

export const PWAInstallButton: React.FC<Props> = ({ variant = 'button' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  if (isInstalled) {
    if (variant === 'settings') {
      return (
        <div className="flex items-center gap-2 text-xs text-[#43B433] font-medium bg-[#EAF8E8] px-3 py-2 rounded-lg">
          <span>✓ Aplikasi QuranMe sudah terinstal di perangkat Anda</span>
        </div>
      );
    }
    return null;
  }

  // Desktop / Android flow via BeforeInstallPrompt
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`inline-flex items-center gap-2 font-medium rounded-lg transition-colors cursor-pointer ${
          variant === 'header'
            ? 'px-3 py-1.5 text-xs bg-[#0EAAFC] text-white hover:bg-[#0877B9] shadow-xs'
            : variant === 'settings'
            ? 'w-full justify-center px-4 py-2.5 text-sm bg-[#0EAAFC] text-white hover:bg-[#0877B9]'
            : 'px-4 py-2 text-xs bg-[#0EAAFC] text-white hover:bg-[#0877B9]'
        }`}
        title="Pasang QuranMe di perangkat Anda"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install QuranMe</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSModal(true)}
          className={`inline-flex items-center gap-2 font-medium rounded-lg border border-[#E5E7EB] transition-colors cursor-pointer ${
            variant === 'header'
              ? 'px-2.5 py-1 text-xs text-[#202124] hover:bg-slate-100'
              : 'px-3 py-2 text-xs text-[#202124] hover:bg-slate-100'
          }`}
        >
          <Download className="w-3.5 h-3.5 text-[#0EAAFC]" />
          <span>Install di iOS</span>
        </button>

        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-[#E5E7EB]">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                <h3 className="text-base font-semibold text-[#202124]">Install QuranMe di iOS</h3>
                <button
                  onClick={() => setShowIOSModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-xs text-[#5F6368] leading-relaxed">
                <p className="flex items-start gap-2">
                  <span className="font-bold text-[#0EAAFC]">1.</span>
                  <span>
                    Tekan tombol <Share2 className="w-3.5 h-3.5 inline mx-1 text-[#0EAAFC]" /> (Bagikan / Share) di menu Safari.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-[#0EAAFC]">2.</span>
                  <span>Gulir ke bawah dan pilih <strong>"Tambah ke Layar Utama" (Add to Home Screen)</strong>.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-[#0EAAFC]">3.</span>
                  <span>Tekan <strong>"Tambah" (Add)</strong> di pojok kanan atas untuk memasang icon QuranMe.</span>
                </p>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="mt-5 w-full rounded-xl bg-[#0EAAFC] py-2 text-xs font-semibold text-white hover:bg-[#0877B9]"
              >
                Mengerti
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
