import React, { useState, useEffect } from 'react';
import { Submission, SupervisionReport, FollowUp, FollowUpProgress, User } from '../../types';
import { StorageService } from '../../services/storage';
import { Modal } from '../../components/Modal';
import {
  Compass,
  CheckCircle,
  Clock,
  Calendar,
  AlertCircle,
  Save,
  Award
} from 'lucide-react';

interface FollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: Submission | null;
  report: SupervisionReport | null;
  currentUser: User;
  onSaved: (followUp: FollowUp) => void;
}

export const FollowUpModal: React.FC<FollowUpModalProps> = ({
  isOpen,
  onClose,
  submission,
  report,
  currentUser,
  onSaved
}) => {
  const [recommendations, setRecommendations] = useState('');
  const [targetImprovement, setTargetImprovement] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [progress, setProgress] = useState<FollowUpProgress>('Sedang Berjalan');
  const [progressNotes, setProgressNotes] = useState('');

  useEffect(() => {
    if (isOpen && report) {
      const existing = StorageService.getFollowUpByReportId(report.id);
      if (existing) {
        setRecommendations(existing.recommendations);
        setTargetImprovement(existing.targetImprovement);
        setDueDate(existing.dueDate);
        setProgress(existing.progress);
        setProgressNotes(existing.progressNotes || '');
      } else {
        setRecommendations(
          'Hasil supervisi pembelajaran sangat memuaskan. Direkomendasikan menyusun karya inovatif / modul ajar diferensiasi untuk didiseminasikan ke forum KKG PAI.'
        );
        setTargetImprovement('Portofolio modul ajar berdiferensiasi dan video refleksi pembelajaran di PMM.');
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        setDueDate(nextMonth.toISOString().slice(0, 10));
        setProgress('Sedang Berjalan');
        setProgressNotes('');
      }
    }
  }, [isOpen, report]);

  if (!submission || !report) return null;

  const handleSave = () => {
    if (!recommendations.trim() || !targetImprovement.trim()) {
      alert('Harap isi rekomendasi dan target tindak lanjut secara lengkap!');
      return;
    }

    const existing = StorageService.getFollowUpByReportId(report.id);

    const followUp: FollowUp = {
      id: existing?.id || `flw-${Date.now()}`,
      reportId: report.id,
      submissionId: submission.id,
      supervisorId: currentUser.id,
      supervisorName: currentUser.name,
      recommendations: recommendations.trim(),
      targetImprovement: targetImprovement.trim(),
      dueDate,
      progress,
      progressNotes: progressNotes.trim(),
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    StorageService.saveFollowUp(followUp);

    // Update submission status to Tindak Lanjut if not yet
    if (submission.status !== 'Tindak Lanjut') {
      const updatedSub: Submission = {
        ...submission,
        status: 'Tindak Lanjut',
        updatedAt: new Date().toISOString()
      };
      StorageService.updateSubmission(updatedSub);
    }

    StorageService.addAuditLog({
      entityType: 'follow_up',
      entityId: followUp.id,
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: 'pengawas',
      action: 'SAVE_SUPERVISOR_FOLLOW_UP',
      newValue: `Target: "${targetImprovement.slice(0, 40)}..." | Progres: ${progress} | Tenggat: ${dueDate}`
    });

    onSaved(followUp);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass size={20} color="var(--color-primary)" />
          <span>Rekomendasi & Rencana Tindak Lanjut Pengawas PAI</span>
        </div>
      }
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', width: '100%' }}>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Batal
          </button>
          <button type="button" className="btn btn-accent" onClick={handleSave}>
            <Save size={16} />
            <span>Simpan Catatan Tindak Lanjut</span>
          </button>
        </div>
      }
    >
      <div>
        {/* Header Information */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--color-muted-foreground)', display: 'block' }}>
                Guru & Sekolah:
              </span>
              <strong style={{ fontSize: '14px', color: 'var(--color-foreground)' }}>
                {submission.teacherName}
              </strong>
              <div style={{ fontSize: '12px', color: '#64748B' }}>{submission.schoolName}</div>
            </div>

            <div>
              <span style={{ fontSize: '12px', color: 'var(--color-muted-foreground)', display: 'block' }}>
                Hasil Penilaian Kepala Sekolah:
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-primary)' }}>
                  {report.finalScore}
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    backgroundColor: '#DCFCE7',
                    color: '#15803D',
                    padding: '2px 8px',
                    borderRadius: '999px'
                  }}
                >
                  {report.predicate}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-muted-foreground)' }}>
                Disahkan oleh: {report.endorsedBy}
              </div>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <div className="form-group">
          <label className="form-label">
            Rekomendasi Pembinaan Pengawas Sekolah <span className="required">*</span>
          </label>
          <textarea
            className="form-textarea"
            rows={3}
            value={recommendations}
            onChange={e => setRecommendations(e.target.value)}
            placeholder="Tuliskan arahan pembinaan akademik, penguatan kompetensi pedagogik atau sosial religius guru..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Target Peningkatan Mutu Pembelajaran (Action Plan) <span className="required">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            value={targetImprovement}
            onChange={e => setTargetImprovement(e.target.value)}
            placeholder="Contoh: Pembuatan modul ajar berbasis kuis gamifikasi dan publikasi best practice di KKG"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Tenggat Waktu Pencapaian</label>
            <input
              type="date"
              className="form-input"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Status Progres Tindak Lanjut</label>
            <select
              className="form-select"
              value={progress}
              onChange={e => setProgress(e.target.value as FollowUpProgress)}
            >
              <option value="Belum Dimulai">Belum Dimulai</option>
              <option value="Sedang Berjalan">Sedang Berjalan</option>
              <option value="Selesai">Selesai Memenuhi Target</option>
            </select>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Catatan Pemantauan Berkala</label>
          <textarea
            className="form-textarea"
            rows={2}
            value={progressNotes}
            onChange={e => setProgressNotes(e.target.value)}
            placeholder="Catatan perkembangan atau pendampingan saat kunjungan berkala pengawas..."
          />
        </div>
      </div>
    </Modal>
  );
};
