'use client';

import React, { useState, useEffect } from 'react';
import { StorageService } from '@/services/storage';
import { User } from '@/types';
import { initialUsers } from '@/data/initialData';
import { TemplateManagement } from '@/components/admin/TemplateManagement';
import { Toast, ToastMessage } from '@/components/Toast';

export default function AdminTemplatesPage() {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    return initialUsers.find(u => u.role === 'admin') || initialUsers[4];
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const stored = StorageService.getCurrentUser();
    if (stored && stored.role === 'admin') {
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
      <TemplateManagement
        currentUser={currentUser}
        onShowToast={showToast}
      />
      <Toast toasts={toasts} onDismiss={id => setToasts(prev => prev.filter(t => t.id !== id))} />
    </div>
  );
}
