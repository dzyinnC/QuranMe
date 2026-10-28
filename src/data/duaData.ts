export interface DuaItem {
  id: string;
  category: 'harian' | 'pagi-petang' | 'sholat' | 'quran';
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  source: string;
}

export const DAILY_DUAS: DuaItem[] = [
  {
    id: 'dua-1',
    category: 'harian',
    title: 'Doa Memohon Tambahan Ilmu',
    arabic: 'رَّبِّ زِدْنِى عِلْمًا',
    transliteration: "Rabbi zidnī 'ilmā",
    translation: 'Ya Tuhanku, tambahkanlah kepadaku ilmu.',
    source: 'QS. Thaha: 114',
  },
  {
    id: 'dua-2',
    category: 'harian',
    title: 'Doa Sapu Jagat (Kebaikan Dunia & Akhirat)',
    arabic: 'رَبَّنَآ ءَاتِنَا فِى ٱلدُّنْيَا حَسَنَةً وَفِى ٱلْـَٔاخِرَةِ حَسَنَةً وَقِنَا عَذَابَ ٱلنَّارِ',
    transliteration: "Rabbanā ātinā fid-dunyā hasanatan wa fil-ākhirati hasanatan wa qinā 'adhāban-nār",
    translation: 'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat dan peliharalah kami dari siksa neraka.',
    source: 'QS. Al-Baqarah: 201',
  },
  {
    id: 'dua-3',
    category: 'harian',
    title: 'Doa untuk Kedua Orang Tua',
    arabic: 'رَّبِّ ٱغْفِرْ لِى وَلِوَٰلِدَىَّ وَٱرْحَمْهُمَا كَمَا رَبَّيَانِى صَغِيرًا',
    transliteration: "Rabbighfir lī wa liwālidayya warhamhumā kamā rabbayānī shaghīrā",
    translation: 'Ya Tuhanku! Ampunilah aku, ibu bapakku dan kasihilah mereka keduanya, sebagaimana mereka berdua telah mendidik aku waktu kecil.',
    source: 'QS. Al-Isra: 24',
  },
  {
    id: 'dua-4',
    category: 'harian',
    title: 'Doa Kelapangan Hati dan Kemudahan Urusan',
    arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي',
    transliteration: "Rabbisyrah lī shadrī wa yassir lī amrī wahlul 'uqdatan min lisānī yafqahū qawlī",
    translation: 'Ya Tuhanku, lapangkanlah untukku dadaku, dan mudahkanlah untukku urusanku, dan lepaskanlah kekakuan dari lidahku, supaya mereka mengerti perkataanku.',
    source: 'QS. Thaha: 25-28',
  },
  {
    id: 'dua-5',
    category: 'harian',
    title: 'Doa Ketetapan Iman dan Hidayah',
    arabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً ۚ إِنَّكَ أَنْتَ الْوَهَّابُ',
    transliteration: "Rabbanā lā tuzigh qulūbanā ba'da idz hadaitanā wahab lanā min ladunka rahmatan innaka antal-wahhāb",
    translation: 'Ya Tuhan kami, janganlah Engkau jadikan hati kami condong kepada kesesatan sesudah Engkau beri petunjuk kepada kami, dan karuniakanlah kepada kami rahmat dari sisi-Mu.',
    source: "QS. Ali 'Imran: 8",
  },
];
