'use client';

import React, { useState, useEffect } from 'react';
import { StorageService } from '@/services/storage';
import { Submission, User } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { SubmissionFormModal } from '@/views/teacher/SubmissionFormModal';
import { OfficialReportView } from '@/views/reports/OfficialReportView';
import {
  FileCheck2,
  Calendar,
  Plus,
  Eye,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function GuruSupervisiPage() {
  const [currentUser, setCurrentUser] = useState<User>(() => StorageService.getCurrentUser());
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewingReportId, setViewingReportId] = useState<string | null>(null);

  const loadData = () => {
    const user = StorageService.getCurrentUser();
    setCurrentUser(user);
    const all = StorageService.getSubmissions();
    const my = all.filter(s => s.teacherId === user.id || s.teacherName === user.name);
    setSubmissions(my.length > 0 ? my : all);
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshData = () => {
    loadData();
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
            Supervisi Saya (Riwayat &amp; Jadwal Klinis)
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>
            Pantau 9 tahapan siklus supervisi pembelajaran PAI mulai dari pengajuan hingga tindak lanjut pengawas
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setIsFormOpen(true)}
        >
          <Plus size={16} />
          <span>Ajukan Jadwal Baru</span>
        </button>
      </div>

      {/* Submissions Table Card */}
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
                <th style={{ padding: '12px', width: '36px', fontWeight: 600 }}>No</th>
                <th style={{ padding: '12px', fontWeight: 600 }}>Tanggal Pelaksanaan</th>
                <th style={{ padding: '12px', fontWeight: 600 }}>Kelas &amp; Mata Pelajaran</th>
                <th style={{ padding: '12px', fontWeight: 600 }}>Materi / Topik Supervisi</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>Status Siklus</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub, idx) => (
                <tr key={sub.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                  <td style={{ padding: '14px 12px', color: '#94A3B8', fontWeight: 600 }}>{idx + 1}</td>
                  <td style={{ padding: '14px 12px', fontWeight: 600, color: '#1E293B' }}>
                    {new Date(sub.executionDate).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    <div style={{ fontWeight: 600 }}>{sub.grade}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{sub.subject}</div>
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    <div style={{ maxWidth: '320px', color: '#334155', fontWeight: 500 }}>{sub.topic}</div>
                  </td>
                  <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                    <StatusBadge status={sub.status} />
                  </td>
                  <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost"
                      onClick={() => setViewingReportId(sub.id)}
                    >
                      <Eye size={14} />
                      <span>Lihat Rincian</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SubmissionFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        currentUser={currentUser}
        onSuccess={() => {
          refreshData();
          setIsFormOpen(false);
        }}
      />

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
