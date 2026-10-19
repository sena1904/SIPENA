'use client';

import React, { useState } from 'react';
import { StorageService } from '@/services/storage';
import {
  History,
  CheckCircle2,
  Save,
  MessageSquare,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function GuruRefleksiPage() {
  const [success, setSuccess] = useState(false);
  const [challenges, setChallenges] = useState(
    'Sebagian peserta didik di kelompok 3 masih membutuhkan scaffolding lebih saat memahami konsep pemaknaan Q.S. Al-Hujurat 13 secara kontekstual.'
  );
  const [positiveNotes, setPositiveNotes] = useState(
    'Metode pembelajaran berbasis kelompok dan media kartu intisari ayat sangat efektif meningkatkan keterlibatan siswa secara aktif.'
  );
  const [actionPlan, setActionPlan] = useState(
    'Menerapkan diferensiasi produk tugas pada pertemuan berikutnya serta menyiapkan lembar kerja bergambar untuk peserta didik berkebutuhan asistensi khusus.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3500);
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
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B', margin: 0 }}>
          Refleksi Mandiri Guru Pascakonsultasi Klinis
        </h2>
        <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>
          Dokumentasikan hasil evaluasi diri pasca observasi kelas untuk perbaikan berkelanjutan kualitas pembelajaran PAI
        </p>
      </div>

      <div className="dashboard-two-col">
        {/* Left Column: Form Refleksi */}
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
          {success && (
            <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: '#EDFDF4', border: '1px solid #86EFAC', color: '#15803D', fontWeight: 600, fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} />
              <span>Catatan refleksi berhasil disimpan dan tersinkronisasi ke laporan supervisi!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="form-group">
              <label className="form-label">
                1. Hal yang Berjalan Efektif Selama Pembelajaran di Kelas
              </label>
              <textarea
                className="form-textarea"
                rows={4}
                value={positiveNotes}
                onChange={e => setPositiveNotes(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                2. Kendala &amp; Tantangan yang Dihadapi Peserta Didik
              </label>
              <textarea
                className="form-textarea"
                rows={4}
                value={challenges}
                onChange={e => setChallenges(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                3. Rencana Aksi Perbaikan untuk Pembelajaran Selanjutnya
              </label>
              <textarea
                className="form-textarea"
                rows={4}
                value={actionPlan}
                onChange={e => setActionPlan(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }}>
                <Save size={16} />
                <span>Simpan Lembar Refleksi</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Umpan Balik Kepala Sekolah */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}
          >
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1E293B', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={16} color="#2563EB" />
              <span>Umpan Balik Kepala Sekolah</span>
            </h4>

            <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Drs. H. Suryanto, M.Pd</div>
              <div style={{ fontSize: '12px', color: '#334155', marginTop: '6px', lineHeight: 1.5, fontStyle: 'italic' }}>
                &ldquo;Pengelolaan kelas dan pengkondisian iklim belajar sangat tertib. Disarankan agar porsi tanya jawab pemantik lebih diperbanyak sebelum masuk ke materi inti.&rdquo;
              </div>
              <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '8px' }}>Diberikan pada 14 Okt 2026</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
