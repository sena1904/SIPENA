import React from 'react';
import { User } from '../types';
import { CsvExportService } from '../services/csvExport';
import {
  FileSpreadsheet,
  GraduationCap,
  School as SchoolIcon,
  User as UserIcon,
  Shield,
  Award,
  Compass,
  Download
} from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'info') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  onTabChange,
  onShowToast
}) => {
  const getRoleBadge = () => {
    switch (currentUser.role) {
      case 'guru':
        return {
          label: 'GURU PAI',
          color: '#0284C7',
          bgColor: '#E0F2FE',
          icon: <GraduationCap size={14} />
        };
      case 'kepala_sekolah':
        return {
          label: 'KEPALA SEKOLAH',
          color: '#7C3AED',
          bgColor: '#EDE9FE',
          icon: <Award size={14} />
        };
      case 'pengawas':
        return {
          label: 'PENGAWAS SEKOLAH',
          color: '#059669',
          bgColor: '#D1FAE5',
          icon: <Compass size={14} />
        };
      case 'admin':
        return {
          label: 'ADMINISTRATOR',
          color: '#DC2626',
          bgColor: '#FEE2E2',
          icon: <Shield size={14} />
        };
    }
  };

  const badge = getRoleBadge();

  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 var(--space-lg)',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        {/* Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <GraduationCap size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  letterSpacing: '-0.5px'
                }}
              >
                SIPENA PAI
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: 'var(--color-accent-light)',
                  color: 'var(--color-accent)',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}
              >
                Kemenag 2026
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-muted-foreground)' }}>
              Sistem Penilaian & Supervisi Pembelajaran PAI
            </div>
          </div>
        </div>

        {/* Center / Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => onTabChange('dashboard')}
          >
            Dashboard
          </button>

          {currentUser.role === 'admin' && (
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'templates' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => onTabChange('templates')}
            >
              Instrumen Penilaian
            </button>
          )}

          {/* Independent CSV Export Button per SRS-F-6.6 */}
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={() => {
              CsvExportService.exportSupervisionSummary();
              onShowToast('Rekap supervisi berhasil diekspor ke file CSV independen', 'success');
            }}
            title="Ekspor CSV Independen (NFR-13 / SRS-F-6.6)"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} />
            <span style={{ display: 'inline' }}>Ekspor CSV</span>
          </button>
        </nav>

        {/* Right User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--color-foreground)',
                lineHeight: 1.2
              }}
            >
              {currentUser.name}
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 700,
                color: badge.color,
                backgroundColor: badge.bgColor,
                padding: '2px 8px',
                borderRadius: '999px',
                marginTop: '3px'
              }}
            >
              {badge.icon}
              {badge.label}
            </div>
          </div>

          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-muted)',
              border: `2px solid ${badge.color}`,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)',
              fontWeight: 700,
              fontSize: '14px'
            }}
            title={`${currentUser.name} (${badge.label})`}
          >
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <UserIcon size={20} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
