import { ALL_QARI, INDONESIAN_QARI, INTERNATIONAL_QARI, QariSource } from '../config/appConfig';
import { AyatItem } from '../types/quran';

export type AudioPlayMode = 'verse' | 'surah';

export interface LastPlayedAudioInfo {
  surahNomor: number;
  surahNamaLatin: string;
  ayatNomor: number | null;
  qariId: string;
  qariName: string;
  timestamp: number;
}

export interface AudioState {
  isPlaying: boolean;
  isLoading: boolean;
  surahNomor: number | null;
  surahNamaLatin: string;
  ayatNomor: number | null;
  currentQari: string;
  currentTime: number;
  duration: number;
  playbackRate: number;
  playMode: AudioPlayMode;
  error: string | null;
  lastPlayed: LastPlayedAudioInfo | null;
}

type AudioListener = (state: AudioState) => void;

const LAST_AUDIO_KEY = 'quranme_last_played_audio_v1';

class AudioPlayerManager {
  private audio: HTMLAudioElement | null = null;
  private listeners: Set<AudioListener> = new Set();
  private playlist: AyatItem[] = [];
  private currentPlaylistIndex: number = -1;

  public state: AudioState = {
    isPlaying: false,
    isLoading: false,
    surahNomor: null,
    surahNamaLatin: '',
    ayatNomor: null,
    currentQari: '05', // Misyari Rasyid Al-Afasi bawaan
    currentTime: 0,
    duration: 0,
    playbackRate: 1.0,
    playMode: 'verse',
    error: null,
    lastPlayed: this.loadLastPlayed(),
  };

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudio();
    }
  }

  private loadLastPlayed(): LastPlayedAudioInfo | null {
    try {
      const data = localStorage.getItem(LAST_AUDIO_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private saveLastPlayed(info: LastPlayedAudioInfo) {
    try {
      this.state.lastPlayed = info;
      localStorage.setItem(LAST_AUDIO_KEY, JSON.stringify(info));
    } catch (e) {
      console.warn('Failed to save last audio played:', e);
    }
  }

  private initAudio() {
    if (this.audio) return;
    this.audio = new Audio();
    this.audio.preload = 'metadata';

    this.audio.addEventListener('play', () => {
      this.state.isPlaying = true;
      this.state.isLoading = false;
      this.state.error = null;
      this.notify();
    });

    this.audio.addEventListener('pause', () => {
      this.state.isPlaying = false;
      this.notify();
    });

    this.audio.addEventListener('waiting', () => {
      this.state.isLoading = true;
      this.notify();
    });

    this.audio.addEventListener('canplay', () => {
      this.state.isLoading = false;
      this.notify();
    });

    this.audio.addEventListener('timeupdate', () => {
      if (this.audio) {
        this.state.currentTime = this.audio.currentTime;
        this.state.duration = this.audio.duration || 0;
        this.notify();
      }
    });

    this.audio.addEventListener('ended', () => {
      this.handleTrackEnded();
    });

    this.audio.addEventListener('error', () => {
      this.state.isPlaying = false;
      this.state.isLoading = false;
      this.state.error = 'Audio tidak dapat dimuat. Silakan periksa koneksi atau coba Qari lain.';
      this.notify();
    });
  }

  private notify() {
    for (const listener of this.listeners) {
      listener({ ...this.state });
    }
  }

  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    listener({ ...this.state });
    return () => {
      this.listeners.delete(listener);
    };
  }

  public setQari(qariId: string) {
    this.state.currentQari = qariId;
    this.notify();
  }

  public setPlaybackRate(rate: number) {
    this.state.playbackRate = rate;
    if (this.audio) {
      this.audio.playbackRate = rate;
    }
    this.notify();
  }

  public getQariSource(qariId: string = this.state.currentQari): QariSource | undefined {
    return ALL_QARI.find((q) => q.id === qariId);
  }

  /**
   * Putar satu ayat tertentu
   */
  public playVerse(
    surahNomor: number,
    surahNamaLatin: string,
    verse: AyatItem,
    playlist: AyatItem[] = []
  ) {
    if (!this.audio) this.initAudio();
    if (!this.audio) return;

    this.playlist = playlist;
    this.currentPlaylistIndex = playlist.findIndex((v) => v.nomorAyat === verse.nomorAyat);

    // Cek apakah qari saat ini adalah qari Indonesia (yang sebagian besar adalah full-surah murottal)
    const qari = this.getQariSource();
    let url: string | null = null;

    if (qari?.isIndonesian) {
      // Qari Indonesia umumnya menyediakan full-surah, tapi jika dipanggil dari ayat, kita beri opsi
      // fallback ke audio ayat resmi equran.id (Misyari '05' atau '01')
      url = verse.audio['05'] || verse.audio['01'] || Object.values(verse.audio)[0];
    } else {
      const qariKey = this.state.currentQari;
      url = verse.audio[qariKey] || verse.audio['05'] || Object.values(verse.audio)[0];
    }

    if (!url) {
      this.state.error = 'Audio untuk ayat ini tidak tersedia dari API.';
      this.notify();
      return;
    }

    this.state.surahNomor = surahNomor;
    this.state.surahNamaLatin = surahNamaLatin;
    this.state.ayatNomor = verse.nomorAyat;
    this.state.playMode = 'verse';
    this.state.isLoading = true;
    this.state.error = null;
    this.saveLastPlayed({
      surahNomor,
      surahNamaLatin,
      ayatNomor: verse.nomorAyat,
      qariId: this.state.currentQari,
      qariName: this.getQariName(),
      timestamp: Date.now(),
    });
    this.notify();

    this.audio.src = url;
    this.audio.playbackRate = this.state.playbackRate;
    this.audio.load();
    this.audio.play().catch((err) => {
      console.warn('Audio play error:', err);
      this.state.isPlaying = false;
      this.state.isLoading = false;
      this.state.error = 'Tekan tombol putar untuk mengizinkan audio di peramban Anda.';
      this.notify();
    });
  }

  /**
   * Putar audio full satu surat
   */
  public playFullSurah(
    surahNomor: number,
    surahNamaLatin: string,
    audioFullFallback?: Record<string, string>,
    targetQariId?: string
  ) {
    if (!this.audio) this.initAudio();
    if (!this.audio) return;

    if (targetQariId) {
      this.state.currentQari = targetQariId;
    }

    const qari = this.getQariSource();
    let url: string | null = null;

    if (qari?.isIndonesian && qari.getSurahAudioUrl) {
      url = qari.getSurahAudioUrl(surahNomor);
      if (!url) {
        // Tampilkan pesan informatif jika surah belum ada di katalog qari ini
        this.state.error = `${qari.name} belum memiliki rekaman untuk Surat ${surahNamaLatin}. Mencoba memutar dengan Qari Misyari Rasyid...`;
        this.notify();
        // Fallback anggun ke Misyari
        if (audioFullFallback) {
          url = audioFullFallback['05'] || Object.values(audioFullFallback)[0];
        }
      }
    } else if (audioFullFallback) {
      const qariKey = this.state.currentQari;
      url = audioFullFallback[qariKey] || audioFullFallback['05'] || Object.values(audioFullFallback)[0];
    }

    if (!url) {
      this.state.error = 'Audio surat lengkap tidak tersedia.';
      this.notify();
      return;
    }

    this.playlist = [];
    this.currentPlaylistIndex = -1;

    this.state.surahNomor = surahNomor;
    this.state.surahNamaLatin = surahNamaLatin;
    this.state.ayatNomor = null;
    this.state.playMode = 'surah';
    this.state.isLoading = true;
    this.saveLastPlayed({
      surahNomor,
      surahNamaLatin,
      ayatNomor: null,
      qariId: this.state.currentQari,
      qariName: this.getQariName(),
      timestamp: Date.now(),
    });
    this.notify();

    this.audio.src = url;
    this.audio.playbackRate = this.state.playbackRate;
    this.audio.load();
    this.audio.play().catch((err) => {
      console.warn('Audio play error:', err);
      this.state.isPlaying = false;
      this.state.isLoading = false;
      this.state.error = 'Tekan tombol putar untuk mengizinkan audio di peramban.';
      this.notify();
    });
  }

  public togglePlayPause() {
    if (!this.audio) return;
    if (this.state.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play().catch((err) => {
        console.warn('Audio play error:', err);
      });
    }
  }

  public togglePlay() {
    this.togglePlayPause();
  }

  public seek(seconds: number) {
    if (!this.audio) return;
    this.audio.currentTime = seconds;
  }

  public stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.state.isPlaying = false;
    this.state.surahNomor = null;
    this.state.ayatNomor = null;
    this.notify();
  }

  public nextTrack() {
    if (
      this.state.playMode === 'verse' &&
      this.playlist.length > 0 &&
      this.currentPlaylistIndex >= 0 &&
      this.currentPlaylistIndex < this.playlist.length - 1
    ) {
      const nextVerse = this.playlist[this.currentPlaylistIndex + 1];
      this.playVerse(this.state.surahNomor!, this.state.surahNamaLatin, nextVerse, this.playlist);
    }
  }

  public prevTrack() {
    if (
      this.state.playMode === 'verse' &&
      this.playlist.length > 0 &&
      this.currentPlaylistIndex > 0
    ) {
      const prevVerse = this.playlist[this.currentPlaylistIndex - 1];
      this.playVerse(this.state.surahNomor!, this.state.surahNamaLatin, prevVerse, this.playlist);
    }
  }

  private handleTrackEnded() {
    if (
      this.state.playMode === 'verse' &&
      this.playlist.length > 0 &&
      this.currentPlaylistIndex >= 0 &&
      this.currentPlaylistIndex < this.playlist.length - 1
    ) {
      const nextVerse = this.playlist[this.currentPlaylistIndex + 1];
      this.playVerse(this.state.surahNomor!, this.state.surahNamaLatin, nextVerse, this.playlist);
    } else {
      this.state.isPlaying = false;
      this.state.currentTime = 0;
      this.notify();
    }
  }

  public getQariName(): string {
    const found = ALL_QARI.find((q) => q.id === this.state.currentQari);
    return found ? found.name : 'Misyari Rasyid Al-Afasi';
  }
}

export const audioService = new AudioPlayerManager();
