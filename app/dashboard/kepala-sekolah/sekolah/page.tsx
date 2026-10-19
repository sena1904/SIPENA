'use client';

import React, { useState } from 'react';
import { StorageService } from '@/services/storage';
import {
  Building,
  Users,
  Award,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  FileText
} from 'lucide-react';

export default function KepalaSekolahProfilSekolahPage() {
  const schools = StorageService.getSchools();
  const school = schools[0] || {
    id: 'school-1',
    name: 'SDN 01 Menteng Jakarta Pusat',
    npsn: '20100123',
    address: 'Jl. Besuki No. 4, Menteng, Jakarta Pusat',
    district: 'Menteng',
    level: 'SD' as const,
    headmasterName: 'Drs. H. Suryanto, M.Pd'
  };

  const users = StorageService.getUsers().filter(u => u.role === 'guru');

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
          alignItems: 'center',
          gap: '20px'
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            backgroundColor: '#EEF5FF',
            color: '#1D4ED8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Building size={32} />
        </div>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1E293B', margin: 0 }}>
            {school.name}
          </h2>
          <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
            NPSN: {school.npsn} • Akreditasi: <strong>A (Unggul - 94.2)</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748B', marginTop: '6px' }}>
            <MapPin size={13} />
            <span>{school.address}</span>
          </div>
        </div>
      </div>

      {/* School Details Grid */}
      <div className="dashboard-two-col">
        {/* Left Column: Daftar Guru PAI Terdaftar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            minWidth: 0
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1E293B', marginBottom: '18px' }}>
            Guru Pendidikan Agama Islam (PAI) Terdaftar
          </h3>

          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', minWidth: '480px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F1F5F9', color: '#64748B' }}>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Nama Guru &amp; NIP</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Fase / Kelas</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600 }}>Status Akun</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>Supervisi</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 700, color: '#1E293B' }}>{u.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>NIP: {u.nip}</div>
                    </td>
                    <td style={{ padding: '12px', color: '#334155' }}>
                      Fase B &amp; C (Kelas IV - VI)
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#DCFCE7', color: '#15803D', padding: '3px 8px', borderRadius: '4px' }}>
                        Aktif
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#2563EB' }}>
                        Terjadwal Ganjil
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Info Kepala Sekolah & Satuan Pendidikan */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}
          >
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1E293B', marginBottom: '14px' }}>
              Pimpinan Satuan Pendidikan
            </h4>

            <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>{school.headmasterName}</div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>Kepala Sekolah Definitif</div>
              <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '8px' }}>NIP: 19680514 199203 1 004</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
