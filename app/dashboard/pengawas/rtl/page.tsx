'use client';

import React, { useState } from 'react';
import { StorageService } from '@/services/storage';
import { Submission, SupervisionReport, FollowUp } from '@/types';
import { FollowUpModal } from '@/views/supervisor/FollowUpModal';
import {
  Award,
  ArrowRightCircle,
  CheckCircle2,
  Calendar,
  Clock,
  Target
} from 'lucide-react';

export default function PengawasRtlPage() {
  const currentUser = StorageService.getCurrentUser();
  const submissions = StorageService.getSubmissions();
  const reports = StorageService.getReports();
  const [followUps, setFollowUps] = useState<FollowUp[]>(StorageService.getFollowUps());

  const [selectedTarget, setSelectedTarget] = useState<{
    sub: Submission;
    report: SupervisionReport;
  } | null>(null);

  const refreshData = () => {
    setFollowUps(StorageService.getFollowUps());
  };

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
          Rencana Tindak Lanjut (RTL) Pembinaan Klinis Guru PAI
        </h2>
        <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>
          Tetapkan rekomendasi perbaikan kompetensi, target capaian, dan pantau progres implementasi bimbingan di kelas
        </p>
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
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F1F5F9', color: '#64748B' }}>
                <th style={{ padding: '12px', fontWeight: 600 }}>Guru &amp; Satuan Pendidikan</th>
                <th style={{ padding: '12px', fontWeight: 600 }}>Target Peningkatan Kualitas</th>
                <th style={{ padding: '12px', fontWeight: 600 }}>Tenggat Waktu</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>Progres RTL</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>Aksi Pengawas</th>
              </tr>
            </thead>
            <tbody>
              {publishedSubmissions.map(sub => {
                const rep = reports.find(r => r.submissionId === sub.id);
                const flw = rep ? followUps.find(f => f.reportId === rep.id) : undefined;

                return (
                  <tr key={sub.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ fontWeight: 700, color: '#1E293B' }}>{sub.teacherName}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{sub.schoolName}</div>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ fontWeight: 600, color: '#334155' }}>
                        {flw ? flw.targetImprovement : 'Belum ditetapkan rekomendasi'}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B', maxWidth: '300px' }}>
                        {flw ? flw.recommendations : 'Klik tombol di kanan untuk mengisi RTL'}
                      </div>
                    </td>
                    <td style={{ padding: '14px 12px', color: '#64748B' }}>
                      {flw ? flw.dueDate : '-'}
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: flw?.progress === 'Selesai' ? '#DCFCE7' : '#FEF3C7',
                          color: flw?.progress === 'Selesai' ? '#15803D' : '#B45309',
                          padding: '3px 8px',
                          borderRadius: '4px'
                        }}
                      >
                        {flw?.progress || 'Menunggu'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                      {rep && (
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={() => setSelectedTarget({ sub, report: rep })}
                        >
                          <ArrowRightCircle size={14} />
                          <span>{flw ? 'Ubah RTL' : '+ Buat RTL'}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <FollowUpModal
        isOpen={Boolean(selectedTarget)}
        onClose={() => setSelectedTarget(null)}
        submission={selectedTarget?.sub || null}
        report={selectedTarget?.report || null}
        currentUser={currentUser}
        onSaved={() => {
          refreshData();
          setSelectedTarget(null);
        }}
      />
    </div>
  );
}
