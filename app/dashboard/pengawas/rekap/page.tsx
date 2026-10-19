'use client';

import React, { useState } from 'react';
import { StorageService } from '@/services/storage';
import { CsvExportService } from '@/services/csvExport';
import {
  Compass,
  Building,
  Award,
  Download,
  Search,
  Filter,
  CheckCircle2
} from 'lucide-react';

export default function PengawasRekapPage() {
  const schools = StorageService.getSchools();
  const reports = StorageService.getReports();
  const submissions = StorageService.getSubmissions();

  const handleExport = () => {
    CsvExportService.exportSupervisionSummary();
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
            Rekapitulasi Mutu Supervisi Sekolah Binaan
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>
            Pemetaan capaian skor supervisi klinis PAI, akreditasi, dan jumlah guru terbina di seluruh sekolah binaan
          </p>
        </div>

        <button type="button" className="btn btn-primary" onClick={handleExport}>
          <Download size={16} />
          <span>Ekspor Rekap Wilayah (CSV)</span>
        </button>
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
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F1F5F9', color: '#64748B' }}>
                <th style={{ padding: '12px', fontWeight: 600 }}>Nama Sekolah Binaan</th>
                <th style={{ padding: '12px', fontWeight: 600 }}>NPSN</th>
                <th style={{ padding: '12px', fontWeight: 600 }}>Kepala Sekolah</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>Guru PAI</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>Rata-Rata Nilai</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>Status Supervisi</th>
              </tr>
            </thead>
            <tbody>
              {schools.map(sch => (
                <tr key={sch.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                  <td style={{ padding: '14px 12px' }}>
                    <div style={{ fontWeight: 700, color: '#1E293B' }}>{sch.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{sch.address}</div>
                  </td>
                  <td style={{ padding: '14px 12px', color: '#334155', fontWeight: 600 }}>{sch.npsn}</td>
                  <td style={{ padding: '14px 12px', color: '#334155' }}>{sch.headmasterName}</td>
                  <td style={{ padding: '14px 12px', textAlign: 'center', fontWeight: 700 }}>2 Guru</td>
                  <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#15803D' }}>88.5</span>
                  </td>
                  <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#DCFCE7', color: '#15803D', padding: '3px 8px', borderRadius: '4px' }}>
                      Lengkap (100%)
                    </span>
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
