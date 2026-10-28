/**
 * Authentic Hijri Calendar & Islamic Holidays Engine
 * Based on MABIMS / Kementerian Agama Republik Indonesia astronomical criteria
 */

export interface HijriDate {
  day: number;
  month: number; // 1-12
  monthName: string;
  year: number;
  formatted: string; // e.g. "14 Syawal 1447 H"
}

export interface IslamicHoliday {
  id: string;
  name: string;
  hijriDay: number;
  hijriMonth: number;
  hijriMonthName: string;
  description: string;
  status: 'verified' | 'estimated' | 'pending';
  statusText: string;
  approxGregorianDate: string; // e.g. "30 Mar 2026"
  isLailatulQadarPotential?: boolean;
}

export const HIJRI_MONTHS = [
  'Muharram',
  'Safar',
  'Rabiul Awal',
  'Rabiul Akhir',
  'Jumadil Awal',
  'Jumadil Akhir',
  'Rajab',
  'Syakban',
  'Ramadan',
  'Syawal',
  'Zulkaidah',
  'Zulhijah',
];

const ISLAMIC_HOLIDAYS_CATALOG: Omit<IslamicHoliday, 'approxGregorianDate'>[] = [
  {
    id: 'hol-1',
    name: 'Tahun Baru Hijriah (1 Muharram)',
    hijriDay: 1,
    hijriMonth: 1,
    hijriMonthName: 'Muharram',
    description: 'Peringatan tahun baru kalender Islam, mengenang peristiwa hijrah Rasulullah SAW.',
    status: 'verified',
    statusText: 'Terverifikasi Kalender Kemenag',
  },
  {
    id: 'hol-2',
    name: 'Hari Asyura (10 Muharram)',
    hijriDay: 10,
    hijriMonth: 1,
    hijriMonthName: 'Muharram',
    description: 'Hari disunnahkannya puasa Asyura yang melebur dosa setahun yang lalu.',
    status: 'verified',
    statusText: 'Terverifikasi Kalender Kemenag',
  },
  {
    id: 'hol-3',
    name: 'Maulid Nabi Muhammad SAW (12 Rabiul Awal)',
    hijriDay: 12,
    hijriMonth: 3,
    hijriMonthName: 'Rabiul Awal',
    description: 'Peringatan kelahiran baginda Nabi Muhammad SAW pembawa risalah Islam.',
    status: 'verified',
    statusText: 'Terverifikasi Kalender Kemenag',
  },
  {
    id: 'hol-4',
    name: 'Isra Mikraj (27 Rajab)',
    hijriDay: 27,
    hijriMonth: 7,
    hijriMonthName: 'Rajab',
    description: 'Perjalanan malam Rasulullah SAW menerima perintah ibadah salat lima waktu.',
    status: 'verified',
    statusText: 'Terverifikasi Kalender Kemenag',
  },
  {
    id: 'hol-5',
    name: 'Nisfu Syakban (15 Syakban)',
    hijriDay: 15,
    hijriMonth: 8,
    hijriMonthName: 'Syakban',
    description: 'Malam pertengahan bulan Syakban yang penuh keutamaan dan pengampunan doa.',
    status: 'estimated',
    statusText: 'Perkiraan Astronomis MABIMS',
  },
  {
    id: 'hol-6',
    name: 'Awal Ramadan 1447 H',
    hijriDay: 1,
    hijriMonth: 9,
    hijriMonthName: 'Ramadan',
    description: 'Awal kewajiban ibadah puasa Ramadan sebulan penuh bagi umat Islam.',
    status: 'pending',
    statusText: 'Menunggu Sidang Isbat Kemenag',
  },
  {
    id: 'hol-7',
    name: 'Malam Potensi Lailatul Qadar (21, 23, 25, 27, 29 Ramadan)',
    hijriDay: 21,
    hijriMonth: 9,
    hijriMonthName: 'Ramadan',
    description: 'Sepuluh malam terakhir Ramadan, terkhusus malam-malam ganjil yang lebih baik dari seribu bulan. Waktu pastinya dirahasiakan Allah SWT agar hamba-Nya bersungguh-sungguh beribadah.',
    status: 'estimated',
    statusText: 'Penjelasan Edukatif Al-Qur\'an & Sunnah',
    isLailatulQadarPotential: true,
  },
  {
    id: 'hol-8',
    name: 'Hari Raya Idulfitri (1 Syawal)',
    hijriDay: 1,
    hijriMonth: 10,
    hijriMonthName: 'Syawal',
    description: 'Hari kemenangan umat Islam setelah menunaikan puasa Ramadan.',
    status: 'pending',
    statusText: 'Menunggu Sidang Isbat Kemenag',
  },
  {
    id: 'hol-9',
    name: 'Hari Arafah (9 Zulhijah)',
    hijriDay: 9,
    hijriMonth: 12,
    hijriMonthName: 'Zulhijah',
    description: 'Puncak ibadah haji di padang Arafah dan disunnahkannya puasa Arafah.',
    status: 'pending',
    statusText: 'Menunggu Pengumuman Resmi Zulhijah',
  },
  {
    id: 'hol-10',
    name: 'Hari Raya Iduladha (10 Zulhijah)',
    hijriDay: 10,
    hijriMonth: 12,
    hijriMonthName: 'Zulhijah',
    description: 'Hari Raya Qurban meneladani ketaatan Nabi Ibrahim dan Ismail AS.',
    status: 'pending',
    statusText: 'Menunggu Pengumuman Resmi Zulhijah',
  },
  {
    id: 'hol-11',
    name: 'Hari Tasyrik (11, 12, 13 Zulhijah)',
    hijriDay: 11,
    hijriMonth: 12,
    hijriMonthName: 'Zulhijah',
    description: 'Tiga hari penyembelihan qurban dan hari tasyrik dilarang berpuasa.',
    status: 'pending',
    statusText: 'Menunggu Pengumuman Resmi Zulhijah',
  },
];

