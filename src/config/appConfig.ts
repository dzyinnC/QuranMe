export const APP_CONFIG = {
  appName: "QuranMe",
  primaryColor: "#0EAAFC",
  secondaryColor: "#43B433",
  backgroundColor: "#FEFEFE",
  contrastColor: "#000000",
  locale: "id-ID",
  direction: "ltr",
} as const;

export const BRAND_IDENTITY = {
  appName: "QuranMe",
  tagline: "Dekat dengan Al-Qur'an, Setiap Hari.",
  description:
    "QuranMe adalah ruang digital modern untuk membaca, memahami, dan membangun kebiasaan berinteraksi dengan Al-Qur'an secara teratur dan bermakna.",
  logoUrl: "/assets/aistudio/BackgroundEraser_20261026_135440364_7aed0bb9.png",
  iconUrl: "/icon.png",
  apiBaseUrl: "https://equran.id/api/v2",
};

export interface QariSource {
  id: string;
  name: string;
  country: "Indonesia" | "Arab Saudi" | "Kuwait";
  isIndonesian: boolean;
  style?: string;
  bio?: string;
  sourceName: string;
  sourceUrl: string;
  playbackMode: "full-surah" | "per-ayah";
  availableSurahs?: number[]; // If specified, only these surahs are in this catalog
  verified: boolean;
  getSurahAudioUrl?: (surahNomor: number) => string | null;
}

// 1. Qari Internasional dari equran.id API (mendukung audio per ayat dan full surat)
export const INTERNATIONAL_QARI: QariSource[] = [
  {
    id: "05",
    name: "Misyari Rasyid Al-Afasi",
    country: "Kuwait",
    isIndonesian: false,
    style: "Murattal",
    bio: "Imam Masjid Agung Kuwait, qari internasional terkenal dengan lantunan tartil merdu.",
    sourceName: "equran.id API v2",
    sourceUrl: "https://equran.id",
    playbackMode: "per-ayah",
    verified: true,
  },
  {
    id: "01",
    name: "Abdullah Al-Juhany",
    country: "Arab Saudi",
    isIndonesian: false,
    style: "Murattal",
    bio: "Salah satu imam Masjidil Haram di Makkah Al-Mukarramah.",
    sourceName: "equran.id API v2",
    sourceUrl: "https://equran.id",
    playbackMode: "per-ayah",
    verified: true,
  },
  {
    id: "02",
    name: "Abdul-Muhsin Al-Qasim",
    country: "Arab Saudi",
    isIndonesian: false,
    style: "Murattal",
    bio: "Imam dan khatib terkemuka di Masjid Nabawi Madinah Munawwarah.",
    sourceName: "equran.id API v2",
    sourceUrl: "https://equran.id",
    playbackMode: "per-ayah",
    verified: true,
  },
  {
    id: "03",
    name: "Abdurrahman as-Sudais",
    country: "Arab Saudi",
    isIndonesian: false,
    style: "Murattal",
    bio: "Kepala Pengurus Dua Masjid Suci dan Imam Besar Masjidil Haram.",
    sourceName: "equran.id API v2",
    sourceUrl: "https://equran.id",
    playbackMode: "per-ayah",
    verified: true,
  },
  {
    id: "04",
    name: "Ibrahim Al-Dossari",
    country: "Arab Saudi",
    isIndonesian: false,
    style: "Murattal",
    bio: "Qari terkemuka Arab Saudi dengan bacaan khas riwayat Hafs.",
    sourceName: "equran.id API v2",
    sourceUrl: "https://equran.id",
    playbackMode: "per-ayah",
    verified: true,
  },
  {
    id: "06",
    name: "Yasser Al-Dosari",
    country: "Arab Saudi",
    isIndonesian: false,
    style: "Murattal",
    bio: "Imam Masjidil Haram Makkah dengan lantunan emosional yang menggetarkan.",
    sourceName: "equran.id API v2",
    sourceUrl: "https://equran.id",
    playbackMode: "per-ayah",
    verified: true,
  },
];

// Helper to pad 3 digits for surah numbers
const pad3 = (n: number) => n.toString().padStart(3, "0");

