/**
 * Accurate Indonesian Prayer Time & Qibla Calculator
 * Based on Standard Kemenag RI / Muslim World League calculation method
 */

export interface PrayerCity {
  id: string;
  name: string;
  lat: number;
  lng: number;
  timezone: number; // 7 for WIB, 8 for WITA, 9 for WIT
  zoneName: string; // "WIB" | "WITA" | "WIT"
}

export const INDONESIAN_CITIES: PrayerCity[] = [
  { id: 'jkt', name: 'DKI Jakarta', lat: -6.2088, lng: 106.8456, timezone: 7, zoneName: 'WIB' },
  { id: 'sby', name: 'Surabaya, Jawa Timur', lat: -7.2575, lng: 112.7521, timezone: 7, zoneName: 'WIB' },
  { id: 'bdg', name: 'Bandung, Jawa Barat', lat: -6.9175, lng: 107.6191, timezone: 7, zoneName: 'WIB' },
  { id: 'mdn', name: 'Medan, Sumatera Utara', lat: 3.5952, lng: 98.6722, timezone: 7, zoneName: 'WIB' },
  { id: 'smg', name: 'Semarang, Jawa Tengah', lat: -7.0051, lng: 110.4381, timezone: 7, zoneName: 'WIB' },
  { id: 'yog', name: 'DI Yogyakarta', lat: -7.7956, lng: 110.3695, timezone: 7, zoneName: 'WIB' },
  { id: 'ach', name: 'Banda Aceh, Aceh', lat: 5.5483, lng: 95.3238, timezone: 7, zoneName: 'WIB' },
  { id: 'mks', name: 'Makassar, Sulawesi Selatan', lat: -5.1477, lng: 119.4327, timezone: 8, zoneName: 'WITA' },
  { id: 'dps', name: 'Denpasar, Bali', lat: -8.6705, lng: 115.2126, timezone: 8, zoneName: 'WITA' },
  { id: 'bpn', name: 'Balikpapan, Kalimantan Timur', lat: -1.2654, lng: 116.8312, timezone: 8, zoneName: 'WITA' },
  { id: 'jpr', name: 'Jayapura, Papua', lat: -2.5337, lng: 140.7181, timezone: 9, zoneName: 'WIT' },
];

export interface PrayerTimeItem {
  id: 'subuh' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya';
  name: string;
  time: string; // "HH:mm"
  timestamp: number;
  isActive: boolean;
  isUpcoming: boolean;
}

export interface PrayerSchedule {
  dateFormatted: string;
  city: string;
  cityObj: PrayerCity;
  qiblaDegrees: number;
  distanceToKaabaKm: number;
  times: PrayerTimeItem[];
  nextPrayer: PrayerTimeItem;
  countdownSeconds: number;
}

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

const SELECTED_CITY_KEY = 'quranme_selected_prayer_city_v1';

export class PrayerTimeService {
  public static getSelectedCity(): PrayerCity {
    try {
      const saved = localStorage.getItem(SELECTED_CITY_KEY);
      if (saved) {
        const found = INDONESIAN_CITIES.find((c) => c.id === saved);
        if (found) return found;
      }
    } catch {}
    return INDONESIAN_CITIES[0]; // Jakarta default
  }

  public static setSelectedCity(cityId: string) {
    try {
      localStorage.setItem(SELECTED_CITY_KEY, cityId);
    } catch (e) {
      console.warn('Failed to save city:', e);
    }
  }

  /**
   * Calculate precise Qibla angle from any lat, lng to Kaaba (Makkah)
   */
  public static calculateQibla(lat: number, lng: number): { degrees: number; distanceKm: number } {
    const kaabaLat = 21.4225;
    const kaabaLng = 39.8262;

    const phiK = rad(kaabaLat);
    const lambdaK = rad(kaabaLng);
    const phi = rad(lat);
    const lambda = rad(lng);

    const deltaLambda = lambdaK - lambda;

    const y = Math.sin(deltaLambda);
    const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(deltaLambda);

    let qibla = deg(Math.atan2(y, x));
    if (qibla < 0) {
      qibla += 360;
    }

    // Haversine Distance
    const R = 6371; // Earth radius km
    const dLat = phiK - phi;
    const dLon = lambdaK - lambda;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(phi) * Math.cos(phiK) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = Math.round(R * c);

    return {
      degrees: Math.round(qibla),
      distanceKm,
    };
  }

