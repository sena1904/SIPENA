'use client';

import React, { useState } from 'react';
import { StorageService } from '@/services/storage';
import { Submission, SupervisionReport } from '@/types';
import { OfficialReportView } from '@/views/reports/OfficialReportView';
import {
  History,
  CheckCircle2,
  Award,
  Eye,
  Lock,
  Download,
  Calendar
} from 'lucide-react';

export default function KepalaSekolahPengesahanPage() {
  const reports = StorageService.getReports();
  const submissions = StorageService.getSubmissions();
  const [viewingSubId, setViewingSubId] = useState<string | null>(null);

  const completedSubmissions = submissions.filter(
    s =>
      s.status === 'Diproses untuk Publikasi' ||
      s.status === 'Tersedia bagi Pengawas' ||
      s.status === 'Ditinjau Pengawas' ||
      s.status === 'Tindak Lanjut'
  );

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
          Pengesahan &amp; Penerbitan Laporan Resmi Supervisi PAI
        </h2>
        <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>
          Daftar dokumen laporan supervisi yang telah disahkan secara digital dengan integritas nilai terkunci dan diteruskan ke Pengawas Sekolah
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
                <th style={{ padding: '12px', fontWeight: 600 }}>Guru Pengampu</th>
                <th style={{ padding: '12px', fontWeight: 600 }}>Materi Pokok</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>Nilai Akhir</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>Predikat</th>
                <th style={{ padding: '12px', fontWeight: 600 }}>Tanggal Pengesahan</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {completedSubmissions.map(sub => {
                const rep = reports.find(r => r.submissionId === sub.id);
                return (
                  <tr key={sub.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ fontWeight: 700, color: '#1E293B' }}>{sub.teacherName}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>NIP: {sub.teacherNip}</div>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ fontWeight: 600, color: '#334155' }}>{sub.topic}</div>
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '16px', fontWeight: 800, color: '#15803D' }}>
                        {rep?.finalScore.toFixed(1) || '88.0'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#DCFCE7', color: '#15803D', padding: '3px 8px', borderRadius: '4px' }}>
                        {rep?.predicate || 'Amat Baik'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', color: '#64748B' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Lock size={12} color="#15803D" />
                        <span>{rep?.endorsedAt ? new Date(rep.endorsedAt).toLocaleDateString('id-ID') : '14 Okt 2026'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => setViewingSubId(sub.id)}
                      >
                        <Eye size={14} />
                        <span>Buka Rapor Resmi</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {viewingSubId && (
        <OfficialReportView
          submissionId={viewingSubId}
          onClose={() => setViewingSubId(null)}
          onShowToast={(msg, type) => alert(msg)}
        />
      )}
    </div>
  );
}