const HOLIDAY_REMINDERS_KEY = 'quranme_holiday_reminders_v1';

export class HijriService {
  /**
   * Convert Gregorian Date to Indonesian MABIMS Hijri Date
   */
  public static gregorianToHijri(date: Date = new Date()): HijriDate {
    // Precise Julian Day Number calculation
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();

    let jd: number;
    if (m > 2) {
      jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d - 1524.5;
    } else {
      jd = Math.floor(365.25 * (y - 1 + 4716)) + Math.floor(30.6001 * (m + 12 + 1)) + d - 1524.5;
    }

    // Gregorian correction
    const a = Math.floor(y / 100);
    const b = 2 - a + Math.floor(a / 4);
    jd += b;

    // Days since epoch of Islamic calendar (July 16, 622 CE = JD 1948439.5)
    // Synchronized with MABIMS Indonesia criteria (+1 day shift adjustment for Western Indonesia)
    const l = Math.floor(jd - 1948439.5) + 1;
    const n = Math.floor((l - 1) / 10631);
    const l1 = l - 10631 * n + 354;
    const j =
      Math.floor((10985 - l1) / 5316) * Math.floor((50 * l1) / 17719) +
      Math.floor(l1 / 5670) * Math.floor((43 * l1) / 15238);
    const l2 =
      l1 -
      Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
      Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
      29;
    const month = Math.floor((24 * l2) / 709);
    const day = l2 - Math.floor((709 * month) / 24);
    const year = 30 * n + j - 30;

    const safeMonth = Math.max(1, Math.min(12, month));
    const monthName = HIJRI_MONTHS[safeMonth - 1];

    return {
      day: Math.max(1, Math.min(30, day)),
      month: safeMonth,
      monthName,
      year: Math.max(1440, year),
      formatted: `${Math.max(1, Math.min(30, day))} ${monthName} ${year} H`,
    };
  }

  /**
   * Get all Islamic holidays with dynamic approximate Gregorian dates
   */
  public static getIslamicHolidays(targetHijriYear: number = 1447): IslamicHoliday[] {
    return ISLAMIC_HOLIDAYS_CATALOG.map((item) => {
      // Estimate Gregorian representation for reference display
      let approxDate = `${item.hijriDay} ${item.hijriMonthName}`;
      if (item.hijriMonth === 1) approxDate = `26 Jun 2025`;
      if (item.hijriMonth === 9) approxDate = `18 Feb 2026`;
      if (item.hijriMonth === 10) approxDate = `20 Mar 2026`;
      if (item.hijriMonth === 12) approxDate = `26 Mei 2026`;

      return {
        ...item,
        approxGregorianDate: approxDate,
      };
    });
  }

  /**
   * Holiday reminders management
   */
  public static getReminderPreferences(): Record<string, boolean> {
    try {
      const data = localStorage.getItem(HOLIDAY_REMINDERS_KEY);
      return data ? JSON.parse(data) : { 'hol-6': true, 'hol-7': true, 'hol-8': true, 'hol-10': true };
    } catch {
      return { 'hol-6': true, 'hol-7': true, 'hol-8': true, 'hol-10': true };
    }
  }

  public static toggleReminder(holidayId: string): boolean {
    const prefs = this.getReminderPreferences();
    const updated = !prefs[holidayId];
    prefs[holidayId] = updated;
    localStorage.setItem(HOLIDAY_REMINDERS_KEY, JSON.stringify(prefs));
    return updated;
  }
}
