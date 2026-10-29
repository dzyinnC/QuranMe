import React from 'react';
import { Building2 } from 'lucide-react';

export interface PartnerLogoItem {
  id: string;
  name: string;
  logoUrl: string;
  fallbackUrl?: string;
  altText: string;
}

export const INSTITUTIONAL_PARTNERS: PartnerLogoItem[] = [
  {
    id: 'yayasan-karya-pondok-mandiri',
    name: 'Yayasan Karya Pondok Mandiri',
    logoUrl: '/assets/aistudio/Glossy_Academic_Crescent_Book_Crest_1a1a1424.png',
    fallbackUrl: '/assets/logos/logo_yayasan_karya_pondok_mandiri.svg',
    altText: 'Logo Yayasan Karya Pondok Mandiri',
  },
  {
    id: 'bbpvp-bekasi',
    name: 'BBPVP Bekasi',
    logoUrl: '/assets/aistudio/image-Photoroom_5c3cd058.png',
    fallbackUrl: '/assets/logos/logo_bbpvp_bekasi.svg',
    altText: 'Logo BBPVP Bekasi - Kementerian Ketenagakerjaan RI',
  },
  {
    id: 'embi-tech-computindo',
    name: 'Embi Tech Computindo',
    logoUrl: '/assets/aistudio/Embi_Tech_Colorful_People_Emblem_e9a8c36b.png',
    fallbackUrl: '/assets/logos/logo_embi_tech_computindo.svg',
    altText: 'Logo Embi Tech Computindo',
  },
];

export const InstitutionalPartnersLogos: React.FC = () => {
  return (
    <section className="rounded-3xl bg-[var(--bg-card)] border border-[#E5E7EB] dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header Title & Subtitle as requested */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#0EAAFC]" />
          <h3 className="text-base sm:text-lg font-bold text-[#202124] dark:text-white tracking-tight">
            Didukung oleh
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-[#5F6368] dark:text-slate-400 italic font-normal leading-relaxed">
          Terima kasih kepada para mitra yang mendukung pengembangan dan keberlangsungan QuranMe.
        </p>
      </div>

      {/* Responsive Logo Container Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FEFEFE] dark:bg-slate-900/60 border border-[#E5E7EB] dark:border-slate-800/80">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-center justify-items-center">
          {INSTITUTIONAL_PARTNERS.map((partner) => (
            <div
              key={partner.id}
              className="w-full h-24 sm:h-28 px-4 py-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/50 hover:border-[#0EAAFC]/40 transition-all duration-200 flex flex-col items-center justify-center group shadow-2xs hover:shadow-xs"
            >
              <img
                src={partner.logoUrl}
                alt={partner.altText}
                title={partner.name}
                onError={(e) => {
                  // Fallback to vector SVG if PNG fails
                  if (partner.fallbackUrl && e.currentTarget.src !== partner.fallbackUrl) {
                    e.currentTarget.src = partner.fallbackUrl;
                  }
                }}
                className="max-h-16 sm:max-h-20 max-w-full object-contain transition-transform group-hover:scale-105 duration-200 filter drop-shadow-2xs"
                loading="lazy"
              />
              <span className="text-[11px] font-semibold text-[#5F6368] dark:text-slate-300 mt-1.5 text-center line-clamp-1 group-hover:text-[#0EAAFC] transition-colors">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
