'use client';

import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Copy,
  ExternalLink,
  Save,
  Layers,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function AdminDatabasePage() {
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState<{
    connected: boolean;
    mode: string;
    message: string;
    config?: { url: string; hasAnonKey: boolean };
  } | null>(null);

  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [supabaseServiceKey, setSupabaseServiceKey] = useState('');
  const [databaseUrl, setDatabaseUrl] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/supabase/status');
      const data = await res.json();
      setStatusData(data);
      if (data.config?.url && !supabaseUrl) {
        setSupabaseUrl(data.config.url.includes('sipena-pai-supervisi') ? '' : data.config.url);
      }
    } catch {
      setStatusData({
        connected: false,
        mode: 'offline',
        message: 'Gagal menghubungi endpoint status Supabase.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl.trim() || !supabaseAnonKey.trim()) {
      alert('Supabase Project URL dan Anon Key wajib diisi!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/supabase/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supabaseUrl: supabaseUrl.trim(),
          supabaseAnonKey: supabaseAnonKey.trim(),
          supabaseServiceKey: supabaseServiceKey.trim(),
          databaseUrl: databaseUrl.trim()
        })
      });

      const data = await res.json();
      if (res.ok) {
        setNotification({ msg: data.message || 'Kredensial Supabase berhasil disimpan ke .env.local!', type: 'success' });
        await fetchStatus();
      } else {
        alert(data.error || 'Gagal menyimpan konfigurasi');
      }
    } catch (err: any) {
      alert(`Terjadi kesalahan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/supabase/seed', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setNotification({ msg: data.message || 'Seed data berhasil dikirim ke Supabase!', type: 'success' });
        await fetchStatus();
      } else {
        alert(data.error || 'Gagal melakukan seed data');
      }
    } catch (err: any) {
      alert(`Gagal seed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopySqlInstructions = () => {
    const textToCopy = `-- Buka Supabase Dashboard > SQL Editor > New Query
-- Jalankan file: supabase/migrations/01_schema.sql
-- Kemudian jalankan: supabase/migrations/02_rls_policies.sql
-- Seluruh tabel, index, dan RLS policies akan langsung terbuat di PostgreSQL Anda.`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
    setNotification({ msg: 'Instruksi SQL berhasil disalin ke clipboard!', type: 'info' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B', margin: 0 }}>
            Koneksi Database PostgreSQL &amp; Supabase
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>
            Hubungkan SIPENA PAI ke instance Supabase PostgreSQL milik Anda dan jalankan migrasi schema otomatis
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline"
          onClick={fetchStatus}
          disabled={loading}
        >
          <RotateCw size={15} className={loading ? 'animate-spin' : ''} />
          <span>{loading ? 'Memeriksa...' : 'Uji Koneksi Ulang'}</span>
        </button>
      </div>

      {notification && (
        <div
          style={{
            padding: '14px 18px',
            borderRadius: '12px',
            backgroundColor: notification.type === 'success' ? '#EDFDF4' : '#EFF6FF',
            border: `1.5px solid ${notification.type === 'success' ? '#86EFAC' : '#BFDBFE'}`,
            color: notification.type === 'success' ? '#15803D' : '#1D4ED8',
            fontWeight: 600,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <CheckCircle2 size={18} />
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Status Banner */}
      <div
        style={{
          padding: '20px 24px',
          borderRadius: '16px',
          backgroundColor: statusData?.connected ? '#EDFDF4' : '#FFFBEB',
          border: `1.5px solid ${statusData?.connected ? '#86EFAC' : '#FDE68A'}`,
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px'
        }}
      >
        {statusData?.connected ? (
          <CheckCircle2 size={28} color="#15803D" style={{ flexShrink: 0, marginTop: '2px' }} />
        ) : (
          <AlertTriangle size={28} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: '16px', color: statusData?.connected ? '#14532D' : '#92400E' }}>
            {statusData?.connected
              ? 'Terhubung Aktif ke Database Live PostgreSQL Supabase'
              : 'Mode Local Storage Aktif (Belum Terhubung ke Supabase Pribadi)'}
          </div>
          <div style={{ fontSize: '13px', color: '#475569', marginTop: '6px', lineHeight: 1.5 }}>
            {statusData?.message}
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Form Config & Migrations */}
      <div className="dashboard-equal-two-col">
        {/* Form Config */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            minWidth: 0
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1E293B', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Save size={18} color="#2563EB" />
            <span>Konfigurasi API Keys (.env.local)</span>
          </h3>

          <form onSubmit={handleSaveConfig} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">
                Supabase Project URL <span className="required">*</span>
              </label>
              <input
                type="url"
                className="form-input"
                placeholder="https://xxxxxxxx.supabase.co"
                value={supabaseUrl}
                onChange={e => setSupabaseUrl(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Project API Anon Key (Public) <span className="required">*</span>
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={supabaseAnonKey}
                onChange={e => setSupabaseAnonKey(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Service Role Key <span style={{ fontSize: '11px', color: '#94A3B8' }}>(Opsional untuk bypass RLS pada seed data)</span>
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={supabaseServiceKey}
                onChange={e => setSupabaseServiceKey(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                PostgreSQL Connection String <span style={{ fontSize: '11px', color: '#94A3B8' }}>(Opsional)</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="postgres://postgres:[PASSWORD]@db.xxxx.supabase.co:5432/postgres"
                value={databaseUrl}
                onChange={e => setDatabaseUrl(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                <Save size={16} />
                <span>Simpan Kredensial (.env.local)</span>
              </button>
            </div>
          </form>
        </div>

        {/* Migrations & Schema Instructions */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1E293B', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="#059669" />
              <span>Langkah Migrasi PostgreSQL</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#1E293B' }}>1. Eksekusi 01_schema.sql</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>Membuat 11 tabel SRS Section 12, trigger sync autentikasi, dan enum role.</div>
              </div>

              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#1E293B' }}>2. Eksekusi 02_rls_policies.sql</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>Mengaktifkan Row-Level Security (RLS) ketat untuk isolasi penuh data antar peran.</div>
              </div>

              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#1E293B' }}>3. Kirim Seed Data Awal</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>Masukkan data awal sekolah, guru, kepala sekolah, pengawas, dan rubrik asesmen.</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleCopySqlInstructions}
            >
              <Copy size={15} />
              <span>{copiedSql ? '✓ Tersalin!' : 'Salin Panduan SQL'}</span>
            </button>

            {statusData?.connected && (
              <button
                type="button"
                className="btn btn-accent"
                onClick={handleSeedData}
                disabled={loading}
              >
                <Sparkles size={15} />
                <span>Kirim Seed Data Awal</span>
              </button>
            )}

            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
              style={{ textDecoration: 'none' }}
            >
              <ExternalLink size={15} />
              <span>Buka Supabase</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
