'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@/types';
import { StorageService } from '@/services/storage';
import {
  User as UserIcon,
  Award,
  BookOpen,
  Building,
  Save,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  FileText
} from 'lucide-react';

export default function GuruProfilPage() {
  const [user, setUser] = useState<User>(() => StorageService.getCurrentUser());
  const [name, setName] = useState(user.name);
  const [nip, setNip] = useState(user.nip || '');
  const [title, setTitle] = useState(user.title || 'Guru PAI');
  const [school, setSchool] = useState('SDN 01 Menteng Jakarta Pusat');
  const [rank, setRank] = useState('Penata Muda Tk. I / III-b');
  const [nuptk, setNuptk] = useState('8349752654200032');
  const [certification, setCertification] = useState('Tersertifikasi (PPG PAI 2021)');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = {
      ...user,
      name,
      nip,
      title
    };
    StorageService.setCurrentUser(updatedUser);
    setUser(updatedUser);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner Card */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#EEF5FF',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '24px',
              border: '2px solid #DCE9FE'
            }}
          >
            {name.charAt(0)}
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1E293B', margin: 0 }}>
              {name}
            </h2>
            <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
              NIP: {nip} • NUPTK: {nuptk}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: '4px' }}>
                ✓ {certification}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#E0F2FE', color: '#0369A1', padding: '2px 8px', borderRadius: '4px' }}>
                {rank}
              </span>
            </div>
          </div>
        </div>

        {isSaved && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#15803D', fontWeight: 600, fontSize: '13px' }}>
            <CheckCircle2 size={18} />
            <span>Data profil berhasil disimpan!</span>
          </div>
        )}
      </div>

      {/* 2-Column Profile Details & Form */}
      <div className="dashboard-two-col">
        {/* Left Column: Form Edit Profil */}
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
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1E293B', marginBottom: '20px' }}>
            Data Kepegawaian & Akademik Guru
          </h3>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="dashboard-equal-two-col">
              <div className="form-group">
                <label className="form-label">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nomor Induk Pegawai (NIP)</label>
                <input
                  type="text"
                  className="form-input"
                  value={nip}
                  onChange={e => setNip(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="dashboard-equal-two-col">
              <div className="form-group">
                <label className="form-label">NUPTK</label>
                <input
                  type="text"
                  className="form-input"
                  value={nuptk}
                  onChange={e => setNuptk(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Pangkat & Golongan Ruang</label>
                <input
                  type="text"
                  className="form-input"
                  value={rank}
                  onChange={e => setRank(e.target.value)}
                />
              </div>
            </div>

            <div className="dashboard-equal-two-col">
              <div className="form-group">
                <label className="form-label">Satuan Pendidikan (Unit Kerja)</label>
                <input
                  type="text"
                  className="form-input"
                  value={school}
                  onChange={e => setSchool(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status Sertifikasi</label>
                <input
                  type="text"
                  className="form-input"
                  value={certification}
                  onChange={e => setCertification(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }}>
                <Save size={16} />
                <span>Simpan Perubahan Profil</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Ringkasan Tugas Mengajar */}
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
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1E293B', marginBottom: '16px' }}>
              Tugas Mengajar Semester Ini
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>PAI & Budi Pekerti (Fase B)</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>Kelas IV-A & IV-B (4 JP/Minggu)</div>
              </div>

              <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>PAI & Budi Pekerti (Fase C)</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>Kelas V-A & V-B (4 JP/Minggu)</div>
              </div>

              <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#EEF5FF', border: '1px solid #DCE9FE' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#1D4ED8' }}>TOTAL BEBAN MENGAJAR</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#1E40AF', marginTop: '2px' }}>24 JP / Minggu</div>
                <div style={{ fontSize: '11px', color: '#60A5FA' }}>✓ Memenuhi Syarat Tunjangan Profesi</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
