'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@/types';
import { initialUsers } from '@/data/initialData';
import { StorageService } from '@/services/storage';
import { PrincipalDashboard } from '@/views/principal/PrincipalDashboard';
import { OfficialReportView } from '@/views/reports/OfficialReportView';
import { Toast, ToastMessage } from '@/components/Toast';

export default function KepalaSekolahDashboardPage() {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    return initialUsers.find(u => u.role === 'kepala_sekolah') || initialUsers[2];
  });
  const [viewingReportSubId, setViewingReportSubId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const stored = StorageService.getCurrentUser();
    if (stored && stored.role === 'kepala_sekolah') {
      setCurrentUser(stored);
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  return (
    <div>
      <PrincipalDashboard
        currentUser={currentUser}
        onOpenReport={subId => setViewingReportSubId(subId)}
        onShowToast={showToast}
      />

      {viewingReportSubId && (
        <OfficialReportView
          submissionId={viewingReportSubId}
          onClose={() => setViewingReportSubId(null)}
          onShowToast={showToast}
        />
      )}

      <Toast toasts={toasts} onDismiss={id => setToasts(prev => prev.filter(t => t.id !== id))} />
    </div>
  );
}
