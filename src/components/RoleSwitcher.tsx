import React from 'react';
import { User, UserRole } from '../types';
import { initialUsers } from '../data/initialData';
import { StorageService } from '../services/storage';
import {
  GraduationCap,
  Award,
  Compass,
  ShieldCheck,
  RefreshCw,
  RotateCcw
} from 'lucide-react';

interface RoleSwitcherProps {
  currentUser: User;
  onUserChange: (user: User) => void;
  onDataReset: () => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentUser,
  onUserChange,
  onDataReset
}) => {
  const users = StorageService.getUsers();

  const handleSelectRole = (role: UserRole) => {
    const targetUser = users.find(u => u.role === role) || initialUsers.find(u => u.role === role);
    if (targetUser) {
      StorageService.setCurrentUser(targetUser);
      onUserChange(targetUser);
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'guru':
        return <GraduationCap size={15} />;
      case 'kepala_sekolah':
        return <Award size={15} />;
      case 'pengawas':
        return <Compass size={15} />;
      case 'admin':
        return <ShieldCheck size={15} />;
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'guru':
        return 'Guru PAI';
      case 'kepala_sekolah':
        return 'Kepala Sekolah';
      case 'pengawas':
        return 'Pengawas Sekolah';
      case 'admin':
        return 'Administrator';
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#0F172A',
        color: '#F8FAFC',
        padding: '8px 16px',
        fontSize: '13px',
        borderBottom: '1px solid #334155',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        zIndex: 100
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: '#1E293B',
            color: '#94A3B8',
            padding: '3px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.5px'
          }}
        >
          <RefreshCw size={12} /> MODE SIMULASI RBAC
        </span>
        <span style={{ color: '#CBD5E1' }}>
          Beralih Peran Pengguna untuk Menguji Alur Kerja:
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        {(['guru', 'kepala_sekolah', 'pengawas', 'admin'] as UserRole[]).map(role => {
          const isSelected = currentUser.role === role;
          return (
            <button
              key={role}
              type="button"
              onClick={() => handleSelectRole(role)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                border: isSelected ? '1px solid #38BDF8' : '1px solid #334155',
                backgroundColor: isSelected ? '#1E3A8A' : '#1E293B',
                color: isSelected ? '#FFFFFF' : '#94A3B8',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
              title={`Masuk sebagai ${getRoleLabel(role)}`}
            >
              {getRoleIcon(role)}
              <span>{getRoleLabel(role)}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset semua data demo ke kondisi awal?')) {
              StorageService.resetAll();
              onDataReset();
            }
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 10px',
            borderRadius: '6px',
            fontSize: '12px',
            border: '1px solid #475569',
            backgroundColor: 'transparent',
            color: '#94A3B8',
            cursor: 'pointer',
            marginLeft: '6px'
          }}
          title="Kembalikan data pengujian ke awal"
        >
          <RotateCcw size={12} />
          <span>Reset Data</span>
        </button>
      </div>
    </div>
  );
};