  public static getSchedule(customDate: Date = new Date(), customCity?: PrayerCity): PrayerSchedule {
    const city = customCity || this.getSelectedCity();
    const lat = city.lat;
    const lng = city.lng;
    const timezone = city.timezone;

    const start = new Date(customDate.getFullYear(), 0, 0);
    const diff = customDate.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

    const b = (2 * Math.PI * (dayOfYear - 81)) / 365;
    const eot = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
    const declination = 23.45 * Math.sin(b);

    const solarNoon = 12 + (timezone * 15 - lng) / 15 - eot / 60;

    // Subuh: 20° below horizon
    const subuhAngle = 20;
    const subuhHourAngle =
      deg(
        Math.acos(
          (-Math.sin(rad(subuhAngle)) - Math.sin(rad(lat)) * Math.sin(rad(declination))) /
            (Math.cos(rad(lat)) * Math.cos(rad(declination)))
        )
      ) / 15;
    const subuh = solarNoon - subuhHourAngle;

    // Ashar: Shafi'i shadow length = 1 + shadow at noon
    const noonShadow = Math.tan(rad(Math.abs(lat - declination)));
    const asharAngle = deg(Math.atan(1 + noonShadow));
    const asharHourAngle =
      deg(
        Math.acos(
          (Math.sin(rad(90 - asharAngle)) - Math.sin(rad(lat)) * Math.sin(rad(declination))) /
            (Math.cos(rad(lat)) * Math.cos(rad(declination)))
        )
      ) / 15;
    const ashar = solarNoon + asharHourAngle;

    // Maghrib: 0.833° sunset + 2 mins ihtiyat
    const sunsetAngle = 0.833;
    const sunsetHourAngle =
      deg(
        Math.acos(
          (-Math.sin(rad(sunsetAngle)) - Math.sin(rad(lat)) * Math.sin(rad(declination))) /
            (Math.cos(rad(lat)) * Math.cos(rad(declination)))
        )
      ) / 15;
    const maghrib = solarNoon + sunsetHourAngle + 2 / 60;

    // Isya: 18° below horizon
    const isyaAngle = 18;
    const isyaHourAngle =
      deg(
        Math.acos(
          (-Math.sin(rad(isyaAngle)) - Math.sin(rad(lat)) * Math.sin(rad(declination))) /
            (Math.cos(rad(lat)) * Math.cos(rad(declination)))
        )
      ) / 15;
    const isya = solarNoon + isyaHourAngle;

    const toTimeStr = (decimalHours: number): string => {
      let h = Math.floor(decimalHours);
      let m = Math.floor((decimalHours - h) * 60);
      if (m >= 60) {
        h += 1;
        m = 0;
      }
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    const formatTimestamp = (decimalHours: number): number => {
      const d = new Date(customDate);
      const h = Math.floor(decimalHours);
      const m = Math.floor((decimalHours - h) * 60);
      d.setHours(h, m, 0, 0);
      return d.getTime();
    };

    const prayerDefs: { id: 'subuh' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya'; name: string; hours: number }[] = [
      { id: 'subuh', name: 'Subuh', hours: subuh },
      { id: 'dzuhur', name: 'Zuhur', hours: solarNoon + 2 / 60 },
      { id: 'ashar', name: 'Asar', hours: ashar },
      { id: 'maghrib', name: 'Magrib', hours: maghrib },
      { id: 'isya', name: 'Isya', hours: isya },
    ];

    const now = customDate.getTime();
    let nextIdx = 0;
    let foundNext = false;

    const times: PrayerTimeItem[] = prayerDefs.map((p, idx) => {
      const ts = formatTimestamp(p.hours);
      if (!foundNext && ts > now) {
        nextIdx = idx;
        foundNext = true;
      }
      return {
        id: p.id,
        name: p.name,
        time: toTimeStr(p.hours),
        timestamp: ts,
        isActive: false,
        isUpcoming: false,
      };
    });

    let countdownSeconds = 0;
    if (foundNext) {
      countdownSeconds = Math.max(0, Math.floor((times[nextIdx].timestamp - now) / 1000));
    } else {
      nextIdx = 0; // Next morning Subuh
      const tomorrowSubuhTs = times[0].timestamp + 24 * 60 * 60 * 1000;
      countdownSeconds = Math.max(0, Math.floor((tomorrowSubuhTs - now) / 1000));
    }

    const activeIdx = (nextIdx - 1 + times.length) % times.length;
    times[activeIdx].isActive = true;
    times[nextIdx].isUpcoming = true;

    const qiblaCalc = this.calculateQibla(lat, lng);

    const dateFormatted = customDate.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    return {
      dateFormatted,
      city: `${city.name} (${city.zoneName})`,
      cityObj: city,
      qiblaDegrees: qiblaCalc.degrees,
      distanceToKaabaKm: qiblaCalc.distanceKm,
      times,
      nextPrayer: times[nextIdx],
      countdownSeconds,
    };
  }
}
