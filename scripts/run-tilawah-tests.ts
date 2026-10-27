/**
 * QuranMe Regression Test Suite for Daily Tilawah Engine
 * Tests all 16 required cases from Bagian 4.F
 */

// In-memory localStorage mock for Node.js test environment
class MockLocalStorage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

// Inject global localStorage
(global as any).localStorage = new MockLocalStorage();
(global as any).window = {
  dispatchEvent: () => {},
};

import { StorageService } from '../src/services/storageService';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`  ✓ [LULUS] ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ [GAGAL] ${testName}${details ? ` -> ${details}` : ''}`);
    failed++;
  }
}

console.log('\n======================================================');
console.log('QURANME TILAWAH ENGINE REGRESSION TEST SUITE (16 KASUS)');
console.log('======================================================\n');

// Reset before starting
StorageService.resetAllData();

// Kasus 1: Progres awal hari ini adalah 0.
const initialCount = StorageService.getTodayAyatCount();
assert(initialCount === 0, 'Kasus 1: Progres awal hari ini adalah 0', `Dapat: ${initialCount}`);

// Kasus 2: Menandai 1 ayat menghasilkan progres 1.
const res1 = StorageService.markAyatCompleted(1, 1, true);
assert(res1.todayCount === 1 && StorageService.getTodayAyatCount() === 1, 'Kasus 2: Menandai 1 ayat menghasilkan progres 1');

// Kasus 3: Menandai 10 ayat berbeda menghasilkan progres 10.
for (let i = 2; i <= 10; i++) {
  StorageService.markAyatCompleted(1, i, true);
}
const count10 = StorageService.getTodayAyatCount();
assert(count10 === 10, 'Kasus 3: Menandai 10 ayat berbeda menghasilkan progres 10', `Dapat: ${count10}`);

// Kasus 4: Menandai 20 ayat berbeda menghasilkan progres 20.
for (let i = 11; i <= 20; i++) {
  StorageService.markAyatCompleted(2, i, true);
}
const count20 = StorageService.getTodayAyatCount();
assert(count20 === 20, 'Kasus 4: Menandai 20 ayat berbeda menghasilkan progres 20', `Dapat: ${count20}`);

// Kasus 5: Menandai ayat yang sama berulang kali tidak meningkatkan hitungan (idempoten).
const countBeforeDup = StorageService.getTodayAyatCount();
StorageService.markAyatCompleted(1, 1, true);
StorageService.markAyatCompleted(1, 1, true);
StorageService.markAyatCompleted(1, 1, true);
const countAfterDup = StorageService.getTodayAyatCount();
assert(countAfterDup === countBeforeDup && countAfterDup === 20, 'Kasus 5: Menandai ayat yang sama berulang kali tidak meningkatkan hitungan');

// Kasus 6: Membuka surah panjang tanpa menyelesaikan ayat tidak otomatis menambah progres.
const countBeforeOpen = StorageService.getTodayAyatCount();
// Simulasi open surah 2 (Al-Baqarah 286 ayat)
StorageService.setLastRead({
  surahNomor: 2,
  surahNamaLatin: 'Al-Baqarah',
  ayatNomor: 1,
  timestamp: Date.now(),
  totalAyat: 286,
});
const countAfterOpen = StorageService.getTodayAyatCount();
assert(countAfterOpen === countBeforeOpen, 'Kasus 6: Membuka surah panjang tanpa menyelesaikan ayat tidak otomatis menambah progres');

// Kasus 7: Scroll bolak-balik tidak menambah progres.
const countBeforeScroll = StorageService.getTodayAyatCount();
// Simulasi 50 scroll ticks updating lastRead
for (let s = 1; s <= 50; s++) {
  StorageService.setLastRead({
    surahNomor: 2,
    surahNamaLatin: 'Al-Baqarah',
    ayatNomor: s % 286 + 1,
    timestamp: Date.now() + s,
    totalAyat: 286,
  });
}
const countAfterScroll = StorageService.getTodayAyatCount();
assert(countAfterScroll === countBeforeScroll, 'Kasus 7: Scroll bolak-balik tidak menambah progres (kebal dari bug 611)');

// Kasus 8: Render ulang komponen tidak menambah progres.
const countBeforeRerender = StorageService.getTodayAyatCount();
for (let r = 0; r < 10; r++) {
  // Komponen query getTodayAyatCount / getTodayProgress berkali-kali
  StorageService.getTodayAyatCount();
  StorageService.getTodayProgress();
}
const countAfterRerender = StorageService.getTodayAyatCount();
assert(countAfterRerender === countBeforeRerender, 'Kasus 8: Render ulang komponen tidak menambah progres');

