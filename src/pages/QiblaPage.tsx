import React, { useEffect, useState } from 'react';
import {
  Compass,
  Info,
  MapPin,
  Navigation,
  RefreshCw,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { MosqueSilhouette } from '../components/common/IslamicOrnaments';
import {
  INDONESIAN_CITIES,
  PrayerCity,
  PrayerTimeService,
} from '../services/prayerTimeService';

interface QiblaPageProps {
  onNavigateHome?: () => void;
}

export const QiblaPage: React.FC<QiblaPageProps> = () => {
  const [selectedCity, setSelectedCity] = useState<PrayerCity>(() =>
    PrayerTimeService.getSelectedCity()
  );
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [hasCompassSensor, setHasCompassSensor] = useState<boolean>(false);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  const [showCityPicker, setShowCityPicker] = useState<boolean>(false);

  // Compute Qibla angle and distance based on selected city
  const qiblaData = PrayerTimeService.calculateQibla(selectedCity.lat, selectedCity.lng);

  useEffect(() => {
    let sensorDetected = false;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      // In iOS webkitCompassHeading exists and is true heading (0 = North)
      // In Android standard alpha is rotation around z-axis
      let heading = 0;
      if ((e as any).webkitCompassHeading) {
        heading = (e as any).webkitCompassHeading;
        sensorDetected = true;
      } else if (e.alpha !== null && e.alpha !== undefined) {
        heading = (360 - e.alpha) % 360;
        sensorDetected = true;
      }

      if (sensorDetected) {
        setHasCompassSensor(true);
        setDeviceHeading(Math.round(heading));
      }
    };

    if (typeof window !== 'undefined') {
      const win = window as any;
      if ('ondeviceorientationabsolute' in win) {
        win.addEventListener('deviceorientationabsolute', handleOrientation);
      } else if ('DeviceOrientationEvent' in win) {
        win.addEventListener('deviceorientation', handleOrientation);
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        const win = window as any;
        win.removeEventListener('deviceorientationabsolute', handleOrientation);
        win.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  const handleSelectCity = (city: PrayerCity) => {
    setSelectedCity(city);
    PrayerTimeService.setSelectedCity(city.id);
    setShowCityPicker(false);
  };

  // Compass needle rotation: Qibla angle relative to current device heading
  // When device points directly to Qibla, relative angle = 0 (needle points straight up)
  const relativeNeedleRotation = hasCompassSensor
    ? (qiblaData.degrees - deviceHeading + 360) % 360
    : qiblaData.degrees;

  const isAlignedWithQibla = hasCompassSensor && Math.abs(relativeNeedleRotation) < 3;

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-200">
      {/* 1. Header Card with Islamic Arch and Mosque Silhouette */}
      <div className="relative overflow-hidden rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6 shadow-xs flex items-center justify-between">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F6FF] text-[#0EAAFC] flex items-center justify-center shadow-xs">
              <Compass className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[var(--text-main)] tracking-tight">
                Arah Kiblat
              </h1>
              <p className="text-xs text-[var(--text-muted)] font-medium">
                Penunjuk presisi arah Ka'bah Makkah Al-Mukarramah
              </p>
            </div>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 text-[#0EAAFC] pointer-events-none opacity-20">
          <MosqueSilhouette className="w-36 h-24 text-[#0EAAFC]" opacity={1} />
        </div>
      </div>

      {/* 2. Interactive Compass Dial Card */}
      <section className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-main)] p-6 sm:p-8 shadow-xs flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
        {/* City Location Header */}
        <div className="flex items-center justify-between w-full max-w-sm pb-2 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 text-left">
            <MapPin className="w-4 h-4 text-[#0EAAFC]" />
            <div>
              <span className="text-xs font-bold text-[var(--text-main)] block">
                {selectedCity.name}
              </span>
              <span className="text-[10px] text-[var(--text-muted)]">
                {selectedCity.lat.toFixed(2)}°, {selectedCity.lng.toFixed(2)}° ({selectedCity.zoneName})
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowCityPicker(true)}
            className="text-xs font-bold text-[#0EAAFC] hover:text-[#0877B9] bg-[#E8F6FF] dark:bg-sky-950/40 px-3 py-1.5 rounded-full cursor-pointer transition-colors"
          >
            Ubah Kota
          </button>
        </div>

        {/* Big Circular Compass Graphic */}
        <div className="relative flex items-center justify-center py-4 my-2">
          {/* Compass Outer Ring */}
          <div
            className={`w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 relative flex items-center justify-center transition-all duration-300 shadow-lg ${
              isAlignedWithQibla
                ? 'border-[#43B433] ring-8 ring-emerald-400/20 bg-gradient-to-br from-emerald-50/60 to-transparent'
                : 'border-[#BFE8FF] dark:border-sky-900/40 bg-gradient-to-br from-white/40 via-sky-50/20 to-emerald-50/20'
            }`}
          >
            {/* Degree Tick Marks */}
            <div className="absolute inset-2 rounded-full border border-dashed border-slate-300 dark:border-slate-700 pointer-events-none" />

            {/* Cardinal Directions */}
            <span className="absolute top-3 font-black text-xs text-red-500 tracking-wider">
              U (0°)
            </span>
            <span className="absolute bottom-3 font-bold text-xs text-slate-400 tracking-wider">
              S (180°)
            </span>
            <span className="absolute right-3 font-bold text-xs text-slate-400 tracking-wider">
              T (90°)
            </span>
            <span className="absolute left-3 font-bold text-xs text-slate-400 tracking-wider">
              B (270°)
            </span>

            {/* Qibla Indicator Marker on Perimeter */}
            <div
              className="absolute inset-0 flex items-start justify-center transition-transform duration-500 ease-out pointer-events-none"
              style={{ transform: `rotate(${qiblaData.degrees}deg)` }}
            >
              <div className="w-5 h-5 bg-[#43B433] text-white rounded-full flex items-center justify-center text-[10px] font-black -mt-2.5 shadow-md">
                🕋
              </div>
            </div>

            {/* Rotating Needle */}
            <div
              className="w-2 h-44 sm:h-48 rounded-full relative flex items-start justify-center transition-transform duration-300 ease-out pointer-events-none"
              style={{ transform: `rotate(${relativeNeedleRotation}deg)` }}
            >
              {/* Green Needle Arrow pointing towards Kaaba */}
              <div
                className={`w-6 h-6 rotate-45 -mt-3 rounded-xs shadow-md flex items-center justify-center transition-colors ${
                  isAlignedWithQibla ? 'bg-[#43B433] scale-125 animate-pulse' : 'bg-[#0EAAFC]'
                }`}
              />

              {/* Tail Counterweight */}
              <div className="absolute bottom-0 w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600" />
            </div>

            {/* Center Pivot Hub */}
            <div className="absolute w-8 h-8 rounded-full bg-white dark:bg-slate-800 border-2 border-[#0EAAFC] shadow-md flex items-center justify-center z-10">
              <div
                className={`w-3.5 h-3.5 rounded-full transition-colors ${
                  isAlignedWithQibla ? 'bg-[#43B433]' : 'bg-[#0EAAFC]'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Degree & Distance Readout */}
        <div className="space-y-1">
          <div className="text-3xl sm:text-4xl font-black text-[var(--text-main)] font-mono tracking-tight">
            {qiblaData.degrees}° <span className="text-lg font-bold text-[#0EAAFC]">Barat Laut</span>
          </div>
          <p className="text-xs text-[var(--text-muted)] font-medium">
            Jarak garis lurus ke Ka'bah: <strong>{qiblaData.distanceKm.toLocaleString('id-ID')} km</strong>
          </p>
        </div>

        {/* Sensor & Alignment Status Banner */}
        <div
          className={`w-full max-w-md p-3.5 rounded-2xl text-xs flex items-center justify-between gap-3 ${
            isAlignedWithQibla
              ? 'bg-[#EAF7EE] text-[#228B22] border border-[#43B433]/40 font-bold'
              : hasCompassSensor
              ? 'bg-[#E8F6FF] text-[#0877B9] border border-[#0EAAFC]/30'
              : 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isAlignedWithQibla
                  ? 'bg-[#43B433] animate-ping'
                  : hasCompassSensor
                  ? 'bg-[#0EAAFC]'
                  : 'bg-amber-500'
              }`}
            />
            <span>
              {isAlignedWithQibla
                ? 'Tepat menghadap arah Kiblat!'
                : hasCompassSensor
                ? `Arah perangkat: ${deviceHeading}° (Putar HP hingga jarum sejajar)`
                : 'Sensor kompas magnetik tidak terdeteksi (Gunakan arah statis 295°)'}
            </span>
          </div>

          <button
            onClick={() => setIsCalibrating(!isCalibrating)}
            className="text-[11px] font-bold underline hover:opacity-80 shrink-0 cursor-pointer"
          >
            {isCalibrating ? 'Tutup Panduan' : 'Kalibrasi'}
          </button>
        </div>

        {/* Calibration Guide */}
        {isCalibrating && (
          <div className="w-full max-w-md p-4 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] text-left text-xs space-y-2 animate-in fade-in">
            <h4 className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-[#0EAAFC]" />
              Panduan Kalibrasi Kompas
            </h4>
            <ol className="list-decimal pl-4 space-y-1 text-[var(--text-muted)]">
              <li>Pegang ponsel Anda mendatar setinggi dada.</li>
              <li>Jauhkan dari benda bermagnet (casing berpelat besi, speaker, atau laptop).</li>
              <li>Gerakkan ponsel perlahan membentuk angka <strong>delapan (∞)</strong> di udara 3-5 kali.</li>
              <li>Arah sensor akan otomatis terkalibrasi secara presisi.</li>
            </ol>
          </div>
        )}
      </section>

      {/* 3. Modal / Dialog Pilihan Kota Manual */}
      {showCityPicker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-[var(--bg-card)] rounded-3xl border border-[var(--border-main)] shadow-2xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <div>
                <h3 className="text-lg font-bold text-[var(--text-main)]">
                  Pilih Kota Wilayah
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Derajat kiblat disesuaikan dengan koordinat kota
                </p>
              </div>
              <button
                onClick={() => setShowCityPicker(false)}
                className="w-8 h-8 rounded-full bg-[var(--bg-card-subtle)] hover:bg-[var(--border-main)] flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {INDONESIAN_CITIES.map((c) => {
                const isSelected = selectedCity.id === c.id;
                const calc = PrayerTimeService.calculateQibla(c.lat, c.lng);

                return (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCity(c)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#0EAAFC] bg-[#E8F6FF]/60 shadow-xs'
                        : 'border-[var(--border-subtle)] hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-[var(--text-main)] block">
                        {c.name}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">
                        Arah Kiblat: {calc.degrees}° Barat Laut ({c.zoneName})
                      </span>
                    </div>

                    <span className="text-xs font-bold text-[#0EAAFC] font-mono">
                      {calc.degrees}°
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
