import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  KeyRound,
  Lock,
  Mail,
  RefreshCw,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import { toast } from '../common/Toast';
import { authService, UserProfile } from '../../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'verify' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'verify' | 'forgot'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [generatedResetCode, setGeneratedResetCode] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const user = await authService.login(email, password);
      toast.show(`Selamat datang kembali, ${user.name}!`);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal masuk akun');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok');
      setIsLoading(false);
      return;
    }

    try {
      const user = await authService.register(name, email, password);
      toast.show('Akun berhasil dibuat! Silakan verifikasi email Anda.');
      setMode('verify');
      setSuccessMsg(`Kode verifikasi 6-digit telah dikirim ke ${email}. (Kode simulasi: ${user.verificationToken})`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mendaftar akun');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await authService.verifyEmail(verifyCode);
      toast.show('Email Anda berhasil diverifikasi!');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Kode verifikasi tidak valid');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      const code = await authService.resendVerification();
      setSuccessMsg(`Kode verifikasi baru: ${code}`);
      toast.show('Kode verifikasi baru telah dikirimkan');
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mengirim ulang kode');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const token = await authService.requestPasswordReset(email);
      setGeneratedResetCode(token);
      setSuccessMsg(`Kode reset kata sandi telah dikirimkan ke email Anda: ${token}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Alamat email tidak ditemukan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await authService.resetPassword(email, resetToken, newPassword);
      toast.show('Kata sandi berhasil diperbarui! Silakan masuk kembali.');
      setMode('login');
      setSuccessMsg('Kata sandi baru berhasil disimpan. Silakan masuk.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mereset kata sandi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md bg-[var(--bg-card)] rounded-3xl border border-[var(--border-main)] shadow-2xl p-6 sm:p-7 space-y-5 modal-pop relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <div>
            <h3 className="text-xl font-black text-[var(--text-main)] tracking-tight">
              {mode === 'login'
                ? 'Masuk ke QuranMe'
                : mode === 'register'
                ? 'Buat Akun Baru'
                : mode === 'verify'
                ? 'Verifikasi Email'
                : 'Lupa Kata Sandi'}
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {mode === 'login'
                ? 'Akses bookmark dan sinkronisasi bacaan Anda'
                : mode === 'register'
                ? 'Simpan progres tilawah secara aman di cloud'
                : mode === 'verify'
                ? 'Masukkan 6 digit kode yang dikirim ke email'
                : 'Dapatkan tautan pemulihan kata sandi akun'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--bg-card-subtle)] hover:bg-[var(--border-main)] flex items-center justify-center text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-xs text-red-600 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-2xl bg-[#EAF7EE] border border-[#43B433]/30 text-xs text-[#228B22] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--text-muted)]">Alamat Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-main)] text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[#0EAAFC]/30"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[var(--text-muted)]">Kata Sandi</label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="text-[11px] font-bold text-[#0EAAFC] hover:underline cursor-pointer"
                >
                  Lupa sandi?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-main)] text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[#0EAAFC]/30"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full bg-[#0EAAFC] hover:bg-[#0877B9] text-white font-bold text-sm shadow-md transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Memproses...' : 'Masuk ke Akun'}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-[var(--text-muted)]">Belum punya akun? </span>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="text-xs font-bold text-[#43B433] hover:underline cursor-pointer"
              >
                Daftar sekarang
              </button>
            </div>
          </form>
        )}

        {/* 2. REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--text-muted)]">Nama Lengkap</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Ahmad Fauzan"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-main)] text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[#0EAAFC]/30"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--text-muted)]">Alamat Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-main)] text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[#0EAAFC]/30"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--text-muted)]">Kata Sandi</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-main)] text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[#0EAAFC]/30"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--text-muted)]">Ulangi Kata Sandi</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang kata sandi"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-main)] text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[#0EAAFC]/30"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#43B433] to-[#2E8B22] text-white font-bold text-sm shadow-md transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Mendaftarkan...' : 'Daftar Akun Baru'}
            </button>

            <div className="text-center pt-1">
              <span className="text-xs text-[var(--text-muted)]">Sudah memiliki akun? </span>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="text-xs font-bold text-[#0EAAFC] hover:underline cursor-pointer"
              >
                Masuk
              </button>
            </div>
          </form>
        )}

        {/* 3. VERIFY EMAIL FORM */}
        {mode === 'verify' && (
          <form onSubmit={handleVerifyEmail} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--text-muted)]">
                Kode Verifikasi (6-Digit)
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  placeholder="Contoh: 123456"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-main)] text-base font-mono text-center tracking-widest text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[#43B433]/30"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full bg-[#43B433] hover:bg-[#349b26] text-white font-bold text-sm shadow-md transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Memverifikasi...' : 'Verifikasi Akun'}
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={handleResendVerification}
                className="text-[#0EAAFC] font-semibold hover:underline cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Kirim ulang kode</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[var(--text-muted)] hover:underline cursor-pointer"
              >
                Kembali ke masuk
              </button>
            </div>
          </form>
        )}

        {/* 4. FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form
            onSubmit={generatedResetCode ? handleResetPassword : handleForgotPassword}
            className="space-y-4"
          >
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--text-muted)]">Alamat Email Terdaftar</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-main)] text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[#0EAAFC]/30"
                />
              </div>
            </div>

            {generatedResetCode && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-muted)]">
                    Kode Token Reset
                  </label>
                  <input
                    type="text"
                    required
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="Masukkan kode reset"
                    className="w-full px-4 py-2.5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-main)] text-sm font-mono text-[var(--text-main)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-muted)]">
                    Kata Sandi Baru
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full px-4 py-2.5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-main)] text-sm text-[var(--text-main)]"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full bg-[#0EAAFC] hover:bg-[#0877B9] text-white font-bold text-sm shadow-md transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isLoading
                ? 'Memproses...'
                : generatedResetCode
                ? 'Simpan Sandi Baru'
                : 'Kirim Kode Pemulihan'}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs font-semibold text-[var(--text-muted)] hover:underline cursor-pointer"
              >
                Kembali ke Masuk
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
