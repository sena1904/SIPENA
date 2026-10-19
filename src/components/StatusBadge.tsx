import React from 'react';
import { SubmissionStatus } from '../types';
import {
  FileText,
  Clock,
  AlertCircle,
  FileSearch,
  CheckCircle2,
  Share2,
  Eye,
  ArrowRightCircle,
  CheckCheck
} from 'lucide-react';

interface StatusBadgeProps {
  status: SubmissionStatus;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showIcon = true }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'Draf':
        return {
          className: 'draf',
          icon: <FileText size={13} aria-hidden="true" />,
          label: 'Draf Guru'
        };
      case 'Menunggu Verifikasi':
        return {
          className: 'menunggu-verifikasi',
          icon: <Clock size={13} aria-hidden="true" />,
          label: 'Menunggu Verifikasi KS'
        };
      case 'Perlu Revisi':
        return {
          className: 'perlu-revisi',
          icon: <AlertCircle size={13} aria-hidden="true" />,
          label: 'Perlu Revisi'
        };
      case 'Dalam Penilaian':
        return {
          className: 'dalam-penilaian',
          icon: <FileSearch size={13} aria-hidden="true" />,
          label: 'Dalam Penilaian KS'
        };
      case 'Menunggu Pengesahan':
        return {
          className: 'menunggu-pengesahan',
          icon: <CheckCircle2 size={13} aria-hidden="true" />,
          label: 'Menunggu Pengesahan'
        };
      case 'Diproses untuk Publikasi':
        return {
          className: 'diproses-untuk-publikasi',
          icon: <Share2 size={13} aria-hidden="true" />,
          label: 'Sinkronisasi Publikasi'
        };
      case 'Tersedia bagi Pengawas':
        return {
          className: 'tersedia-bagi-pengawas',
          icon: <CheckCheck size={13} aria-hidden="true" />,
          label: 'Tersedia bagi Pengawas'
        };
      case 'Ditinjau Pengawas':
        return {
          className: 'ditinjau-pengawas',
          icon: <Eye size={13} aria-hidden="true" />,
          label: 'Ditinjau Pengawas'
        };
      case 'Tindak Lanjut':
        return {
          className: 'tindak-lanjut',
          icon: <ArrowRightCircle size={13} aria-hidden="true" />,
          label: 'Proses Tindak Lanjut'
        };
      default:
        return {
          className: 'draf',
          icon: <FileText size={13} aria-hidden="true" />,
          label: status
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={`status-badge ${config.className}`}
      role="status"
      aria-label={`Status laporan: ${config.label}`}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};
