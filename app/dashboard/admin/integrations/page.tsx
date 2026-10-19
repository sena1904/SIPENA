'use client';

import React, { useState } from 'react';
import { StorageService } from '@/services/storage';
import { GoogleIntegrationService } from '@/services/googleIntegration';
import { IntegrationLog } from '@/types';
import {
  FileSpreadsheet,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Layers
} from 'lucide-react';

export default function AdminIntegrationsPage() {
  const [logs, setLogs] = useState<IntegrationLog[]>(StorageService.getIntegrationLogs());
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const refreshLogs = () => {
    setLogs(StorageService.getIntegrationLogs());
  };

  const handleRetry = async (logId: string) => {
    setRetryingId(logId);
    try {
      await GoogleIntegrationService.retryIntegration(logId);
      refreshLogs();
    } catch {
      alert('Gagal melakukan retry sinkronisasi');
    } finally {
      setRetryingId(null);
    }
  };

  const handleSimulate = () => {
    const report = StorageService.getReports()[0];
    const sub = StorageService.getSubmissions()[0];
    if (!report || !sub) return;

    const failedLog: IntegrationLog = {
      id: `log-fail-${Date.now()}`,
      reportId: report.id,
      submissionId: sub.id,
      service: 'Google Sheets',
      status: 'Gagal',
      attemptCount: 1,
      message: 'Simulasi kegagalan integrasi Google Sheets (Error 429: Quota Limit Tercapai)',
      payloadSummary: `Data rekap gagal dikirim untuk ${sub.teacherName}`,
      timestamp: new Date().toISOString()
    };
    StorageService.addIntegrationLog(failedLog);
    refreshLogs();
  };

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
            Log Integrasi Sinkronisasi Google Sheets &amp; Drive
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>
            Pantau pengiriman data rekap supervisi otomatis ke Google Sheets dan arsip berkas ke Google Drive (SRS Section 6)
          </p>
        </div>

        <button type="button" className="btn btn-outline" onClick={handleSimulate}>
          <span>+ Simulasi Log Gagal (Uji Resiliensi)</span>
        </button>
      </div>

      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F1F5F9', color: '#64748B' }}>
                <th style={{ padding: '12px', fontWeight: 600 }}>Layanan Target</th>
                <th style={{ padding: '12px', fontWeight: 600 }}>Waktu Sinkronisasi</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>Percobaan</th>
                <th style={{ padding: '12px', fontWeight: 600 }}>Pesan Sistem</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                  <td style={{ padding: '14px 12px' }}>
                    <div style={{ fontWeight: 700, color: '#1E293B' }}>{log.service}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{log.payloadSummary}</div>
                  </td>
                  <td style={{ padding: '14px 12px', color: '#64748B' }}>
                    {new Date(log.timestamp).toLocaleString('id-ID')}
                  </td>
                  <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: log.status === 'Berhasil' ? '#DCFCE7' : '#FEE2E2',
                        color: log.status === 'Berhasil' ? '#15803D' : '#DC2626',
                        padding: '3px 8px',
                        borderRadius: '4px'
                      }}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 12px', textAlign: 'center', fontWeight: 600 }}>
                    {log.attemptCount}x
                  </td>
                  <td style={{ padding: '14px 12px', fontSize: '12px', color: '#475569', maxWidth: '320px' }}>
                    {log.message}
                  </td>
                  <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                    {log.status === 'Gagal' && (
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => handleRetry(log.id)}
                        disabled={retryingId === log.id}
                      >
                        <RotateCw size={13} className={retryingId === log.id ? 'animate-spin' : ''} />
                        <span>Retry</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
