'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  Eye,
  FileCheck2,
  Download,
  AlertCircle,
  Plus,
  Trash2,
  X,
  FileUp,
  ExternalLink,
  Check
} from 'lucide-react';

interface ModulDoc {
  id: string;
  title: string;
  fileName?: string;
  type: string;
  size: string;
  updatedAt: string;
  status: 'Terverifikasi' | 'Menunggu Review' | 'Perlu Revisi';
  notes: string;
  fileUrl?: string;
}

const DEFAULT_DOCS: ModulDoc[] = [
  {
    id: 'doc-1',
    title: 'Modul Ajar PAI: Q.S. Al-Hujurat Ayat 13 (Fase B)',
    fileName: 'Modul_Ajar_PAI_Kelas4_Al_Hujurat.pdf',
    type: 'Modul Ajar / RPP',
    size: '2.4 MB',
    updatedAt: '12 Okt 2026',
    status: 'Terverifikasi',
    notes: 'Komponen diferensiasi konten & profil pelajar Pancasila lengkap.',
    fileUrl: 'https://storage.sipena.id/uploads/modul-ajar-001.pdf'
  },
  {
    id: 'doc-2',
    title: 'Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) Semester Ganjil',
    fileName: 'KKTP_PAI_Semester_Ganjil_2026.docx',
    type: 'KKTP',
    size: '1.1 MB',
    updatedAt: '10 Okt 2026',
    status: 'Terverifikasi',
    notes: 'Interval rubrik nilai sesuai panduan BSKAP.',
    fileUrl: 'https://storage.sipena.id/uploads/kktp-001.docx'
  },
  {
    id: 'doc-3',
    title: 'Lembar Kerja Peserta Didik (LKPD) Interaktif Berbasis Kisah Nabi',
    fileName: 'LKPD_Kisah_Nabi_Muhammad_SAW.pdf',
    type: 'LKPD',
    size: '3.8 MB',
    updatedAt: '14 Okt 2026',
    status: 'Menunggu Review',
    notes: 'Menunggu telaah Kepala Sekolah saat observasi kelas.',
    fileUrl: 'https://storage.sipena.id/uploads/lkpd-001.pdf'
  },
  {
    id: 'doc-4',
    title: 'Instrumen Asesmen Formatif & Sumatif Lingkup Materi Zakat',
    fileName: 'Asesmen_Formatif_Sumatif_Zakat.pdf',
    type: 'Asesmen',
    size: '1.9 MB',
    updatedAt: '16 Okt 2026',
    status: 'Perlu Revisi',
    notes: 'Mohon tambahkan rubrik penilaian sikap spiritual (KI-1).',
    fileUrl: 'https://storage.sipena.id/uploads/asesmen-001.pdf'
  }
];

const STORAGE_KEY = 'sipena_guru_administrasi_docs';

