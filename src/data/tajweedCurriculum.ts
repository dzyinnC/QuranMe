/**
 * QuranMe Tajweed & Waqaf Curriculum Dataset
 * Verified according to:
 * 1. Lajnah Pentashihan Mushaf Al-Qur'an Kementerian Agama RI (Mushaf Standar Indonesia)
 * 2. Matan Al-Muqaddimah al-Jazariyyah (Al-Imam Ibn al-Jazari, wafat 833 H)
 * 3. Matan Tuhfat al-Atfal (Asy-Syaikh Sulaiman al-Jamzuri, wafat 1198 H)
 * 4. Riwayat Hafs dari 'Asim Thariq Asy-Syathibiyyah
 */

export interface TajweedLesson {
  id: string;
  category: 'pengantar' | 'makhraj' | 'sifat' | 'nun_tanwin' | 'mim' | 'ghunnah' | 'idgham' | 'alif_lam' | 'ra' | 'lafzhul_jalalah' | 'qalqalah' | 'mad' | 'hamzah' | 'pertemuan_huruf' | 'praktik_adab' | 'waqaf_ibtida' | 'panduan_bertahap';
  subCategory?: string;
  title: string;
  level: 'Pemula' | 'Menengah' | 'Lanjutan';
  summary: string;
  arabicSnippet?: string;
  arabicExample?: string;
  transliteration?: string;
  penjelasanLengkap: string[];
  kaidahPenting: string[];
  kesalahanUmum: string[];
  rujukanKitab: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface WaqafGuideItem {
  simbol: string;
  nama: string;
  kategori: string;
  definisi: string;
  hukumBacaan: string;
  contohAyat: {
    surah: string;
    ayat: number;
    potonganArab: string;
    arti: string;
    panduanIbtida: string;
  };
  pedomanKemenag: string;
}

export interface LearningStepModule {
  step: number;
  title: string;
  targetPemahaman: string;
  materiPokok: string[];
  latihanMandiri: string;
  evaluasi: string;
}

// 1. DATASET 15 BAB ILMU TAJWID LENGKAP
export const TAJWEED_CURRICULUM: TajweedLesson[] = [
  // --- BAB 1: PENGANTAR ILMU TAJWID ---
  {
    id: 'pengantar-tajwid',
    category: 'pengantar',
    title: '1. Pengantar Ilmu Tajwid & Adab Tilawah',
    level: 'Pemula',
    summary: 'Pengertian tajwid secara bahasa dan istilah, tujuan, hukum mempelajarinya, serta adab mulia membaca kalamullah.',
    arabicSnippet: 'وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا',
    arabicExample: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
    transliteration: "Wa rattilil-qur'āna tartīlā (QS. Al-Muzzammil: 4)",
    penjelasanLengkap: [
      "Tajwid secara bahasa bermakna 'at-tahsin' (التَّحْسِينُ) yaitu memperbagus atau menyempurnakan.",
      "Secara istilah, tajwid adalah mengeluarkan setiap huruf hijaiyah dari makhraj aslinya serta memberikan hak-haknya (sifat lazimah asliyah) dan mustahaq-nya (sifat 'aridhah yang timbul karena sebab tertentu).",
      'Mempelajari teori ilmu tajwid berstatus Fardhu Kifayah bagi umat Islam, sedangkan mempraktikkan tajwid saat membaca Al-Qur\'an berstatus Fardhu \'Ain agar terhindar dari kekeliruan makna (Lahn).',
      "Adab tilawah meliputi: bersuci dari hadas, menghadap kiblat dengan tenang, membaca ta'awwudz dan basmalah, mentadaburi makna ayat, serta membaguskan suara tanpa dibuat-buat secara berlebihan.",
    ],
    kaidahPenting: [
      'Hak huruf: sifat asli yang melekat selamanya (seperti jahr, syiddah, hams).',
      'Mustahaq huruf: sifat yang muncul sewaktu-waktu karena hubungan dengan huruf lain (seperti tafkhim, tarqiq, ikhfa, idgham).',
      'Teori tajwid adalah panduan, sedangkan ketepatan bacaan harus diverifikasi melalui talaqqi dengan guru bersanad.',
    ],
    kesalahanUmum: [
      'Membaca terburu-buru tanpa memperhatikan panjang-pendek (Mad) dan dengung (Ghunnah).',
      'Menilai bahwa mengetahui istilah teori sudah cukup tanpa melatih kelenturan lisan secara praktis.',
    ],
    rujukanKitab: "Matan Al-Jazariyyah Bait 27: 'وَالأَخْذُ بِالتَّجْوِيدِ حَتْمٌ لَازِمُ * مَنْ لَمْ يُجَوِّدِ القُرْآنَ آثِمُ'",
    quiz: {
      question: 'Apakah hukum mempraktikkan kaidah tajwid saat membaca Al-Qur’an bagi setiap individu muslim?',
      options: ['Sunnah Muakkad', "Fardhu 'Ain", 'Fardhu Kifayah', 'Mubah'],
      correctIndex: 1,
      explanation: "Menurut kesepakatan para ulama qira'at, mempraktikkan tajwid saat membaca Al-Qur'an adalah Fardhu 'Ain, sedangkan mempelajari teori ilmiahnya adalah Fardhu Kifayah.",
    },
  },

  // --- BAB 2: MAKHARIJUL HURUF ---
  {
    id: 'makharijul-huruf',
    category: 'makhraj',
    title: '2. Makharijul Huruf (Tempat-Tempat Keluarnya Huruf)',
    level: 'Menengah',
    summary: 'Mengenal 5 daerah makhraj utama (Al-Jauf, Al-Halq, Al-Lisan, Asy-Syafatan, Al-Khaisyum) dan 17 makhraj rinci.',
    arabicSnippet: 'مَخَارِجُ الحُرُوفِ سَبْعَةَ عَشَرْ',
    penjelasanLengkap: [
      'Menurut pendapat terpilih Al-Imam Al-Khalil bin Ahmad dan Al-Imam Ibn al-Jazari, terdapat 17 makhraj spesifik yang terbagi dalam 5 rongga utama:',
      '1. Al-Jauf (الْجَوْفُ): Rongga mulut dan tenggorokan. Merupakan tempat keluarnya 3 huruf mad (Alif, Wawu mad, Ya mad).',
      '2. Al-Halq (الْحَلْقُ): Tenggorokan. Terbagi 3: Pangkal (ء, هـ), Tengah (ع, ح), dan Ujung (غ, خ).',
      '3. Al-Lisan (اللِّسَانُ): Lidah. Memiliki 10 makhraj untuk 18 huruf (Pangkal: ق, ك; Tengah: ج, ش, ي; Sisi: ض, ل; Ujung: ن, ر, ط, د, ت, ص, ز, س, ظ, ذ, ث).',
      '4. Asy-Syafatan (الشَّفَتَانِ): Dua bibir. Menghasilkan huruf ف (gigi seri atas ke perut bibir bawah) serta ب, م, و (pertemuan kedua bibir).',
      '5. Al-Khaisyum (الْخَيْشُومُ): Pangkal rongga hidung. Khusus untuk keluarnya suara dengung (Ghunnah).',
    ],
    kaidahPenting: [
      'Untuk mendeteksi makhraj suatu huruf: sukunkan huruf tersebut atau tasydidkan, lalu dahului dengan hamzah washl berharakat (misal: أَبْ atau أَبَّ). Di titik hentinya suara, di situlah letak makhrajnya.',
    ],
    kesalahanUmum: [
      'Mencampuradukkan makhraj Ha (ح) halus di tengah tenggorokan dengan Kha (خ) di ujung tenggorokan.',
      'Melafalkan huruf Dhad (ض) menjadi seperti Zha (ظ) atau Dal tebal.',
    ],
    rujukanKitab: "Matan Al-Jazariyyah Bait 9: 'مَخَارِجُ الحُرُوفِ سَبْعَةَ عَشَرْ * عَلَى الَّذِي يَخْتَارُهُ مَنِ اخْتَبَرْ'",
    quiz: {
      question: 'Berapakah jumlah tempat keluarnya huruf (makharijul huruf) secara terperinci menurut Ibn al-Jazari?',
      options: ['14 makhraj', '16 makhraj', '17 makhraj', '20 makhraj'],
      correctIndex: 2,
      explanation: 'Menurut pengujian Al-Imam Ibn al-Jazari dan Al-Khalil bin Ahmad, terdapat 17 makhraj terperinci yang tersebar di 5 rongga utama.',
    },
  },

  // --- BAB 3: SIFAT-SIFAT HURUF ---
  {
    id: 'sifat-huruf',
    category: 'sifat',
    title: '3. Sifat-Sifat Huruf Hijaiyah',
    level: 'Menengah',
    summary: 'Sifat huruf yang berpasangan (Hams-Jahr, Syiddah-Rakhawah, dll) dan sifat tunggal tanpa lawan (Qalqalah, Lin, Shafir, dll).',
    penjelasanLengkap: [
      'Sifat huruf adalah karakteristik atau kondisi yang tampak pada saat huruf dilafalkan dari makhrajnya.',
      'Sifat Berpasangan (10 Sifat):',
      '- Hams (hembusan nafas: فَحَثَّهُ شَخْصٌ سَكَتَ) lawannya Jahr (nafas tertahan).',
      '- Syiddah (suara tertahan kuat: أَجِدُ قَطٍ بَكَتْ) dan Tawassuth/Bainiyyah (pertengahan: لِنْ عُمَرْ) lawannya Rakhawah (suara terlepas lembut).',
      '- Isti\'la (pangkal lidah terangkat naik: خُصَّ ضَغْطٍ قِظْ) lawannya Istifal (lidah turun mendatar).',
      '- Ithbaq (lidah menempel langit-langit: ص, ض, ط, ظ) lawannya Infitah (lidah terbuka).',
      '- Idzlaq (huruf lancar/ringan: فِرَّ مِنْ لُبٍّ) lawannya Ishmat (huruf berat/mantap).',
      'Sifat Tidak Berpasangan (7 Sifat): Qalqalah (pantulan), Shafir (desis burung: ص, ز, س), Lin (lembut: و, ي sukun setelah fathah), Inhiraf (lenturan: ل, ر), Takrir (getaran berulang terbatas pada ر), Tafasysyi (udara berhamburan pada ش), Istithalah (memanjangnya sisi lidah pada ض), dan Ghunnah.',
    ],
    kaidahPenting: [
      'Setiap huruf hijaiyah memiliki minimal 5 sifat yang berpasangan, dan dapat memiliki 1 atau 2 sifat tambahan yang tidak berpasangan.',
      'Huruf Isti\'la selalu dibaca tebal (Tafkhim), terutama huruf-huruf Ithbaq (ص, ض, ط, ظ).',
    ],
    kesalahanUmum: [
      'Menggetarkan huruf Ra (ر) secara berlebihan hingga menghasilkan suara r-r-r tebal yang merusak sifat Takrir.',
      'Menghilangkan hembusan nafas (Hams) pada huruf Ta (ت) dan Kaf (ك) saat sukun.',
    ],
    rujukanKitab: "Matan Al-Jazariyyah Bait 20: 'صِفَاتُهَا جَهْرٌ وَرِخْوٌ مُسْتَفِلْ * مُنْفَتِحٌ مُصْمَتَةٌ وَالضِّدَّ قُلْ...'",
    quiz: {
      question: 'Manakah kelompok huruf yang memiliki sifat Hams (menghembuskan nafas saat dibaca)?',
      options: ['خُصَّ ضَغْطٍ قِظْ', 'فَحَثَّهُ شَخْصٌ سَكَتَ', 'أَجِدُ قَطٍ بَكَتْ', 'قُطْبُ جَدٍّ'],
      correctIndex: 1,
      explanation: "Huruf hams terhimpun dalam kalimat 'فَحَثَّهُ شَخْصٌ سَكَتَ' (Fa, Ha halus, Tsa, Ha, Sya, Kha, Sha, Sin, Kaf, Ta).",
    },
  },

  // --- BAB 4: HUKUM NUN SUKUN & TANWIN ---
  {
    id: 'nun-sukun-tanwin',
    category: 'nun_tanwin',
    title: '4. Hukum Nun Sukun (نْ) & Tanwin',
    level: 'Pemula',
    summary: 'Empat hukum utama: Izhar Halqi, Idgham (Bighunnah & Bilaghunnah), Iqlab, dan Ikhfa Haqiqi.',
    arabicSnippet: 'لِلنُّونِ إِنْ تَسْكُنْ وَلِلتَّنْوِينِ * أَرْبَعُ أَحْكَامٍ فَخُذْ تَبْيِينِي',
    penjelasanLengkap: [
      '1. Izhar Halqi (إِظْهَارٌ حَلْقِيٌّ): Nun sukun/tanwin bertemu huruf tenggorokan (ء, هـ, ع, ح, غ, خ). Dibaca jelas dan tegas tanpa dengung.',
      '2. Idgham (إِدْغَامٌ): Terbagi 2:',
      '   - Idgham Bighunnah: Bertemu 4 huruf (ي, ن, م, و) dalam 2 kata terpisah. Dileburkan disertai dengung 2 harakat.',
      '   - Idgham Bilaghunnah: Bertemu huruf Lam (ل) atau Ra (ر). Dileburkan sempurna tanpa dengung.',
      '   * Pengecualian Idgham: Jika nun sukun bertemu wau/ya dalam SATU kata (صِنْوَانٌ, قِنْوَانٌ, دُنْيَا, بُنْيَانٌ), wajib dibaca Izhar Mutlaq!',
      '3. Iqlab (إِقْلَابٌ): Bertemu huruf Ba (ب). Bunyi nun/tanwin diganti menjadi Mim ringan dengan merapatkan bibir tanpa menekan, didengungkan 2 harakat.',
      '4. Ikhfa Haqiqi (إِخْفَاءٌ حَقِيقِيٌّ): Bertemu 15 huruf ikhfa. Disamarkan antara izhar dan idgham disertai dengung 2 harakat.',
    ],
    kaidahPenting: [
      'Tingkatan Ikhfa: Aqrab (paling dekat ke makhraj nun: ت, د, ط), Ab\'ad (paling jauh: ق, ك), dan Ausath (pertengahan: 10 huruf lainnya).',
    ],
    kesalahanUmum: [
      'Mendengungkan Izhar Halqi.',
      'Mengidghamkan kata دُنْيَا (dunya) menjadi duyya (padahal wajib Izhar Mutlaq).',
    ],
    rujukanKitab: "Matan Tuhfat al-Atfal Bait 6-25 (Ahkamun Nuni as-Sakinati wat-Tanwin)",
    quiz: {
      question: 'Mengapa lafaz دُنْيَا (dunya) tidak diidghamkan meskipun nun sukun bertemu huruf Ya?',
      options: ['Karena huruf Ya bukan huruf idgham', 'Karena terjadi dalam satu kata (Izhar Mutlaq)', 'Karena harakat fathah', 'Karena tergolong ikhfa'],
      correctIndex: 1,
      explanation: 'Idgham hanya berlaku jika nun sukun dan huruf idgham berada di dua kata berbeda. Jika bertemu dalam satu kata, hukumnya adalah Izhar Mutlaq untuk menjaga keaslian bentuk kata.',
    },
  },

  // --- BAB 5: HUKUM MIM SUKUN ---
  {
    id: 'mim-sukun',
    category: 'mim',
    title: '5. Hukum Mim Sukun (مْ)',
    level: 'Pemula',
    summary: 'Tiga hukum mim sukun: Ikhfa Syafawi, Idgham Mimi (Mitslain), dan Izhar Syafawi.',
    penjelasanLengkap: [
      '1. Ikhfa Syafawi (إِخْفَاءٌ شَفَوِيٌّ): Mim sukun bertemu huruf Ba (ب). Dibaca samar pada bibir dengan dengung 2 harakat (contoh: تَرْمِيهِم بِحِجَارَةٍ).',
      '2. Idgham Mimi / Mitslain Shaghir (إِدْغَامٌ مِثْلَيْنِ): Mim sukun bertemu huruf Mim (م). Dileburkan menjadi satu mim bertasydid disertai dengung 2 harakat (contoh: لَهُم مَّا يَشَاءُونَ).',
      '3. Izhar Syafawi (إِظْهَارٌ شَفَوِيٌّ): Mim sukun bertemu seluruh 26 huruf hijaiyah lainnya selain Ba dan Mim. Dibaca jelas di bibir tanpa dengung.',
    ],
    kaidahPenting: [
      'Peringatan khusus pada Izhar Syafawi: Berhati-hatilah agar mim sukun tidak tertelan atau tersamar ketika bertemu huruf Wawu (و) dan Fa (ف) karena kedekatan makhrajnya!',
    ],
    kesalahanUmum: [
      'Menahan dengung saat mim sukun bertemu Wawu atau Fa pada bacaan Izhar Syafawi.',
    ],
    rujukanKitab: "Matan Tuhfat al-Atfal Bait 26-29 (Ahkamul Mimiz-Zabitah)",
    quiz: {
      question: 'Huruf apakah yang memicu berlakunya hukum Ikhfa Syafawi saat bertemu mim sukun?',
      options: ['Huruf Mim (م)', 'Huruf Ba (ب)', 'Huruf Wawu (و)', 'Huruf Nun (ن)'],
      correctIndex: 1,
      explanation: 'Ikhfa Syafawi terjadi secara khusus hanya saat mim sukun bertemu dengan satu huruf saja, yaitu Ba (ب).',
    },
  },

  // --- BAB 6: HUKUM GHUNNAH & TINGKATANNYA ---
  {
    id: 'hukum-ghunnah',
    category: 'ghunnah',
    title: '6. Hukum Ghunnah & Maratib Al-Ghunnah',
    level: 'Menengah',
    summary: 'Pengertian ghunnah, hukum Nun dan Mim Musyaddadah, serta 5 tingkatan kesempurnaan dengung.',
    penjelasanLengkap: [
      'Ghunnah adalah suara merdu bergetar yang keluar dari rongga hidung (Al-Khaisyum) tanpa melibatkan lidah.',
      'Nun bertasydid (نّ) dan Mim bertasydid (مّ) dinamakan huruf ghunnah musyaddadah dan wajib ditahan selama 2 harakat penuh.',
      'Tingkatan Kesempurnaan Ghunnah (Maratib al-Ghunnah):',
      '1. Akmal ma takun (أَكْمَلُ مَا تَكُونُ): Paling sempurna. Pada Nun/Mim bertasydid dan Idgham Bighunnah.',
      '2. Kamilah (كَامِلَةٌ): Sempurna. Pada Ikhfa Haqiqi, Ikhfa Syafawi, dan Iqlab.',
      '3. Naqishah (نَاقِصَةٌ): Kurang. Pada Nun dan Mim sukun yang dibaca Izhar.',
      '4. Anqash ma takun (أَنْقَصُ مَا تَكُونُ): Paling minim. Pada Nun dan Mim yang berharakat hidup.',
    ],
    kaidahPenting: [
      'Ghunnah adalah sifat lazimah dzatiyyah yang selalu ada pada huruf Nun dan Mim, hanya kadarnya yang berbeda sesuai kondisi harakat dan hukumnya.',
    ],
    kesalahanUmum: [
      'Melepas tasydid nun/mim terlalu cepat tanpa menahan durasi dengung 2 harakat.',
    ],
    rujukanKitab: "Matan Tuhfat al-Atfal Bait 19: 'وَغُنَّ مِيمًا ثُمَّ نُونًا شُدِّدَا * وَسَمِّ كُلًّا حَرْفَ غُنَّةٍ بَدَا'",
    quiz: {
      question: 'Berapakah durasi menahan dengung pada Nun dan Mim bertasydid (Ghunnah Musyaddadah)?',
      options: ['1 harakat', '2 harakat', '4 harakat', '6 harakat'],
      correctIndex: 1,
      explanation: 'Ghunnah musyaddadah wajib ditahan selama 2 harakat (kadar satu alif) dengan suara dengung mantap di hidung.',
    },
  },

  // --- BAB 7: IDGHAM MUTAMATSILAIN, MUTAJANISAIN & MUTAQARIBAIN ---
  {
    id: 'idgham-lainnya',
    category: 'idgham',
    title: '7. Hukum Idgham Pertemuan Huruf (Mutamatsilain, Mutajanisain, Mutaqaribain)',
    level: 'Lanjutan',
    summary: 'Kaidah peleburan dua huruf yang sama, sejenis makhraj, atau berdekatan sifatnya.',
    penjelasanLengkap: [
      '1. Idgham Mutamatsilain (المُتَمَاثِلَيْنِ): Pertemuan dua huruf yang identik makhraj dan sifatnya, huruf pertama sukun dan kedua hidup (misal: رَبِحَت تِّجَارَتُهُمْ, اضْرِب بِّعَصَاكَ).',
      '2. Idgham Mutajanisain (المُتَجَانِسَيْنِ): Pertemuan dua huruf yang sama makhrajnya namun berbeda sifatnya. Contoh dalam riwayat Hafs: Dal sukun bertemu Ta (قَد تَّبَيَّنَ), Ta sukun bertemu Tha (أَثْقَلَت دَّعَوَا), Ba sukun bertemu Mim (يَا بُنَيَّ ارْكَب مَّعَنَا).',
      '3. Idgham Mutaqaribain (المُتَقَارِبَيْنِ): Pertemuan dua huruf yang berdekatan makhraj dan sifatnya. Contoh: Qaf sukun bertemu Kaf (أَلَمْ نَخْلُقكُّمْ), Lam sukun bertemu Ra (وَقُل رَّبِّ).',
    ],
    kaidahPenting: [
      'Idgham Shaghir terjadi apabila huruf pertama sukun dan huruf kedua berharakat.',
    ],
    kesalahanUmum: [
      'Memantulkan (qalqalah) huruf Dal sukun padahal sudah bertemu Ta pada kata قَد تَّبَيَّنَ.',
    ],
    rujukanKitab: "Matan Tuhfat al-Atfal Bait 34-39 (Fil Mitslaini wal Mutaqaribaini wal Mutajanisain)",
    quiz: {
      question: 'Pertemuan huruf Qaf sukun dengan Kaf pada lafaz أَلَمْ نَخْلُقكُّمْ tergolong hukum:',
      options: ['Idgham Mutamatsilain', 'Idgham Mutajanisain', 'Idgham Mutaqaribain', 'Izhar Halqi'],
      correctIndex: 2,
      explanation: 'Qaf dan Kaf berdekatan letak makhrajnya di pangkal lidah, sehingga pertemuannya disebut Idgham Mutaqaribain.',
    },
  },

  // --- BAB 8: HUKUM ALIF LAM ---
  {
    id: 'alif-lam',
    category: 'alif_lam',
    title: '8. Hukum Alif Lam (Qamariyah & Syamsiyah)',
    level: 'Pemula',
    summary: 'Perbedaan pelafalan Alif Lam Ta’rif saat bertemu huruf Qamariyah (Izhar) dan huruf Syamsiyah (Idgham).',
    penjelasanLengkap: [
      '1. Alif Lam Qamariyah (Izhar Qamariyah): Alif Lam bertemu salah satu dari 14 huruf yang terangkum dalam: اِبْغِ حَجَّكَ وَخَفْ عَقِيمَهُ (ء, ب, غ, ح, ج, ك, و, خ, ف, ع, ق, ي, م, هـ). Lam dibaca sukun jelas (contoh: الْقَمَرُ, الْحَمْدُ).',
      '2. Alif Lam Syamsiyah (Idgham Syamsiyah): Alif Lam bertemu salah satu dari 14 huruf syamsiyah (huruf pertama setiap kata dalam bait: طِبْ ثُمَّ صِلْ رَحْمًا تَفُزْ ضِفْ ذَا نِعَمْ * دَعْ سُوءَ ظَنٍّ زُرْ شَرِيفًا لِلْكَرَمْ). Huruf Lam dileburkan sehingga huruf sesudahnya bertasydid (contoh: الشَّمْسُ, الرَّحْمٰنُ).',
    ],
    kaidahPenting: [
      'Dalam Mushaf Standar Indonesia dan Mushaf Madinah, Alif Lam Qamariyah selalu ditandai dengan tanda sukun di atas huruf Lam, sedangkan Alif Lam Syamsiyah ditandai dengan tasydid pada huruf sesudahnya.',
    ],
    kesalahanUmum: [
      'Membaca huruf Lam pada kata الشَّمْسُ (al-syams) padahal harus lebur langsung ke asy-syams.',
    ],
    rujukanKitab: "Matan Tuhfat al-Atfal Bait 30-33 (Ahkamu Lam Al wa Lam Al-Fi'li)",
    quiz: {
      question: 'Apakah hukum bacaan Alif Lam pada lafaz الْعَالَمِينَ?',
      options: ['Alif Lam Syamsiyah', 'Alif Lam Qamariyah', 'Idgham Bilaghunnah', 'Ikhfa Syafawi'],
      correctIndex: 1,
      explanation: "Huruf 'Ain (ع) termasuk dalam bait 'اِبْغِ حَجَّكَ وَخَفْ عَقِيمَهُ', sehingga Alif Lam dibaca jelas sebagai Alif Lam Qamariyah.",
    },
  },

  // --- BAB 9: HUKUM HURUF RA ---
  {
    id: 'hukum-ra',
    category: 'ra',
    title: '9. Hukum Huruf Ra (Tafkhim, Tarqiq & Jawazul Wajhain)',
    level: 'Menengah',
    summary: 'Kapan huruf Ra dibaca tebal (Tafkhim), tipis (Tarqiq), atau boleh kedua-duanya.',
    penjelasanLengkap: [
      '1. Ra Tafkhim (Tebal):',
      '   - Ra berharakat Fathah atau Dhammah (رَبِّنَا, رُزِقْنَا).',
      '   - Ra sukun didahului huruf berharakat fathah atau dhammah (مَرْيَمَ, قُرْآنٌ).',
      '   - Ra sukun karena waqaf didahului alif atau wau mad (النَّارْ, نُورْ).',
      '   - Ra sukun didahului hamzah washl (ارْجِعِي).',
      '   - Ra sukun didahului kasrah asli, namun sesudahnya ada huruf isti\'la tidak berharakat kasrah dalam satu kata (قِرْطَاسٌ, فِرْقَةٍ).',
      '2. Ra Tarqiq (Tipis):',
      '   - Ra berharakat Kasrah (رِجَالٌ).',
      '   - Ra sukun didahului huruf berharakat kasrah asli dan tidak bertemu huruf isti\'la (فِرْعَوْنَ).',
      '   - Ra sukun karena waqaf didahului Ya sukun (خَيْرْ, قَدِيرْ).',
      '3. Jawazul Wajhain (Boleh Tebal atau Tipis):',
      '   - Pada kata فِرْقٍ (surah Asy-Syu’ara: 63) saat washal karena huruf isti\'la (qaf) berharakat kasrah.',
      '   - Pada kata مِصْرَ dan عَيْنَ الْقِطْرِ saat waqaf.',
    ],
    kaidahPenting: [
      'Tafkhim dihasilkan dengan menaikkan pangkal lidah ke langit-langit (Isti\'la), menghasilkan suara menggema tebal.',
    ],
    kesalahanUmum: [
      'Menebalkan Ra kasrah seperti pada kata رِزْقًا.',
    ],
    rujukanKitab: "Matan Al-Jazariyyah Bait 32-34 (Babur Ra'at)",
    quiz: {
      question: 'Bagaimanakah cara membaca huruf Ra pada lafaz فِرْعَوْنَ?',
      options: ['Tafkhim (Tebal)', 'Tarqiq (Tipis)', 'Boleh tebal atau tipis', 'Qalqalah'],
      correctIndex: 1,
      explanation: 'Ra sukun yang didahului harakat kasrah asli dan tidak bertemu huruf isti’la dalam satu kata wajib dibaca tipis (Tarqiq).',
    },
  },

  // --- BAB 10: LAFZHUL JALALAH ---
  {
    id: 'lafzhul-jalalah',
    category: 'lafzhul_jalalah',
    title: '10. Hukum Membaca Lafzhul Jalalah (اللَّه)',
    level: 'Pemula',
    summary: 'Kaidah membaca nama Allah (Tafkhim / Taghlizh saat didahului fathah/dhammah, Tarqiq saat didahului kasrah).',
    arabicExample: 'شَهِدَ اللَّهُ · بِسْمِ اللَّهِ · نَصْرُ اللَّهِ',
    penjelasanLengkap: [
      "1. Tafkhim (Taghlizh/Tebal): Huruf Lam pada lafaz 'Allah' (اللَّه) dibaca tebal apabila huruf sebelumnya berharakat Fathah atau Dhammah.",
      "   Contoh: قُلْ هُوَ اللَّهُ (Qul huwallahu), نَصْرُ اللَّهِ (Nasrullahi).",
      "2. Tarqiq (Tipis): Huruf Lam pada lafaz 'Allah' dibaca tipis apabila huruf sebelumnya berharakat Kasrah.",
      "   Contoh: بِسْمِ اللَّهِ (Bismillahi), قُلِ اللَّهُمَّ (Qulillahumma).",
    ],
    kaidahPenting: [
      'Penebalan lam khusus hanya berlaku pada nama Allah (Lafzhul Jalalah), bukan pada kata umum lain yang berhuruf lam.',
    ],
    kesalahanUmum: [
      'Membaca Bismillah dengan lam tebal seperti Bismill-awh.',
    ],
    rujukanKitab: "Matan Al-Jazariyyah Bait 35: 'وَفَخِّمِ اللَّامَ مِنِ اسْمِ اللَّهِ * عَنْ فَتْحٍ اوْ ضَمٍّ كَعَبْدُ اللَّهِ'",
    quiz: {
      question: 'Bagaimana hukum membaca lam pada lafaz بِسْمِ اللَّهِ?',
      options: ['Tebal (Tafkhim)', 'Tipis (Tarqiq)', 'Boleh tebal atau tipis', 'Idgham Syamsiyah'],
      correctIndex: 1,
      explanation: "Lafzhul Jalalah yang didahului huruf berharakat kasrah ('bi') wajib dibaca tipis (Tarqiq).",
    },
  },

  // --- BAB 11: HUKUM QALQALAH ---
  {
    id: 'hukum-qalqalah',
    category: 'qalqalah',
    title: '11. Hukum Qalqalah (Pantulan Suara)',
    level: 'Pemula',
    summary: 'Lima huruf qalqalah (ق, ط, ب, ج, د) dan pembagiannya: Sughra, Kubra, dan Akbar.',
    arabicSnippet: 'قَطْبُ جَدٍّ',
    penjelasanLengkap: [
      'Qalqalah secara bahasa bermakna guncangan atau getaran. Secara istilah adalah pantulan suara yang kuat pada makhraj huruf ketika dilafalkan dalam keadaan sukun.',
      'Huruf Qalqalah ada 5: Qaf (ق), Tha (ط), Ba (ب), Jim (ج), Dal (د) yang disingkat قُطْبُ جَدٍّ.',
      'Tingkatan Qalqalah:',
      '1. Qalqalah Sughra (Kecil): Huruf qalqalah bersukun asli di tengah kata atau di tengah kalimat washal (contoh: يَطْمَعُ, يَدْعُونَ, خَلَقْنَا). Pantulannya ringan dan langsung menyambung ke huruf berikutnya.',
      '2. Qalqalah Kubra (Besar): Huruf qalqalah berada di akhir kata dan disukunkan karena waqaf (contoh: الْفَلَقِ, مُحِيطٌ, وَتَبَّ). Pantulannya lebih kuat dan jelas terdengar.',
      '3. Qalqalah Akbar (Paling Besar): Huruf qalqalah bertasydid di akhir kata saat waqaf (contoh: بِالْحَقِّ, تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ). Ditahan sejenak seiring tasydid baru kemudian dipantulkan kuat.',
    ],
    kaidahPenting: [
      'Pantulan qalqalah tidak boleh menyerupai harakat fathah, kasrah, atau dhammah, melainkan murni pelepasan makhraj secara alami.',
    ],
    kesalahanUmum: [
      'Menambahkan bunyi hamzah mati di akhir pantulan qalqalah kubra (misal: Ahad-e`).',
    ],
    rujukanKitab: "Matan Al-Jazariyyah Bait 14 & Tuhfat al-Atfal",
    quiz: {
      question: 'Manakah dari kata berikut yang mengandung hukum Qalqalah Sughra?',
      options: ['قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', 'يَجْعَلُونَ أَصَابِعَهُمْ', 'وَالسَّمَاءِ ذَاتِ الْبُرُوجِ', 'قُلْ هُوَ اللَّهُ أَحَدٌ'],
      correctIndex: 1,
      explanation: "Pada kata يَجْعَلُونَ, huruf Jim sukun berada di tengah kata sehingga tergolong Qalqalah Sughra.",
    },
  },

  // --- BAB 12: HUKUM MAD LENGKAP ---
  {
    id: 'hukum-mad',
    category: 'mad',
    title: '12. Hukum Mad Lengkap (Asli & Far’i)',
    level: 'Lanjutan',
    summary: 'Mad Thabi’i, Wajib Muttashil, Jaiz Munfashil, Badal, ‘Aridh Lissukun, Lin, Lazim (Kilmi/Harfi), Shilah, ‘Iwadh, dan Tamkin.',
    penjelasanLengkap: [
      'Mad secara bahasa bermakna membentangkan atau memanjangkan. Terbagi menjadi 2 kelompok besar:',
      'A. Mad Asli / Thabi’i: Panjang 2 harakat tanpa sebab hamzah atau sukun.',
      'B. Mad Far’i (Cabang): Mad yang panjangnya melebihi 2 harakat karena adanya hamzah atau sukun:',
      '   1. Mad Wajib Muttashil: Huruf mad bertemu hamzah dalam satu kata (4-5 harakat).',
      '   2. Mad Jaiz Munfashil: Huruf mad bertemu hamzah di lain kata (4-5 harakat riwayat Syathibiyyah).',
      '   3. Mad Badal: Hamzah mendahului huruf mad dalam satu kata (2 harakat, contoh: آمَنُوا).',
      "   4. Mad 'Aridh Lissukun: Huruf mad diiringi sukun karena waqaf (boleh 2, 4, atau 6 harakat).",
      '   5. Mad Lin: Wawu/Ya sukun setelah fathah bertemu huruf sukun karena waqaf (2, 4, atau 6 harakat).',
      '   6. Mad Lazim Kilmi Mutsaqqal: Mad bertemu tasydid dalam kata (6 harakat wajib, misal: الضَّالِّينَ, الصَّاخَّةُ).',
      '   7. Mad Lazim Kilmi Mukhaffaf: Mad bertemu sukun asli dalam kata (6 harakat, contoh: آلْآنَ pada Surah Yunus).',
      "   8. Mad Lazim Harfi: Terjadi pada fawatihussuwar huruf n-q-sh-'-s-l-k-m (نَقَصَ عَسَلُكُمْ) dengan panjang 6 harakat.",
      "   9. Mad Shilah: Shilah Qashirah (2 harakat) dan Shilah Thawilah (4-5 harakat saat ha dhamir bertemu hamzah).",
      "   10. Mad 'Iwadh: Mengganti tanwin fathah menjadi alif mad saat waqaf di akhir kalimat (2 harakat, misal: عَلِيمًا dibaca 'Alīmā').",
      '   11. Mad Tamkin: Pertemuan dua huruf Ya, yang pertama bertasydid dan berharakat kasrah, yang kedua sukun (2 harakat, misal: حُيِّيتُم).',
    ],
    kaidahPenting: [
      "Tingkatan kekuatan mad (Maratib al-Mudud): Lazim > Muttashil > 'Aridh Lissukun > Munfashil > Badal.",
    ],
    kesalahanUmum: [
      'Mengurangi durasi Mad Lazim menjadi kurang dari 6 harakat.',
      "Membaca Mad 'Iwadh dengan tetap membunyikan tanwin 'an' saat waqaf.",
    ],
    rujukanKitab: "Matan Tuhfat al-Atfal Bait 40-61 (Ahkamul Mudud)",
    quiz: {
      question: 'Berapakah panjang bacaan Mad Lazim Kilmi Mutsaqqal pada kata وَلَا الضَّالِّينَ?',
      options: ['2 harakat', '4 harakat', '5 harakat', '6 harakat penuh'],
      correctIndex: 3,
      explanation: 'Mad Lazim Kilmi Mutsaqqal wajib dibaca sepanjang 6 harakat secara sempurna (tidak boleh kurang).',
    },
  },

  // --- BAB 13: HAMZAH WASHL & QATH' ---
  {
    id: 'hamzah-washl-qath',
    category: 'hamzah',
    title: "13. Hamzah Washl & Hamzah Qath'",
    level: 'Menengah',
    summary: 'Cara membedakan hamzah washl dan qath’, serta kaidah harakat memulai bacaan (Ibtida).',
    penjelasanLengkap: [
      "1. Hamzah Qath' (هَمْزَةُ الْقَطْعِ): Hamzah asli yang selalu dibaca baik saat washal maupun di awal kalimat. Memiliki kepala huruf 'Ain kecil (ء).",
      '2. Hamzah Washl (هَمْزَةُ الْوَصْلِ): Hamzah perantara yang hanya dibaca ketika memulai bacaan (ibtida), dan gugur (tidak dibaca) saat menyambung dari kata sebelumnya. Ditandai kepala Shad kecil (ﭐ) di atas alif.',
      'Kaidah Harakat Memulai (Ibtida) Hamzah Washl pada Kata Kerja (Fi’il):',
      '- Jika huruf ke-3 berharakat Dhammah asli, maka hamzah washl dibaca Dhammah (contoh: اُدْعُ, اُنْظُرْ).',
      '- Jika huruf ke-3 berharakat Fathah atau Kasrah, maka hamzah washl dibaca Kasrah (contoh: اِضْرِبْ, اِهْدِنَا, اِعْلَمُوا).',
      'Pada isim (kata benda) dengan Alif Lam, hamzah washl selalu dibaca Fathah (contoh: اَلْحَمْدُ).',
    ],
    kaidahPenting: [
      'Jangan membaca hamzah washl dengan harakat dhommah jika dhommah pada huruf ketiga bukan dhommah asli (seperti pada: اِبْنُوا, اِمْشُوا).',
    ],
    kesalahanUmum: [
      'Membaca hamzah washl saat menyambung kata sebelumnya.',
    ],
    rujukanKitab: "Matan Al-Jazariyyah (Bab Hamzatil Washli)",
    quiz: {
      question: 'Bagaimana harakat hamzah washl saat memulai bacaan (ibtida) pada kata اِهْدِنَا?',
      options: ['Fathah (Ahdina)', 'Kasrah (Ihdina)', 'Dhammah (Uhdina)', 'Sukun'],
      correctIndex: 1,
      explanation: "Huruf ketiga yaitu Dal berharakat kasrah ('di'), maka hamzah washl pada kata kerja tersebut dibaca kasrah (Ihdina).",
    },
  },

  // --- BAB 14: HUKUM PERTEMUAN DUA HURUF SUKUN ---
  {
    id: 'pertemuan-huruf-sukun',
    category: 'pertemuan_huruf',
    title: '14. Hukum Pertemuan Dua Huruf Sukun (Iltiqa’ As-Sakinain)',
    level: 'Lanjutan',
    summary: 'Cara bangsa Arab menyelesaikan pertemuan dua sukun: dengan pengguguran huruf mad atau pemberian harakat bantu (Nun Wiqayah / Nun Iwadh).',
    penjelasanLengkap: [
      'Dalam kaidah fonologi bahasa Arab, dua huruf sukun tidak boleh bertemu dalam keadaan washal.',
      'Penyelesaian Pertemuan Dua Sukun:',
      '1. Pengguguran Huruf Mad: Apabila huruf sukun pertama berupa huruf mad, maka huruf mad tersebut digugurkan panjangnya saat washal.',
      '   Contoh: قَالَا الْحَمْدُ لِلَّهِ (dibaca: Qālal-hamdu, alif mad pada qālā tidak dipanjangkan).',
      '2. Kasrah Pembantu (Nun Wiqayah / Nun Iwadh): Apabila kata pertama berakhiran tanwin dan kata berikutnya diawali hamzah washl bersukun, tanwin diubah menjadi nun berharakat kasrah halus.',
      '   Contoh: خَيْرًا الْوَصِيَّةُ (dibaca: Khairanil-wasiyyah), قُلْ هُوَ اللَّهُ أَحَدٌ ۞ اللَّهُ الصَّمَدُ (saat washal dibaca: Ahadunillāhus-samad).',
    ],
    kaidahPenting: [
      'Di mushaf Indonesia, nun kecil sering dituliskan di bawah hamzah washl untuk memudahkan pembaca awam.',
    ],
    kesalahanUmum: [
      'Tetap memanjangkan huruf mad saat bertemu sukun kata berikutnya pada saat washal.',
    ],
    rujukanKitab: 'Nihayatul Qawlil Mufid fi Ilmit Tajwid & Kaidah Rasm Utsmani',
    quiz: {
      question: 'Bagaimanakah membaca lafaz قُلْ هُوَ اللَّهُ أَحَدٌ disambung langsung ke kata اللَّهُ الصَّمَدُ?',
      options: ['Ahadul-lahus-samad', 'Ahadunillahus-samad', 'Ahadan-lahus-samad', 'Ahadullahus-samad'],
      correctIndex: 1,
      explanation: 'Karena tanwin bertemu sukun pada lafaz Allah, timbul nun wiqayah berharakat kasrah sehingga dibaca Ahadunillāhus-samad.',
    },
  },

  // --- BAB 15: ADAB TILAWAH & MENGHINDARI LAHN ---
  {
    id: 'adab-tilawah-lahn',
    category: 'praktik_adab',
    title: '15. Praktik Membaca & Menghindari Lahn (Kekeliruan)',
    level: 'Menengah',
    summary: 'Mengenal Lahn Jali (kesalahan fatal pengubah makna) dan Lahn Khafi (kesalahan samar kaidah tajwid).',
    penjelasanLengkap: [
      'Lahn adalah penyimpangan atau kekeliruan dalam melafalkan ayat Al-Qur’an.',
      '1. Lahn Jali (اللَّحْنُ الْجَلِيُّ): Kesalahan nyata dan fatal yang dapat mengubah struktur kata atau merusak makna ayat.',
      '   - Contoh: Mengubah harakat (misal أَنْعَمْتَ عَلَيْهِمْ diganti menjadi أَنْعَمْتُ), mengganti huruf (misal ع diganti ء), atau menambah/mengurangi huruf.',
      '   - Hukum: Haram secara syar\'i jika disengaja atau bermalas-malasan belajar.',
      '2. Lahn Khafi (اللَّحْنُ الْخَفِيُّ): Kesalahan tersembunyi yang menyalahi kaidah kesempurnaan tajwid namun tidak sampai mengubah makna bahasa.',
      '   - Contoh: Mengurangi kadar dengung ghunnah, meninggalkan ikhfa, memendekkan mad wajib, atau getaran takrir berlebihan pada huruf Ra.',
      '   - Hukum: Makruh dan tercela bagi para pembaca Al-Qur\'an.',
    ],
    kaidahPenting: [
      'Prioritas utama dalam belajar Al-Qur’an adalah membersihkan lisan dari Lahn Jali terlebih dahulu, kemudian menyempurnakan dari Lahn Khafi.',
    ],
    kesalahanUmum: [
      'Meremehkan perubahan huruf seperti membaca Al-Hamdu menjadi El-Hemdu atau mengganti Qaf menjadi Kaf.',
    ],
    rujukanKitab: "Matan Al-Jazariyyah & Kitab Al-Wafi fi Syarhil Arba'in",
    quiz: {
      question: 'Mengubah harakat أَنْعَمْتَ عَلَيْهِمْ menjadi أَنْعَمْتُ عَلَيْهِمْ tergolong kesalahan:',
      options: ['Lahn Khafi', 'Lahn Jali', 'Waqaf Qabih', 'Idgham Mutajanisain'],
      correctIndex: 1,
      explanation: "Perubahan harakat dari 'ta' (Engkau, Allah) menjadi 'tu' (aku) adalah Lahn Jali karena merusak dan membalikkan makna pokok akidah ayat.",
    },
  },
];

// 2. DATASET TANDA WAQAF MUSHAF STANDAR INDONESIA (Kemenag RI)
export const WAQAF_GUIDE_DATA: WaqafGuideItem[] = [
  {
    simbol: 'م',
    nama: 'Waqaf Lazim (م)',
    kategori: 'Harus Berhenti',
    definisi: 'Waqaf sempurna yang mengharuskan pembaca berhenti untuk menyempurnakan makna dan mencegah kerancuan pengertian jika disambung.',
    hukumBacaan: 'Wajib berhenti sempurna. Mengambil nafas baru lalu melanjutkan dari kata sesudahnya.',
    contohAyat: {
      surah: "Al-An'am",
      ayat: 36,
      potonganArab: 'إِنَّمَا يَسْتَجِيبُ الَّذِينَ يَسْمَعُونَ ۘ وَالْمَوْتَىٰ يَبْعَثُهُمُ اللَّهُ',
      arti: 'Hanya orang-orang yang mendengar sajalah yang mematuhi (seruan). [Berhenti di sini]. Dan orang-orang yang mati akan dibangkitkan oleh Allah.',
      panduanIbtida: 'Wajib berhenti di يَسْمَعُونَ, lalu memulai kembali dari وَالْمَوْتَىٰ. Jika disambung, seolah orang matilah yang mematuhi seruan di dunia.',
    },
    pedomanKemenag: 'Keputusan Lajnah Pentashihan Mushaf Al-Qur’an Kemenag RI tentang Tanda Waqaf Lazim.',
  },
  {
    simbol: 'لا',
    nama: 'Waqaf La Wakfa Fih (لا)',
    kategori: 'Dilarang Berhenti',
    definisi: 'Larangan berhenti pada kalimat yang masih terikat kuat maknanya dengan kalimat sesudahnya.',
    hukumBacaan: 'Tidak boleh berhenti di sini. Jika terpaksa berhenti karena nafas habis, wajib mengulang (Ibtida) dari kata sebelumnya.',
    contohAyat: {
      surah: 'An-Nahl',
      ayat: 32,
      potonganArab: 'الَّذِينَ تَتَوَفَّاهُمُ الْمَلَائِكَةُ طَيِّبِينَ ۙ يَقُولُونَ سَلَامٌ عَلَيْكُمُ',
      arti: '(yaitu) orang-orang yang diwafatkan oleh para malaikat dalam keadaan baik, [jangan berhenti], mereka (para malaikat) mengatakan: Salamun alaikum...',
      panduanIbtida: 'Lanjutkan bacaan. Jika terhenti di طَيِّبِينَ, ulang kembali dari الَّذِينَ atau تَتَوَفَّاهُمُ.',
    },
    pedomanKemenag: 'Pengecualian: Jika tanda لا berada tepat di atas nomor akhir ayat (ra’sul ayah), berhenti diperbolehkan menurut sunnah Nabi SAW.',
  },
  {
    simbol: 'ج',
    nama: 'Waqaf Jaiz (ج)',
    kategori: 'Boleh Berhenti atau Lanjut',
    definisi: 'Tanda yang memberikan pilihan seimbang kepada pembaca antara berhenti atau menyambung bacaan.',
    hukumBacaan: 'Boleh berhenti dan boleh washal (derajat keduanya sama baiknya).',
    contohAyat: {
      surah: 'Al-Kahfi',
      ayat: 13,
      potonganArab: 'نَحْنُ نَقُصُّ عَلَيْكَ نَبَأَهُم بِالْحَقِّ ۚ إِنَّهُمْ فِتْيَةٌ آمَنُوا بِرَبِّهِمْ',
      arti: 'Kami ceritakan kepadamu kisah mereka dengan sebenarnya. [Boleh berhenti atau lanjut]. Sesungguhnya mereka adalah pemuda-pemuda yang beriman...',
      panduanIbtida: 'Jika berhenti di بِالْحَقِّ, dapat langsung melanjutkan dari kata إِنَّهُمْ tanpa mengulang.',
    },
    pedomanKemenag: 'Mushaf Standar Indonesia Bab Tanda Waqaf Jaiz.',
  },
  {
    simbol: 'قلى',
    nama: 'Waqaf Al-Waqfu Aula (قلى)',
    kategori: 'Lebih Utama Berhenti',
    definisi: 'Singkatan dari Al-Waqfu Aula. Menyambung diperbolehkan, namun berhenti jauh lebih utama dan selaras dengan struktur makna.',
    hukumBacaan: 'Diutamakan berhenti (waqaf).',
    contohAyat: {
      surah: 'Al-Baqarah',
      ayat: 253,
      potonganArab: 'تِلْكَ الرُّسُلُ فَضَّلْنَا بَعْضَهُمْ عَلَىٰ بَعْضٍ ۘ مِّنْهُم مَّن كَلَّمَ اللَّهُ',
      arti: 'Rasul-rasul itu Kami lebihkan sebagian mereka dari sebagian yang lain. [Lebih utama berhenti]. Di antara mereka ada yang Allah berbicara langsung kepadanya...',
      panduanIbtida: 'Berhenti di بَعْضٍ, lalu lanjutkan dari مِّنْهُم.',
    },
    pedomanKemenag: 'Panduan Pentashihan Mushaf Standar Indonesia.',
  },
  {
    simbol: 'صلى',
    nama: 'Waqaf Al-Washlu Aula (صلى)',
    kategori: 'Lebih Utama Lanjut',
    definisi: 'Singkatan dari Al-Washlu Aula. Berhenti diperbolehkan, namun menyambung bacaan (washal) jauh lebih utama.',
    hukumBacaan: 'Diutamakan menyambung (washal) tanpa memutus nafas.',
    contohAyat: {
      surah: 'Al-Baqarah',
      ayat: 282,
      potonganArab: 'وَإِن كُنتُمْ عَلَىٰ سَفَرٍ وَلَمْ تَجِدُوا كَاتِبًا فَرِهَانٌ مَّقْبُوضَةٌ ۖ فَإِنْ أَمِنَ بَعْضُكُم بَعْضًا',
      arti: '...maka hendaklah ada barang tanggungan yang dipegang. [Lebih utama lanjut]. Akan tetapi jika sebagian kamu mempercayai sebagian yang lain...',
      panduanIbtida: 'Lanjutkan bacaan ke فَإِنْ أَمِنَ secara bersambung.',
    },
    pedomanKemenag: 'Panduan Pentashihan Mushaf Standar Indonesia.',
  },
  {
    simbol: '∴',
    nama: 'Waqaf Mu’anaqah / Tanda Titik Tiga (∴ ... ∴)',
    kategori: 'Berhenti di Salah Satu Tempat',
    definisi: 'Tanda berpasangan titik tiga. Mengharuskan pembaca berhenti pada salah satu titik tanda saja, dan dilarang berhenti pada keduanya atau melewati keduanya tanpa berhenti.',
    hukumBacaan: 'Jika sudah berhenti pada tanda titik tiga pertama, maka pada tanda kedua wajib lanjut (washal). Begitu pula sebaliknya.',
    contohAyat: {
      surah: 'Al-Baqarah',
      ayat: 2,
      potonganArab: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ',
      arti: 'Pilihan 1: Dzalikal-kitabu la raiba [berhenti]. Fihi hudal-lilmuttaqin [lanjut]. | Pilihan 2: Dzalikal-kitabu la raiba fih [berhenti]. Hudal-lilmuttaqin [lanjut].',
      panduanIbtida: 'Pilih salah satu titik perhentian saja, jangan berhenti di kedua titik sekaligus.',
    },
    pedomanKemenag: 'Mushaf Standar Indonesia: Kaidah Mu’anaqah / Muraqabah.',
  },
];

// 3. DATASET KURIKULUM BELAJAR MEMBACA BERTAHAP (13 Modul)
export const STEP_BY_STEP_MODULES: LearningStepModule[] = [
  {
    step: 1,
    title: 'Modul 1: Mengenal Huruf Hijaiyah & 3 Harakat Dasar',
    targetPemahaman: 'Mengenal bentuk tunggal 29 huruf hijaiyah dan bunyi harakat fathah (a), kasrah (i), dhammah (u).',
    materiPokok: [
      'Bentuk dan nama 29 huruf hijaiyah.',
      'Perubahan bunyi vokal fathah, kasrah, dhammah.',
      'Perbedaan alif dan hamzah.',
    ],
    latihanMandiri: 'Lafalkan: بَ - بِ - بُ | تَ - تِ - تُ | ثَ - ثِ - ثُ secara tegas.',
    evaluasi: 'Mampu membedakan bunyi vokal murni tanpa terpengaruh logat bahasa daerah.',
  },
  {
    step: 2,
    title: 'Modul 2: Makhraj Huruf Dasar & Titik Sentuh Lidah',
    targetPemahaman: 'Membedakan tempat keluarnya huruf yang berdekatan bunyinya.',
    materiPokok: [
      'Perbedaan Ha (ح) halus dan Kha (خ) tenggorokan.',
      'Perbedaan Sin (س), Syin (ش), dan Shad (ص).',
      'Perbedaan Ta (ت) dan Tha (ط) tebal.',
    ],
    latihanMandiri: 'Latih pernapasan huruf halq: أَ - إِ - أُ | حَ - حِ - حُ | خَ - خِ - خُ.',
    evaluasi: 'Dapat membunyikan Ha halus tanpa suara serak di tenggorokan.',
  },
  {
    step: 3,
    title: 'Modul 3: Sifat Huruf Penting (Hams & Isti’la)',
    targetPemahaman: 'Mengenal hembusan nafas dan tebal-tipisnya huruf.',
    materiPokok: [
      'Hembusan nafas pada huruf ت, ك, ف, س.',
      'Penaikan pangkal lidah pada huruf خ, ص, ض, غ, ط, ق, ظ.',
    ],
    latihanMandiri: 'Rasakan hembusan udara di depan telapak tangan saat mengucapkan: أَكْ - أَتْ.',
    evaluasi: 'Huruf tebal terdengar menggema memenuhi mulut.',
  },
  {
    step: 4,
    title: 'Modul 4: Sukun (Mati) & Tasydid (Ganda)',
    targetPemahaman: 'Membaca huruf mati secara stabil dan menekan huruf bertasydid dengan tepat.',
    materiPokok: [
      'Sukun sebagai tanda mati huruf.',
      'Tasydid sebagai gabungan huruf sukun dan huruf hidup.',
      'Keseimbangan tekanan (nabr).',
    ],
    latihanMandiri: 'Lafalkan: رَبَّ - رَبِّ - رَبُّ | إِيَّاكَ نَعْبُدُ.',
    evaluasi: 'Tidak memantulkan huruf sukun yang bukan tergolong huruf qalqalah.',
  },
  {
    step: 5,
    title: 'Modul 5: Mengenal Panjang-Pendek (Mad Thabi’i 2 Harakat)',
    targetPemahaman: 'Konsisten membaca mad asli 2 harakat (1 alif) tanpa kelebihan atau kekurangan.',
    materiPokok: [
      'Alif setelah fathah, Wawu sukun setelah dhammah, Ya sukun setelah kasrah.',
      'Tanda harakat berdiri (fathah tegak, kasrah tegak, dhommah terbalik).',
    ],
    latihanMandiri: 'Praktikkan ritme ketukan: قَالَ - يَقُولُ - قِيلَ (masing-masing tepat 2 ketukan).',
    evaluasi: 'Tidak memanjangkan huruf pendek dan tidak memendekkan huruf mad.',
  },
  {
    step: 6,
    title: 'Modul 6: Hukum Nun Sukun & Tanwin (Izhar, Idgham, Ikhfa, Iqlab)',
    targetPemahaman: 'Menguasai 4 hukum nun sukun dalam ayat-ayat pendek Juz ‘Amma.',
    materiPokok: [
      'Kapan harus dibaca jelas (Izhar Halqi).',
      'Kapan harus dilebur dengan dengung (Idgham Bighunnah).',
      'Kapan harus disamarkan (Ikhfa Haqiqi) dan ditukar mim (Iqlab).',
    ],
    latihanMandiri: 'Baca Surah Al-Ikhlas, Al-Falaq, dan An-Nas dengan memperhatikan tanda tajwid nun sukun.',
    evaluasi: 'Ikhfa terdengar dengung samar di hidung selama 2 harakat.',
  },
  {
    step: 7,
    title: 'Modul 7: Hukum Mim Sukun & Peringatan Khusus',
    targetPemahaman: 'Membedakan Ikhfa Syafawi, Idgham Mimi, dan Izhar Syafawi.',
    materiPokok: [
      'Mim sukun bertemu Ba (Ikhfa Syafawi).',
      'Mim sukun bertemu Mim (Idgham Mimi).',
      'Kehati-hatian saat mim sukun bertemu Wawu dan Fa.',
    ],
    latihanMandiri: 'Praktikkan Surah Al-Fil: أَلَمْ تَرَ كَيْفَ ... تَرْمِيهِم بِحِجَارَةٍ.',
    evaluasi: 'Menutup bibir tanpa menekan keras saat Ikhfa Syafawi.',
  },
  {
    step: 8,
    title: 'Modul 8: Menghidupkan Ghunnah & Memantulkan Qalqalah',
    targetPemahaman: 'Menahan dengung pada Nun/Mim tasydid dan memantulkan 5 huruf qalqalah.',
    materiPokok: [
      'Ghunnah Musyaddadah 2 harakat.',
      'Qalqalah Sughra di tengah kata vs Qalqalah Kubra saat waqaf.',
    ],
    latihanMandiri: 'Baca Surah Al-Lahab dan Al-Qari’ah dengan pantulan bersih.',
    evaluasi: 'Pantulan qalqalah bebas dari akhiran hamzah mati.',
  },
  {
    step: 9,
    title: 'Modul 9: Ragam Mad Far’i (Wajib, Jaiz & Lazim)',
    targetPemahaman: 'Membaca mad panjang 4, 5, hingga 6 harakat sesuai kaidah.',
    materiPokok: [
      'Mad Wajib Muttashil (4-5 harakat).',
      'Mad Jaiz Munfashil (4-5 harakat).',
      'Mad Lazim Kilmi Mutsaqqal (6 harakat).',
    ],
    latihanMandiri: 'Praktikkan: جَاءَ (4-5) | يَا أَيُّهَا (4-5) | الضَّالِّينَ (6 harakat).',
    evaluasi: 'Durasi mad lazim 6 harakat terasa lebih panjang daripada mad wajib.',
  },
  {
    step: 10,
    title: 'Modul 10: Tanda Waqaf, Washal & Cara Memulai (Ibtida)',
    targetPemahaman: 'Mengetahui tempat berhenti yang aman dan cara melanjutkan bacaan tanpa merusak makna.',
    materiPokok: [
      'Enam tanda waqaf Mushaf Standar Indonesia.',
      'Cara berhenti pada kata berharakat tanwin, ta marbuthah, dan sukun.',
      'Ibtida yang baik (Hasan) vs yang buruk (Qabih).',
    ],
    latihanMandiri: 'Latihan berhenti pada ayat panjang Ayat Kursi (Al-Baqarah: 255).',
    evaluasi: 'Tidak kehabisan nafas di tengah kata dan tidak berhenti pada waqaf La.',
  },
  {
    step: 11,
    title: 'Modul 11: Kaidah Tartil & Menghindari Lahn Jali',
    targetPemahaman: 'Membaca Al-Qur’an dengan tenang, tidak tergesa-gesa, dan steril dari kesalahan harakat/huruf.',
    materiPokok: [
      'Pengertian Tartil menurut Ali bin Abi Thalib ra: Mengetahui tajwid huruf dan mengenal tempat waqaf.',
      'Pemeriksaan Lahn Jali (kesalahan harakat).',
    ],
    latihanMandiri: 'Rekam bacaan Surah Al-Fatihah mandiri, lalu bandingkan dengan qari panutan.',
    evaluasi: 'Surah Al-Fatihah bersih 100% dari Lahn Jali.',
  },
  {
    step: 12,
    title: 'Modul 12: Latihan Membaca Rangkaian Ayat Pilihan',
    targetPemahaman: 'Menerapkan seluruh kaidah secara terintegrasi pada Surah Al-Baqarah 1-5 dan Surah Yasin.',
    materiPokok: [
      'Sinkronisasi makhraj, sifat, mad, ghunnah, dan waqaf secara simultan.',
      'Menjaga konsistensi tempo bacaan (Tahqiq, Tadwir, Hadr).',
    ],
    latihanMandiri: 'Tilawah 1 halaman penuh dengan mode tajwid berwarna QuranMe.',
    evaluasi: 'Mampu membaca 1 ruku’ dengan tajwid yang tertib dan nafas teratur.',
  },
  {
    step: 13,
    title: 'Modul 13: Evaluasi Mandiri, Kuis Komprehensif & Bimbingan Guru',
    targetPemahaman: 'Mengukur pemahaman teori dan menyadari pentingnya talaqqi berkelanjutan.',
    materiPokok: [
      'Uji pemahaman 15 bab tajwid.',
      'Etika berguru kepada ustadz/ustadzah Al-Qur’an bersanad.',
      'Komitmen membaca istiqamah setiap hari.',
    ],
    latihanMandiri: 'Kerjakan seluruh kuis tajwid dan target tilawah harian QuranMe.',
    evaluasi: 'Mendapatkan pemahaman komprehensif dan terus menjaga interaksi harian bersama Al-Qur’an.',
  },
];