// 2. Minimal 5 Qari Indonesia Terverifikasi (Audio Valid & Siap Diputar)
export const INDONESIAN_QARI: QariSource[] = [
  {
    id: "idn-muzammil",
    name: "Muzammil Hasballah",
    country: "Indonesia",
    isIndonesian: true,
    style: "Irama Nahawand & Hijaz Khas",
    bio: "Qari muda asal Pidie, Aceh, lulusan Arsitektur ITB dengan bacaan merdu yang viral dan menginspirasi jutaan generasi muda Muslim.",
    sourceName: "Internet Archive (MurottalMuzammilHasballah)",
    sourceUrl: "https://archive.org/details/MurottalMuzammilHasballah",
    playbackMode: "full-surah",
    // Surah yang terverifikasi dalam repositori audionya
    availableSurahs: [1, 8, 18, 25, 36, 55, 67, 75, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114],
    verified: true,
    getSurahAudioUrl: (surahNomor: number) => {
      const mapping: Record<number, string> = {
        1: "001%20Muzammil%20Hasballah%20-%20Al-Fatihah.mp3",
        8: "008%20Muzammil%20Hasballah%20-%20Al-Anfal.mp3",
        18: "018%20Muzammil%20Hasballah%20-%20Al-Kahfi.mp3",
        25: "025%20Muzammil%20Hasballah%20-%20Al-Furqan.mp3",
        36: "036%20Muzammil%20Hasballah%20-%20Yasin.mp3",
        55: "055%20Muzammil%20Hasballah%20-%20Ar-Rahman.mp3",
        67: "067%20Muzammil%20Hasballah%20-%20Al-Mulk.mp3",
        75: "075%20Muzammil%20Hasballah%20-%20Al-Qiyamah.mp3",
        78: "078%20Muzammil%20Hasballah%20-%20An-Naba%27.mp3",
        79: "079%20Muzammil%20Hasballah%20-%20An-Nazi%27at.mp3",
        80: "080%20Muzammil%20Hasballah%20-%20%27Abasa.mp3",
        81: "081%20Muzammil%20Hasballah%20-%20At-Takwir.mp3",
        82: "082%20Muzammil%20Hasballah%20-%20Al-Infitar.mp3",
        83: "083%20Muzammil%20Hasballah%20-%20Al-Mutaffifin.mp3",
        84: "084%20Muzammil%20Hasballah%20-%20Al-Insyiqaq.mp3",
        85: "085%20Muzammil%20Hasballah%20-%20Al-Buruj.mp3",
        86: "086%20Muzammil%20Hasballah%20-%20At-Tariq.mp3",
        87: "087%20Muzammil%20Hasballah%20-%20Al-A%27la.mp3",
        88: "088%20Muzammil%20Hasballah%20-%20Al-Ghasyiyah.mp3",
        89: "089%20Muzammil%20Hasballah%20-%20Al-Fajr.mp3",
        90: "090%20Muzammil%20Hasballah%20-%20Al-Balad.mp3",
        91: "091%20Muzammil%20Hasballah%20-%20Asy-Syams.mp3",
        92: "092%20Muzammil%20Hasballah%20-%20Al-Lail.mp3",
        93: "093%20Muzammil%20Hasballah%20-%20Ad-Duha.mp3",
        94: "094%20Muzammil%20Hasballah%20-%20Asy-Syarh.mp3",
        95: "095%20Muzammil%20Hasballah%20-%20At-Tin.mp3",
        96: "096%20Muzammil%20Hasballah%20-%20Al-%27Alaq.mp3",
        97: "097%20Muzammil%20Hasballah%20-%20Al-Qadr.mp3",
        98: "098%20Muzammil%20Hasballah%20-%20Al-Bayyinah.mp3",
        99: "099%20Muzammil%20Hasballah%20-%20Az-Zalzalah.mp3",
        100: "100%20Muzammil%20Hasballah%20-%20Al-%27Adiyat.mp3",
        101: "101%20Muzammil%20Hasballah%20-%20Al-Qari%27ah.mp3",
        102: "102%20Muzammil%20Hasballah%20-%20At-Takasur.mp3",
        103: "103%20Muzammil%20Hasballah%20-%20Al-%27Asr.mp3",
        104: "104%20Muzammil%20Hasballah%20-%20Al-Humazah.mp3",
        105: "105%20Muzammil%20Hasballah%20-%20Al-Fil.mp3",
        106: "106%20Muzammil%20Hasballah%20-%20Quraisy.mp3",
        107: "107%20Muzammil%20Hasballah%20-%20Al-Ma%27un.mp3",
        108: "108%20Muzammil%20Hasballah%20-%20Al-Kausar.mp3",
        109: "109%20Muzammil%20Hasballah%20-%20Al-Kafirun.mp3",
        110: "110%20Muzammil%20Hasballah%20-%20An-Nasr.mp3",
        111: "111%20Muzammil%20Hasballah%20-%20Al-Lahab.mp3",
        112: "112%20Muzammil%20Hasballah%20-%20Al-Ikhlas.mp3",
        113: "113%20Muzammil%20Hasballah%20-%20Al-Falaq.mp3",
        114: "114%20Muzammil%20Hasballah%20-%20An-Nas.mp3",
      };
      const file = mapping[surahNomor];
      return file ? `https://archive.org/download/MurottalMuzammilHasballah/${file}` : null;
    },
  },
  {
    id: "idn-muammar",
    name: "KH. Muammar ZA",
    country: "Indonesia",
    isIndonesian: true,
    style: "Nagham Klasik Indonesia / Mujawwad",
    bio: "Maestro Qari legendaris Indonesia asal Pemalang, Jawa Tengah. Juara MTQ Nasional dan Internasional dengan teknik pernafasan dan cengkok khas Nusantara yang melegenda.",
    sourceName: "Internet Archive (muammar_murottal_first)",
    sourceUrl: "https://archive.org/details/muammar_murottal_first",
    playbackMode: "full-surah",
    availableSurahs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    verified: true,
    getSurahAudioUrl: (surahNomor: number) => {
      const names: Record<number, string> = {
        1: "MuammarZA_Murottal_001_Al_Fatihah.mp3",
        2: "MuammarZA_Murottal_002_Al_Baqarah.mp3",
        3: "MuammarZA_Murottal_003_Ali_Imraan.mp3",
        4: "MuammarZA_Murottal_004_An_Nisa.mp3",
        5: "MuammarZA_Murottal_005_Al_Maidah.mp3",
        6: "MuammarZA_Murottal_006_Al_Anam.mp3",
        7: "MuammarZA_Murottal_007_Al_Araf.mp3",
        8: "MuammarZA_Murottal_008_Al_Anfal.mp3",
        9: "MuammarZA_Murottal_009_At_Taubah.mp3",
        10: "MuammarZA_Murottal_010_Yunus.mp3",
        11: "MuammarZA_Murottal_011_Hud.mp3",
        12: "MuammarZA_Murottal_012_Yusuf.mp3",
        13: "MuammarZA_Murottal_013_Ar_Rad.mp3",
        14: "MuammarZA_Murottal_014_Ibrahim.mp3",
        15: "MuammarZA_Murottal_015_Al_Hijr.mp3",
        16: "MuammarZA_Murottal_016_An_Nahl.mp3",
        17: "MuammarZA_Murottal_017_Al_Isra.mp3",
        18: "MuammarZA_Murottal_018_Al_Kahfi.mp3",
        19: "MuammarZA_Murottal_019_Maryam.mp3",
        20: "MuammarZA_Murottal_020_Thaha.mp3",
        21: "MuammarZA_Murottal_021_Al_Anbiya.mp3",
        22: "MuammarZA_Murottal_022_Al_Haj.mp3",
      };
      const file = names[surahNomor];
      return file ? `https://archive.org/download/muammar_murottal_first/${file}` : null;
    },
  },
  {
    id: "idn-zain",
    name: "Ustadz Zain Abu Kautsar",
    country: "Indonesia",
    isIndonesian: true,
    style: "Tartil Lembut & Menyejukkan",
    bio: "Qari asal Indonesia yang dikenal luas lewat lantunan tartil Al-Qur'an dengan artikulasi makharijul huruf yang sangat bening dan menentramkan hati.",
    sourceName: "Internet Archive (murottalzainabukautsar)",
    sourceUrl: "https://archive.org/details/murottalzainabukautsar",
    playbackMode: "full-surah",
    availableSurahs: [1, 18, 32, 36, 44, 55, 56, 67, 71, 73, 76, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114],
    verified: true,
    getSurahAudioUrl: (surahNomor: number) => {
      const valid = [1, 18, 32, 36, 44, 55, 56, 67, 71, 73, 76, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114];
      if (valid.includes(surahNomor)) {
        return `https://archive.org/download/murottalzainabukautsar/${pad3(surahNomor)}.mp3`;
      }
      return null;
    },
  },
  {
    id: "idn-ibrohim",
    name: "Ibrohim Elhaq",
    country: "Indonesia",
    isIndonesian: true,
    style: "Tartil Jernih & Syahdu",
    bio: "Qari muda asal Indonesia dengan suara merdu dan pembawaan tartil yang teduh, sering memimpin sholat berjamaah di berbagai masjid besar nusantara.",
    sourceName: "Internet Archive (IbrohimElhaqmp3)",
    sourceUrl: "https://archive.org/details/IbrohimElhaqmp3",
    playbackMode: "full-surah",
    availableSurahs: [36, 47, 49, 50, 51, 53, 55, 56, 57, 58, 59, 61, 63, 67, 75, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114],
    verified: true,
    getSurahAudioUrl: (surahNomor: number) => {
      const mapping: Record<number, string> = {
        36: "Ibrohim%20Elhaq%20-%2036.%20Yasin.mp3",
        47: "Ibrohim%20Elhaq%20-%2047.%20Muhammad.mp3",
        49: "Ibrohim%20Elhaq%20-%2049.%20Al%20Hujurat.mp3",
        50: "Ibrohim%20Elhaq%20-%2050.%20Qaf.mp3",
        51: "Ibrohim%20Elhaq%20-%2051.%20Ad%20Dhariat.mp3",
        53: "Ibrohim%20Elhaq%20-%2053.%20An%20Najm.mp3",
        55: "Ibrohim%20Elhaq%20-%2055.%20Ar%20Rohman.mp3",
        56: "Ibrohim%20Elhaq%20-%2056.%20Al%20Waqiah.mp3",
        57: "Ibrohim%20Elhaq%20-%2057.%20Al%20Hadid.mp3",
        58: "Ibrohim%20Elhaq%20-%2058.%20Surat%20Mujadilah.mp3",
        59: "Ibrohim%20Elhaq%20-%2059.%20Al-Hasyr.mp3",
        61: "Ibrohim%20Elhaq%20-%2061.%20As%20Saf.mp3",
        63: "Ibrohim%20Elhaq%20-%2063.%20Al%20Munafiqun.mp3",
        67: "Ibrohim%20Elhaq%20-%2067.%20Al%20Mulk.mp3",
        75: "Ibrohim%20Elhaq%20-%2075.%20Al%20Qiyamah.mp3",
        78: "Ibrohim%20Elhaq%20-%2078.%20An%20Naba%27.mp3",
        79: "Ibrohim%20Elhaq%20-%2079.%20An%20Naziat.mp3",
        80: "Ibrohim%20Elhaq%20-%2080.%20Abasa.mp3",
        81: "Ibrohim%20Elhaq%20-%2081.%20At%20Takwir.mp3",
        82: "Ibrohim%20Elhaq%20-%2082.%20Al%20Infithar.mp3",
        83: "Ibrohim%20Elhaq%20-%2083.%20Al%20Muthaffifin.mp3",
        84: "Ibrohim%20Elhaq%20-%2084.%20Al%20Insyiqaq.mp3",
        85: "Ibrohim%20Elhaq%20-%2085.%20Al%20Buruj.mp3",
        86: "Ibrohim%20Elhaq%20-%2086.%20Ath%20Thariq.mp3",
        87: "Ibrohim%20Elhaq%20-%2087.%20Al%20A%27la.mp3",
        88: "Ibrohim%20Elhaq%20-%2088.%20Al%20Ghasyiyah.mp3",
        89: "Ibrohim%20Elhaq%20-%2089.%20Al%20Fajr.mp3",
        90: "Ibrohim%20Elhaq%20-%2090.%20Al%20Balad.mp3",
        91: "Ibrohim%20Elhaq%20-%2091.%20Asy%20Syams.mp3",
        92: "Ibrohim%20Elhaq%20-%2092.%20Al%20Lail.mp3",
        93: "Ibrohim%20Elhaq%20-%2093.%20Adh%20Dhuha.mp3",
        94: "Ibrohim%20Elhaq%20-%2094.%20Al%20Insyirah.mp3",
        95: "Ibrohim%20Elhaq%20-%2095.%20At%20Tin.mp3",
        96: "Ibrohim%20Elhaq%20-%2096.%20Al%20Alaq.mp3",
        97: "Ibrohim%20Elhaq%20-%2097.%20Al%20Qadr.mp3",
        98: "Ibrohim%20Elhaq%20-%2098.%20Al%20Bayyinah.mp3",
        99: "Ibrohim%20Elhaq%20-%2099.%20Az%20Zalzalah.mp3",
        100: "Ibrohim%20Elhaq%20-%20100.%20Al%20Adiyat.mp3",
        101: "Ibrohim%20Elhaq%20-%20101.%20Al%20Qoriah.mp3",
        102: "Ibrohim%20Elhaq%20-%20102.%20At%20Takatsur.mp3",
        103: "Ibrohim%20Elhaq%20-%20103.%20Al%20Asr.mp3",
        104: "Ibrohim%20Elhaq%20-%20104.%20Al%20Humazah.mp3",
        105: "Ibrohim%20Elhaq%20-%20105.%20Al%20Fill.mp3",
        106: "Ibrohim%20Elhaq%20-%20106.%20Al%20Quraish.mp3",
        107: "Ibrohim%20Elhaq%20-%20107.%20Al%20Maun.mp3",
        108: "Ibrohim%20Elhaq%20-%20108.%20Al%20Kautsar.mp3",
        109: "Ibrohim%20Elhaq%20-%20109.%20Al%20Kafirun.mp3",
        110: "Ibrohim%20Elhaq%20-%20110.%20An%20Nashr.mp3",
        111: "Ibrohim%20Elhaq%20-%20111.%20Al%20Lahab.mp3",
        112: "Ibrohim%20Elhaq%20-%20112.%20Al%20Ikhlas.mp3",
        113: "Ibrohim%20Elhaq%20-%20113.%20Al%20Falaq.mp3",
        114: "Ibrohim%20Elhaq%20-%20114.%20An%20Nas.mp3",
      };
      const file = mapping[surahNomor];
      return file ? `https://archive.org/download/IbrohimElhaqmp3/${file}` : null;
    },
  },
  {
    id: "idn-taqy",
    name: "Taqy Malik",
    country: "Indonesia",
    isIndonesian: true,
    style: "Tartil Modern Khas Nusantara",
    bio: "Qari muda dan hafizh Al-Qur'an asal Banjarmasin, Kalimantan Selatan, dikenal dengan bacaan tartil bervolume lembut dan menyejukkan sanubari.",
    sourceName: "Internet Archive (TaqyMalikmp3)",
    sourceUrl: "https://archive.org/details/TaqyMalikmp3",
    playbackMode: "full-surah",
    availableSurahs: [36, 47, 50, 55, 56, 67, 68, 72, 75],
    verified: true,
    getSurahAudioUrl: (surahNomor: number) => {
      const mapping: Record<number, string> = {
        36: "Taqy-Malik-Surat%2036-YaSiin.mp3",
        47: "Taqy-Malik-Surat%2047-Muhammad.mp3",
        50: "Taqy-Malik-Surat%2050-Qaf.mp3",
        55: "Taqy-Malik-Surat%2055-Ar-Rahman.mp3",
        56: "Taqy-Malik-Surat%2056-Al-Waqiah.mp3",
        67: "Taqy-Malik-Surat%2067-Al%20Mulk.mp3",
        68: "Taqy-Malik-Surat%2068-Al-Qalam.mp3",
        72: "Taqy-Malik-Surat%2072-Al-Jin.mp3",
        75: "Taqy-Malik-Surat%2075-Al-Qiyamah.mp3",
      };
      const file = mapping[surahNomor];
      return file ? `https://archive.org/download/TaqyMalikmp3/${file}` : null;
    },
  },
];

// Gabungan seluruh Qari yang dapat dipilih pengguna
export const ALL_QARI: QariSource[] = [
  ...INTERNATIONAL_QARI,
  ...INDONESIAN_QARI,
];

// Compatibility export
export const AVAILABLE_QARI = ALL_QARI.map((q) => ({
  id: q.id,
  name: q.name,
  country: q.country,
  isIndonesian: q.isIndonesian,
}));

export type QariId = string;
