import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Submission,
  AssessmentTemplate,
  AssessmentAnswer,
  SupervisionReport,
  PredicateType,
  User
} from '../../types';
import { StorageService } from '../../services/storage';
import { GoogleIntegrationService } from '../../services/googleIntegration';
import { Modal } from '../../components/Modal';
import {
  Award,
  CheckCircle,
  FileText,
  AlertCircle,
  ArrowLeft,
  Lock,
  Sparkles,
  Share2,
  Calendar,
  User as UserIcon,
  HelpCircle
} from 'lucide-react';

interface AssessmentViewProps {
  submission: Submission;
  currentUser: User;
  onBack: () => void;
  onEndorsed: (report: SupervisionReport) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  submission,
  currentUser,
  onBack,
  onEndorsed,
  onShowToast
}) => {
  const template: AssessmentTemplate =
    (submission.templateVersionId ? StorageService.getTemplateById(submission.templateVersionId) : null) ||
    StorageService.getActiveTemplate();

  // Load existing answers if any
  const existingAnswer = StorageService.getAnswerBySubmissionId(submission.id);

  const [scores, setScores] = useState<Record<string, number>>(() => {
    if (existingAnswer?.scores) return existingAnswer.scores;
    // Default score 3 (Baik) for all indicators to ease entry
    const defaults: Record<string, number> = {};
    template.categories.forEach(cat => {
      cat.indicators.forEach(ind => {
        defaults[ind.id] = 3;
      });
    });
    return defaults;
  });

  const [notes, setNotes] = useState<Record<string, string>>(() => {
    return existingAnswer?.notes || {};
  });

  const [overallFindings, setOverallFindings] = useState(
    existingAnswer?.overallFindings ||
      'Guru menunjukkan penguasaan materi PAI yang sangat baik, suasana kelas aktif kondusif, dan nilai karakter akhlak karimah terintegrasi dalam interaksi belajar.'
  );

  const [overallRecommendation, setOverallRecommendation] = useState(
    existingAnswer?.overallRecommendation ||
      'Pertahankan pembelajaran berbasis diferensiasi. Disarankan untuk membagikan modul ajar dan praktik baik ini dalam kegiatan KKG PAI tingkat gugus / kecamatan.'
  );

  const [isEndorsing, setIsEndorsing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Real-time calculation of weighted score (SRS-F-4.4)
  const calculateFinalScore = (): { score: number; predicate: PredicateType } => {
    let totalWeightedScore = 0;

    template.categories.forEach(cat => {
      let catSum = 0;
      let catCount = 0;

      cat.indicators.forEach(ind => {
        const val = scores[ind.id] || 3;
        catSum += val;
        catCount++;
      });

      // Category average normalized to 100
      const catAverage100 = catCount > 0 ? (catSum / (catCount * 4)) * 100 : 0;
      totalWeightedScore += (catAverage100 * cat.weight) / 100;
    });

    const roundedScore = Math.round(totalWeightedScore * 10) / 10;

    let predicate: PredicateType = 'Kurang';
    if (roundedScore >= 91) predicate = 'Amat Baik';
    else if (roundedScore >= 81) predicate = 'Baik';
    else if (roundedScore >= 71) predicate = 'Cukup';

    return { score: roundedScore, predicate };
  };

  const { score: currentFinalScore, predicate: currentPredicate } = calculateFinalScore();

  const handleScoreChange = (indicatorId: string, val: number) => {
    setScores(prev => ({ ...prev, [indicatorId]: val }));
  };

  const handleNoteChange = (indicatorId: string, val: string) => {
    setNotes(prev => ({ ...prev, [indicatorId]: val }));
  };

  // Save progress answers
  const handleSaveProgress = () => {
    const answer: AssessmentAnswer = {
      id: existingAnswer?.id || `ans-${Date.now()}`,
      submissionId: submission.id,
      templateVersionId: template.id,
      scores,
      notes,
      overallFindings,
      overallRecommendation,
      assessedBy: currentUser.name,
      assessedAt: new Date().toISOString()
    };
    StorageService.saveAnswerForSubmission(answer);
    onShowToast('Skor dan catatan observasi supervisi berhasil disimpan!', 'info');
  };

  // Final Endorsement (SRS-F-5.1)
  const handleEndorseReport = () => {
    setShowConfirmModal(true);
  };

  const executeEndorsement = async () => {
    setShowConfirmModal(false);
    setIsEndorsing(true);

    try {
      // 1. Save answers
      const answer: AssessmentAnswer = {
        id: existingAnswer?.id || `ans-${Date.now()}`,
        submissionId: submission.id,
        templateVersionId: template.id,
        scores,
        notes,
        overallFindings,
        overallRecommendation,
        assessedBy: currentUser.name,
        assessedAt: new Date().toISOString()
      };
      StorageService.saveAnswerForSubmission(answer);

      // 2. Create supervision report
      const reportId = `REP-2026-${Math.floor(100 + Math.random() * 900)}`;
      const newReport: SupervisionReport = {
        id: reportId,
        submissionId: submission.id,
        templateVersionId: template.id,
        templateVersionName: template.version,
        finalScore: currentFinalScore,
        predicate: currentPredicate,
        endorsedBy: currentUser.name,
        endorserNip: currentUser.nip || '-',
        endorsedAt: new Date().toISOString(),
        pdfUrl: `https://storage.sipena.id/reports/${reportId}.pdf`,
        isImmutable: true
      };
      StorageService.addReport(newReport);

      // 3. Update submission state to Diproses untuk Publikasi
      const updatedSub: Submission = {
        ...submission,
        status: 'Diproses untuk Publikasi',
        updatedAt: new Date().toISOString()
      };
      StorageService.updateSubmission(updatedSub);

      StorageService.addAuditLog({
        entityType: 'report',
        entityId: reportId,
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorRole: 'kepala_sekolah',
        action: 'ENDORSE_SUPERVISION_REPORT',
        oldValue: 'Status: Dalam Penilaian',
        newValue: `Status: Diproses untuk Publikasi | Nilai: ${currentFinalScore} (${currentPredicate}) | Disahkan oleh ${currentUser.name}`
      });

      // Celebration effect!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // 4. Background Sync to Google Drive and Google Sheets (SRS-F-6.1, SRS-F-6.2, SRS-F-6.5)
      await GoogleIntegrationService.processPublication(newReport, updatedSub);

      onShowToast(
        `Supervisi berhasil disahkan dengan predikat ${currentPredicate}! Laporan resmi kini Tersedia bagi Pengawas.`,
        'success'
      );

      onEndorsed(newReport);
    } catch (err) {
      console.error('Error during endorsement:', err);
      onShowToast('Terjadi kesalahan saat mengesahkan laporan.', 'error');
    } finally {
      setIsEndorsing(false);
    }
  };

  const getPredicateBadgeColor = (pred: PredicateType) => {
    switch (pred) {
      case 'Amat Baik':
        return { bg: '#DCFCE7', text: '#15803D' };
      case 'Baik':
        return { bg: '#E0F2FE', text: '#0369A1' };
      case 'Cukup':
        return { bg: '#FEF3C7', text: '#B45309' };
      case 'Kurang':
        return { bg: '#FEE2E2', text: '#B91C1C' };
    }
  };

  const predColors = getPredicateBadgeColor(currentPredicate);

  return (
    <div>
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={onBack}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Daftar</span>
        </button>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleSaveProgress}
          >
            <span>Simpan Sementara</span>
          </button>
          <button
            type="button"
            className="btn btn-accent"
            disabled={isEndorsing}
            onClick={handleEndorseReport}
            style={{ boxShadow: 'var(--shadow-md)' }}
          >
            <Lock size={16} />
            <span>{isEndorsing ? 'Memproses Pengesahan...' : 'Sahkan & Kunci Laporan Supervisi'}</span>
          </button>
        </div>
      </div>

      {/* Target Teacher Summary Card */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-sm)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px'
        }}
      >
        <div>
          <span style={{ fontSize: '12px', color: 'var(--color-muted-foreground)', display: 'block' }}>
            Guru yang Disupervisi:
          </span>
          <strong style={{ fontSize: '16px', color: 'var(--color-primary)' }}>
            {submission.teacherName}
          </strong>
          <div style={{ fontSize: '12px', color: '#64748B' }}>NIP: {submission.teacherNip}</div>
        </div>

        <div>
          <span style={{ fontSize: '12px', color: 'var(--color-muted-foreground)', display: 'block' }}>
            Mata Pelajaran & Kelas:
          </span>
          <strong style={{ fontSize: '14px', color: 'var(--color-foreground)' }}>
            {submission.subject}
          </strong>
          <div style={{ fontSize: '13px', color: '#475569' }}>{submission.grade}</div>
        </div>

        <div>
          <span style={{ fontSize: '12px', color: 'var(--color-muted-foreground)', display: 'block' }}>
            Instrumen & Versi Aktif:
          </span>
          <strong style={{ fontSize: '14px', color: 'var(--color-secondary)' }}>
            {template.version}
          </strong>
          <div style={{ fontSize: '11px', color: 'var(--color-muted-foreground)' }}>
            Total 12 Indikator Standar Kurikulum Merdeka
          </div>
        </div>

        {/* Live Score Counter Widget */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            border: '2px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-foreground)' }}>
              NILAI AKHIR OTOMATIS
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1.1 }}>
              {currentFinalScore}
            </div>
          </div>
          <div
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: predColors.bg,
              color: predColors.text,
              fontSize: '13px',
              fontWeight: 700
            }}
          >
            {currentPredicate}
          </div>
        </div>
      </div>

      {/* Categories & Indicators Accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {template.categories.map((category, catIdx) => (
          <div key={category.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div
              style={{
                backgroundColor: '#F1F5F9',
                padding: '16px 20px',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-primary)' }}>
                  {category.name}
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--color-muted-foreground)' }}>
                  Bobot Penilaian: {category.weight}% dari Nilai Akhir
                </span>
              </div>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  backgroundColor: '#E2E8F0',
                  padding: '4px 10px',
                  borderRadius: '999px'
                }}
              >
                {category.indicators.length} Indikator
              </span>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {category.indicators.map((ind, indIdx) => {
                const currentVal = scores[ind.id] || 3;
                const currentRubricText = ind.rubric[currentVal as 1 | 2 | 3 | 4];

                return (
                  <div
                    key={ind.id}
                    style={{
                      borderBottom: indIdx < category.indicators.length - 1 ? '1px solid #E2E8F0' : 'none',
                      paddingBottom: indIdx < category.indicators.length - 1 ? '20px' : '0'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              backgroundColor: 'var(--color-primary)',
                              color: '#FFFFFF',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: 700
                            }}
                          >
                            {ind.code}
                          </span>
                          <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--color-foreground)' }}>
                            {ind.label}
                          </span>
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--color-muted-foreground)', marginTop: '4px' }}>
                          {ind.description}
                        </p>
                      </div>

                      {/* 1-4 Radio Pill Selector */}
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {[1, 2, 3, 4].map(s => {
                          const isSelected = currentVal === s;
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => handleScoreChange(ind.id, s)}
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '8px',
                                fontWeight: 700,
                                fontSize: '14px',
                                border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                backgroundColor: isSelected ? 'var(--color-primary)' : '#FFFFFF',
                                color: isSelected ? '#FFFFFF' : 'var(--color-foreground)',
                                cursor: 'pointer',
                                transition: 'all 150ms ease'
                              }}
                              title={`Skor ${s}`}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                      {/* Data Isian Guru & Bukti Pendukung */}
                    {submission.teacherInstrumentData?.[ind.id] && (
                      <div
                        style={{
                          backgroundColor: '#F0F9FF',
                          border: '1px solid #BAE6FD',
                          borderRadius: '8px',
                          padding: '10px 14px',
                          marginTop: '8px',
                          marginBottom: '8px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#0369A1' }}>
                            Data Keterlaksanaan dari Guru ({submission.teacherName}):
                          </span>
                          {submission.teacherInstrumentData[ind.id].selfScore && (
                            <span style={{ fontSize: '10px', fontWeight: 700, backgroundColor: '#E0F2FE', color: '#0284C7', padding: '2px 6px', borderRadius: '4px' }}>
                              Evaluasi Mandiri Guru: Skor {submission.teacherInstrumentData[ind.id].selfScore}/4
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: '#0F172A', marginTop: '4px', lineHeight: 1.5 }}>
                          "{submission.teacherInstrumentData[ind.id].implementationNotes}"
                        </div>
                        {submission.teacherInstrumentData[ind.id].evidenceAttachment && (
                          <div style={{ fontSize: '11px', color: '#2563EB', marginTop: '4px' }}>
                            📎 Rujukan Bukti: <strong>{submission.teacherInstrumentData[ind.id].evidenceAttachment}</strong>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Active Rubric Description Box */}
                    <div
                      style={{
                        backgroundColor: '#F8FAFC',
                        borderLeft: '4px solid var(--color-secondary)',
                        padding: '10px 14px',
                        borderRadius: '0 6px 6px 0',
                        fontSize: '13px',
                        color: '#334155',
                        marginTop: '8px'
                      }}
                    >
                      <strong>Deskripsi Capaian Rubrik (Skor {currentVal}):</strong> {currentRubricText}
                    </div>

                    {/* Kepala Sekolah Observation Feedback Note Input */}
                    <div style={{ marginTop: '10px' }}>
                      <input
                        type="text"
                        className="form-input"
                        style={{ fontSize: '13px', padding: '8px 12px' }}
                        placeholder="Umpan balik / catatan observasi Kepala Sekolah untuk indikator ini..."
                        value={notes[ind.id] || ''}
                        onChange={e => handleNoteChange(ind.id, e.target.value)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Section: Catatan Temuan & Rekomendasi Umum (SRS-F-4.5) */}
        <div className="card">
          <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '14px', color: 'var(--color-primary)' }}>
            Catatan Temuan & Rekomendasi Supervisi Kepala Sekolah
          </h3>

          <div className="form-group">
            <label className="form-label">Temuan Umum Hasil Observasi Pembelajaran PAI:</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={overallFindings}
              onChange={e => setOverallFindings(e.target.value)}
              placeholder="Uraikan temuan substantif pembelajaran yang telah terlaksana..."
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Rekomendasi Pembinaan & Rencana Tindak Lanjut:</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={overallRecommendation}
              onChange={e => setOverallRecommendation(e.target.value)}
              placeholder="Uraikan saran perbaikan, penguatan modul ajar, atau rekomendasi berbagi praktik baik..."
            />
          </div>
        </div>

        {/* Bottom Endorsement Callout */}
        <div
          style={{
            backgroundColor: '#F0FDF4',
            border: '2px solid #86EFAC',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 700, fontSize: '16px' }}>
              <Sparkles size={20} />
              <span>Siap untuk Mengesahkan Laporan Supervisi Ini?</span>
            </div>
            <p style={{ fontSize: '13px', color: '#14532D', marginTop: '4px', maxWidth: '650px' }}>
              Nilai akhir terhitung adalah <strong>{currentFinalScore} ({currentPredicate})</strong>.
              Pengesahan akan membubuhkan stempel digital resmi, mengunci dokumen (immutable), dan otomatis mengarsipkan ke Google Drive serta Google Sheets Dinas.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-lg btn-accent"
            disabled={isEndorsing}
            onClick={handleEndorseReport}
          >
            <Lock size={18} />
            <span>{isEndorsing ? 'Sedang Mengesahkan...' : 'Sahkan & Publikasikan Laporan'}</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal (SRS-F-5.1) */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={20} color="var(--color-accent)" />
            <span>Konfirmasi Pengesahan Laporan Supervisi (Immutable)</span>
          </div>
        }
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', width: '100%' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowConfirmModal(false)}
            >
              Batal
            </button>
            <button
              type="button"
              className="btn btn-accent"
              onClick={executeEndorsement}
            >
              <CheckCircle size={16} />
              <span>Ya, Sahkan & Kunci Dokumen</span>
            </button>
          </div>
        }
      >
        <div>
          <div
            style={{
              padding: '16px',
              backgroundColor: '#F0FDF4',
              border: '1.5px solid #86EFAC',
              borderRadius: 'var(--radius-md)',
              marginBottom: '16px'
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '15px', color: '#166534', marginBottom: '4px' }}>
              Pernyataan Pengesahan Kepala Sekolah:
            </div>
            <p style={{ fontSize: '13px', color: '#14532D', lineHeight: 1.5 }}>
              Dengan menekan tombol konfirmasi, Anda selaku Kepala Sekolah menyatakan bahwa proses supervisi akademik pembelajaran PAI untuk <strong>{submission.teacherName}</strong> telah selesai dilaksanakan dengan data sebagai berikut:
            </p>
            <ul style={{ marginTop: '8px', marginLeft: '20px', fontSize: '13px', color: '#14532D' }}>
              <li>Nilai Akhir Terhitung: <strong>{currentFinalScore} / 100</strong></li>
              <li>Predikat Kelayakan: <strong>{currentPredicate}</strong></li>
              <li>Instrumen: <strong>{template.version}</strong></li>
            </ul>
          </div>

          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              color: '#991B1B'
            }}
          >
            <strong>Peringatan Integritas Data (PRD Bagian 5 & SRS-F-5.1):</strong> Laporan yang telah disahkan akan bersifat <em>immutable</em> (terkunci permanen) dan tidak dapat diubah sembarangan tanpa mekanisme revisi resmi tercatat. Berkas PDF akan otomatis diarsipkan ke Google Drive dan rekap dikirimkan ke Google Sheets Pengawas.
          </div>
        </div>
      </Modal>
    </div>
  );
};
