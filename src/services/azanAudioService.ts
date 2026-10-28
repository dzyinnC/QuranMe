/**
 * QuranMe Azan & Prayer Sound Library Engine
 * - Verified authentic Adhan recordings (Indonesian & International)
 * - Strict separation between Real Adhan and Notification Chimes
 * - Transparent error reporting ("Audio azan belum tersedia / gagal dimuat")
 * - 100% offline fallback chime via Web Audio API (explicitly labeled as non-Azan)
 * - Volume, playback tracking, and test audio controls
 */

export interface AzanAudioOption {
  id: string;
  name: string;
  category: 'indonesia' | 'international' | 'soft-chime' | 'silent';
  sourceName: string;
  reciterName: string;
  description: string;
  audioUrl?: string;
  fallbackUrl?: string;
  durationApprox: string;
  isSynthesized?: boolean;
}

export const AZAN_AUDIO_OPTIONS: AzanAudioOption[] = [
  {
    id: 'azan-indonesia-hazim',
    name: 'Azan Indonesia (Lantunan Syahdu)',
    category: 'indonesia',
    reciterName: 'Al-Ustadz Abu Hazim Muhsin (Indonesia)',
    sourceName: 'Rekaman Otentik Muazin Nusantara (Arsip Audio Khas Indonesia)',
    description: 'Lantunan azan merdu khas muazin Nusantara dengan cengkok lembut menyejukkan hati.',
    audioUrl: '/audio/adhan_indonesia.mp3',
    fallbackUrl: 'https://archive.org/download/AdzanAlUstadzAbuHazimMuhsin/04-ADZAN.mp3',
    durationApprox: '2 menit 16 detik',
  },
  {
    id: 'azan-makkah-nafees',
    name: 'Azan Makkah Al-Mukarramah',
    category: 'international',
    reciterName: 'Syaikh Ahmad Al-Nafees',
    sourceName: 'Islamic Network / AlAdhan Audio CDN',
    description: 'Lantunan azan khusyuk dan megah bersuara jernih dengan irama Hijaz Haramain.',
    audioUrl: '/audio/adhan_makkah.mp3',
    fallbackUrl: 'https://cdn.aladhan.com/audio/adhans/a1.mp3',
    durationApprox: '3 menit 33 detik',
  },
  {
    id: 'azan-aaqib-commons',
    name: 'Azan Madinah (Langgam Tartil)',
    category: 'international',
    reciterName: 'Aaqib Azeez (Lisensi CC BY-SA 4.0)',
    sourceName: 'Wikimedia Commons Media Repository',
    description: 'Lantunan azan bersuara jernih, tenang, dan tertib dengan artikulasi makhraj yang fasih.',
    audioUrl: '/audio/adhan_aaqib.mp3',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/The_Adhan_-_Muslim_Call_to_Prayer_-_Aaqib_Azeez.mp3',
    durationApprox: '1 menit 26 detik',
  },
  {
    id: 'chime-soft',
    name: 'Nada Notifikasi Pendek (Bukan Azan)',
    category: 'soft-chime',
    reciterName: 'Web Audio API Melodic Chime',
    sourceName: 'Synthesizer Peramban (100% Offline)',
    description: 'Dentang lonceng Islami harmonik pendek (3 detik) untuk pengingat ringkas. BUKAN rekaman azan.',
    durationApprox: '3 detik',
    isSynthesized: true,
  },
  {
    id: 'silent-mode',
    name: 'Mode Senyap / Getar Saja',
    category: 'silent',
    reciterName: 'Sistem Getar Perangkat',
    sourceName: 'Navigator Vibrate API',
    description: 'Hanya menampilkan notifikasi visual dan getaran singkat tanpa mengeluarkan suara.',
    durationApprox: 'Instan',
  },
];

const PREF_AZAN_AUDIO_KEY = 'quranme_selected_azan_audio_v2';
const PREF_PRAYER_NOTIF_SETTINGS = 'quranme_prayer_notif_settings_v2';

export interface PrayerNotifSetting {
  prayerId: 'subuh' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya';
  enabled: boolean;
  reminderMinutesBefore: number; // 0 = tepat waktu, 5 = 5 mnt sebelum, 10 = 10 mnt sebelum
}

