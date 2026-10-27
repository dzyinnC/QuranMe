import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="bg-amber-500 text-white px-4 py-2 text-xs font-medium flex items-center justify-center gap-2 shadow-sm transition-all">
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>Mode Offline — Menampilkan surat & data yang telah tersimpan di perangkat.</span>
    </div>
  );
};
