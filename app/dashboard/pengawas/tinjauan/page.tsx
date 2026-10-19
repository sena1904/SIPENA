'use client';

import React, { useState } from 'react';
import { StorageService } from '@/services/storage';
import { OfficialReportView } from '@/views/reports/OfficialReportView';
import {
  FileCheck2,
  Eye,
  Award,
  Building,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export default function PengawasTinjauanPage() {
  const reports = StorageService.getReports();
  const submissions = StorageService.getSubmissions();
  const [viewingSubId, setViewingSubId] = useState<string | null>(null);

  const publishedSubmissions = submissions.filter(
    s =>
      s.status === 'Tersedia bagi Pengawas' ||
      s.status === 'Ditinjau Pengawas' ||
      s.status === 'Tindak Lanjut'
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
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B', margin: 0 }}>
          Tinjauan Laporan Resmi Supervisi PAI
        </h2>
        <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>
          Telaah dokumen supervisi guru yang telah diverifikasi dan disahkan oleh Kepala Sekolah untuk penetapan pembinaan klinis
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
                <th style={{ padding: '12px', fontWeight: 600 }}>Sekolah &amp; Guru</th>
                <th style={{ padding: '12px', fontWeight: 600 }}>Materi Pembelajaran</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>Nilai Akhir</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>Predikat</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>Status Tinjauan</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {publishedSubmissions.map(sub => {
                const rep = reports.find(r => r.submissionId === sub.id);
                return (
                  <tr key={sub.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ fontWeight: 700, color: '#1E293B' }}>{sub.teacherName}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{sub.schoolName}</div>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ fontWeight: 600, color: '#334155' }}>{sub.topic}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{sub.grade}</div>
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '15px', fontWeight: 800, color: '#1D4ED8' }}>
                        {rep?.finalScore.toFixed(1) || '88.5'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#DCFCE7', color: '#15803D', padding: '3px 8px', borderRadius: '4px' }}>
                        {rep?.predicate || 'Amat Baik'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#EDE9FE', color: '#6D28D9', padding: '3px 8px', borderRadius: '4px' }}>
                        {sub.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => setViewingSubId(sub.id)}
                      >
                        <Eye size={14} />
                        <span>Tinjau Laporan</span>
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