export default function GuruAdministrasiPage() {
  const [documents, setDocuments] = useState<ModulDoc[]>(DEFAULT_DOCS);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Modul Ajar / RPP');
  const [newNotes, setNewNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load persisted documents from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setDocuments(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveDocs = (newDocs: ModulDoc[]) => {
    setDocuments(newDocs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newDocs));
    } catch {
      // ignore
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!newTitle.trim()) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        setNewTitle(nameWithoutExt);
      }
    }
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('Nama Dokumen / Perangkat Pembelajaran wajib diisi!');
      return;
    }

    setIsUploading(true);

    setTimeout(() => {
      let fileSizeStr = '1.5 MB';
      let fileNameStr = selectedFile?.name || `${newTitle.replace(/\s+/g, '_')}.pdf`;

      if (selectedFile) {
        const sizeBytes = selectedFile.size;
        fileSizeStr =
          sizeBytes < 1024 * 1024
            ? `${(sizeBytes / 1024).toFixed(1)} KB`
            : `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
      }

      const newDoc: ModulDoc = {
        id: `doc-${Date.now()}`,
        title: newTitle.trim(),
        fileName: fileNameStr,
        type: newType,
        size: fileSizeStr,
        updatedAt: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        status: 'Menunggu Review',
        notes: newNotes.trim() || 'Berkas baru diunggah oleh guru untuk ditelaah.',
        fileUrl: `https://storage.sipena.id/uploads/${fileNameStr}`
      };

      const updated = [newDoc, ...documents];
      saveDocs(updated);

      setIsUploading(false);
      setUploadSuccess(true);
      showToast(`Berkas "${newDoc.title}" berhasil diunggah dan diajukan ke Kepala Sekolah!`);

      setTimeout(() => {
        setUploadSuccess(false);
        setIsUploadOpen(false);
        setNewTitle('');
        setNewNotes('');
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 700);
    }, 600);
  };

  const handleDelete = (docId: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus arsip berkas "${title}"?`)) {
      const updated = documents.filter(d => d.id !== docId);
      saveDocs(updated);
      showToast(`Berkas "${title}" berhasil dihapus.`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 9999,
            backgroundColor: '#1E3A5F',
            color: '#FFFFFF',
            padding: '14px 20px',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
            fontWeight: 600
          }}
        >
          <CheckCircle2 size={18} color="#34D399" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Action Card */}
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
            Administrasi Modul Ajar &amp; Perangkat Supervisi
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>
            Unggah dan kelola berkas pra-observasi pembelajaran PAI untuk diverifikasi oleh Kepala Sekolah
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setIsUploadOpen(true)}
        >
          <Plus size={16} />
          <span>Unggah Berkas Baru</span>
        </button>
      </div>

      {/* Form Unggah Perangkat Pembelajaran Baru */}
      {isUploadOpen && (
        <div
          style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '16px',
            padding: '24px',
            border: '1.5px dashed #2563EB',
            boxShadow: '0 4px 16px rgba(37, 99, 235, 0.06)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileUp size={20} color="#2563EB" />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1E293B', margin: 0 }}>
                Form Unggah Perangkat Pembelajaran Baru
              </h3>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-ghost"
              onClick={() => {
                setIsUploadOpen(false);
                setSelectedFile(null);
                setNewTitle('');
                setNewNotes('');
              }}
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleAddDocument} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* File Dropzone Input */}
            <div
              style={{
                border: '2px dashed #CBD5E1',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: selectedFile ? '#EFF6FF' : '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.png"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <Upload size={28} color={selectedFile ? '#2563EB' : '#94A3B8'} style={{ margin: '0 auto 8px' }} />
              {selectedFile ? (
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1D4ED8' }}>
                    {selectedFile.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                    Ukuran: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Klik untuk ganti berkas
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>
                    Klik untuk memilih berkas perangkat pembelajaran dari komputer
                  </div>
                  <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
                    Format didukung: PDF, DOCX, PPTX, JPG, PNG (Maks. 25 MB)
                  </div>
                </div>
              )}
            </div>

            <div className="dashboard-equal-two-col" style={{ gap: '16px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '13px', fontWeight: 600 }}>
                  Nama Dokumen / Materi Pembelajaran *
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Contoh: Modul Ajar PAI Bab 4 Fase B (Indahnya Keberagaman)"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '13px', fontWeight: 600 }}>
                  Kategori Perangkat *
                </label>
                <select
                  className="form-select"
                  value={newType}
                  onChange={e => setNewType(e.target.value)}
                >
                  <option value="Modul Ajar / RPP">Modul Ajar / RPP</option>
                  <option value="KKTP">KKTP (Kriteria Ketercapaian)</option>
                  <option value="Bahan Ajar">Bahan Ajar / Slide Presentasi</option>
                  <option value="LKPD">Lembar Kerja Peserta Didik (LKPD)</option>
                  <option value="Asesmen">Instrumen Asesmen (Rubrik / Soal)</option>
                  <option value="Media Pembelajaran">Media &amp; Dokumentasi Pembelajaran</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '13px', fontWeight: 600 }}>
                Catatan Pengantar untuk Kepala Sekolah (Opsional)
              </label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="Tuliskan keterangan fokus diferensiasi, pertemuan pembelajaran, atau catatan penting lainnya..."
                value={newNotes}
                onChange={e => setNewNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
              <button
                type="button"
                className="btn btn-outline"
                disabled={isUploading}
                onClick={() => {
                  setIsUploadOpen(false);
                  setSelectedFile(null);
                  setNewTitle('');
                  setNewNotes('');
                }}
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isUploading}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                {isUploading ? (
                  <>
                    <Clock size={16} className="spin" />
                    <span>Mengunggah Berkas...</span>
                  </>
                ) : uploadSuccess ? (
                  <>
                    <Check size={16} />
                    <span>Berhasil Diunggah!</span>
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    <span>Simpan &amp; Ajukan Verifikasi</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Document List Table */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1E293B', margin: 0 }}>
            Daftar Berkas Perangkat Pembelajaran ({documents.length})
          </h3>
          <span style={{ fontSize: '12px', color: '#64748B' }}>
            Tersimpan otomatis di penyimpanan lokal SIPENA
          </span>
        </div>

        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', minWidth: '640px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F1F5F9', color: '#64748B' }}>
                <th style={{ padding: '12px', fontWeight: 600 }}>Dokumen</th>
                <th style={{ padding: '12px', fontWeight: 600 }}>Kategori</th>
                <th style={{ padding: '12px', fontWeight: 600 }}>Ukuran &amp; Tanggal</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>Status Verifikasi</th>
                <th style={{ padding: '12px', fontWeight: 600 }}>Catatan Kepala Sekolah</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {documents.map(doc => (
                <tr key={doc.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                  <td style={{ padding: '14px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FileText size={20} color="#2563EB" style={{ flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 600, color: '#1E293B' }}>{doc.title}</div>
                        {doc.fileName && (
                          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                            {doc.fileName}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#F1F5F9', padding: '3px 8px', borderRadius: '4px' }}>
                      {doc.type}
                    </span>
                  </td>
                  <td style={{ padding: '14px 12px', color: '#64748B', whiteSpace: 'nowrap' }}>
                    {doc.size} • {doc.updatedAt}
                  </td>
                  <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor:
                          doc.status === 'Terverifikasi'
                            ? '#DCFCE7'
                            : doc.status === 'Perlu Revisi'
                            ? '#FEE2E2'
                            : '#E0F2FE',
                        color:
                          doc.status === 'Terverifikasi'
                            ? '#15803D'
                            : doc.status === 'Perlu Revisi'
                            ? '#DC2626'
                            : '#0369A1',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 12px', fontSize: '12px', color: '#475569', maxWidth: '280px' }}>
                    {doc.notes}
                  </td>
                  <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        type="button"
                        className="btn btn-sm btn-ghost"
                        onClick={() => alert(`Mengunduh berkas: ${doc.fileName || doc.title}\nUkuran: ${doc.size}\nStatus: ${doc.status}`)}
                        title="Unduh berkas"
                      >
                        <Download size={14} />
                        <span>Unduh</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-ghost"
                        style={{ color: '#DC2626' }}
                        onClick={() => handleDelete(doc.id, doc.title)}
                        title="Hapus berkas"
                      >
                        <Trash2 size={14} />
                      </button>
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
