import React, { useState } from 'react';
import { User, Submission, SupervisionReport, FollowUp, School } from '../../types';
import { StorageService } from '../../services/storage';
import { CsvExportService } from '../../services/csvExport';
import { StatusBadge } from '../../components/StatusBadge';
import { FollowUpModal } from './FollowUpModal';
import {
  Compass,
  School as SchoolIcon,
  Award,
  CheckCircle2,
  Eye,
  FileText,
  Search,
  ArrowRightCircle,
  FileCheck2,
  TrendingUp,
  Filter,
  Download,
  Info,
  FileSpreadsheet
} from 'lucide-react';

interface SupervisorDashboardProps {
  currentUser: User;
  onOpenReport: (submissionId: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SupervisorDashboard: React.FC<SupervisorDashboardProps> = ({
  currentUser,
  onOpenReport,
  onShowToast
}) => {
  const allSchools = StorageService.getSchools();
  const assignments = StorageService.getAssignments().filter(a => a.userId === currentUser.id);
  const assignedSchoolIds = assignments.map(a => a.schoolId);

  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Target submission & report for follow up modal
  const [selectedForFollowUp, setSelectedForFollowUp] = useState<{
    sub: Submission;
    report: SupervisionReport;
  } | null>(null);

  // Submissions filtered by supervisor's assigned schools AND status >= 'Tersedia bagi Pengawas' (SRS-F-7.1)
  const allSubmissions = StorageService.getSubmissions();
  const allReports = StorageService.getReports();
  const allFollowUps = StorageService.getFollowUps();

  const publishedSubmissions = allSubmissions.filter(sub => {
    const isAssignedSchool =
      assignedSchoolIds.length === 0 || assignedSchoolIds.includes(sub.schoolId);
    const isPublishedStatus =
      sub.status === 'Tersedia bagi Pengawas' ||
      sub.status === 'Ditinjau Pengawas' ||
      sub.status === 'Tindak Lanjut';

    return isAssignedSchool && isPublishedStatus;
  });

  const filteredSubmissions = publishedSubmissions.filter(sub => {
    const matchesSchool = selectedSchoolFilter === 'ALL' || sub.schoolId === selectedSchoolFilter;
    const matchesSearch =
      sub.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.topic.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSchool && matchesSearch;
  });

  // Calculate Region Stats
  const relevantReports = allReports.filter(r =>
    publishedSubmissions.some(s => s.id === r.submissionId)
  );

  const averageScore =
    relevantReports.length > 0
      ? (
          relevantReports.reduce((acc, curr) => acc + curr.finalScore, 0) /
          relevantReports.length
        ).toFixed(1)
      : '0.0';

  const pendingReviewCount = publishedSubmissions.filter(
    s => s.status === 'Tersedia bagi Pengawas'
  ).length;

  const activeFollowUpsCount = publishedSubmissions.filter(
    s => s.status === 'Tindak Lanjut'
  ).length;

  const handleOpenAndMarkReviewed = (sub: Submission) => {
    // If status is Tersedia bagi Pengawas, advance to Ditinjau Pengawas (SRS-F-7.3)
    if (sub.status === 'Tersedia bagi Pengawas') {
      const updatedSub: Submission = {
        ...sub,
        status: 'Ditinjau Pengawas',
        updatedAt: new Date().toISOString()
      };
      StorageService.updateSubmission(updatedSub);

      StorageService.addAuditLog({
        entityType: 'submission',
        entityId: sub.id,
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorRole: 'pengawas',
        action: 'SUPERVISOR_REVIEWED_REPORT',
        oldValue: 'Status: Tersedia bagi Pengawas',
        newValue: 'Status: Ditinjau Pengawas'
      });
    }

    onOpenReport(sub.id);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* =========================================================================
          ROW 1: THREE SOFT TINTED STAT CARDS (Responsive Grid)
         ========================================================================= */}
      <div className="dashboard-stats-grid">
        {/* Card 1: Sekolah Binaan & Laporan - Soft Blue Tint */}
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
              {assignments.length || allSchools.length}
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
              <SchoolIcon size={20} />
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#1E3A8A' }}>Sekolah Binaan</div>
            <div style={{ fontSize: '12px', color: '#60A5FA' }}>({publishedSubmissions.length} laporan disahkan)</div>
          </div>
        </div>

        {/* Card 2: Rata-Rata Nilai Wilayah - Soft Green Tint */}
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
              {averageScore}
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
              <Award size={20} />
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#14532D' }}>Rata-Rata Wilayah</div>
            <div style={{ fontSize: '12px', color: '#4ADE80' }}>(pencapaian mutu PAI)</div>
          </div>
        </div>

        {/* Card 3: Menunggu Tinjauan - Soft Lavender/Purple Tint */}
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
              {pendingReviewCount}
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
              <Eye size={20} />
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#4C1D95' }}>Menunggu Tinjauan</div>
            <div style={{ fontSize: '12px', color: '#A78BFA' }}>({activeFollowUpsCount} dalam tindak lanjut)</div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ROW 2: TWO COLUMNS (Rekapitulasi Table & Aksi Cepat Buttons)
         ========================================================================= */}
      <div className="dashboard-two-col">
        {/* Left Column: Rekapitulasi Supervisi Card */}
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
                Rekapitulasi Supervisi Sekolah Binaan
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0' }}>
                Laporan supervisi guru yang telah disahkan dan siap ditinjau
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* School Filter Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Filter size={14} color="#64748B" />
                <select
                  className="form-select"
                  style={{ width: '180px', fontSize: '12px', height: '32px' }}
                  value={selectedSchoolFilter}
                  onChange={e => setSelectedSchoolFilter(e.target.value)}
                >
                  <option value="ALL">Semua Sekolah Binaan</option>
                  {allSchools.map(sch => (
                    <option key={sch.id} value={sch.id}>
                      {sch.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div style={{ position: 'relative', width: '160px' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '28px', fontSize: '12px', height: '32px' }}
                  placeholder="Cari guru / materi..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <Search
                  size={14}
                  color="#94A3B8"
                  style={{ position: 'absolute', left: '8px', top: '9px' }}
                />
              </div>
            </div>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center', color: '#94A3B8' }}>
              <Compass size={36} strokeWidth={1.5} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#475569' }}>
                Belum ada laporan disahkan yang siap ditinjau
              </div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', width: '100%' }}>
              <table style={{ width: '100%', minWidth: '540px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #F1F5F9', color: '#64748B' }}>
                    <th style={{ padding: '10px 12px', width: '36px', fontWeight: 600 }}>No</th>
                    <th style={{ padding: '10px 12px', fontWeight: 600 }}>Sekolah & Guru</th>
                    <th style={{ padding: '10px 12px', fontWeight: 600 }}>Materi / Kelas</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600 }}>Nilai</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600 }}>Status</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((sub, index) => {
                    const report = allReports.find(r => r.submissionId === sub.id);
                    const followUp = report ? allFollowUps.find(f => f.reportId === report.id) : undefined;

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
                          <div style={{ fontSize: '11px', color: '#64748B' }}>{sub.schoolName}</div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: 500, color: '#334155' }}>{sub.grade}</div>
                          <div style={{ fontSize: '11px', color: '#64748B', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {sub.topic}
                          </div>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          {report ? (
                            <div>
                              <span style={{ fontSize: '14px', fontWeight: 800, color: '#1D4ED8' }}>
                                {report.finalScore}
                              </span>
                              <span
                                style={{
                                  marginLeft: '4px',
                                  fontSize: '10px',
                                  fontWeight: 700,
                                  backgroundColor: '#DCFCE7',
                                  color: '#15803D',
                                  padding: '1px 5px',
                                  borderRadius: '4px'
                                }}
                              >
                                {report.predicate}
                              </span>
                            </div>
                          ) : (
                            <span style={{ color: '#94A3B8' }}>-</span>
                          )}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <StatusBadge status={sub.status} />
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              className="btn btn-sm btn-ghost"
                              style={{ padding: '4px 6px', fontSize: '11px' }}
                              onClick={() => handleOpenAndMarkReviewed(sub)}
                              title="Buka Laporan"
                            >
                              <Eye size={13} />
                              <span>Laporan</span>
                            </button>

                            {report && (
                              <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                style={{ padding: '4px 8px', fontSize: '11px' }}
                                onClick={() => setSelectedForFollowUp({ sub, report })}
                                title="Rencana Tindak Lanjut"
                              >
                                <ArrowRightCircle size={13} />
                                <span>{followUp ? 'RTL' : '+ RTL'}</span>
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
            {/* Button 1: Beri RTL Supervisi */}
            <button
              type="button"
              onClick={() => {
                const target = publishedSubmissions.find(s => {
                  const r = allReports.find(rep => rep.submissionId === s.id);
                  return r && !allFollowUps.some(f => f.reportId === r.id);
                }) || publishedSubmissions[0];

                if (target) {
                  const rep = allReports.find(r => r.submissionId === target.id);
                  if (rep) {
                    setSelectedForFollowUp({ sub: target, report: rep });
                    return;
                  }
                }
                onShowToast('Pilih laporan pada tabel untuk mengisi Rencana Tindak Lanjut.', 'info');
              }}
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
              <ArrowRightCircle size={18} color="#2563EB" />
              <span>Beri Catatan Tindak Lanjut (RTL)</span>
            </button>

            {/* Button 2: Ekspor Rekap Wilayah */}
            <button
              type="button"
              onClick={() => {
                try {
                  CsvExportService.exportSupervisionSummary();
                  onShowToast('Rekapitulasi pengawasan wilayah berhasil diekspor (CSV).', 'success');
                } catch {
                  onShowToast('Gagal mengekspor data pengawasan.', 'error');
                }
              }}
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
              <Download size={18} color="#059669" />
              <span>Ekspor Rekap Wilayah (CSV)</span>
            </button>

            {/* Button 3: Buka Google Sheets Binaan */}
            <button
              type="button"
              onClick={() => {
                window.open('https://docs.google.com/spreadsheets', '_blank');
                onShowToast('Membuka tautan sinkronisasi Google Sheets pengawasan wilayah.', 'info');
              }}
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
              <FileSpreadsheet size={18} color="#7C3AED" />
              <span>Buka Google Sheets Wilayah</span>
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
            Sinkronisasi data rekapitulasi pengawasan PAI ke Google Sheets Kementerian Agama berlangsung otomatis. Berikan catatan pembinaan klinis dan Rencana Tindak Lanjut (RTL) pada laporan guru yang telah disahkan oleh Kepala Sekolah.
          </p>
        </div>
      </div>

      {/* Follow Up Modal */}
      <FollowUpModal
        isOpen={Boolean(selectedForFollowUp)}
        onClose={() => setSelectedForFollowUp(null)}
        submission={selectedForFollowUp?.sub || null}
        report={selectedForFollowUp?.report || null}
        currentUser={currentUser}
        onSaved={flw => {
          onShowToast(
            `Rekomendasi tindak lanjut untuk ${selectedForFollowUp?.sub.teacherName} berhasil disimpan!`,
            'success'
          );
          setSelectedForFollowUp(null);
        }}
      />
    </div>
  );
};
