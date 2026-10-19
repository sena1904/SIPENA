'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  GraduationCap,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Award,
  Compass,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { initialUsers } from '@/data/initialData';
import { StorageService } from '@/services/storage';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const errorParam = searchParams.get('error');

  const [email, setEmail] = useState('ahmad.dahlan@sekolah.belajar.id');
  const [password, setPassword] = useState('Supervisi2026!');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    errorParam === 'unauthorized_access_prevented'
      ? 'Akses ditolak: Anda tidak memiliki wewenang untuk membuka halaman peran lain.'
      : ''
  );

  // Quick fill preset credentials for evaluation
  const handleQuickPreset = (role: 'guru' | 'kepala_sekolah' | 'pengawas' | 'admin') => {
    const storedUsers = typeof window !== 'undefined' ? StorageService.getUsers() : initialUsers;
    const user = storedUsers.find(u => u.role === role) || initialUsers.find(u => u.role === role);
    if (user) {
      setEmail(user.email);
      setPassword(user.password || 'Supervisi2026!');
      setErrorMessage('');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      // Find matching user in system
      const storedUsers = typeof window !== 'undefined' ? StorageService.getUsers() : initialUsers;
      const targetUser = storedUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase())
        || initialUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

      if (!targetUser) {
        setErrorMessage('Kredensial login tidak valid. Pastikan email terdaftar pada dinas/sekolah.');
        setIsLoading(false);
        return;
      }

      if (targetUser.status !== 'active') {
        setErrorMessage('Akun Anda dinonaktifkan oleh administrator. Silakan hubungi admin sekolah.');
        setIsLoading(false);
        return;
      }

      // Check password if configured on user
      if (targetUser.password && targetUser.password !== password) {
        setErrorMessage('Kata sandi salah. Silakan periksa kembali kata sandi Anda.');
        setIsLoading(false);
        return;
      }

      // Set cookie for Edge Middleware & Server session
      document.cookie = `sipena_session_role=${targetUser.role}; path=/; max-age=28800; SameSite=Lax`;
      document.cookie = `sipena_session_user=${encodeURIComponent(JSON.stringify(targetUser))}; path=/; max-age=28800; SameSite=Lax`;

      // Save to localStorage for client-side storage layer
      localStorage.setItem('sipena_current_user', JSON.stringify(targetUser));

      // Dynamic redirect based on Role
      let destination = '/dashboard/guru';
      if (targetUser.role === 'kepala_sekolah') destination = '/dashboard/kepala-sekolah';
      else if (targetUser.role === 'pengawas') destination = '/dashboard/pengawas';
      else if (targetUser.role === 'admin') destination = '/dashboard/admin';

      if (redirectParam && redirectParam.startsWith('/dashboard')) {
        destination = redirectParam;
      }

      router.push(destination);
      router.refresh();
    } catch (err) {
      setErrorMessage('Terjadi kesalahan autentikasi. Silakan coba beberapa saat lagi.');
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px'
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Logo Brand */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}
            >
              <GraduationCap size={28} />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: 800, color: 'var(--color-primary)' }}>
              SIPENA PAI
            </span>
          </Link>
          <div style={{ fontSize: '13px', color: 'var(--color-muted-foreground)', marginTop: '4px' }}>
            Masuk ke Portal Supervisi Pembelajaran PAI Terpadu
          </div>
        </div>

        {/* Login Card */}
        <div className="card" style={{ padding: '32px', boxShadow: 'var(--shadow-lg)' }}>
          {errorMessage && (
            <div
              style={{
                padding: '12px 14px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #F87171',
                borderRadius: 'var(--radius-md)',
                color: '#B91C1C',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                marginBottom: '20px'
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">
                Alamat Email <span className="required">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  className="form-input"
                  style={{ paddingLeft: '36px' }}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nama@sekolah.belajar.id"
                />
                <Mail
                  size={16}
                  color="var(--color-muted-foreground)"
                  style={{ position: 'absolute', left: '12px', top: '12px' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>
                  Kata Sandi <span className="required">*</span>
                </label>
                <a
                  href="#reset"
                  onClick={e => {
                    e.preventDefault();
                    alert('Silakan hubungi Administrator Sistem untuk mereset kata sandi terverifikasi.');
                  }}
                  style={{ fontSize: '12px', color: 'var(--color-secondary)' }}
                >
                  Lupa sandi?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  className="form-input"
                  style={{ paddingLeft: '36px' }}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                />
                <Lock
                  size={16}
                  color="var(--color-muted-foreground)"
                  style={{ position: 'absolute', left: '12px', top: '12px' }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '15px' }}
              disabled={isLoading}
            >
              <span>{isLoading ? 'Memverifikasi...' : 'Masuk ke Sistem'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Preset Demo Accounts */}
          <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--color-border-subtle)' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-muted-foreground)', marginBottom: '10px', textTransform: 'uppercase' }}>
              Uji Coba Cepat (Pilih Akun Peran):
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-sm btn-outline"
                style={{ fontSize: '12px', justifyContent: 'flex-start' }}
                onClick={() => handleQuickPreset('guru')}
              >
                <GraduationCap size={14} color="#0284C7" />
                <span>Guru PAI</span>
              </button>

              <button
                type="button"
                className="btn btn-sm btn-outline"
                style={{ fontSize: '12px', justifyContent: 'flex-start' }}
                onClick={() => handleQuickPreset('kepala_sekolah')}
              >
                <Award size={14} color="#7C3AED" />
                <span>Kepala Sekolah</span>
              </button>

              <button
                type="button"
                className="btn btn-sm btn-outline"
                style={{ fontSize: '12px', justifyContent: 'flex-start' }}
                onClick={() => handleQuickPreset('pengawas')}
              >
                <Compass size={14} color="#059669" />
                <span>Pengawas</span>
              </button>

              <button
                type="button"
                className="btn btn-sm btn-outline"
                style={{ fontSize: '12px', justifyContent: 'flex-start' }}
                onClick={() => handleQuickPreset('admin')}
              >
                <ShieldCheck size={14} color="#DC2626" />
                <span>Administrator</span>
              </button>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/" style={{ fontSize: '13px', color: 'var(--color-muted-foreground)' }}>
            ← Kembali ke Halaman Utama
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Memuat...</div>}>
      <LoginForm />
    </Suspense>
  );
}