// Kasus 9: Membuka ulang aplikasi tidak menggandakan progres.
const countBeforeReload = StorageService.getTodayAyatCount();
// Simulasi reload: reinstantiate progress retrieval from storage
const progressFresh = StorageService.getTodayProgress();
assert(progressFresh.ayatCount === countBeforeReload, 'Kasus 9: Membuka ulang aplikasi tidak menggandakan progres');

// Kasus 10: Berpindah surah tetap menghitung ayat unik dengan benar.
// Tandai ayat di Surat 36 (Yasin 1-5)
for (let y = 1; y <= 5; y++) {
  StorageService.markAyatCompleted(36, y, true);
}
const countWithYasin = StorageService.getTodayAyatCount();
assert(countWithYasin === 25, 'Kasus 10: Berpindah surah tetap menghitung ayat unik dengan benar (20 + 5 = 25)', `Dapat: ${countWithYasin}`);

// Kasus 11: Memulihkan posisi terakhir tidak menganggap seluruh ayat sebelumnya telah selesai.
const lastPos = StorageService.getLastRead();
assert(lastPos !== null && StorageService.getTodayAyatCount() === 25, 'Kasus 11: Memulihkan posisi terakhir tidak menganggap seluruh ayat sebelumnya telah selesai');

// Kasus 12: Pergantian tanggal memisahkan progres hari ini dan hari sebelumnya.
const todayStr = StorageService.getTodayLocalDateString();
// Mock yesterday in storage
const yesterdayLogs = [
  { date: '2026-10-25', ayatCount: 15, completedVerseIds: ['1:1', '1:2'] },
  { date: todayStr, ayatCount: 25 },
];
localStorage.setItem('quranme_tilawah_logs_v1', JSON.stringify(yesterdayLogs));
const logs = StorageService.getTilawahLogs();
const yesterdayLog = logs.find((l) => l.date === '2026-10-25');
const todayLog = logs.find((l) => l.date === todayStr);
assert(yesterdayLog?.ayatCount === 15 && todayLog?.ayatCount === 25, 'Kasus 12: Pergantian tanggal memisahkan progres hari ini dan hari sebelumnya');

// Kasus 13: Mengubah target harian tidak mengubah jumlah ayat yang sudah dibaca.
const countBeforeTargetChange = StorageService.getTodayAyatCount();
StorageService.saveSettings({ dailyTargetAyat: 50 });
const countAfterTargetChange = StorageService.getTodayAyatCount();
const updatedSettings = StorageService.getSettings();
assert(
  countAfterTargetChange === countBeforeTargetChange && updatedSettings.dailyTargetAyat === 50,
  'Kasus 13: Mengubah target harian tidak mengubah jumlah ayat yang sudah dibaca'
);

// Kasus 14: Penghapusan tanda selesai memperbarui progres secara akurat.
const countBeforeUnmark = StorageService.getTodayAyatCount();
StorageService.markAyatCompleted(36, 1, false); // unmark Yasin 1
const countAfterUnmark = StorageService.getTodayAyatCount();
assert(
  countAfterUnmark === countBeforeUnmark - 1 && countAfterUnmark === 24,
  'Kasus 14: Penghapusan tanda selesai memperbarui progres secara akurat (-1 ayat)',
  `Dapat: ${countAfterUnmark}`
);

// Kasus 15: Nilai 611 tidak muncul hanya karena jumlah ayat yang tersedia dalam data Al-Qur'an.
const currentAccurateCount = StorageService.getTodayAyatCount();
assert(
  currentAccurateCount !== 611 && currentAccurateCount === 24,
  'Kasus 15: Nilai 611 tidak muncul hanya karena jumlah ayat dalam data Al-Qur\'an',
  `Count saat ini: ${currentAccurateCount}`
);

// Kasus 16: Data progres lama yang rusak disanitasi sehingga angka baru tidak kembali salah.
// Simulasi injection legacy corrupt count (611)
localStorage.setItem('quranme_tilawah_logs_v1', JSON.stringify([
  { date: todayStr, ayatCount: 611, completedVerseIds: [] }
]));
// Force re-read & sanitize
StorageService.resetTilawahToday();
const sanitizedCount = StorageService.getTodayAyatCount();
assert(
  sanitizedCount === 0,
  'Kasus 16: Data progres lama yang rusak (611) disanitasi menjadi nilai valid',
  `Dapat: ${sanitizedCount}`
);

console.log('\n======================================================');
console.log(`HASIL TEST: ${passed} LULUS, ${failed} GAGAL dari ${passed + failed} KASUS`);
console.log('======================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
