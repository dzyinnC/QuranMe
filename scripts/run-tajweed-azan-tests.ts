/**
 * Automated Verification Test Suite for QuranMe Tajweed & Azan Systems
 */

import { AZAN_AUDIO_OPTIONS } from '../src/services/azanAudioService';
import { TajweedService, TAJWEED_RULES, WAQAF_MARKERS } from '../src/services/tajweedService';
import { TAJWEED_CURRICULUM, WAQAF_GUIDE_DATA, STEP_BY_STEP_MODULES } from '../src/data/tajweedCurriculum';
import * as fs from 'fs';
import * as path from 'path';

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✓ [LULUS] ${testName}`);
    passCount++;
  } else {
    console.error(`  ✗ [GAGAL] ${testName}`);
    failCount++;
  }
}

console.log('======================================================');
console.log('QURANME TAJWEED & AZAN SYSTEM AUDIT TEST SUITE');
console.log('======================================================');

// 1. Audio Azan verification
console.log('\n[BAGIAN 1: VERIFIKASI PUSTAKA AUDIO AZAN & NOTIFIKASI]');

const indonesianAzan = AZAN_AUDIO_OPTIONS.find((o) => o.category === 'indonesia');
assert(!!indonesianAzan, 'Azan Indonesia tersedia dalam AZAN_AUDIO_OPTIONS');
assert(
  indonesianAzan?.audioUrl === '/audio/adhan_indonesia.mp3',
  'Azan Indonesia mengarah ke file audio lokal terverifikasi (/audio/adhan_indonesia.mp3)'
);

const makkahAzan = AZAN_AUDIO_OPTIONS.find((o) => o.id === 'azan-makkah-nafees');
assert(!!makkahAzan, 'Azan Makkah Al-Nafees tersedia dalam opsi');

const chimeOption = AZAN_AUDIO_OPTIONS.find((o) => o.category === 'soft-chime');
assert(!!chimeOption, 'Nada notifikasi pendek tersedia');
assert(
  chimeOption?.isSynthesized === true && chimeOption?.name.includes('Bukan Azan'),
  'Nada notifikasi pendek ditandai secara tegas sebagai BUKAN Azan'
);

// Check physical existence of audio files in public/audio
const publicAudioDir = path.resolve(process.cwd(), 'public/audio');
const indoFileExists = fs.existsSync(path.join(publicAudioDir, 'adhan_indonesia.mp3'));
const makkahFileExists = fs.existsSync(path.join(publicAudioDir, 'adhan_makkah.mp3'));
const aaqibFileExists = fs.existsSync(path.join(publicAudioDir, 'adhan_aaqib.mp3'));

assert(indoFileExists, 'File fisik adhan_indonesia.mp3 ada di public/audio');
assert(makkahFileExists, 'File fisik adhan_makkah.mp3 ada di public/audio');
assert(aaqibFileExists, 'File fisik adhan_aaqib.mp3 ada di public/audio');

// 2. Tajweed Parser verification
console.log('\n[BAGIAN 2: VERIFIKASI PARSER TAJWID & KAMUS KAIDAH]');

const sampleHtml = 'بِسْمِ <tajweed class=ham_wasl>ٱ</tajweed>للَّهِ <tajweed class=ham_wasl>ٱ</tajweed><tajweed class=laam_shamsiyah>ل</tajweed>رَّحْمَ<tajweed class=madda_normal>ـٰ</tajweed>نِ <tajweed class=ham_wasl>ٱ</tajweed><tajweed class=laam_shamsiyah>ل</tajweed>رَّح<tajweed class=madda_permissible>ِي</tajweed>مِ <span class=end>١</span>';
const parsedTokens = TajweedService.parseTajweedHtml(sampleHtml);

assert(parsedTokens.length > 0, 'Parser HTML tajweed menghasilkan token terstruktur');

const hamWaslToken = parsedTokens.find((t) => t.className === 'ham_wasl');
assert(!!hamWaslToken && hamWaslToken.rule?.name === 'Hamzah Washl', 'Token ham_wasl terpetakan ke aturan Hamzah Washl');

const maddaNormalToken = parsedTokens.find((t) => t.className === 'madda_normal');
assert(!!maddaNormalToken && maddaNormalToken.rule?.category === 'mad', 'Token madda_normal terpetakan ke kategori mad');

const endToken = parsedTokens.find((t) => t.className === 'end');
assert(!!endToken, 'Tanda akhir ayat (end marker) terdeteksi');

// Verify all core rule classes are defined in dictionary
const requiredClasses = [
  'madda_normal', 'madda_obligatory', 'madda_permissible', 'madda_necessary',
  'ikhafa', 'idgham_ghunnah', 'idgham_wo_ghunnah', 'iqlab',
  'ghunnah', 'ikhafa_syafawi', 'idgham_shafawi', 'qalaqah',
  'idgham_mutajanisayn', 'idgham_mutaqaribayn', 'laam_shamsiyah', 'ham_wasl', 'slnt'
];

let allRulesPresent = true;
for (const cls of requiredClasses) {
  if (!TAJWEED_RULES[cls]) {
    allRulesPresent = false;
    break;
  }
}
assert(allRulesPresent, 'Seluruh 17 kelas tajweed standar Quran.com memiliki definisi lengkap');

// 3. Waqaf Markers verification
console.log('\n[BAGIAN 3: VERIFIKASI TANDA WAQAF MUSHAF STANDAR INDONESIA]');
const standardWaqaf = ['م', 'لا', 'ج', 'صلى', 'قلى', '∴'];
let allWaqafPresent = true;
for (const sym of standardWaqaf) {
  if (!WAQAF_MARKERS[sym]) {
    allWaqafPresent = false;
    break;
  }
}
assert(allWaqafPresent, 'Enam tanda waqaf Mushaf Standar Indonesia terdaftar lengkap (م, لا, ج, صلى, قلى, ∴)');

assert(WAQAF_GUIDE_DATA.length === 6, 'Panduan rinci tanda waqaf Kemenag RI memuat tepat 6 simbol');

// 4. Curriculum verification
console.log('\n[BAGIAN 4: VERIFIKASI KURIKULUM TAJWID & BELAJAR BERTAHAP]');
assert(TAJWEED_CURRICULUM.length === 15, 'Kurikulum ilmu tajwid memuat tepat 15 Bab komprehensif');

const allCurriculumHaveQuiz = TAJWEED_CURRICULUM.every(
  (c) => c.quiz && c.quiz.options.length >= 2 && typeof c.quiz.correctIndex === 'number'
);
assert(allCurriculumHaveQuiz, 'Setiap bab kurikulum memiliki kuis latihan pemahaman interaktif');

assert(STEP_BY_STEP_MODULES.length === 13, 'Kurikulum belajar membaca bertahap memuat tepat 13 Modul');

console.log('\n======================================================');
console.log(`HASIL TEST: ${passCount} LULUS, ${failCount} GAGAL dari ${passCount + failCount} KASUS`);
console.log('======================================================');

if (failCount > 0) {
  process.exit(1);
}
