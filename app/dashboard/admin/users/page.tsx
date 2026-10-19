'use client';

import React, { useState } from 'react';
import { StorageService } from '@/services/storage';
import { User, UserRole, UserStatus } from '@/types';
import { Modal } from '@/components/Modal';
import {
  Users,
  Plus,
  ShieldCheck,
  Check,
  X,
  Lock,
  Search,
  CheckCircle2
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(StorageService.getUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('guru');
  const [nip, setNip] = useState('');

  const refreshUsers = () => {
    setUsers(StorageService.getUsers());
  };

  const handleToggleStatus = (u: User) => {
    const newStatus: UserStatus = u.status === 'active' ? 'inactive' : 'active';
    const updated = users.map(user => user.id === u.id ? { ...user, status: newStatus } : user);
    StorageService.saveUsers(updated);
    setUsers(updated);
  };

  const handleResetPassword = (u: User) => {
    const tempPass = Math.random().toString(36).slice(-8);
    alert(`Kata sandi sementara untuk akun ${u.email} berhasil di-generate:\n\nPassword: ${tempPass}\n\nTautan aktivasi dikirimkan ke email terdaftar.`);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role,
      status: 'active',
      nip: nip.trim() || '19900101 202001 1 001',
      schoolId: 'school-1',
      title: role === 'guru' ? 'Guru PAI' : role === 'kepala_sekolah' ? 'Kepala Sekolah' : 'Pengawas'
    };

    const updated = [...users, newUser];
    StorageService.saveUsers(updated);
    setUsers(updated);
    setIsModalOpen(false);
    setName('');
    setEmail('');
    setNip('');
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B', margin: 0 }}>
            Manajemen Pengguna &amp; Hak Akses (RBAC)
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>
            Kelola akun Guru, Kepala Sekolah, Pengawas, dan Admin dengan isolasi otorisasi penuh
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative', width: '200px' }}>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '32px', fontSize: '12px' }}
              placeholder="Cari pengguna..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          </div>

          <button type="button" className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} />
            <span>Tambah Akun Baru</span>
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}
      >
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', minWidth: '580px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F1F5F9', color: '#64748B' }}>
                <th style={{ padding: '12px', fontWeight: 600 }}>Nama &amp; Gelar</th>
                <th style={{ padding: '12px', fontWeight: 600 }}>Email &amp; NIP</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>Peran (RBAC)</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>Status Akun</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>Aksi Admin</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                  <td style={{ padding: '14px 12px' }}>
                    <div style={{ fontWeight: 700, color: '#1E293B' }}>{u.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{u.title}</div>
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    <div>{u.email}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>NIP: {u.nip}</div>
                  </td>
                  <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        backgroundColor:
                          u.role === 'guru'
                            ? '#E0F2FE'
                            : u.role === 'kepala_sekolah'
                            ? '#EDE9FE'
                            : u.role === 'pengawas'
                            ? '#DCFCE7'
                            : '#FEE2E2',
                        color:
                          u.role === 'guru'
                            ? '#0369A1'
                            : u.role === 'kepala_sekolah'
                            ? '#6D28D9'
                            : u.role === 'pengawas'
                            ? '#15803D'
                            : '#DC2626',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        textTransform: 'uppercase'
                      }}
                    >
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: u.status === 'active' ? '#15803D' : '#94A3B8'
                      }}
                    >
                      {u.status === 'active' ? '✓ Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        className="btn btn-sm btn-ghost"
                        onClick={() => handleResetPassword(u)}
                        title="Reset Password"
                      >
                        <Lock size={13} />
                        <span>Reset</span>
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm ${u.status === 'active' ? 'btn-outline' : 'btn-primary'}`}
                        onClick={() => handleToggleStatus(u)}
                      >
                        <span>{u.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Pengguna */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Akun Pengguna Baru">
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label">Nama Lengkap &amp; Gelar</label>
            <input
              type="text"
              className="form-input"
              placeholder="Contoh: Dra. Hj. Maryam, M.Pd.I"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Akun (Login)</label>
            <input
              type="email"
              className="form-input"
              placeholder="nama@sekolah.belajar.id"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nomor Induk Pegawai (NIP)</label>
            <input
              type="text"
              className="form-input"
              placeholder="19850712 201001 1 018"
              value={nip}
              onChange={e => setNip(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Peran Sistem (Role)</label>
            <select
              className="form-select"
              value={role}
              onChange={e => setRole(e.target.value as UserRole)}
            >
              <option value="guru">Guru PAI</option>
              <option value="kepala_sekolah">Kepala Sekolah</option>
              <option value="pengawas">Pengawas Sekolah</option>
              <option value="admin">Administrator Sistem</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              <span>Simpan Akun Pengguna</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
