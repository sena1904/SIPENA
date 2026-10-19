'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Copy,
  ExternalLink,
  Save,
  Layers,
  Sparkles
} from 'lucide-react';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'sql' | 'env'>('status');
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
        message: 'Tidak dapat memeriksa status koneksi Supabase.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

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
        onShowToast?.(data.message || 'Konfigurasi Supabase berhasil disimpan!', 'success');
        await fetchStatus();
        setActiveTab('status');
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
        onShowToast?.(data.message || 'Seed data berhasil dikirim ke Supabase!', 'success');
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
    onShowToast?.('Instruksi SQL berhasil disalin ke clipboard!', 'info');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Integrasi Database PostgreSQL & Supabase"
      size="lg"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Navigation Tabs in Modal */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'status' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('status')}
          >
            <Database size={15} />
            <span>Status Koneksi</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'env' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('env')}
          >
            <Save size={15} />
            <span>Atur Kredensial (.env.local)</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'sql' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('sql')}
          >
            <Layers size={15} />
            <span>Skrip SQL & Migrasi</span>
          </button>
        </div>

        {/* TAB 1: STATUS KONEKSI */}
        {activeTab === 'status' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                padding: '16px 20px',
                borderRadius: '12px',
                backgroundColor: statusData?.connected ? '#EDFDF4' : '#FFFBEB',
                border: `1.5px solid ${statusData?.connected ? '#86EFAC' : '#FDE68A'}`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px'
              }}
            >
              {statusData?.connected ? (
                <CheckCircle2 size={24} color="#15803D" style={{ flexShrink: 0, marginTop: '2px' }} />
              ) : (
                <AlertTriangle size={24} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '15px', color: statusData?.connected ? '#14532D' : '#92400E' }}>
                  {statusData?.connected
                    ? 'Koneksi Live Supabase Terhubung'
                    : 'Mode Mock / Local Storage Aktif'}
                </div>
                <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px', lineHeight: 1.5 }}>
                  {statusData?.message || 'Memeriksa konfigurasi koneksi database...'}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>URL Proyek Supabase</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B', marginTop: '4px', wordBreak: 'break-all' }}>
                  {statusData?.config?.url || 'Belum diatur'}
                </div>
              </div>
              <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Status API Key</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: statusData?.config?.hasAnonKey ? '#15803D' : '#DC2626', marginTop: '4px' }}>
                  {statusData?.config?.hasAnonKey ? '✓ Anon Key Terpasang' : '✗ Belum Dikonfigurasi'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '6px' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={fetchStatus}
                disabled={loading}
              >
                <RotateCw size={15} className={loading ? 'animate-spin' : ''} />
                <span>{loading ? 'Memeriksa...' : 'Uji Koneksi Ulang'}</span>
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setActiveTab('env')}
              >
                <span>Ubah Kredensial Supabase</span>
              </button>

              {statusData?.connected && (
                <button
                  type="button"
                  className="btn btn-accent"
                  onClick={handleSeedData}
                  disabled={loading}
                >
                  <Sparkles size={15} />
                  <span>Kirim Seed Data Awal ke Supabase</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ATUR KREDENSIAL */}
        {activeTab === 'env' && (
          <form onSubmit={handleSaveConfig} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
              Masukkan kredensial dari project Supabase Anda (buka <strong>Project Settings &gt; API</strong> di console Supabase). Nilai akan disimpan secara otomatis ke file <code>.env.local</code>.
            </p>

            <div className="form-group">
              <label className="form-label">
                Project URL <span className="required">*</span>
              </label>
              <input
                type="url"
                className="form-input"
                placeholder="https://your-project-id.supabase.co"
                value={supabaseUrl}
                onChange={e => setSupabaseUrl(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Project API Anon Key <span className="required">*</span>
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
                PostgreSQL Direct Connection String <span style={{ fontSize: '11px', color: '#94A3B8' }}>(Opsional)</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="postgres://postgres:[PASSWORD]@db.your-project.supabase.co:5432/postgres"
                value={databaseUrl}
                onChange={e => setDatabaseUrl(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setActiveTab('status')}
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                <Save size={15} />
                <span>{loading ? 'Menyimpan...' : 'Simpan Kredensial (.env.local)'}</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: SKRIP SQL & MIGRASI */}
        {activeTab === 'sql' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
              Aplikasi telah menyediakan 2 file migrasi SQL PostgreSQL berstandar produksi yang mencakup 11 tabel SRS Section 12 dan Row-Level Security (RLS):
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#1E293B' }}>1. supabase/migrations/01_schema.sql</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>11 tabel PostgreSQL + trigger on_auth_user_created + enum role</div>
                </div>
                <span style={{ fontSize: '11px', backgroundColor: '#E0F2FE', color: '#0369A1', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                  Schema
                </span>
              </div>

              <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#1E293B' }}>2. supabase/migrations/02_rls_policies.sql</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Kebijakan isolasi Row-Level Security Guru, Kepala Sekolah, Pengawas, & Admin</div>
                </div>
                <span style={{ fontSize: '11px', backgroundColor: '#EDE9FE', color: '#6D28D9', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                  Security
                </span>
              </div>
            </div>

            <div style={{ backgroundColor: '#1E293B', color: '#E2E8F0', padding: '16px', borderRadius: '8px', fontSize: '12px', fontFamily: 'monospace', lineHeight: 1.6 }}>
              <div># Cara Eksekusi di Supabase Dashboard:</div>
              <div>1. Buka project Anda di https://supabase.com/dashboard</div>
              <div>2. Masuk ke menu &quot;SQL Editor&quot; di sidebar kiri</div>
              <div>3. Buka file supabase/migrations/01_schema.sql di project Anda dan salin kodenya</div>
              <div>4. Tempel di SQL Editor dan klik tombol &quot;RUN&quot;</div>
              <div>5. Ulangi untuk supabase/migrations/02_rls_policies.sql</div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleCopySqlInstructions}
              >
                <Copy size={15} />
                <span>{copiedSql ? '✓ Instruksi Tersalin!' : 'Salin Panduan'}</span>
              </button>

              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{ textDecoration: 'none' }}
              >
                <ExternalLink size={15} />
                <span>Buka Supabase Dashboard</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
