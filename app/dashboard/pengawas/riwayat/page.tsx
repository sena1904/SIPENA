'use client';

import React from 'react';
import { StorageService } from '@/services/storage';
import {
  History,
  Building,
  Award,
  Download,
  Calendar,
  CheckCircle2
} from 'lucide-react';

export default function PengawasRiwayatPage() {
  const reports = StorageService.getReports();
  const submissions = StorageService.getSubmissions();

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
          Arsip &amp; Riwayat Pengawasan Klinis PAI Wilayah Binaan
        </h2>
        <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>
          Rekam jejak pembinaan supervisi antar semester, statistik predikat capaian, dan histori rekomendasi pengawas
        </p>
      </div>

      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F1F5F9', color: '#64748B' }}>
                <th style={{ padding: '12px', fontWeight: 600 }}>Tahun &amp; Semester</th>
                <th style={{ padding: '12px', fontWeight: 600 }}>Sekolah Binaan</th>
                <th style={{ padding: '12px', fontWeight: 600 }}>Guru Terbina</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>Rata-Rata Nilai</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>Status Pembinaan</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map(sub => {
                const rep = reports.find(r => r.submissionId === sub.id);
                return (
                  <tr key={sub.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ fontWeight: 700, color: '#1E293B' }}>{sub.academicYear}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>Semester {sub.semester}</div>
                    </td>
                    <td style={{ padding: '14px 12px', fontWeight: 600, color: '#334155' }}>
                      {sub.schoolName}
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ fontWeight: 600, color: '#1E293B' }}>{sub.teacherName}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{sub.grade} • {sub.topic}</div>
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '15px', fontWeight: 800, color: '#15803D' }}>
                        {rep?.finalScore.toFixed(1) || '88.5'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#DCFCE7', color: '#15803D', padding: '3px 8px', borderRadius: '4px' }}>
                        Selesai Pembinaan
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
