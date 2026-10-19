'use client';

import React, { useState } from 'react';
import { StorageService } from '@/services/storage';
import { Submission, User } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { VerificationModal } from '@/views/principal/VerificationModal';
import {
  FileCheck2,
  CheckSquare,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';

export default function KepalaSekolahVerifikasiPage() {
  const currentUser = StorageService.getCurrentUser();
  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    return StorageService.getSubmissions();
  });
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const refreshData = () => {
    setSubmissions(StorageService.getSubmissions());
  };

  const pendingSubmissions = submissions.filter(
    s => s.status === 'Menunggu Verifikasi' || s.status === 'Perlu Revisi'
  );

  const filtered = pendingSubmissions.filter(s =>
    s.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            Verifikasi Kelengkapan Berkas Guru PAI
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>
            Periksa dokumen administrasi pra-observasi (Modul Ajar/RPP, KKTP, Asesmen) sebelum pelaksanaan supervisi kelas
          </p>
        </div>

        <div style={{ position: 'relative', width: '220px' }}>
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '32px', fontSize: '12px' }}
            placeholder="Cari guru / materi..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
        </div>
      </div>

      {/* Table Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}
      >
        {filtered.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>
            <FileCheck2 size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <div style={{ fontWeight: 600, fontSize: '15px', color: '#475569' }}>
              Tidak ada berkas yang menunggu verifikasi saat ini
            </div>
            <p style={{ fontSize: '13px', marginTop: '4px' }}>
              Semua berkas pengajuan guru telah diverifikasi atau belum ada pengajuan baru.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F1F5F9', color: '#64748B' }}>
                  <th style={{ padding: '12px', fontWeight: 600 }}>Guru Pengampu</th>
                  <th style={{ padding: '12px', fontWeight: 600 }}>Materi &amp; Kelas</th>
                  <th style={{ padding: '12px', fontWeight: 600 }}>Tanggal Supervisi</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(sub => (
                  <tr key={sub.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ fontWeight: 700, color: '#1E293B' }}>{sub.teacherName}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>NIP: {sub.teacherNip}</div>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ fontWeight: 600, color: '#334155' }}>{sub.topic}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{sub.grade} • {sub.subject}</div>
                    </td>
                    <td style={{ padding: '14px 12px', color: '#64748B' }}>
                      {new Date(sub.executionDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                      <StatusBadge status={sub.status} />
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => setSelectedSub(sub)}
                      >
                        <CheckSquare size={14} />
                        <span>Verifikasi Berkas</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <VerificationModal
        isOpen={Boolean(selectedSub)}
        onClose={() => setSelectedSub(null)}
        submission={selectedSub}
        currentUser={currentUser}
        onVerified={() => {
          refreshData();
          setSelectedSub(null);
        }}
        onRevisionRequested={() => {
          refreshData();
          setSelectedSub(null);
        }}
      />
    </div>
  );
}
