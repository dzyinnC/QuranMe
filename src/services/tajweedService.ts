/**
 * QuranMe Tajweed Engine & Rule Dictionary
 * - Integrates with Quran Foundation / Quran.com API v4 (Hafs 'an 'Asim, Mushaf Uthmani)
 * - Word & segment level Tajweed classification
 * - Accurate Indonesian scholarly explanations (Tuhfat al-Atfal & Al-Muqaddimah al-Jazariyyah)
 * - Offline caching and graceful fallbacks
 */

export interface TajweedRuleInfo {
  className: string;
  name: string;
  category: 'mad' | 'nun_tanwin' | 'mim' | 'qalqalah' | 'idgham' | 'lam' | 'hamzah' | 'ghunnah' | 'silent';
  colorBadge: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  alasan: string;
  caraBaca: string;
  durasi?: string;
  huruf?: string[];
  contohLafaz?: string;
  rujukanKitab: string;
}

export interface TajweedToken {
  text: string;
  className?: string;
  rule?: TajweedRuleInfo;
  isWaqaf?: boolean;
  waqafMeaning?: string;
}

export interface TajweedVerse {
  ayatNomor: number;
  tokens: TajweedToken[];
  rawTajweedHtml: string;
}

// 1. Comprehensive scholarly Tajweed rules dictionary based on Hafs 'an 'Asim
export const TAJWEED_RULES: Record<string, TajweedRuleInfo> = {
  // --- HUKUM MAD (Panjang) ---
  madda_normal: {
    className: 'madda_normal',
    name: "Mad Thabi'i (Mad Asli)",
    category: 'mad',
    colorBadge: '#845EC2',
    textColor: '#6B46C1',
    bgColor: '#F3E8FF',
    borderColor: '#D8B4FE',
    alasan: 'Huruf mad (Alif setelah fathah, Wawu sukun setelah dhammah, atau Ya sukun setelah kasrah) tanpa sebab hamzah atau sukun.',
    caraBaca: 'Dibaca panjang 2 harakat (1 alif) secara wajar tanpa berlebih-lebihan.',
    durasi: '2 Harakat',
    huruf: ['ا', 'و', 'ي'],
    rujukanKitab: "Matan Tuhfat al-Atfal (Bait 41-43): 'وَالمَدُّ أَصْلِيٌّ وَفَرْعِيٌّ لَهُ * وَسَمِّ أَوَّلًا طَبِيعِيًّا وَهُوَ...'",
  },
  madda_obligatory: {
    className: 'madda_obligatory',
    name: 'Mad Wajib Muttashil',
    category: 'mad',
    colorBadge: '#D65DB1',
    textColor: '#B83280',
    bgColor: '#FCE7F3',
    borderColor: '#F472B6',
    alasan: 'Huruf mad bertemu huruf hamzah (ء) di dalam satu kata (sambung).',
    caraBaca: 'Wajib dibaca panjang 4 sampai 5 harakat saat washal maupun waqaf (menurut riwayat Hafs dari Asim).',
    durasi: '4 - 5 Harakat (Wajib)',
    huruf: ['ء'],
    rujukanKitab: "Matan Tuhfat al-Atfal (Bait 46): 'فَوَاجِبٌ إِنْ جَاءَ هَمْزٌ بَعْدَ مَدّ * فِي كِلْمَةٍ وَذَا بِمُتَّصِلْ يُعَدّ'",
  },
  madda_permissible: {
    className: 'madda_permissible',
    name: "Mad Jaiz Munfashil / 'Aridh Lissukun",
    category: 'mad',
    colorBadge: '#FF6F91',
    textColor: '#E53E3E',
    bgColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    alasan: "Huruf mad bertemu hamzah di lain kata (Munfashil) ATAU huruf mad bertemu sukun 'aridh akibat berhenti/waqaf.",
    caraBaca: 'Boleh dibaca 2, 4, atau 5 harakat (Munfashil) atau 2, 4, 6 harakat (Aridh lissukun saat waqaf).',
    durasi: '2, 4, atau 5-6 Harakat',
    rujukanKitab: "Matan Tuhfat al-Atfal (Bait 47): 'وَجَائِزٌ مَدٌّ وَقَصْرٌ إِنْ فُصِلْ * كُلٌّ بِكِلْمَةٍ وَهَذَا المُنْفَصِلْ'",
  },
  madda_necessary: {
    className: 'madda_necessary',
    name: 'Mad Lazim (Kilmi / Harfi)',
    category: 'mad',
    colorBadge: '#C51162',
    textColor: '#991B1B',
    bgColor: '#FFE4E6',
    borderColor: '#FDA4AF',
    alasan: 'Huruf mad bertemu huruf bertasydid atau berharakat sukun asli baik dalam satu kata maupun rangkaian fawatihussuwar.',
    caraBaca: 'Pasti dibaca panjang 6 harakat secara sempurna (lazim mutsaqqal / mukhaffaf).',
    durasi: '6 Harakat Penuh (Lazim)',
    rujukanKitab: "Matan Tuhfat al-Atfal (Bait 50): 'أَقْسَامُ لَازِمٍ لَدَيْهِمْ أَرْبَعَة * وَتِلْكَ كِلْمِيٌّ وَحَرْفِيٌّ مَعَهْ'",
  },

  // --- HUKUM NUN SUKUN & TANWIN ---
  ikhafa: {
    className: 'ikhafa',
    name: 'Ikhfa Haqiqi',
    category: 'nun_tanwin',
    colorBadge: '#2E7D32',
    textColor: '#15803D',
    bgColor: '#DCFCE7',
    borderColor: '#86EFAC',
    alasan: 'Nun sukun (نْ) atau tanwin bertemu salah satu dari 15 huruf ikhfa (ت, ث, ج, د, ذ, ز, س, ش, ص, ض, ط, ظ, ف, ق, ك).',
    caraBaca: 'Bunyi nun sukun atau tanwin disamarkan ke arah makhraj huruf berikutnya disertai ghunnah (dengung) 2 harakat.',
    durasi: '2 Harakat (Ghunnah)',
    huruf: ['ت', 'ث', 'ج', 'د', 'ذ', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ف', 'ق', 'ك'],
    rujukanKitab: "Matan Tuhfat al-Atfal (Bait 20): 'وَالرَّابِعُ الإِخْفَاءُ عِنْدَ الفَاضِلِ * مِنَ الحُرُوفِ وَاجِبٌ لِلْفَاضِلِ...'",
  },
  idgham_ghunnah: {
    className: 'idgham_ghunnah',
    name: 'Idgham Bighunnah (Ma’al Ghunnah)',
    category: 'nun_tanwin',
    colorBadge: '#0284C7',
    textColor: '#0369A1',
    bgColor: '#E0F2FE',
    borderColor: '#7DD3FC',
    alasan: 'Nun sukun (نْ) atau tanwin bertemu salah satu dari 4 huruf ya, nun, mim, wau (ي, ن, م, و) dalam dua kata berlainan.',
    caraBaca: 'Memasukkan bunyi nun sukun/tanwin ke huruf berikutnya secara lebur disertai dengung sempurna (ghunnah) 2 harakat.',
    durasi: '2 Harakat',
    huruf: ['ي', 'ن', 'م', 'و'],
    rujukanKitab: "Matan Tuhfat al-Atfal (Bait 10): 'لَكِنَّهَا قِسْمَانِ قِسْمٌ يُدْغَمَا * فِيهِ بِغُنَّةٍ بِيَنْمُو عُلِمَا'",
  },
  idgham_wo_ghunnah: {
    className: 'idgham_wo_ghunnah',
    name: 'Idgham Bilaghunnah',
    category: 'nun_tanwin',
    colorBadge: '#0D9488',
    textColor: '#0F766E',
    bgColor: '#CCFBF1',
    borderColor: '#5EEAD4',
    alasan: 'Nun sukun (نْ) atau tanwin bertemu dengan huruf Lam (ل) atau Ra (ر).',
    caraBaca: 'Memasukkan bunyi nun sukun/tanwin ke huruf lam atau ra secara utuh tanpa ada dengung sedikitpun.',
    huruf: ['ل', 'ر'],
    rujukanKitab: "Matan Tuhfat al-Atfal (Bait 14): 'وَالثَّانِ إِدْغَامٌ بِغَيْرِ غُنَّةْ * فِي اللَّامِ وَالرَّا ثُمَّ كَرِّرَنَّهْ'",
  },
  iqlab: {
    className: 'iqlab',
    name: 'Iqlab',
    category: 'nun_tanwin',
    colorBadge: '#D97706',
    textColor: '#B45309',
    bgColor: '#FEF3C7',
    borderColor: '#FCD34D',
    alasan: 'Nun sukun (نْ) atau tanwin bertemu huruf Ba (ب).',
    caraBaca: 'Mengubah bunyi nun sukun atau tanwin menjadi suara Mim (م) ringan dengan merapatkan bibir tanpa menekan keras, disertai ghunnah 2 harakat.',
    durasi: '2 Harakat (Ghunnah)',
    huruf: ['ب'],
    rujukanKitab: "Matan Tuhfat al-Atfal (Bait 17): 'وَالثَّالِثُ الإِقْلَابُ عِنْدَ البَاءِ * مِيمًا بِغُنَّةٍ مَعَ الإِخْفَاءِ'",
  },

  // --- HUKUM MIM SUKUN & GHUNNAH ---
  ghunnah: {
    className: 'ghunnah',
    name: 'Ghunnah Musyaddadah',
    category: 'ghunnah',
    colorBadge: '#10B981',
    textColor: '#047857',
    bgColor: '#D1FAE5',
    borderColor: '#6EE7B7',
    alasan: 'Huruf Nun bertasydid (نّ) atau Mim bertasydid (مّ) baik di tengah maupun akhir kata.',
    caraBaca: 'Mendengungkan suara di pangkal hidung (Al-Khaisyum) secara mantap dan ditahan selama 2 harakat.',
    durasi: '2 Harakat (Akmal ma takun)',
    huruf: ['نّ', 'مّ'],
    rujukanKitab: "Matan Tuhfat al-Atfal (Bait 19): 'وَغُنَّ مِيمًا ثُمَّ نُونًا شُدِّدَا * وَسَمِّ كُلًّا حَرْفَ غُنَّةٍ بَدَا'",
  },
  ikhafa_syafawi: {
    className: 'ikhafa_syafawi',
    name: 'Ikhfa Syafawi',
    category: 'mim',
    colorBadge: '#059669',
    textColor: '#047857',
    bgColor: '#E6FFFA',
    borderColor: '#81E6D9',
    alasan: 'Mim sukun (مْ) bertemu dengan huruf Ba (ب).',
    caraBaca: 'Menyamarkan bacaan mim sukun di bibir disertai dengung (ghunnah) 2 harakat.',
    durasi: '2 Harakat',
    huruf: ['ب'],
    rujukanKitab: "Matan Tuhfat al-Atfal (Bait 26): 'فَالأَوَّلُ الإِخْفَاءُ عِنْدَ البَاءِ * وَسَمِّهِ الشَّفْوِيَّ لِلقُرَّاءِ'",
  },
  idgham_shafawi: {
    className: 'idgham_shafawi',
    name: 'Idgham Mimi (Mitslain Shaghir)',
    category: 'mim',
    colorBadge: '#0284C7',
    textColor: '#0369A1',
    bgColor: '#E0F2FE',
    borderColor: '#BAE6FD',
    alasan: 'Mim sukun (مْ) bertemu dengan huruf Mim (م).',
    caraBaca: 'Memasukkan mim pertama ke mim kedua sehingga menjadi mim bertasydid yang didengungkan 2 harakat.',
    durasi: '2 Harakat',
    huruf: ['م'],
    rujukanKitab: "Matan Tuhfat al-Atfal (Bait 27): 'وَالثَّانِ إِدْغَامٌ بِمِثْلِهَا أَتَى * وَسَمِّ إِدْغَامًا صَغِيرًا يَا فَتَى'",
  },

  // --- QALQALAH (Pantulan) ---
  qalaqah: {
    className: 'qalaqah',
    name: 'Qalqalah (Sughra / Kubra)',
    category: 'qalqalah',
    colorBadge: '#0EAAFC',
    textColor: '#0284C7',
    bgColor: '#E0F7FF',
    borderColor: '#7DD3FC',
    alasan: 'Huruf qalqalah (ب, ج, د, ط, ق - Ba Ju Di To Ko) berharakat sukun asli di tengah kata (Sughra) atau disukunkan saat waqaf di akhir kata (Kubra).',
    caraBaca: 'Memantulkan makhraj huruf dengan getaran ringan (sughra) atau pantulan kuat dan jelas (kubra).',
    huruf: ['ق', 'ط', 'ب', 'ج', 'د'],
    rujukanKitab: "Matan Al-Jazariyyah (Bait 14): 'قَلْقَلَةٌ قُطْبُ جَدٍّ وَاللِّينُ * وَاوٌ وَيَاءٌ سَكَنَا وَانْفَتَحَا...'",
  },

  // --- IDGHAM LAINNYA ---
  idgham_mutajanisayn: {
    className: 'idgham_mutajanisayn',
    name: 'Idgham Mutajanisain',
    category: 'idgham',
    colorBadge: '#6366F1',
    textColor: '#4338CA',
    bgColor: '#EEF2FF',
    borderColor: '#A5B4FC',
    alasan: 'Pertemuan dua huruf yang sama makhrajnya namun berbeda sebagian sifatnya (misal: Ta sukun bertemu Tha, Dal sukun bertemu Ta, Ba sukun bertemu Mim).',
    caraBaca: 'Memasukkan huruf pertama ke dalam huruf kedua secara utuh.',
    rujukanKitab: "Matan Tuhfat al-Atfal (Bait 35): 'إِنْ فِي المَخَارِجِ اتَّفَقَا وَفِي * الصِّفَاتِ اخْتَلَفَا يُلَقَّبَا مُتَجَانِسَيْنِ'",
  },
  idgham_mutaqaribayn: {
    className: 'idgham_mutaqaribayn',
    name: 'Idgham Mutaqaribain',
    category: 'idgham',
    colorBadge: '#8B5CF6',
    textColor: '#6D28D9',
    bgColor: '#F5F3FF',
    borderColor: '#C4B5FD',
    alasan: 'Pertemuan dua huruf yang berdekatan makhraj dan sifatnya (misal: Qaf sukun bertemu Kaf, Lam sukun bertemu Ra).',
    caraBaca: 'Memasukkan huruf pertama ke dalam huruf kedua.',
    rujukanKitab: "Matan Tuhfat al-Atfal (Bait 36): 'أَوْ يَكُونَا مَخْرَجًا تَقَارَبَا * وَفِي الصِّفَاتِ اخْتَلَفَا يُلَقَّبَا مُتَقَارِبَيْنِ'",
  },

  // --- ALIF LAM & HAMZAH ---
  laam_shamsiyah: {
    className: 'laam_shamsiyah',
    name: 'Alif Lam Syamsiyah (Idgham Syamsiyah)',
    category: 'lam',
    colorBadge: '#4F46E5',
    textColor: '#3730A3',
    bgColor: '#EEF2FF',
    borderColor: '#C7D2FE',
    alasan: 'Alif lam ta’rif bertemu salah satu dari 14 huruf syamsiyah (ط ث ص ر ت ض ذ ن د س ظ ز ش ل).',
    caraBaca: 'Huruf lam tidak dibaca sukun, melainkan dileburkan ke dalam huruf berikutnya yang berharakat tasydid.',
    huruf: ['ط', 'ث', 'ص', 'ر', 'ت', 'ض', 'ذ', 'ن', 'د', 'س', 'ظ', 'ز', 'ش', 'ل'],
    rujukanKitab: "Matan Tuhfat al-Atfal (Bait 32): 'ثَانِيهِمَا إِدْغَامُهَا فِي أَرْبَعِ * وَعَشْرَةٍ أَيْضًا وَرَمْزَهَا فَعِ...'",
  },
  ham_wasl: {
    className: 'ham_wasl',
    name: 'Hamzah Washl',
    category: 'hamzah',
    colorBadge: '#94A3B8',
    textColor: '#475569',
    bgColor: '#F1F5F9',
    borderColor: '#CBD5E1',
    alasan: 'Hamzah washl bertindak sebagai perantara bacaan di awal kalimat, namun diabaikan (gugur) ketika disambung dari kata sebelumnya.',
    caraBaca: 'Tidak dibaca saat washal (menyambung bacaan); hanya dibaca jika memulai bacaan (ibtida).',
    rujukanKitab: "Matan Al-Jazariyyah (Bab Hamzatil Washli): 'وَابْدَأْ بِهَمْزِ الوَصْلِ مِنْ فِعْلٍ بِضَمّ...'",
  },
  slnt: {
    className: 'slnt',
    name: 'Huruf Gugur / Ziyadah (Silent Letter)',
    category: 'silent',
    colorBadge: '#94A3B8',
    textColor: '#64748B',
    bgColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    alasan: 'Huruf rasm Utsmani tambahan yang tidak dilafalkan dalam riwayat bacaan Hafs dari Asim.',
    caraBaca: 'Diabaikan dalam pelafalan (langsung menuju huruf berharakat sesudahnya).',
    rujukanKitab: 'Pedoman Rasm Utsmani Mushaf Standar Indonesia & Al-Muqaddimah al-Jazariyyah',
  },
};

// 2. Waqaf Markers Dictionary (Mushaf Standar Indonesia & Mushaf Madinah)
export const WAQAF_MARKERS: Record<string, { name: string; meaning: string; advice: string }> = {
  'م': {
    name: 'Waqaf Lazim (م)',
    meaning: 'Harus berhenti sempurna.',
    advice: 'Wajib berhenti untuk menyempurnakan makna ayat dan mencegah kerancuan arti jika disambung.',
  },
  'لا': {
    name: 'Waqaf La Wakfa Fih (لا)',
    meaning: 'Dilarang berhenti di sini.',
    advice: 'Tidak boleh berhenti karena maknanya belum sempurna dan terikat kuat dengan kata berikutnya, kecuali jika tanda ini berada di akhir ayat.',
  },
  'ج': {
    name: 'Waqaf Jaiz (ج)',
    meaning: 'Boleh berhenti atau lanjut.',
    advice: 'Pembaca memiliki pilihan setara: berhenti dipersilakan, menyambung bacaan (washal) pun diperbolehkan.',
  },
  'صلى': {
    name: 'Waqaf Al-Washlu Aula (صلى)',
    meaning: 'Menyambung lebih utama.',
    advice: 'Boleh berhenti jika kehabisan nafas, namun menyambung bacaan (washal) lebih disukai dan utama.',
  },
  'قلى': {
    name: 'Waqaf Al-Waqfu Aula (قلى)',
    meaning: 'Berhenti lebih utama.',
    advice: 'Boleh menyambung, namun berhenti (waqaf) lebih utama dan selaras dengan struktur makna ayat.',
  },
  '∴': {
    name: 'Waqaf Mu’anaqah (Tanda Tiga Titik)',
    meaning: 'Berhenti di salah satu tempat saja.',
    advice: 'Jika sudah berhenti pada tanda titik tiga pertama, maka pada tanda titik tiga kedua harus lanjut (washal), dan tidak boleh berhenti pada kedua-duanya.',
  },
};

// In-memory cache for surah tajweed verses
const memoryTajweedCache = new Map<number, TajweedVerse[]>();
const inFlightTajweed = new Map<number, Promise<TajweedVerse[]>>();

export class TajweedService {
  /**
   * Mengambil metadata tajweed per ayat untuk surah tertentu dari Quran.com API v4
   * Dilengkapi cache in-memory dan localStorage
   */
  static async getSurahTajweed(surahNomor: number): Promise<TajweedVerse[]> {
    if (surahNomor < 1 || surahNomor > 114) {
      throw new Error('Nomor surah tidak valid (1-114)');
    }

    // 1. Check in-memory cache
    if (memoryTajweedCache.has(surahNomor)) {
      return memoryTajweedCache.get(surahNomor)!;
    }

    // 2. Check localStorage cache
    const storageKey = `quranme_tajweed_v2_s${surahNomor}`;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed: TajweedVerse[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          memoryTajweedCache.set(surahNomor, parsed);
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Tajweed storage read error:', e);
    }

    // 3. Deduplicate in-flight network requests
    if (inFlightTajweed.has(surahNomor)) {
      return inFlightTajweed.get(surahNomor)!;
    }

    const fetchPromise = (async () => {
      try {
        const url = `https://api.quran.com/api/v4/quran/verses/uthmani_tajweed?chapter_number=${surahNomor}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }
        const json = await res.json();
        if (json && Array.isArray(json.verses)) {
          const parsedVerses: TajweedVerse[] = json.verses.map((v: any, idx: number) => {
            const rawHtml: string = v.text_uthmani_tajweed || '';
            const ayatNum = idx + 1;
            const tokens = TajweedService.parseTajweedHtml(rawHtml);
            return {
              ayatNomor: ayatNum,
              tokens,
              rawTajweedHtml: rawHtml,
            };
          });

          memoryTajweedCache.set(surahNomor, parsedVerses);
          try {
            localStorage.setItem(storageKey, JSON.stringify(parsedVerses));
          } catch (e) {
            console.warn('Failed to cache tajweed in localStorage:', e);
          }
          return parsedVerses;
        }
        throw new Error('Format data tajweed API tidak sesuai');
      } catch (err) {
        console.warn(`Tajweed fetch error for surah ${surahNomor}:`, err);
        throw err;
      }
    })();

    inFlightTajweed.set(surahNomor, fetchPromise);
    try {
      const result = await fetchPromise;
      return result;
    } finally {
      inFlightTajweed.delete(surahNomor);
    }
  }

  /**
   * Parse Quran.com <tajweed class=XYZ>...</tajweed> tag string into structured tokens
   */
  static parseTajweedHtml(html: string): TajweedToken[] {
    const tokens: TajweedToken[] = [];
    if (!html) return tokens;

    // Regex to match <tajweed class=CLASSNAME>CONTENT</tajweed> or plain text
    const regex = /<tajweed\s+class=([a-zA-Z0-9_]+)>([\s\S]*?)<\/tajweed>|<span\s+class=end>([\s\S]*?)<\/span>|([^<]+)/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(html)) !== null) {
      if (match[1] && match[2]) {
        // Tagged tajweed segment
        const className = match[1];
        const content = match[2];
        const rule = TAJWEED_RULES[className];
        tokens.push({
          text: content,
          className,
          rule: rule || undefined,
        });
      } else if (match[3]) {
        // End marker (verse number symbol)
        tokens.push({
          text: ` ۝${match[3]} `,
          className: 'end',
        });
      } else if (match[4]) {
        // Plain text
        const plainText = match[4];
        tokens.push({
          text: plainText,
        });
      }
    }

    return tokens;
  }

  /**
   * Quick check for Waqaf Marker inside an Arabic word or token
   */
  static checkWaqaf(text: string) {
    for (const [key, val] of Object.entries(WAQAF_MARKERS)) {
      if (text.includes(key)) {
        return { marker: key, ...val };
      }
    }
    return null;
  }
}
