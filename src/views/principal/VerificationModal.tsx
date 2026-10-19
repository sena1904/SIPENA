import React, { useState } from 'react';
import { Submission, SubmissionDocument, User } from '../../types';
import { StorageService } from '../../services/storage';
import { Modal } from '../../components/Modal';
import {
  FileCheck2,
  AlertCircle,
  FileText,
  ExternalLink,
  CheckCircle,
  XCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: Submission | null;
  currentUser: User;
  onVerified: (updatedSub: Submission) => void;
  onRevisionRequested: (updatedSub: Submission) => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  submission,
  currentUser,
  onVerified,
  onRevisionRequested
}) => {
  const [revisionNotes, setRevisionNotes] = useState('');
  const [showRevisionForm, setShowRevisionForm] = useState(false);

  if (!submission) return null;

  const docs: SubmissionDocument[] = StorageService.getDocumentsBySubmissionId(submission.id);

  const handleApproveVerification = () => {
    const updatedSub: Submission = {
      ...submission,
      status: 'Dalam Penilaian',
      verifiedAt: new Date().toISOString(),
      verifiedBy: currentUser.name,
      updatedAt: new Date().toISOString()
    };

    StorageService.updateSubmission(updatedSub);

    StorageService.addAuditLog({
      entityType: 'submission',
      entityId: submission.id,
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: 'kepala_sekolah',
      action: 'VERIFY_DOCUMENTS_APPROVED',
      oldValue: 'Status: Menunggu Verifikasi',
      newValue: 'Status: Dalam Penilaian (Diverifikasi oleh Kepala Sekolah)'
    });

    onVerified(updatedSub);
    onClose();
  };

  const handleSubmitRevision = () => {
    if (!revisionNotes.trim()) {
      alert('Catatan revisi wajib diisi agar guru memahami bagian yang perlu diperbaiki!');
      return;
    }

    const updatedSub: Submission = {
      ...submission,
      status: 'Perlu Revisi',
      revisionNotes: revisionNotes.trim(),
      revisionDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    StorageService.updateSubmission(updatedSub);

    StorageService.addAuditLog({
      entityType: 'submission',
      entityId: submission.id,
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: 'kepala_sekolah',
      action: 'REQUEST_REVISION',
      oldValue: 'Status: Menunggu Verifikasi',
      newValue: `Status: Perlu Revisi | Catatan: "${revisionNotes.trim()}"`
    });

    onRevisionRequested(updatedSub);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileCheck2 size={20} color="var(--color-primary)" />
          <span>Verifikasi Kelengkapan Dokumen & Bukti Pembelajaran</span>
        </div>
      }
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
          >
            Tutup
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            {!showRevisionForm ? (
              <>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setShowRevisionForm(true)}
                >
                  <XCircle size={16} />
                  <span>Kembalikan untuk Revisi</span>
                </button>
                <button
                  type="button"
                  className="btn btn-accent"
                  onClick={handleApproveVerification}
                >
                  <CheckCircle size={16} />
                  <span>Verifikasi Lengkap & Lanjut ke Penilaian</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowRevisionForm(false)}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleSubmitRevision}
                >
                  <ArrowRight size={16} />
                  <span>Kirim Catatan Revisi ke Guru</span>
                </button>
              </>
            )}
          </div>
        </div>
      }
    >
      <div>
        {/* Identitas Guru & Pembelajaran */}
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
                Guru Pengampu:
              </span>
              <strong style={{ fontSize: '14px', color: 'var(--color-foreground)' }}>
                {submission.teacherName}
              </strong>
              <div style={{ fontSize: '11px', color: '#64748B' }}>NIP: {submission.teacherNip}</div>
            </div>

            <div>
              <span style={{ fontSize: '12px', color: 'var(--color-muted-foreground)', display: 'block' }}>
                Mata Pelajaran & Kelas:
              </span>
              <strong style={{ fontSize: '14px', color: 'var(--color-foreground)' }}>
                {submission.subject}
              </strong>
              <div style={{ fontSize: '12px', color: '#64748B' }}>{submission.grade}</div>
            </div>

            <div>
              <span style={{ fontSize: '12px', color: 'var(--color-muted-foreground)', display: 'block' }}>
                Rencana Pelaksanaan:
              </span>
              <strong style={{ fontSize: '14px', color: 'var(--color-foreground)' }}>
                {new Date(submission.executionDate).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </strong>
              <div style={{ fontSize: '12px', color: '#64748B' }}>
                {submission.academicYear} • Semester {submission.semester}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-muted-foreground)', display: 'block' }}>
              Materi Pokok & Tujuan Pembelajaran:
            </span>
            <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-primary)', marginTop: '2px' }}>
              {submission.topic}
            </div>
            <p style={{ fontSize: '13px', color: '#334155', marginTop: '4px', lineHeight: 1.5 }}>
              {submission.learningObjectives}
            </p>
          </div>
        </div>

        {/* Status Isian Data Instrumen Guru */}
        <div
          style={{
            backgroundColor: submission.teacherInstrumentData && Object.keys(submission.teacherInstrumentData).length > 0 ? '#F0FDF4' : '#FFFBEB',
            border: submission.teacherInstrumentData && Object.keys(submission.teacherInstrumentData).length > 0 ? '1px solid #BBF7D0' : '1px solid #FDE68A',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle
              size={18}
              color={submission.teacherInstrumentData && Object.keys(submission.teacherInstrumentData).length > 0 ? '#16A34A' : '#D97706'}
            />
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: '13px',
                  color: submission.teacherInstrumentData && Object.keys(submission.teacherInstrumentData).length > 0 ? '#15803D' : '#B45309'
                }}
              >
                Data Instrumen Pembelajaran dari Guru
              </div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>
                {submission.teacherInstrumentData && Object.keys(submission.teacherInstrumentData).length > 0
                  ? `Guru telah mengisikan data keterlaksanaan & bukti pada ${Object.keys(submission.teacherInstrumentData).length} butir indikator instrumen.`
                  : 'Guru belum melengkapi deskripsi data instrumen rinci.'}
              </div>
            </div>
          </div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: submission.teacherInstrumentData && Object.keys(submission.teacherInstrumentData).length > 0 ? '#DCFCE7' : '#FEF3C7',
              color: submission.teacherInstrumentData && Object.keys(submission.teacherInstrumentData).length > 0 ? '#15803D' : '#B45309',
              padding: '3px 8px',
              borderRadius: '4px'
            }}
          >
            {submission.teacherInstrumentData && Object.keys(submission.teacherInstrumentData).length > 0
              ? `${Object.keys(submission.teacherInstrumentData).length} Butir Terisi`
              : 'Draf'}
          </span>
        </div>

        {/* Daftar Dokumen Unggahan Guru */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px', color: 'var(--color-foreground)' }}>
            Berkas Administrasi yang Diunggah ({docs.length} Berkas)
          </h4>

          {docs.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#DC2626', backgroundColor: '#FEF2F2', borderRadius: '8px' }}>
              <AlertCircle size={20} style={{ margin: '0 auto 6px' }} />
              <div>Guru belum mengunggah dokumen administrasi apapun!</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {docs.map(doc => (
                <div
                  key={doc.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '6px',
                        backgroundColor: '#EFF6FF',
                        color: 'var(--color-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <FileText size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--color-foreground)' }}>
                        {doc.fileName}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-muted-foreground)' }}>
                        Jenis: {doc.type.replace('_', ' ').toUpperCase()} • Ukuran: {(doc.fileSize / 1024 / 1024).toFixed(2)} MB • Diunggah: {new Date(doc.uploadedAt).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                  </div>

                  <a
                    href={doc.storageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-outline"
                    style={{ fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    onClick={e => {
                      e.preventDefault();
                      alert(`Membuka berkas pratinjau: ${doc.fileName}`);
                    }}
                  >
                    <ExternalLink size={13} />
                    <span>Pratinjau</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Catatan Revisi jika tombol Revisi ditekan */}
        {showRevisionForm && (
          <div
            style={{
              padding: '16px',
              backgroundColor: '#FEF2F2',
              border: '1.5px solid #F87171',
              borderRadius: 'var(--radius-md)',
              animation: 'modalEnter 150ms ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#991B1B', fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>
              <AlertCircle size={18} />
              <span>Instruksi Catatan Revisi untuk Guru (Wajib Diisi):</span>
            </div>
            <textarea
              className="form-textarea"
              rows={4}
              style={{ backgroundColor: '#FFFFFF' }}
              value={revisionNotes}
              onChange={e => setRevisionNotes(e.target.value)}
              placeholder="Contoh: Modul Ajar belum menyertakan rubrik asesmen formatif kognitif. Mohon unggah instrumen asesmen dan perjelas langkah diferensiasi proses pada kegiatan inti..."
              autoFocus
            />
            <div style={{ fontSize: '12px', color: '#B91C1C', marginTop: '6px' }}>
              * Catatan ini akan langsung diterima oleh guru dan status pengajuan akan berubah menjadi "Perlu Revisi".
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