export interface AzanPlayerState {
  currentPlayingId: string | null;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  errorMessage: string | null;
}

class AzanAudioService {
  private audio: HTMLAudioElement | null = null;
  private currentPlayingId: string | null = null;
  private isPlaying: boolean = false;
  private isLoading: boolean = false;
  private currentTime: number = 0;
  private duration: number = 0;
  private volume: number = 0.85;
  private errorMessage: string | null = null;
  private audioCtx: AudioContext | null = null;
  private listeners: Set<(state: AzanPlayerState) => void> = new Set();
  private chimeTimeoutId: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioElement();
    }
  }

  private initAudioElement() {
    this.audio = new Audio();
    this.audio.preload = 'metadata';
    this.audio.volume = this.volume;

    this.audio.addEventListener('loadstart', () => {
      this.isLoading = true;
      this.errorMessage = null;
      this.notify();
    });

    this.audio.addEventListener('canplay', () => {
      this.isLoading = false;
      this.notify();
    });

    this.audio.addEventListener('playing', () => {
      this.isPlaying = true;
      this.isLoading = false;
      this.errorMessage = null;
      this.notify();
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.notify();
    });

    this.audio.addEventListener('timeupdate', () => {
      if (this.audio) {
        this.currentTime = this.audio.currentTime;
        this.duration = this.audio.duration || 0;
        this.notify();
      }
    });

    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.currentPlayingId = null;
      this.currentTime = 0;
      this.notify();
    });

    this.audio.addEventListener('error', () => {
      this.isLoading = false;
      this.isPlaying = false;
      // Do NOT silently play chime. Report genuine error as requested!
      this.errorMessage = 'Audio azan gagal dimuat. Periksa izin pemutaran audio di peramban atau gunakan sumber audio lain.';
      this.notify();
    });
  }

  private getState(): AzanPlayerState {
    return {
      currentPlayingId: this.currentPlayingId,
      isPlaying: this.isPlaying,
      isLoading: this.isLoading,
      currentTime: this.currentTime,
      duration: this.duration,
      volume: this.volume,
      errorMessage: this.errorMessage,
    };
  }

  private notify() {
    const state = this.getState();
    for (const listener of this.listeners) {
      listener(state);
    }
  }

  public subscribe(listener: (state: AzanPlayerState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getSelectedAudioId(): string {
    try {
      const saved = localStorage.getItem(PREF_AZAN_AUDIO_KEY);
      return saved || 'azan-indonesia-hazim';
    } catch {
      return 'azan-indonesia-hazim';
    }
  }

  public getSelectedAudioOption(): AzanAudioOption {
    const id = this.getSelectedAudioId();
    return AZAN_AUDIO_OPTIONS.find((opt) => opt.id === id) || AZAN_AUDIO_OPTIONS[0];
  }

  public setSelectedAudioId(id: string) {
    try {
      localStorage.setItem(PREF_AZAN_AUDIO_KEY, id);
    } catch (e) {
      console.warn('Failed to save azan preference:', e);
    }
  }

  public getPrayerSettings(): Record<string, PrayerNotifSetting> {
    try {
      const data = localStorage.getItem(PREF_PRAYER_NOTIF_SETTINGS);
      if (data) return JSON.parse(data);
    } catch {}

    return {
      subuh: { prayerId: 'subuh', enabled: true, reminderMinutesBefore: 0 },
      dzuhur: { prayerId: 'dzuhur', enabled: true, reminderMinutesBefore: 0 },
      ashar: { prayerId: 'ashar', enabled: true, reminderMinutesBefore: 0 },
      maghrib: { prayerId: 'maghrib', enabled: true, reminderMinutesBefore: 0 },
      isya: { prayerId: 'isya', enabled: true, reminderMinutesBefore: 0 },
    };
  }

  public savePrayerSettings(settings: Record<string, PrayerNotifSetting>) {
    try {
      localStorage.setItem(PREF_PRAYER_NOTIF_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save prayer settings:', e);
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
    this.notify();
  }

  public stop() {
    if (this.chimeTimeoutId) {
      clearTimeout(this.chimeTimeoutId);
      this.chimeTimeoutId = null;
    }
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.isPlaying = false;
    this.isLoading = false;
    this.currentPlayingId = null;
    this.currentTime = 0;
    this.errorMessage = null;
    this.notify();
  }

  public togglePlayPause() {
    if (!this.audio || !this.currentPlayingId) return;
    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play().catch((err) => {
        this.errorMessage = `Gagal memutar audio: ${err.message || 'Izin audio diperlukan'}`;
        this.isPlaying = false;
        this.notify();
      });
    }
  }

  /**
   * Preview or test a selected audio option
   */
  public playPreview(option: AzanAudioOption) {
    // If clicking same active audio, toggle play/pause
    if (this.currentPlayingId === option.id && this.isPlaying) {
      this.stop();
      return;
    }

    this.stop();
    this.currentPlayingId = option.id;
    this.errorMessage = null;

    if (option.category === 'silent') {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([150, 80, 150]);
      }
      this.notify();
      setTimeout(() => {
        if (this.currentPlayingId === option.id) {
          this.currentPlayingId = null;
          this.notify();
        }
      }, 1000);
      return;
    }

    // Explicitly labeled non-azan melodic chime
    if (option.isSynthesized) {
      this.isPlaying = true;
      this.playSoftChime();
      this.notify();
      this.chimeTimeoutId = setTimeout(() => {
        if (this.currentPlayingId === option.id) {
          this.isPlaying = false;
          this.currentPlayingId = null;
          this.notify();
        }
      }, 3200);
      return;
    }

    // Real Azan Audio file playback
    if (!this.audio) {
      this.initAudioElement();
    }

    if (this.audio && option.audioUrl) {
      this.isLoading = true;
      this.audio.src = option.audioUrl;
      this.audio.volume = this.volume;
      this.audio.currentTime = 0;
      this.notify();

      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isPlaying = true;
            this.isLoading = false;
            this.notify();
          })
          .catch((err) => {
            console.warn('Primary audio URL play error:', err);
            // Attempt fallback URL if present
            if (option.fallbackUrl && this.audio) {
              this.audio.src = option.fallbackUrl;
              this.audio
                .play()
                .then(() => {
                  this.isPlaying = true;
                  this.isLoading = false;
                  this.notify();
                })
                .catch((fallbackErr) => {
                  console.error('Fallback audio play error:', fallbackErr);
                  this.isLoading = false;
                  this.isPlaying = false;
                  // As required by Bagian A: NEVER silently fallback to chime! Report genuine status.
                  this.errorMessage = `Audio azan "${option.name}" belum dapat diputar otomatis oleh peramban. Klik tombol untuk mengizinkan audio atau coba rekaman lain.`;
                  this.notify();
                });
            } else {
              this.isLoading = false;
              this.isPlaying = false;
              this.errorMessage = `Audio azan "${option.name}" belum dapat diputar otomatis oleh peramban. Klik tombol untuk mengizinkan audio atau coba rekaman lain.`;
              this.notify();
            }
          });
      }
    } else {
      this.errorMessage = 'File audio azan tidak ditemukan pada opsi yang dipilih.';
      this.notify();
    }
  }

  /**
   * Synthesize clean soft bell chime with Web Audio API (Offline & lightweight)
   * Clearly identified as short notification, NOT azan
   */
  private playSoftChime() {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioCtx) {
        this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 melodic chord
      notes.forEach((freq, idx) => {
        const osc = this.audioCtx!.createOscillator();
        const gain = this.audioCtx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.audioCtx!.currentTime + idx * 0.35);

        const noteVol = 0.22 * this.volume;
        gain.gain.setValueAtTime(0, this.audioCtx!.currentTime + idx * 0.35);
        gain.gain.linearRampToValueAtTime(noteVol, this.audioCtx!.currentTime + idx * 0.35 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx!.currentTime + idx * 0.35 + 1.5);

        osc.connect(gain);
        gain.connect(this.audioCtx!.destination);

        osc.start(this.audioCtx!.currentTime + idx * 0.35);
        osc.stop(this.audioCtx!.currentTime + idx * 0.35 + 1.6);
      });
    } catch (e) {
      console.warn('Synthesized chime error:', e);
    }
  }
}

export const azanAudioService = new AzanAudioService();
