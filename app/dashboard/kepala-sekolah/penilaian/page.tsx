'use client';

import React, { useState } from 'react';
import { StorageService } from '@/services/storage';
import { Submission } from '@/types';
import { AssessmentView } from '@/views/principal/AssessmentView';
import {
  Award,
  FileSearch,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function KepalaSekolahPenilaianPage() {
  const currentUser = StorageService.getCurrentUser();
  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    return StorageService.getSubmissions();
  });
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);

  const assessableSubmissions = submissions.filter(
    s => s.status === 'Dalam Penilaian' || s.status === 'Menunggu Pengesahan'
  );

  const refreshData = () => {
    setSubmissions(StorageService.getSubmissions());
  };

  if (selectedSub) {
    return (
      <AssessmentView
        submission={selectedSub}
        currentUser={currentUser}
        onBack={() => {
          setSelectedSub(null);
          refreshData();
        }}
        onEndorsed={() => {
          setSelectedSub(null);
          refreshData();
        }}
        onShowToast={(msg) => alert(msg)}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
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
          Instrumen Penilaian Observasi Kelas Kurikulum Merdeka
        </h2>
        <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>
          Lakukan observasi klinis kelas dan masukkan skor rubrik untuk 4 dimensi kompetensi pembelajaran PAI
        </p>
      </div>

      {/* Assessment Queue */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}
      >
        {assessableSubmissions.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>
            <Award size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <div style={{ fontWeight: 600, fontSize: '15px', color: '#475569' }}>
              Tidak ada antrean observasi kelas yang sedang aktif
            </div>
            <p style={{ fontSize: '13px', marginTop: '4px' }}>
              Pengajuan guru yang telah diverifikasi berkasnya akan muncul di sini untuk dinilai saat observasi kelas.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F1F5F9', color: '#64748B' }}>
                  <th style={{ padding: '12px', fontWeight: 600 }}>Guru Pengampu</th>
                  <th style={{ padding: '12px', fontWeight: 600 }}>Materi Pembelajaran</th>
                  <th style={{ padding: '12px', fontWeight: 600 }}>Kelas</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {assessableSubmissions.map(sub => (
                  <tr key={sub.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ fontWeight: 700, color: '#1E293B' }}>{sub.teacherName}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>NIP: {sub.teacherNip}</div>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ fontWeight: 600, color: '#334155' }}>{sub.topic}</div>
                    </td>
                    <td style={{ padding: '14px 12px', color: '#64748B' }}>{sub.grade}</td>
                    <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#E0F2FE', color: '#0369A1', padding: '4px 10px', borderRadius: '999px' }}>
                        {sub.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => setSelectedSub(sub)}
                      >
                        <FileSearch size={14} />
                        <span>Mulai Penilaian Observasi</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
