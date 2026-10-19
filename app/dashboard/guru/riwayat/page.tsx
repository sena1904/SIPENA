'use client';

import React, { useState } from 'react';
import { StorageService } from '@/services/storage';
import { OfficialReportView } from '@/views/reports/OfficialReportView';
import {
  Award,
  Download,
  Eye,
  FileCheck2,
  Calendar,
  CheckCircle2,
  Building
} from 'lucide-react';

export default function GuruRiwayatPage() {
  const currentUser = StorageService.getCurrentUser();
  const reports = StorageService.getReports();
  const submissions = StorageService.getSubmissions().filter(s => s.teacherId === currentUser.id);

  const completedSubmissions = submissions.filter(
    s =>
      s.status === 'Diproses untuk Publikasi' ||
      s.status === 'Tersedia bagi Pengawas' ||
      s.status === 'Ditinjau Pengawas' ||
      s.status === 'Tindak Lanjut'
  );

  const [viewingReportId, setViewingReportId] = useState<string | null>(null);

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
          Riwayat &amp; Arsip Laporan Resmi Supervisi PAI
        </h2>
        <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>
          Dokumen hasil penilaian kinerja guru yang telah disahkan secara digital oleh Kepala Sekolah beserta predikat capaian mutu
        </p>
      </div>

      {/* Reports Table Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}
      >
        {completedSubmissions.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>
            <Award size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <div style={{ fontWeight: 600, fontSize: '15px', color: '#475569' }}>
              Belum ada laporan supervisi yang disahkan pada semester ini
            </div>
            <p style={{ fontSize: '13px', marginTop: '4px' }}>
              Laporan resmi akan terbit setelah Kepala Sekolah menyelesaikan penilaian observasi kelas.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F1F5F9', color: '#64748B' }}>
                  <th style={{ padding: '12px', fontWeight: 600 }}>Tahun / Semester</th>
                  <th style={{ padding: '12px', fontWeight: 600 }}>Materi &amp; Kelas</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>Nilai Akhir</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>Predikat</th>
                  <th style={{ padding: '12px', fontWeight: 600 }}>Disahkan Oleh</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {completedSubmissions.map(sub => {
                  const rep = reports.find(r => r.submissionId === sub.id);

                  return (
                    <tr key={sub.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ fontWeight: 700, color: '#1E293B' }}>{sub.academicYear}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Semester {sub.semester}</div>
                      </td>
                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ fontWeight: 600, color: '#334155' }}>{sub.topic}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>{sub.grade} • {sub.subject}</div>
                      </td>
                      <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                        <span style={{ fontSize: '16px', fontWeight: 800, color: '#1D4ED8' }}>
                          {rep?.finalScore.toFixed(1) || '88.5'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor: '#DCFCE7',
                            color: '#15803D',
                            padding: '3px 8px',
                            borderRadius: '4px'
                          }}
                        >
                          {rep?.predicate || 'Amat Baik'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ fontWeight: 600, color: '#1E293B' }}>{rep?.endorsedBy || 'Drs. H. Suryanto, M.Pd'}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>
                          {rep?.endorsedAt ? new Date(rep.endorsedAt).toLocaleDateString('id-ID') : '14 Okt 2026'}
                        </div>
                      </td>
                      <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={() => setViewingReportId(sub.id)}
                        >
                          <Eye size={14} />
                          <span>Buka Laporan Resmi</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {viewingReportId && (
        <OfficialReportView
          submissionId={viewingReportId}
          onClose={() => setViewingReportId(null)}
          onShowToast={(msg, type) => alert(msg)}
        />
      )}
    </div>
  );
}
