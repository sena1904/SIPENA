import React from 'react';
import { SubmissionStatus } from '../types';
import { Check, AlertCircle } from 'lucide-react';

interface StepperProps {
  currentStatus: SubmissionStatus;
}

export const Stepper: React.FC<StepperProps> = ({ currentStatus }) => {
  // Main sequence steps
  const steps: { key: SubmissionStatus; label: string }[] = [
    { key: 'Draf', label: '1. Draf' },
    { key: 'Menunggu Verifikasi', label: '2. Verifikasi KS' },
    { key: 'Dalam Penilaian', label: '3. Penilaian KS' },
    { key: 'Diproses untuk Publikasi', label: '4. Publikasi & Sinkron' },
    { key: 'Tersedia bagi Pengawas', label: '5. Siap Pengawas' },
    { key: 'Tindak Lanjut', label: '6. Tindak Lanjut' }
  ];

  const getStepIndex = (status: SubmissionStatus): number => {
    switch (status) {
      case 'Draf':
        return 0;
      case 'Menunggu Verifikasi':
        return 1;
      case 'Perlu Revisi':
        return 1; // loop state
      case 'Dalam Penilaian':
      case 'Menunggu Pengesahan':
        return 2;
      case 'Diproses untuk Publikasi':
        return 3;
      case 'Tersedia bagi Pengawas':
        return 4;
      case 'Ditinjau Pengawas':
        return 4;
      case 'Tindak Lanjut':
        return 5;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);
  const isRevision = currentStatus === 'Perlu Revisi';

  const progressPercent = (currentIndex / (steps.length - 1)) * 100;

  return (
    <div style={{ margin: '16px 0 24px' }}>
      {isRevision && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            backgroundColor: 'var(--color-destructive-light)',
            color: 'var(--color-destructive)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px',
            fontSize: '13px',
            fontWeight: 600
          }}
        >
          <AlertCircle size={16} />
          <span>Pengajuan ini dikembalikan oleh Kepala Sekolah untuk perbaikan dokumen/bukti pembelajaran.</span>
        </div>
      )}

      <div className="stepper-container">
        <div className="stepper-line" />
        <div className="stepper-progress" style={{ width: `${progressPercent}%` }} />

        {steps.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isActive = idx === currentIndex;

          return (
            <div
              key={step.key}
              className={`stepper-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
            >
              <div className="stepper-dot">
                {isCompleted ? <Check size={16} strokeWidth={3} /> : idx + 1}
              </div>
              <span className="stepper-label">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
