import React, { useState } from 'react';
import { User } from './types';
import { StorageService } from './services/storage';
import { Navbar } from './components/Navbar';
import { RoleSwitcher } from './components/RoleSwitcher';
import { Toast, ToastMessage } from './components/Toast';
import { TeacherDashboard } from './views/teacher/TeacherDashboard';
import { PrincipalDashboard } from './views/principal/PrincipalDashboard';
import { SupervisorDashboard } from './views/supervisor/SupervisorDashboard';
import { AdminDashboard } from './views/admin/AdminDashboard';
import { OfficialReportView } from './views/reports/OfficialReportView';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>(() => StorageService.getCurrentUser());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [viewingReportSubId, setViewingReportSubId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleRoleChange = (newUser: User) => {
    setCurrentUser(newUser);
    setActiveTab('dashboard');
    setViewingReportSubId(null);
    showToast(`Beralih ke peran: ${newUser.name} (${newUser.role.replace('_', ' ').toUpperCase()})`, 'info');
  };

  const handleDataReset = () => {
    const resetUser = StorageService.getCurrentUser();
    setCurrentUser(resetUser);
    setActiveTab('dashboard');
    setViewingReportSubId(null);
    showToast('Seluruh data simulasi SIPENA PAI telah dikembalikan ke kondisi awal!', 'success');
  };

  return (
    <div className="app-container">
      {/* Simulation RBAC Switcher Banner */}
      <RoleSwitcher
        currentUser={currentUser}
        onUserChange={handleRoleChange}
        onDataReset={handleDataReset}
      />

      {/* Main Navbar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        onTabChange={tab => {
          setActiveTab(tab);
          setViewingReportSubId(null);
        }}
        onShowToast={showToast}
      />

      {/* Main Body Content based on RBAC & Active Tab */}
      <main className="main-content">
        {currentUser.role === 'guru' && (
          <TeacherDashboard
            currentUser={currentUser}
            onOpenReport={subId => setViewingReportSubId(subId)}
            onShowToast={showToast}
          />
        )}

        {currentUser.role === 'kepala_sekolah' && (
          <PrincipalDashboard
            currentUser={currentUser}
            onOpenReport={subId => setViewingReportSubId(subId)}
            onShowToast={showToast}
          />
        )}

        {currentUser.role === 'pengawas' && (
          <SupervisorDashboard
            currentUser={currentUser}
            onOpenReport={subId => setViewingReportSubId(subId)}
            onShowToast={showToast}
          />
        )}

        {currentUser.role === 'admin' && (
          <AdminDashboard
            currentUser={currentUser}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Official Report & PDF Export View */}
      {viewingReportSubId && (
        <OfficialReportView
          submissionId={viewingReportSubId}
          onClose={() => setViewingReportSubId(null)}
          onShowToast={showToast}
        />
      )}

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--color-border)',
          backgroundColor: '#FFFFFF',
          padding: '24px var(--space-lg)',
          marginTop: 'auto',
          fontSize: '13px',
          color: 'var(--color-muted-foreground)'
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          <div>
            <strong>SIPENA PAI</strong> — Sistem Informasi Penilaian dan Evaluasi Supervisi Pembelajaran PAI
            <div style={{ fontSize: '12px', marginTop: '2px' }}>
              Berdasarkan PRD & SRS Kementerian Agama & Kemendikbudristek 2026/2027
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
            <span>Versi MVP 1.0.0</span>
            <span>•</span>
            <span>Style: ui-ux-pro-max (Minimalism & Swiss Style)</span>
            <span>•</span>
            <span>RBAC & Audit Trail Aktif</span>
          </div>
        </div>
      </footer>

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};
export default App;
