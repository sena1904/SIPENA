import React, { useState } from 'react';
import { User, Submission, SupervisionReport } from '../../types';
import { StorageService } from '../../services/storage';
import { SubmissionFormModal } from './SubmissionFormModal';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileEdit,
  Eye,
  Download,
  Info,
  Calendar,
  Layers,
  Award
} from 'lucide-react';

interface TeacherDashboardProps {
  currentUser: User;
  onOpenReport: (submissionId: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  currentUser,
  onOpenReport,
  onShowToast
}) => {
  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    return StorageService.getSubmissions().filter(s => s.teacherId === currentUser.id);
  });

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Submission | null>(null);

  const refreshSubmissions = () => {
    setSubmissions(StorageService.getSubmissions().filter(s => s.teacherId === currentUser.id));
  };

  // Stats calculation aligned with the 3 cards in the image
  const activeCount = submissions.filter(
    s => s.status === 'Dalam Penilaian' || s.status === 'Menunggu Verifikasi'
  ).length;

  const completedCount = submissions.filter(
    s =>
      s.status === 'Diproses untuk Publikasi' ||
      s.status === 'Tersedia bagi Pengawas' ||
      s.status === 'Ditinjau Pengawas' ||
      s.status === 'Tindak Lanjut'
  ).length;

  const waitingCount = submissions.filter(
    s => s.status === 'Menunggu Verifikasi' || s.status === 'Perlu Revisi' || s.status === 'Draf'
  ).length;

  const handleOpenNewForm = () => {
    setEditingSub(null);
    setIsFormModalOpen(true);
  };

  const handleOpenLatestReport = () => {
    const completed = submissions.find(
      s =>
        s.status === 'Tersedia bagi Pengawas' ||
        s.status === 'Ditinjau Pengawas' ||
        s.status === 'Tindak Lanjut'
    );
    if (completed) {
      onOpenReport(completed.id);
    } else if (submissions.length > 0) {
      onOpenReport(submissions[0].id);
    } else {
      onShowToast('Belum ada laporan supervisi yang disahkan.', 'info');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Tersedia bagi Pengawas':
      case 'Ditinjau Pengawas':
      case 'Tindak Lanjut':
        return (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: '#DCFCE7',
              color: '#15803D',
              padding: '4px 10px',
              borderRadius: '999px',
              display: 'inline-block'
            }}
          >
            Selesai
          </span>
        );
      case 'Dalam Penilaian':
      case 'Diproses untuk Publikasi':
        return (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: '#E0F2FE',
              color: '#0369A1',
              padding: '4px 10px',
              borderRadius: '999px',
              display: 'inline-block'
            }}
          >
            Proses
          </span>
        );
      default:
        return (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: '#FEE2E2',
              color: '#DC2626',
              padding: '4px 10px',
              borderRadius: '999px',
              display: 'inline-block'
            }}
          >
            {status === 'Perlu Revisi' ? 'Revisi' : 'Menunggu'}
          </span>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* =========================================================================
          ROW 1: THREE SOFT TINTED STAT CARDS (Responsive Grid)
         ========================================================================= */}
      <div className="dashboard-stats-grid">
        {/* Card 1: Supervisi Aktif (ditugaskan) - Light Blue Tint */}
        <div
          style={{
            backgroundColor: '#EEF5FF',
            border: '1px solid #DCE9FE',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '140px',
            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '38px', fontWeight: 800, color: '#1D4ED8', lineHeight: 1 }}>
              {activeCount}
            </div>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(37, 99, 235, 0.12)',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Calendar size={20} />
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#1E3A8A' }}>Supervisi Aktif</div>
            <div style={{ fontSize: '12px', color: '#60A5FA' }}>(ditugaskan)</div>
          </div>
        </div>

        {/* Card 2: Selesai (semester ini) - Light Green Tint */}
        <div
          style={{
            backgroundColor: '#EDFDF4',
            border: '1px solid #D1F8E1',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '140px',
            boxShadow: '0 2px 6px rgba(22, 163, 74, 0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '38px', fontWeight: 800, color: '#15803D', lineHeight: 1 }}>
              {completedCount}
            </div>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(22, 163, 74, 0.12)',
                color: '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#14532D' }}>Selesai</div>
            <div style={{ fontSize: '12px', color: '#4ADE80' }}>(semester ini)</div>
          </div>
        </div>

        {/* Card 3: Menunggu Penilaian - Light Lavender/Purple Tint */}
        <div
          style={{
            backgroundColor: '#F8F5FF',
            border: '1px solid #EDE5FF',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '140px',
            boxShadow: '0 2px 6px rgba(124, 58, 237, 0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '38px', fontWeight: 800, color: '#6D28D9', lineHeight: 1 }}>
              {waitingCount}
            </div>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(124, 58, 237, 0.12)',
                color: '#7C3AED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Clock size={20} />
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#4C1D95' }}>Menunggu Penilaian</div>
            <div style={{ fontSize: '12px', color: '#A78BFA' }}>(verifikasi & revisi)</div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ROW 2: TWO COLUMNS (Jadwal Supervisi Table & Aksi Cepat Buttons)
         ========================================================================= */}
      <div className="dashboard-two-col">
        {/* Left Column: Jadwal & Antrean Supervisi Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
            minWidth: 0
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1E293B', margin: 0 }}>
              Jadwal Supervisi
            </h3>
            <span style={{ fontSize: '12px', color: '#64748B' }}>
              Tahun Ajaran 2026/2027 (Ganjil)
            </span>
          </div>

          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', minWidth: '480px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F1F5F9', color: '#64748B' }}>
                  <th style={{ padding: '10px 12px', width: '40px', fontWeight: 600 }}>No</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Tanggal</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Kelas / Materi</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#94A3B8' }}>
                      Belum ada jadwal supervisi. Klik tombol "Isi Form Supervisi" untuk memulai.
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub, index) => (
                    <tr
                      key={sub.id}
                      style={{
                        borderBottom: '1px solid #F8FAFC',
                        transition: 'background-color 150ms ease'
                      }}
                    >
                      <td style={{ padding: '14px 12px', color: '#94A3B8', fontWeight: 600 }}>
                        {index + 1}
                      </td>
                      <td style={{ padding: '14px 12px', fontWeight: 500, color: '#334155' }}>
                        {new Date(sub.executionDate).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ fontWeight: 600, color: '#1E293B' }}>{sub.grade}</div>
                        <div style={{ fontSize: '11px', color: '#64748B', maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {sub.topic}
                        </div>
                        <div style={{ marginTop: '2px' }}>
                          {sub.teacherInstrumentData && Object.keys(sub.teacherInstrumentData).length > 0 ? (
                            <span style={{ fontSize: '10px', color: '#15803D', fontWeight: 600 }}>
                              ✓ Data instrumen terisi ({Object.keys(sub.teacherInstrumentData).length} butir)
                            </span>
                          ) : (
                            <span style={{ fontSize: '10px', color: '#B45309' }}>
                              • Belum mengisi data butir instrumen
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                        {getStatusBadge(sub.status)}
                      </td>
                      <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          {(sub.status === 'Draf' || sub.status === 'Perlu Revisi') && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline"
                              style={{ padding: '4px 8px', fontSize: '12px' }}
                              onClick={() => {
                                setEditingSub(sub);
                                setIsFormModalOpen(true);
                              }}
                            >
                              <FileEdit size={13} />
                              <span>Isi / Edit</span>
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn btn-sm btn-ghost"
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                            onClick={() => onOpenReport(sub.id)}
                          >
                            <Eye size={14} />
                            <span>Detail</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Aksi Cepat Card (Pill Outline Buttons matching image) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1E293B', marginBottom: '20px' }}>
            Aksi Cepat
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Button 1: Isi Form Supervisi */}
            <button
              type="button"
              onClick={handleOpenNewForm}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 18px',
                borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#1E3A5F',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 150ms ease',
                textAlign: 'left'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#1E3A5F';
                e.currentTarget.style.backgroundColor = '#F8FAFC';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#CBD5E1';
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
            >
              <FileEdit size={18} color="#2563EB" />
              <span>Isi Form Supervisi</span>
            </button>

            {/* Button 2: Lihat Hasil Penilaian */}
            <button
              type="button"
              onClick={handleOpenLatestReport}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 18px',
                borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#1E3A5F',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 150ms ease',
                textAlign: 'left'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#1E3A5F';
                e.currentTarget.style.backgroundColor = '#F8FAFC';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#CBD5E1';
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
            >
              <Award size={18} color="#059669" />
              <span>Lihat Hasil Penilaian</span>
            </button>

            {/* Button 3: Unduh Laporan */}
            <button
              type="button"
              onClick={handleOpenLatestReport}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 18px',
                borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#1E3A5F',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 150ms ease',
                textAlign: 'left'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#1E3A5F';
                e.currentTarget.style.backgroundColor = '#F8FAFC';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#CBD5E1';
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
            >
              <Download size={18} color="#7C3AED" />
              <span>Unduh Laporan</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ROW 3: INFORMASI TERBARU BANNER (Exact match with bottom card in image)
         ========================================================================= */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '20px 24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1E293B', margin: 0 }}>
            Informasi Terbaru
          </h3>
          <span style={{ fontSize: '12px', color: '#94A3B8' }}>
            18 Oktober 2026
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#EFF6FF',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '2px'
            }}
          >
            <Info size={16} />
          </div>
          <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.6 }}>
            Laporan hasil supervisi pembelajaran semester ganjil dapat diakses dan diunduh setelah Kepala Sekolah melakukan verifikasi berkas, penilaian observasi kelas, dan pengesahan digital.
          </p>
        </div>
      </div>

      {/* Submission Form Modal */}
      <SubmissionFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        currentUser={currentUser}
        editingSubmission={editingSub}
        onSuccess={(sub, isSubmitted) => {
          refreshSubmissions();
          if (isSubmitted) {
            onShowToast(`Pengajuan supervisi "${sub.topic}" berhasil dikirim ke Kepala Sekolah!`, 'success');
          } else {
            onShowToast('Draf pengajuan berhasil disimpan.', 'info');
          }
        }}
      />
    </div>
  );
};
