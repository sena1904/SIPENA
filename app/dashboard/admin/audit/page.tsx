'use client';

import React, { useState } from 'react';
import { StorageService } from '@/services/storage';
import { CsvExportService } from '@/services/csvExport';
import {
  History,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function AdminAuditPage() {
  const [logs] = useState(StorageService.getAuditLogs());
  const [searchTerm, setSearchTerm] = useState('');

  const handleExport = () => {
    CsvExportService.exportSupervisionSummary();
  };

  const filtered = logs.filter(l =>
    l.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.newValue || '').toLowerCase().includes(searchTerm.toLowerCase())
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
            Jejak Audit Keamanan Sistem (Audit Trail NFR-10)
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>
            Rekaman permanen seluruh aktivitas autentikasi, pengesahan nilai, verifikasi berkas, dan perubahan data
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative', width: '220px' }}>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '32px', fontSize: '12px' }}
              placeholder="Cari aktor / aksi..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          </div>

          <button type="button" className="btn btn-primary" onClick={handleExport}>
            <Download size={16} />
            <span>Ekspor Jejak Audit (CSV)</span>
          </button>
        </div>
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
                <th style={{ padding: '12px', fontWeight: 600 }}>Waktu &amp; Tanggal</th>
                <th style={{ padding: '12px', fontWeight: 600 }}>Aktor &amp; Peran</th>
                <th style={{ padding: '12px', fontWeight: 600 }}>Aksi Sistem</th>
                <th style={{ padding: '12px', fontWeight: 600 }}>Entitas</th>
                <th style={{ padding: '12px', fontWeight: 600 }}>Perubahan Nilai / Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                  <td style={{ padding: '14px 12px', color: '#64748B', fontSize: '12px', whiteSpace: 'nowrap' }}>
                    {new Date(log.timestamp).toLocaleString('id-ID')}
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    <div style={{ fontWeight: 700, color: '#1E293B' }}>{log.actorName}</div>
                    <span style={{ fontSize: '10px', fontWeight: 700, backgroundColor: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                      {log.actorRole}
                    </span>
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    <code style={{ fontSize: '11px', backgroundColor: '#EEF2FF', color: '#3730A3', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                      {log.action}
                    </code>
                  </td>
                  <td style={{ padding: '14px 12px', color: '#64748B', fontSize: '12px' }}>
                    {log.entityType} ({log.entityId})
                  </td>
                  <td style={{ padding: '14px 12px', fontSize: '12px' }}>
                    {log.oldValue && (
                      <div style={{ color: '#DC2626' }}>
                        <span style={{ fontWeight: 600 }}>Lama:</span> {log.oldValue}
                      </div>
                    )}
                    <div style={{ color: '#16A34A', fontWeight: 500 }}>
                      <span style={{ fontWeight: 600 }}>Baru:</span> {log.newValue}
                    </div>
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
