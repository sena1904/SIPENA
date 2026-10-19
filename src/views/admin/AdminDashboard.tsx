import React, { useState } from 'react';
import {
  User,
  UserStatus,
  School,
  AssessmentTemplate,
  UserRole
} from '../../types';
import { StorageService } from '../../services/storage';
import { Modal } from '../../components/Modal';
import { TemplateManagement } from '../../components/admin/TemplateManagement';
import {
  ShieldCheck,
  Users,
  Layers,
  RotateCw,
  Plus,
  Trash2,
  Lock,
  Search,
  Check,
  X,
  Info,
  Eye,
  EyeOff
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: User;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'templates'>('users');

  const [users, setUsers] = useState<User[]>(StorageService.getUsers());
  const [templates, setTemplates] = useState<AssessmentTemplate[]>(StorageService.getTemplates());

  // User modal
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [showUserPassword, setShowUserPassword] = useState(false);
  const [newUserRole, setNewUserRole] = useState<UserRole>('guru');
  const [newUserNip, setNewUserNip] = useState('');

  const resetUserForm = () => {
    setIsUserModalOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('');
    setShowUserPassword(false);
    setNewUserNip('');
  };

  const refreshAll = () => {
    setUsers(StorageService.getUsers());
    setTemplates(StorageService.getTemplates());
  };

  // Toggle user active / inactive (SRS-F-1.5)
  const handleToggleUserStatus = (user: User) => {
    const newStatus: UserStatus = user.status === 'active' ? 'inactive' : 'active';
    const updated: User[] = users.map(u => (u.id === user.id ? { ...u, status: newStatus } : u));
    StorageService.saveUsers(updated);
    setUsers(updated);

    StorageService.addAuditLog({
      entityType: 'user',
      entityId: user.id,
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: 'admin',
      action: newStatus === 'active' ? 'ACTIVATE_USER' : 'DEACTIVATE_USER',
      oldValue: `Status: ${user.status}`,
      newValue: `Status: ${newStatus}`
    });

    onShowToast(`Status akun ${user.name} berhasil diubah menjadi ${newStatus}.`, 'info');
  };

  // Reset user password (SRS-F-1.6)
  const handleResetUserPassword = (user: User) => {
    const tempPass = Math.random().toString(36).slice(-8);
    alert(`Kata sandi sementara untuk akun ${user.email} berhasil di-generate:\n\nPassword: ${tempPass}\n\nTautan aktivasi dikirimkan ke email terdaftar.`);

    StorageService.addAuditLog({
      entityType: 'user',
      entityId: user.id,
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: 'admin',
      action: 'RESET_USER_PASSWORD',
      newValue: `Reset password requested for ${user.email}`
    });

    onShowToast(`Kredensial sementara untuk ${user.name} berhasil dibuat.`, 'success');
  };

  // Create new user (SRS-F-1.4)
  const handleCreateUser = () => {
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword.trim()) {
      alert('Nama, Email, dan Kata Sandi wajib diisi!');
      return;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      password: newUserPassword.trim(),
      role: newUserRole,
      status: 'active',
      nip: newUserNip.trim() || '19900101 202001 1 001',
      schoolId: 'school-1',
      title: newUserRole === 'guru' ? 'Guru PAI' : newUserRole === 'kepala_sekolah' ? 'Kepala Sekolah' : newUserRole === 'pengawas' ? 'Pengawas' : 'Administrator Sistem'
    };

    const updated = [...users, newUser];
    StorageService.saveUsers(updated);
    setUsers(updated);

    StorageService.addAuditLog({
      entityType: 'user',
      entityId: newUser.id,
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: 'admin',
      action: 'CREATE_USER',
      newValue: `User ${newUser.name} (${newUser.role}) created with email ${newUser.email}`
    });

    onShowToast(`Pengguna baru ${newUser.name} (${newUser.role}) berhasil ditambahkan!`, 'success');
    resetUserForm();
  };



  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* =========================================================================
          ROW 1: TWO SOFT TINTED STAT CARDS (Users & Assessment Templates)
         ========================================================================= */}
      <div className="dashboard-equal-two-col">
        {/* Card 1: Pengguna Aktif - Soft Blue Tint */}
        <div
          onClick={() => setActiveTab('users')}
          style={{
            backgroundColor: '#EEF5FF',
            border: '1px solid #DCE9FE',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '140px',
            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.04)',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '38px', fontWeight: 800, color: '#1D4ED8', lineHeight: 1 }}>
              {users.filter(u => u.status === 'active').length}
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
              <Users size={20} />
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#1E3A8A' }}>Pengguna Aktif</div>
            <div style={{ fontSize: '12px', color: '#60A5FA' }}>(total {users.length} akun terdaftar)</div>
          </div>
        </div>

        {/* Card 2: Templat Instrumen - Soft Green Tint */}
        <div
          onClick={() => setActiveTab('templates')}
          style={{
            backgroundColor: '#EDFDF4',
            border: '1px solid #D1F8E1',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '140px',
            boxShadow: '0 2px 6px rgba(22, 163, 74, 0.04)',
            cursor: 'pointer',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '38px', fontWeight: 800, color: '#15803D', lineHeight: 1 }}>
              {templates.length}
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
              <Layers size={20} />
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#14532D' }}>Instrumen Penilaian</div>
            <div style={{ fontSize: '12px', color: '#15803D', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              ({StorageService.getActiveTemplate()?.version || 'v2.1 Kurikulum Merdeka'})
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ROW 2: TWO COLUMNS (Admin Management & Aksi Cepat Buttons)
         ========================================================================= */}
      <div className="dashboard-two-col">
        {/* Left Column: Admin Tabs & Tables Card */}
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
          {/* Admin Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              marginBottom: '20px',
              borderBottom: '1px solid #F1F5F9',
              paddingBottom: '12px',
              flexWrap: 'wrap'
            }}
          >
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'users' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={16} />
          <span>Manajemen Pengguna ({users.length})</span>
        </button>

        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'templates' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('templates')}
        >
          <Layers size={16} />
          <span>Instrumen & Versioning ({templates.length})</span>
        </button>
      </div>

      {/* TAB 1: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Users size={20} color="var(--color-primary)" />
              <span>Daftar Akun Pengguna & Hak Akses (RBAC)</span>
            </div>

            <button
              type="button"
              className="btn btn-sm btn-accent"
              onClick={() => setIsUserModalOpen(true)}
            >
              <Plus size={15} />
              <span>Tambah Akun Baru</span>
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nama & Gelar</th>
                  <th>Email & NIP</th>
                  <th>Peran Sistem</th>
                  <th>Status Akun</th>
                  <th>Aksi Admin</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--color-foreground)' }}>{u.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-muted-foreground)' }}>{u.title}</div>
                    </td>
                    <td>
                      <div>{u.email}</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>NIP: {u.nip || '-'}</div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '11px',
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
                    <td>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: u.status === 'active' ? '#15803D' : '#DC2626'
                        }}
                      >
                        {u.status === 'active' ? <Check size={14} /> : <X size={14} />}
                        <span>{u.status === 'active' ? 'Aktif' : 'Nonaktif'}</span>
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline"
                          onClick={() => handleResetUserPassword(u)}
                          title="Reset kata sandi pengguna"
                        >
                          <Lock size={13} />
                          <span>Reset Akses</span>
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm ${u.status === 'active' ? 'btn-ghost' : 'btn-accent'}`}
                          onClick={() => handleToggleUserStatus(u)}
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
      )}

      {/* TAB 2: TEMPLATE VERSIONING & FULL CRUD (SRS-F-4.1) */}
      {activeTab === 'templates' && (
        <TemplateManagement
          currentUser={currentUser}
          onShowToast={(msg, type) => {
            onShowToast(msg, type);
            refreshAll();
          }}
        />
      )}

        </div>

        {/* Right Column: Aksi Cepat Card */}
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
            {/* Button 1: Tambah Pengguna Baru */}
            <button
              type="button"
              onClick={() => setIsUserModalOpen(true)}
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
              <Plus size={18} color="#2563EB" />
              <span>Tambah Pengguna Baru</span>
            </button>

            {/* Button 2: Kelola Templat Instrumen */}
            <button
              type="button"
              onClick={() => setActiveTab('templates')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 18px',
                borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                backgroundColor: activeTab === 'templates' ? '#EFF6FF' : '#FFFFFF',
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
                e.currentTarget.style.backgroundColor = activeTab === 'templates' ? '#EFF6FF' : '#FFFFFF';
              }}
            >
              <Layers size={18} color="#059669" />
              <span>Kelola Templat Instrumen</span>
            </button>

            {/* Button 3: Segarkan Data */}
            <button
              type="button"
              onClick={() => {
                refreshAll();
                onShowToast('Data pengguna dan templat berhasil disegarkan.', 'info');
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
              <RotateCw size={18} color="#7C3AED" />
              <span>Segarkan Data</span>
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
            Sistem SIPENA PAI beroperasi dengan isolasi penuh peran (RBAC) dan kepatuhan jejak audit NFR-09/NFR-10. Semua aktivitas autentikasi, modifikasi nilai, dan perubahan hak akses pengguna dicatat secara permanen dalam Audit Log.
          </p>
        </div>
      </div>

      {/* Modal Add User */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={resetUserForm}
        title="Tambah Akun Pengguna Baru"
        footer={
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', width: '100%' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={resetUserForm}
            >
              Batal
            </button>
            <button
              type="button"
              className="btn btn-accent"
              onClick={handleCreateUser}
            >
              <Check size={16} />
              <span>Simpan Akun</span>
            </button>
          </div>
        }
      >
        <div>
          <div className="form-group">
            <label className="form-label">
              Nama Lengkap & Gelar <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={newUserName}
              onChange={e => setNewUserName(e.target.value)}
              placeholder="Contoh: Dra. Hj. Maryam, M.Pd.I"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Alamat Email (Login) <span className="required">*</span>
            </label>
            <input
              type="email"
              className="form-input"
              value={newUserEmail}
              onChange={e => setNewUserEmail(e.target.value)}
              placeholder="nama@sekolah.belajar.id"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Kata Sandi (Password) <span className="required">*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showUserPassword ? 'text' : 'password'}
                className="form-input"
                value={newUserPassword}
                onChange={e => setNewUserPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowUserPassword(!showUserPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px'
                }}
                title={showUserPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showUserPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <span style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', display: 'block' }}>
              Kata sandi awal untuk akses login pengguna baru
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Nomor Induk Pegawai (NIP)</label>
            <input
              type="text"
              className="form-input"
              value={newUserNip}
              onChange={e => setNewUserNip(e.target.value)}
              placeholder="19800101 200501 2 001"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Peran Pengguna (Role RBAC)</label>
            <select
              className="form-select"
              value={newUserRole}
              onChange={e => setNewUserRole(e.target.value as UserRole)}
            >
              <option value="guru">Guru PAI</option>
              <option value="kepala_sekolah">Kepala Sekolah</option>
              <option value="pengawas">Pengawas Sekolah</option>
              <option value="admin">Administrator Sistem</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};
