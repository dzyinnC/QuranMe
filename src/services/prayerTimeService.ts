/**
 * Accurate Indonesian Prayer Time Calculator
 * Based on Standard Kemenag RI / Muslim World League calculation method
 */

export interface PrayerTimeItem {
  id: 'subuh' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya';
  name: string;
  time: string; // "HH:mm"
  timestamp: number;
  isActive: boolean;
  isUpcoming: boolean;
}

export interface PrayerSchedule {
  dateFormatted: string; // e.g. "Sen, 12 Mei 2025"
  city: string; // "Jakarta & Sekitarnya (WIB)"
  qiblaDegrees: number; // 292
  times: PrayerTimeItem[];
  nextPrayer: PrayerTimeItem;
}

// Convert degrees to radians and vice-versa
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

export class PrayerTimeService {
  public static getSchedule(customDate: Date = new Date()): PrayerSchedule {
    const lat = -6.2088; // Jakarta
    const lng = 106.8456;
    const timezone = 7; // WIB UTC+7

    // Day of year calculation for solar declination and equation of time
    const start = new Date(customDate.getFullYear(), 0, 0);
    const diff = customDate.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

    // Solar calculation approximations
    const b = (2 * Math.PI * (dayOfYear - 81)) / 365;
    const eot = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b); // Equation of time in minutes
    const declination = 23.45 * Math.sin(b); // Solar declination in degrees

    // Solar noon (Dzuhur) in hours
    const solarNoon = 12 + (timezone * 15 - lng) / 15 - eot / 60;

    // Subuh: Sun angle 20° below horizon (Kemenag standard)
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

    // Maghrib: Sun 0.833° below horizon + elevation correction
    const sunsetAngle = 0.833;
    const sunsetHourAngle =
      deg(
        Math.acos(
          (-Math.sin(rad(sunsetAngle)) - Math.sin(rad(lat)) * Math.sin(rad(declination))) /
            (Math.cos(rad(lat)) * Math.cos(rad(declination)))
        )
      ) / 15;
    const maghrib = solarNoon + sunsetHourAngle + (2 / 60); // 2 mins ihtiyat

    // Isya: Sun 18° below horizon (Kemenag standard)
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
      { id: 'dzuhur', name: 'Dzuhur', hours: solarNoon + (2 / 60) },
      { id: 'ashar', name: 'Ashar', hours: ashar },
      { id: 'maghrib', name: 'Maghrib', hours: maghrib },
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

    if (!foundNext) {
      nextIdx = 0; // Subuh of next day
    }

    // Set active (the current prayer window) and upcoming
    const activeIdx = (nextIdx - 1 + times.length) % times.length;
    times[activeIdx].isActive = true;
    times[nextIdx].isUpcoming = true;

    const dateFormatted = customDate.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    return {
      dateFormatted,
      city: 'Jakarta & Sekitarnya (WIB)',
      qiblaDegrees: 292,
      times,
      nextPrayer: times[nextIdx],
    };
  }
}
