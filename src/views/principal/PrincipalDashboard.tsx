import React, { useState } from 'react';
import { User, Submission, SupervisionReport } from '../../types';
import { StorageService } from '../../services/storage';
import { CsvExportService } from '../../services/csvExport';
import { StatusBadge } from '../../components/StatusBadge';
import { VerificationModal } from './VerificationModal';
import { AssessmentView } from './AssessmentView';
import {
  Award,
  FileCheck2,
  Clock,
  AlertCircle,
  FileSearch,
  CheckCircle2,
  Eye,
  CheckSquare,
  Search,
  Sparkles,
  FileEdit,
  Download,
  Info
} from 'lucide-react';

interface PrincipalDashboardProps {
  currentUser: User;
  onOpenReport: (submissionId: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const PrincipalDashboard: React.FC<PrincipalDashboardProps> = ({
  currentUser,
  onOpenReport,
  onShowToast
}) => {
  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    // School-level RBAC filtering per PRD & SRS!
    const schoolId = currentUser.schoolId || 'school-1';
    return StorageService.getSubmissions().filter(s => s.schoolId === schoolId);
  });

  const [selectedSubForVerification, setSelectedSubForVerification] = useState<Submission | null>(null);
  const [selectedSubForAssessment, setSelectedSubForAssessment] = useState<Submission | null>(null);
  const [filterTab, setFilterTab] = useState<'all' | 'pending_verification' | 'in_assessment' | 'endorsed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const refreshData = () => {
    const schoolId = currentUser.schoolId || 'school-1';
    setSubmissions(StorageService.getSubmissions().filter(s => s.schoolId === schoolId));
  };

  // Stats
  const waitingVerificationCount = submissions.filter(s => s.status === 'Menunggu Verifikasi').length;
  const inAssessmentCount = submissions.filter(
    s => s.status === 'Dalam Penilaian' || s.status === 'Menunggu Pengesahan'
  ).length;
  const revisionCount = submissions.filter(s => s.status === 'Perlu Revisi').length;
  const endorsedCount = submissions.filter(
    s =>
      s.status === 'Diproses untuk Publikasi' ||
      s.status === 'Tersedia bagi Pengawas' ||
      s.status === 'Ditinjau Pengawas' ||
      s.status === 'Tindak Lanjut'
  ).length;

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch =
      sub.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.grade.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === 'pending_verification') return sub.status === 'Menunggu Verifikasi';
    if (filterTab === 'in_assessment') return sub.status === 'Dalam Penilaian' || sub.status === 'Menunggu Pengesahan';
    if (filterTab === 'endorsed')
      return (
        sub.status === 'Diproses untuk Publikasi' ||
        sub.status === 'Tersedia bagi Pengawas' ||
        sub.status === 'Ditinjau Pengawas' ||
        sub.status === 'Tindak Lanjut'
      );

    return true;
  });

  const handleQuickVerify = () => {
    const pending = submissions.find(s => s.status === 'Menunggu Verifikasi');
    if (pending) {
      setSelectedSubForVerification(pending);
    } else {
      setFilterTab('pending_verification');
      onShowToast('Tidak ada antrean berkas yang menunggu verifikasi saat ini.', 'info');
    }
  };

  const handleQuickAssess = () => {
    const inAssess = submissions.find(s => s.status === 'Dalam Penilaian' || s.status === 'Menunggu Pengesahan');
    if (inAssess) {
      setSelectedSubForAssessment(inAssess);
    } else {
      setFilterTab('in_assessment');
      onShowToast('Tidak ada supervisi dalam observasi kelas aktif.', 'info');
    }
  };

  const handleExportCsv = () => {
    try {
      CsvExportService.exportSupervisionSummary();
      onShowToast('Rekapitulasi supervisi sekolah berhasil diunduh (CSV).', 'success');
    } catch {
      onShowToast('Gagal mengekspor data supervisi.', 'error');
    }
  };

  // If in assessment view mode, render AssessmentView component
  if (selectedSubForAssessment) {
    return (
      <AssessmentView
        submission={selectedSubForAssessment}
        currentUser={currentUser}
        onBack={() => {
          setSelectedSubForAssessment(null);
          refreshData();
        }}
        onEndorsed={report => {
          setSelectedSubForAssessment(null);
          refreshData();
          onOpenReport(report.submissionId);
        }}
        onShowToast={onShowToast}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* =========================================================================
          ROW 1: THREE SOFT TINTED STAT CARDS (Responsive Grid)
         ========================================================================= */}
      <div className="dashboard-stats-grid">
        {/* Card 1: Menunggu Verifikasi - Soft Blue Tint */}
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
              {waitingVerificationCount}
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
              <Clock size={20} />
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#1E3A8A' }}>Menunggu Verifikasi</div>
            <div style={{ fontSize: '12px', color: '#60A5FA' }}>(berkas RPP & modul masuk)</div>
          </div>
        </div>

        {/* Card 2: Selesai Disahkan - Soft Green Tint */}
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
              {endorsedCount}
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
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#14532D' }}>Selesai Disahkan</div>
            <div style={{ fontSize: '12px', color: '#4ADE80' }}>(terarsip & siap ditinjau pengawas)</div>
          </div>
        </div>

        {/* Card 3: Dalam Penilaian - Soft Purple Tint */}
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
              {inAssessmentCount}
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
              <FileSearch size={20} />
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#4C1D95' }}>Dalam Penilaian</div>
            <div style={{ fontSize: '12px', color: '#A78BFA' }}>(observasi kelas aktif)</div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ROW 2: TWO COLUMNS (Antrean Supervisi Table & Aksi Cepat Buttons)
         ========================================================================= */}
      <div className="dashboard-two-col">
        {/* Left Column: Antrean Supervisi Card */}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1E293B', margin: 0 }}>
                Antrean Supervisi Guru PAI
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0' }}>
                Daftar berkas pengajuan dan instrumen observasi guru binaan
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Filter Tabs */}
              <div style={{ display: 'flex', gap: '2px', backgroundColor: '#F1F5F9', padding: '3px', borderRadius: '8px' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${filterTab === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '6px' }}
                  onClick={() => setFilterTab('all')}
                >
                  Semua ({submissions.length})
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${filterTab === 'pending_verification' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '6px' }}
                  onClick={() => setFilterTab('pending_verification')}
                >
                  Verifikasi ({waitingVerificationCount})
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${filterTab === 'in_assessment' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '6px' }}
                  onClick={() => setFilterTab('in_assessment')}
                >
                  Penilaian ({inAssessmentCount})
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${filterTab === 'endorsed' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '6px' }}
                  onClick={() => setFilterTab('endorsed')}
                >
                  Disahkan ({endorsedCount})
                </button>
              </div>

              {/* Search */}
              <div style={{ position: 'relative', width: '180px' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '30px', fontSize: '12px', height: '32px' }}
                  placeholder="Cari guru / materi..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <Search
                  size={14}
                  color="#94A3B8"
                  style={{ position: 'absolute', left: '9px', top: '9px' }}
                />
              </div>
            </div>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center', color: '#94A3B8' }}>
              <FileCheck2 size={36} strokeWidth={1.5} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#475569' }}>
                Tidak ada pengajuan dalam filter ini
              </div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', width: '100%' }}>
              <table style={{ width: '100%', minWidth: '540px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #F1F5F9', color: '#64748B' }}>
                    <th style={{ padding: '10px 12px', width: '36px', fontWeight: 600 }}>No</th>
                    <th style={{ padding: '10px 12px', fontWeight: 600 }}>Guru Pengampu</th>
                    <th style={{ padding: '10px 12px', fontWeight: 600 }}>Kelas / Materi</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600 }}>Status</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((sub, index) => {
                    const report = StorageService.getReportBySubmissionId(sub.id);

                    return (
                      <tr
                        key={sub.id}
                        style={{
                          borderBottom: '1px solid #F8FAFC',
                          transition: 'background-color 150ms ease'
                        }}
                      >
                        <td style={{ padding: '12px', color: '#94A3B8', fontWeight: 600 }}>
                          {index + 1}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: 600, color: '#1E293B' }}>{sub.teacherName}</div>
                          <div style={{ fontSize: '11px', color: '#64748B' }}>NIP: {sub.teacherNip}</div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: 500, color: '#334155' }}>{sub.grade}</div>
                          <div style={{ fontSize: '11px', color: '#64748B', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {sub.topic}
                          </div>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <StatusBadge status={sub.status} />
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            {sub.status === 'Menunggu Verifikasi' && (
                              <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                style={{ padding: '4px 8px', fontSize: '11px' }}
                                onClick={() => setSelectedSubForVerification(sub)}
                              >
                                <CheckSquare size={13} />
                                <span>Verifikasi</span>
                              </button>
                            )}

                            {sub.status === 'Dalam Penilaian' && (
                              <button
                                type="button"
                                className="btn btn-sm btn-accent"
                                style={{ padding: '4px 8px', fontSize: '11px' }}
                                onClick={() => setSelectedSubForAssessment(sub)}
                              >
                                <FileSearch size={13} />
                                <span>Nilai</span>
                              </button>
                            )}

                            {report && (
                              <button
                                type="button"
                                className="btn btn-sm btn-outline"
                                style={{ padding: '4px 8px', fontSize: '11px' }}
                                onClick={() => onOpenReport(sub.id)}
                              >
                                <Eye size={13} />
                                <span>Rapor ({report.finalScore})</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
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
            {/* Button 1: Verifikasi Berkas */}
            <button
              type="button"
              onClick={handleQuickVerify}
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
              <FileCheck2 size={18} color="#2563EB" />
              <span>Verifikasi Berkas Masuk</span>
            </button>

            {/* Button 2: Isi Nilai Observasi */}
            <button
              type="button"
              onClick={handleQuickAssess}
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
              <FileEdit size={18} color="#059669" />
              <span>Input Nilai Observasi</span>
            </button>

            {/* Button 3: Unduh Rekap Supervisi */}
            <button
              type="button"
              onClick={handleExportCsv}
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
              <span>Unduh Rekapitulasi (CSV)</span>
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
            Pelaksanaan supervisi akademik semester ganjil berfokus pada diferensiasi pembelajaran PAI dan instrumen asesmen Kurikulum Merdeka. Pastikan seluruh berkas RPP/Modul Ajar diverifikasi sebelum jadwal observasi kelas berlangsung.
          </p>
        </div>
      </div>

      {/* Verification Modal */}
      <VerificationModal
        isOpen={Boolean(selectedSubForVerification)}
        onClose={() => setSelectedSubForVerification(null)}
        submission={selectedSubForVerification}
        currentUser={currentUser}
        onVerified={updated => {
          refreshData();
          onShowToast(
            `Dokumen supervisi ${updated.teacherName} terverifikasi lengkap! Lanjutkan pengisian nilai observasi.`,
            'success'
          );
          setSelectedSubForAssessment(updated);
        }}
        onRevisionRequested={updated => {
          refreshData();
          onShowToast(
            `Pengajuan ${updated.teacherName} berhasil dikembalikan untuk revisi beserta catatan perbaikan.`,
            'info'
          );
        }}
      />
    </div>
  );
};
