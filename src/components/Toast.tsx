import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`} role="alert">
          {t.type === 'success' && <CheckCircle2 size={18} />}
          {t.type === 'error' && <AlertTriangle size={18} />}
          {t.type === 'info' && <Info size={18} />}
          <span style={{ flex: 1 }}>{t.message}</span>
          <button
            type="button"
            onClick={() => onDismiss(t.id)}
            style={{
              background: 'transparent',
              color: 'inherit',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              padding: '2px'
            }}
            aria-label="Tutup notifikasi"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
