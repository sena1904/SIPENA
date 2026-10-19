import React, { useState } from 'react';
import { Submission, SupervisionReport, AssessmentAnswer, AssessmentTemplate, FollowUp } from '../../types';
import { StorageService } from '../../services/storage';
import { PdfService } from '../../services/pdfService';
import { Stepper } from '../../components/Stepper';
import { StatusBadge } from '../../components/StatusBadge';
import {
  FileText,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  Award,
  ExternalLink,
  ShieldCheck,
  X,
  QrCode
} from 'lucide-react';

interface OfficialReportViewProps {
  submissionId: string;
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const OfficialReportView: React.FC<OfficialReportViewProps> = ({
  submissionId,
  onClose,
  onShowToast
}) => {
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const submission = StorageService.getSubmissionById(submissionId);
  const report = StorageService.getReportBySubmissionId(submissionId);
  const answer = StorageService.getAnswerBySubmissionId(submissionId);
  const template = (report?.templateVersionId ? StorageService.getTemplateById(report.templateVersionId) : null) || StorageService.getActiveTemplate();
  const followUp = report ? StorageService.getFollowUpByReportId(report.id) : undefined;
  const integrationLogs = StorageService.getIntegrationLogs().filter(l => l.submissionId === submissionId);

  if (!submission) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <h3>Pengajuan supervisi tidak ditemukan</h3>
        <button type="button" className="btn btn-primary" onClick={onClose}>
          Tutup
        </button>
      </div>
    );
  }

  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    const filename = `SIPENA_SUPERVISI_PAI_${submission.teacherName.replace(/\s+/g, '_')}_${submission.id}.pdf`;
    try {
      await PdfService.exportReportToPdf('official-report-printable', filename);
      onShowToast('PDF Laporan Supervisi resmi berhasil dibuat!', 'success');
    } catch {
      onShowToast('Gagal membuat file PDF.', 'error');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 1100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        overflowY: 'auto'
      }}
    >
      {/* Top Action Bar */}
      <div
        style={{
          width: '100%',
          maxWidth: '920px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Award size={20} color="#38BDF8" />
          <span style={{ fontWeight: 700, fontSize: '15px' }}>
            Pratinjau Dokumen Resmi Hasil Supervisi Akademik PAI
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-sm btn-outline"
            style={{ color: '#FFFFFF', borderColor: '#475569' }}
            onClick={handlePrint}
          >
            <Printer size={15} />
            <span>Cetak</span>
          </button>

          <button
            type="button"
            className="btn btn-sm btn-accent"
            disabled={isExportingPdf}
            onClick={handleDownloadPdf}
          >
            <Download size={15} />
            <span>{isExportingPdf ? 'Membuat PDF...' : 'Unduh PDF'}</span>
          </button>

          <button
            type="button"
            className="btn btn-sm btn-ghost"
            style={{ color: '#94A3B8' }}
            onClick={onClose}
            aria-label="Tutup"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Printable Document Sheet (A4 Styled Container) */}
      <div
        id="official-report-printable"
        style={{
          width: '100%',
          maxWidth: '920px',
          backgroundColor: '#FFFFFF',
          color: '#0F172A',
          padding: 'clamp(20px, 5vw, 48px)',
          boxSizing: 'border-box',
          borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          marginBottom: '40px',
          fontFamily: 'var(--font-body)',
          lineHeight: 1.5
        }}
      >
        {/* Kop Surat Resmi */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            borderBottom: '3px double #1E3A5F',
            paddingBottom: '16px',
            marginBottom: '20px'
          }}
        >
          <div
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              flexShrink: 0
            }}
          >
            <ShieldCheck size={42} />
          </div>

          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
              KEMENTERIAN AGAMA REPUBLIK INDONESIA
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.5px' }}>
              KANTOR KEMENTERIAN AGAMA KOTA JAKARTA PUSAT
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600 }}>
              SEKSI PENDIDIKAN AGAMA ISLAM (PAI) KECAMATAN MENTENG
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
              Jl. Kramat Raya No. 132, Senen, Jakarta Pusat • Sistem Informasi SIPENA PAI 2026/2027
            </div>
          </div>

          <div
            style={{
              width: '64px',
              height: '64px',
              border: '1.5px solid #CBD5E1',
              borderRadius: '6px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              backgroundColor: '#F8FAFC'
            }}
          >
            <QrCode size={36} color="var(--color-primary)" />
            <span style={{ fontSize: '8px', fontWeight: 700, color: 'var(--color-muted-foreground)' }}>VERIFIED</span>
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: 'var(--color-primary)',
              textDecoration: 'underline'
            }}
          >
            LAPORAN HASIL SUPERVISI AKADEMIK PEMBELAJARAN PAI
          </h2>
          <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
            Nomor Registrasi: <strong>SIPENA-PAI/{submission.academicYear.replace('/', '-')}/{submission.id}</strong>
          </div>
        </div>

        {/* Stepper Status tracker */}
        <Stepper currentStatus={submission.status} />

        {/* Meta Identitas */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px 24px',
            fontSize: '13px',
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px'
          }}
        >
          <div>
            <span style={{ color: '#64748B' }}>Nama Guru: </span>
            <strong>{submission.teacherName}</strong>
          </div>
          <div>
            <span style={{ color: '#64748B' }}>Sekolah: </span>
            <strong>{submission.schoolName}</strong>
          </div>
          <div>
            <span style={{ color: '#64748B' }}>NIP: </span>
            <strong>{submission.teacherNip}</strong>
          </div>
          <div>
            <span style={{ color: '#64748B' }}>Tahun Ajaran / Semester: </span>
            <strong>{submission.academicYear} • Semester {submission.semester}</strong>
          </div>
          <div>
            <span style={{ color: '#64748B' }}>Mata Pelajaran: </span>
            <strong>{submission.subject}</strong>
          </div>
          <div>
            <span style={{ color: '#64748B' }}>Fase / Kelas: </span>
            <strong>{submission.grade}</strong>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <span style={{ color: '#64748B' }}>Materi Pokok / TP: </span>
            <strong>{submission.topic}</strong>
          </div>
        </div>

        {/* Tabel Penilaian Instrumen */}
        {answer && (
          <div style={{ marginBottom: '20px' }}>
            <h4
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--color-primary)',
                marginBottom: '8px',
                borderBottom: '1px solid #E2E8F0',
                paddingBottom: '4px'
              }}
            >
              I. REKAPITULASI SKOR INDIKATOR SUPERVISI ({template.version})
            </h4>

            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '12px'
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '1.5px solid #CBD5E1' }}>
                  <th style={{ padding: '8px', textAlign: 'center', width: '40px' }}>No</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Indikator Supervisi PAI</th>
                  <th style={{ padding: '8px', textAlign: 'center', width: '70px' }}>Skor (1-4)</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Catatan Temuan Observasi</th>
                </tr>
              </thead>
              <tbody>
                {template.categories.map(cat => (
                  <React.Fragment key={cat.id}>
                    <tr style={{ backgroundColor: '#F8FAFC' }}>
                      <td colSpan={4} style={{ padding: '6px 8px', fontWeight: 700, color: 'var(--color-primary)' }}>
                        {cat.name} (Bobot: {cat.weight}%)
                      </td>
                    </tr>
                    {cat.indicators.map((ind, idx) => {
                      const score = answer.scores[ind.id] || 3;
                      const note = answer.notes[ind.id] || '-';

                      return (
                        <tr key={ind.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                          <td style={{ padding: '6px 8px', textAlign: 'center', color: '#64748B' }}>
                            {ind.code}
                          </td>
                          <td style={{ padding: '6px 8px' }}>
                            <div style={{ fontWeight: 600 }}>{ind.label}</div>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>{ind.description}</div>
                            {submission.teacherInstrumentData?.[ind.id] && (
                              <div
                                style={{
                                  marginTop: '4px',
                                  fontSize: '11px',
                                  color: '#0369A1',
                                  backgroundColor: '#F0F9FF',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  borderLeft: '2px solid #0284C7'
                                }}
                              >
                                <span style={{ fontWeight: 700 }}>Data Guru:</span> "{submission.teacherInstrumentData[ind.id].implementationNotes}"
                                {submission.teacherInstrumentData[ind.id].evidenceAttachment && (
                                  <div style={{ marginTop: '2px', color: '#2563EB', fontSize: '10px' }}>
                                    📎 Bukti: <strong>{submission.teacherInstrumentData[ind.id].evidenceAttachment}</strong>
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '6px 8px', textAlign: 'center', fontWeight: 700, fontSize: '13px' }}>
                            {score}
                          </td>
                          <td style={{ padding: '6px 8px', color: '#334155' }}>{note}</td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Skor Akhir Box */}
        {report && (
          <div
            style={{
              backgroundColor: '#F0FDF4',
              border: '2px solid #86EFAC',
              borderRadius: '8px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}
          >
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#166534' }}>
                NILAI AKHIR SUPERVISI PEMBELAJARAN
              </div>
              <div style={{ fontSize: '30px', fontWeight: 900, color: '#14532D', lineHeight: 1.1 }}>
                {report.finalScore} / 100
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: 800,
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                  padding: '4px 14px',
                  borderRadius: '999px',
                  display: 'inline-block'
                }}
              >
                PREDIKAT: {report.predicate.toUpperCase()}
              </span>
              <div style={{ fontSize: '11px', color: '#166534', marginTop: '4px' }}>
                Disahkan secara digital pada: {new Date(report.endorsedAt).toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        )}

        {/* Catatan Kualitatif & Rekomendasi */}
        <div style={{ marginBottom: '24px', fontSize: '13px' }}>
          <h4
            style={{
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: '8px',
              borderBottom: '1px solid #E2E8F0',
              paddingBottom: '4px'
            }}
          >
            II. CATATAN KUALITATIF & REKOMENDASI PEMBINAAN
          </h4>

          <div style={{ marginBottom: '10px' }}>
            <strong>A. Temuan Substantif Kepala Sekolah:</strong>
            <p style={{ margin: '4px 0 0 14px', color: '#334155' }}>
              {answer?.overallFindings || 'Pembelajaran terlaksana dengan baik sesuai modul ajar.'}
            </p>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <strong>B. Rekomendasi Kepala Sekolah:</strong>
            <p style={{ margin: '4px 0 0 14px', color: '#334155' }}>
              {answer?.overallRecommendation || 'Tingkatkan implementasi diferensiasi dan asesmen formatif.'}
            </p>
          </div>

          {followUp && (
            <div
              style={{
                backgroundColor: '#FAF5FF',
                border: '1px solid #E9D5FF',
                borderRadius: '6px',
                padding: '12px 14px',
                marginTop: '10px'
              }}
            >
              <strong style={{ color: '#6B21A8' }}>
                C. Rencana Tindak Lanjut Pengawas Sekolah ({followUp.supervisorName}):
              </strong>
              <p style={{ margin: '4px 0 4px 14px', color: '#4C1D95' }}>
                {followUp.recommendations}
              </p>
              <div style={{ margin: '4px 0 0 14px', fontSize: '12px', color: '#7E22CE' }}>
                • Target: <strong>{followUp.targetImprovement}</strong> • Tenggat:{' '}
                <strong>{followUp.dueDate}</strong> • Status Progres: <strong>{followUp.progress}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Tanda Tangan 3 Pihak (Guru, Kepala Sekolah, Pengawas) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            textAlign: 'center',
            fontSize: '12px',
            marginTop: '32px',
            paddingTop: '16px',
            borderTop: '1px solid #E2E8F0'
          }}
        >
          {/* Guru */}
          <div>
            <div>Mengetahui,</div>
            <div style={{ fontWeight: 600 }}>Guru yang Disupervisi</div>
            <div style={{ height: '55px' }} />
            <div style={{ fontWeight: 700, textDecoration: 'underline' }}>{submission.teacherName}</div>
            <div style={{ color: '#64748B' }}>NIP. {submission.teacherNip}</div>
          </div>

          {/* Pengawas */}
          <div>
            <div>Menyetujui,</div>
            <div style={{ fontWeight: 600 }}>Pengawas Pembina PAI</div>
            <div style={{ height: '55px' }} />
            <div style={{ fontWeight: 700, textDecoration: 'underline' }}>
              {followUp ? followUp.supervisorName : 'Dra. Hj. Siti Fatimah, M.Pd'}
            </div>
            <div style={{ color: '#64748B' }}>NIP. 19651120 199002 2 001</div>
          </div>

          {/* Kepala Sekolah */}
          <div>
            <div>Jakarta, {report ? new Date(report.endorsedAt).toLocaleDateString('id-ID') : '-'}</div>
            <div style={{ fontWeight: 600 }}>Kepala Sekolah Penilai</div>
            <div
              style={{
                height: '55px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#15803D',
                fontWeight: 800,
                fontSize: '11px',
                letterSpacing: '1px'
              }}
            >
              [ TERVERIFIKASI DIGITAL ]
            </div>
            <div style={{ fontWeight: 700, textDecoration: 'underline' }}>
              {report ? report.endorsedBy : submission.schoolName}
            </div>
            <div style={{ color: '#64748B' }}>
              NIP. {report?.endorserNip || '19680315 199403 1 004'}
            </div>
          </div>
        </div>

        {/* Integration Status Footer */}
        {integrationLogs.length > 0 && (
          <div
            style={{
              marginTop: '28px',
              paddingTop: '12px',
              borderTop: '1px dashed #CBD5E1',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              fontSize: '11px',
              color: '#64748B'
            }}
          >
            {integrationLogs.map(log => (
              <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: log.status === 'Berhasil' ? '#15803D' : '#DC2626' }}>●</span>
                <span>
                  {log.service}: <strong>{log.status}</strong> ({new Date(log.timestamp).toLocaleTimeString('id-ID')})
                </span>
                {log.externalUrl && (
                  <a
                    href={log.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--color-secondary)', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
                  >
                    <span>buka</span>
                    <ExternalLink size={10} />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
