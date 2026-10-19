import React, { useState, useEffect } from 'react';
import { AssessmentTemplate, AssessmentCategory, Indicator, User } from '@/types';
import { StorageService } from '@/services/storage';
import { Modal } from '@/components/Modal';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Copy,
  CheckCircle2,
  AlertCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Sliders,
  Check,
  X,
  FileSpreadsheet,
  FileCheck2,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface TemplateManagementProps {
  currentUser?: User;
  onShowToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const TemplateManagement: React.FC<TemplateManagementProps> = ({
  currentUser,
  onShowToast
}) => {
  const [templates, setTemplates] = useState<AssessmentTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');

  // Modals state
  const [previewTemplate, setPreviewTemplate] = useState<AssessmentTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<AssessmentTemplate | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<AssessmentTemplate | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Form state
  const [formId, setFormId] = useState('');
  const [formVersion, setFormVersion] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formIsActive, setFormIsActive] = useState(false);
  const [formCategories, setFormCategories] = useState<AssessmentCategory[]>([]);
  const [expandedIndicators, setExpandedIndicators] = useState<Record<string, boolean>>({});

  const adminActor = currentUser || StorageService.getCurrentUser() || {
    id: 'admin-1',
    name: 'M. Fathurrahman, S.Kom',
    role: 'admin' as const
  };

  const refreshTemplates = () => {
    setTemplates(StorageService.getTemplates());
  };

  useEffect(() => {
    refreshTemplates();
  }, []);

  const notify = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    if (onShowToast) {
      onShowToast(msg, type);
    } else {
      alert(msg);
    }
  };

  // Check report usage
  const getUsageCount = (templateId: string) => {
    const reports = StorageService.getReports();
    const answers = StorageService.getAnswers();
    const reportCount = reports.filter(r => r.templateVersionId === templateId).length;
    const answerCount = answers.filter(a => a.templateVersionId === templateId).length;
    return Math.max(reportCount, answerCount);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    const newId = `tmpl-${Date.now()}`;
    setFormId(newId);
    setFormVersion(`v${(templates.length + 1).toFixed(1)} - Kurikulum Merdeka PAI ${new Date().getFullYear()}/${new Date().getFullYear() + 1}`);
    setFormTitle('Instrumen Supervisi Pembelajaran PAI Terpadu');
    setFormDescription('Standar instrumen supervisi klinis PAI mengacu pada regulasi Ditjen Pendis Kemenag & Kemendikbudristek.');
    setFormIsActive(templates.length === 0);

    // Initial default categories
    setFormCategories([
      {
        id: `cat-${Date.now()}-1`,
        name: 'A. Perencanaan Pembelajaran (Modul Ajar / RPP)',
        weight: 30,
        indicators: [
          {
            id: `ind-${Date.now()}-1`,
            code: 'A.1',
            label: 'Kesesuaian Capaian Pembelajaran (CP) dan Tujuan Pembelajaran (TP)',
            description: 'TP dirumuskan secara terukur mencakup kompetensi pengetahuan, keterampilan, dan karakter Islami.',
            rubric: {
              1: 'TP tidak mencerminkan CP dan tidak dapat diukur secara jelas.',
              2: 'TP mencerminkan CP tetapi belum sepenuhnya terukur.',
              3: 'TP sesuai CP, terukur, dan mencakup pengetahuan serta sikap.',
              4: 'TP sangat komprehensif, operasional, berorientasi HOTS & penguatan karakter.'
            }
          }
        ]
      },
      {
        id: `cat-${Date.now()}-2`,
        name: 'B. Pelaksanaan Pembelajaran di Kelas / Observasi',
        weight: 45,
        indicators: [
          {
            id: `ind-${Date.now()}-2`,
            code: 'B.1',
            label: 'Apersepsi Bermakna & Pembiasaan Doa / Tadarus Al-Qur\'an',
            description: 'Membuka pembelajaran dengan adab Islami, tadarus terarah, dan mengaitkan materi secara kontekstual.',
            rubric: {
              1: 'Pelajaran dibuka tergesa-gesa tanpa apersepsi dan pembiasaan adab.',
              2: 'Hanya berdoa singkat tanpa motivasi dan kaitan apersepsi.',
              3: 'Apersepsi terarah dan pembiasaan tadarus berjalan tertib.',
              4: 'Sangat khidmat, inspiratif, dan membangkitkan rasa ingin tahu peserta didik.'
            }
          }
        ]
      },
      {
        id: `cat-${Date.now()}-3`,
        name: 'C. Evaluasi, Asesmen, dan Refleksi Pembelajaran',
        weight: 25,
        indicators: [
          {
            id: `ind-${Date.now()}-3`,
            code: 'C.1',
            label: 'Penerapan Asesmen Formatif Berkelanjutan',
            description: 'Mengukur pemahaman peserta didik selama proses belajar berlangsung dengan umpan balik konstruktif.',
            rubric: {
              1: 'Tidak ada asesmen formatif selama proses belajar.',
              2: 'Hanya bertanya "apakah sudah paham?" tanpa instrumen terarah.',
              3: 'Melakukan asesmen formatif dengan teknik yang terencana.',
              4: 'Asesmen formatif memberikan umpan balik langsung (constructive feedback) seketika.'
            }
          }
        ]
      }
    ]);

    setEditingTemplate(null);
    setExpandedIndicators({});
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (tmpl: AssessmentTemplate) => {
    setEditingTemplate(tmpl);
    setFormId(tmpl.id);
    setFormVersion(tmpl.version);
    setFormTitle(tmpl.title);
    setFormDescription(tmpl.description);
    setFormIsActive(tmpl.isActive);
    // Deep clone categories
    setFormCategories(JSON.parse(JSON.stringify(tmpl.categories)));
    setExpandedIndicators({});
    setIsFormModalOpen(true);
  };

  // Duplicate / Clone Template (SRS-F-4.1)
  const handleDuplicate = (tmpl: AssessmentTemplate) => {
    const nextVer = `${tmpl.version.split(' - ')[0] || 'v2.1'}.1 - Kurikulum Merdeka PAI ${new Date().getFullYear()}/${new Date().getFullYear() + 1}`;
    const cloned = StorageService.duplicateTemplate(tmpl.id, nextVer, adminActor);
    if (cloned) {
      refreshTemplates();
      notify(`Templat berhasil diduplikasi menjadi versi baru: ${cloned.version}!`, 'success');
      // Open editor for immediate fine-tuning
      handleOpenEdit(cloned);
    }
  };

  // Set as Active
  const handleSetActive = (tmpl: AssessmentTemplate) => {
    if (tmpl.isActive) return;
    StorageService.setActiveTemplate(tmpl.id, adminActor);
    refreshTemplates();
    notify(`Versi instrumen aktif berhasil diubah ke: ${tmpl.version}`, 'success');
  };

  // Open Delete Confirm Modal
  const handleOpenDelete = (tmpl: AssessmentTemplate) => {
    setTemplateToDelete(tmpl);
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!templateToDelete) return;
    const res = StorageService.deleteTemplate(templateToDelete.id, adminActor);
    if (!res.success) {
      setDeleteError(res.error || 'Gagal menghapus templat.');
      return;
    }
    refreshTemplates();
    setIsDeleteModalOpen(false);
    setTemplateToDelete(null);
    notify('Templat instrumen supervisi berhasil dihapus.', 'info');
  };

  // Form Category & Indicator Helpers
  const handleAddCategory = () => {
    const nextCode = String.fromCharCode(65 + formCategories.length); // A, B, C, D...
    const newCat: AssessmentCategory = {
      id: `cat-${Date.now()}-${formCategories.length + 1}`,
      name: `${nextCode}. Dimensi Baru`,
      weight: 10,
      indicators: [
        {
          id: `ind-${Date.now()}-new`,
          code: `${nextCode}.1`,
          label: 'Indikator Observasi Baru',
          description: 'Deskripsi kriteria ketercapaian indikator.',
          rubric: {
            1: 'Kriteria skor 1 (Kurang)',
            2: 'Kriteria skor 2 (Cukup)',
            3: 'Kriteria skor 3 (Baik)',
            4: 'Kriteria skor 4 (Sangat Baik / Terpenuhi Optimal)'
          }
        }
      ]
    };
    setFormCategories(prev => [...prev, newCat]);
  };

  const handleRemoveCategory = (catIndex: number) => {
    if (formCategories.length <= 1) {
      alert('Instrumen harus memiliki minimal 1 dimensi/kategori.');
      return;
    }
    setFormCategories(prev => prev.filter((_, idx) => idx !== catIndex));
  };

  const handleUpdateCategory = (catIndex: number, field: 'name' | 'weight', value: any) => {
    setFormCategories(prev => {
      const copy = [...prev];
      copy[catIndex] = {
        ...copy[catIndex],
        [field]: field === 'weight' ? Number(value) || 0 : value
      };
      return copy;
    });
  };

  const handleAddIndicator = (catIndex: number) => {
    const cat = formCategories[catIndex];
    const catLetter = cat.name.charAt(0).toUpperCase() || 'A';
    const nextNum = cat.indicators.length + 1;
    const newInd: Indicator = {
      id: `ind-${Date.now()}-${catIndex}-${nextNum}`,
      code: `${catLetter}.${nextNum}`,
      label: `Indikator Butir ${catLetter}.${nextNum}`,
      description: 'Deskripsi fokus pengamatan klinis.',
      rubric: {
        1: 'Deskripsi untuk skor 1 (Kurang)',
        2: 'Deskripsi untuk skor 2 (Cukup)',
        3: 'Deskripsi untuk skor 3 (Baik)',
        4: 'Deskripsi untuk skor 4 (Sangat Baik)'
      }
    };

    setFormCategories(prev => {
      const copy = [...prev];
      copy[catIndex] = {
        ...copy[catIndex],
        indicators: [...copy[catIndex].indicators, newInd]
      };
      return copy;
    });

    setExpandedIndicators(prev => ({ ...prev, [newInd.id]: true }));
  };

  const handleRemoveIndicator = (catIndex: number, indIndex: number) => {
    const cat = formCategories[catIndex];
    if (cat.indicators.length <= 1) {
      alert('Setiap dimensi/kategori harus memiliki minimal 1 indikator penilaian.');
      return;
    }
    setFormCategories(prev => {
      const copy = [...prev];
      copy[catIndex] = {
        ...copy[catIndex],
        indicators: copy[catIndex].indicators.filter((_, idx) => idx !== indIndex)
      };
      return copy;
    });
  };

  const handleUpdateIndicator = (
    catIndex: number,
    indIndex: number,
    field: 'code' | 'label' | 'description',
    value: string
  ) => {
    setFormCategories(prev => {
      const copy = [...prev];
      const indicators = [...copy[catIndex].indicators];
      indicators[indIndex] = {
        ...indicators[indIndex],
        [field]: value
      };
      copy[catIndex] = { ...copy[catIndex], indicators };
      return copy;
    });
  };

  const handleUpdateRubric = (
    catIndex: number,
    indIndex: number,
    score: 1 | 2 | 3 | 4,
    value: string
  ) => {
    setFormCategories(prev => {
      const copy = [...prev];
      const indicators = [...copy[catIndex].indicators];
      indicators[indIndex] = {
        ...indicators[indIndex],
        rubric: {
          ...indicators[indIndex].rubric,
          [score]: value
        }
      };
      copy[catIndex] = { ...copy[catIndex], indicators };
      return copy;
    });
  };

  const toggleIndicatorExpand = (indId: string) => {
    setExpandedIndicators(prev => ({
      ...prev,
      [indId]: !prev[indId]
    }));
  };

  // Total weight calculation
  const totalWeight = formCategories.reduce((sum, c) => sum + (Number(c.weight) || 0), 0);

  // Save Form Handler
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formVersion.trim()) {
      alert('Label versi instrumen wajib diisi (contoh: v2.2 - Kurikulum Merdeka).');
      return;
    }
    if (!formTitle.trim()) {
      alert('Judul instrumen wajib diisi.');
      return;
    }
    if (formCategories.length === 0) {
      alert('Instrumen harus memiliki minimal 1 dimensi/kategori.');
      return;
    }

    const templateToSave: AssessmentTemplate = {
      id: formId,
      version: formVersion.trim(),
      title: formTitle.trim(),
      description: formDescription.trim(),
      isActive: formIsActive,
      categories: formCategories,
      createdAt: editingTemplate ? editingTemplate.createdAt : new Date().toISOString()
    };

    StorageService.saveTemplate(templateToSave, adminActor);
    refreshTemplates();
    setIsFormModalOpen(false);
    notify(
      editingTemplate
        ? `Perubahan templat ${templateToSave.version} berhasil disimpan!`
        : `Templat baru ${templateToSave.version} berhasil ditambahkan!`,
      'success'
    );
  };

  // Filtered list
  const filteredTemplates = templates.filter(tmpl => {
    const matchesSearch =
      tmpl.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tmpl.version.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'active') return matchesSearch && tmpl.isActive;
    if (statusFilter === 'archived') return matchesSearch && !tmpl.isActive;
    return matchesSearch;
  });

  const activeTemplate = templates.find(t => t.isActive);
  const totalIndicatorsActive = activeTemplate
    ? activeTemplate.categories.reduce((acc, c) => acc + c.indicators.length, 0)
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner & Quick Stats */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B', margin: 0 }}>
              Templat Instrumen &amp; Rubrik Supervisi Klinis PAI
            </h2>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                padding: '2px 8px',
                borderRadius: '6px'
              }}
            >
              SRS-F-4.1 Versioning Ready
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>
            Kelola indikator observasi 4 dimensi Kurikulum Merdeka (Perencanaan, Pelaksanaan, Asesmen, Evaluasi) dengan dukungan riwayat versi.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleOpenCreate}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px' }}
        >
          <Plus size={16} />
          <span>Tambah Instrumen Baru</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '16px 20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Total Templat Terdaftar</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#1E293B', marginTop: '4px' }}>
            {templates.length} <span style={{ fontSize: '13px', fontWeight: 500, color: '#94A3B8' }}>Versi</span>
          </div>
          <div style={{ fontSize: '11px', color: '#10B981', marginTop: '4px' }}>
            ✓ Termasuk arsip historis
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '12px',
            padding: '16px 20px',
            boxShadow: '0 1px 3px rgba(16,185,129,0.05)'
          }}
        >
          <div style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>Versi Aktif Saat Ini</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#15803D', marginTop: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {activeTemplate?.version || 'Belum Diatur'}
          </div>
          <div style={{ fontSize: '11px', color: '#16A34A', marginTop: '4px' }}>
            Digunakan untuk seluruh penilaian baru
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '16px 20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Total Indikator Rubrik Aktif</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#1E3A8A', marginTop: '4px' }}>
            {totalIndicatorsActive} <span style={{ fontSize: '13px', fontWeight: 500, color: '#94A3B8' }}>Butir</span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
            Skala 4 Tingkat (Kurang - Sangat Baik)
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '16px 20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Standar Kurikulum</div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginTop: '8px' }}>
            Kurikulum Merdeka PAI
          </div>
          <div style={{ fontSize: '11px', color: '#0284C7', marginTop: '4px' }}>
            Direktorat PAI Ditjen Pendis Kemenag
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className={`btn btn-sm ${statusFilter === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setStatusFilter('all')}
          >
            Semua ({templates.length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${statusFilter === 'active' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setStatusFilter('active')}
          >
            Aktif Digunakan
          </button>
          <button
            type="button"
            className={`btn btn-sm ${statusFilter === 'archived' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setStatusFilter('archived')}
          >
            Arsip / Nonaktif
          </button>
        </div>

        <div style={{ position: 'relative', width: '280px' }}>
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '34px', fontSize: '13px' }}
            placeholder="Cari versi, judul instrumen..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
        </div>
      </div>

      {/* Templates List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredTemplates.length === 0 ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '48px 24px',
              textAlign: 'center',
              border: '1px dashed #CBD5E1',
              color: '#64748B'
            }}
          >
            <Layers size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <div style={{ fontWeight: 700, fontSize: '16px', color: '#1E293B' }}>
              Tidak ada templat instrumen ditemukan
            </div>
            <p style={{ fontSize: '13px', margin: '4px 0 16px' }}>
              {searchTerm ? 'Coba ubah kata kunci pencarian Anda.' : 'Belum ada instrumen supervisi yang dibuat.'}
            </p>
            <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
              <Plus size={15} />
              <span>Buat Instrumen Baru Sekarang</span>
            </button>
          </div>
        ) : (
          filteredTemplates.map(tmpl => {
            const usageCount = getUsageCount(tmpl.id);
            const totalIndicators = tmpl.categories.reduce((acc, c) => acc + c.indicators.length, 0);

            return (
              <div
                key={tmpl.id}
                style={{
                  backgroundColor: tmpl.isActive ? '#F8FDF9' : '#FFFFFF',
                  borderRadius: '16px',
                  padding: '24px',
                  border: tmpl.isActive ? '2px solid #86EFAC' : '1px solid #E2E8F0',
                  boxShadow: tmpl.isActive
                    ? '0 4px 16px rgba(22, 163, 74, 0.08)'
                    : '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Header Row */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '16px',
                    marginBottom: '16px'
                  }}
                >
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          backgroundColor: tmpl.isActive ? '#15803D' : '#475569',
                          color: '#FFFFFF',
                          padding: '3px 10px',
                          borderRadius: '6px'
                        }}
                      >
                        {tmpl.version}
                      </span>

                      {tmpl.isActive ? (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor: '#DCFCE7',
                            color: '#15803D',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <CheckCircle2 size={13} />
                          AKTIF DIGUNAKAN
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            backgroundColor: '#F1F5F9',
                            color: '#64748B',
                            padding: '3px 8px',
                            borderRadius: '4px'
                          }}
                        >
                          Arsip / Nonaktif
                        </span>
                      )}

                      {usageCount > 0 ? (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            backgroundColor: '#EFF6FF',
                            color: '#2563EB',
                            padding: '3px 8px',
                            borderRadius: '4px'
                          }}
                        >
                          Terikat {usageCount} Laporan
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            backgroundColor: '#FEF3C7',
                            color: '#B45309',
                            padding: '3px 8px',
                            borderRadius: '4px'
                          }}
                        >
                          Belum Digunakan (Bebas Dihapus)
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1E293B', margin: '8px 0 4px' }}>
                      {tmpl.title}
                    </h3>

                    <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                      {tmpl.description}
                    </p>
                  </div>

                  {/* Action Buttons Toolbar */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost"
                      onClick={() => setPreviewTemplate(tmpl)}
                      title="Lihat rincian butir rubrik & skala skor 1-4"
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Eye size={14} color="#2563EB" />
                      <span>Lihat Rubrik</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() => handleDuplicate(tmpl)}
                      title="Buat versi baru dari templat ini (SRS-F-4.1 Versioning)"
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Copy size={14} />
                      <span>Duplikasi &amp; Versi Baru</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() => handleOpenEdit(tmpl)}
                      title="Ubah rincian butir, bobot, atau indikator"
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Edit2 size={14} color="#0D9488" />
                      <span>Edit</span>
                    </button>

                    {!tmpl.isActive && (
                      <button
                        type="button"
                        className="btn btn-sm btn-accent"
                        onClick={() => handleSetActive(tmpl)}
                        title="Jadikan templat ini aktif untuk supervisi mendatang"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Check size={14} />
                        <span>Aktifkan</span>
                      </button>
                    )}

                    <button
                      type="button"
                      className="btn btn-sm btn-ghost"
                      onClick={() => handleOpenDelete(tmpl)}
                      title="Hapus templat instrumen"
                      style={{ color: '#DC2626' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Categories & Indicators Badges Breakdown */}
                <div
                  style={{
                    backgroundColor: tmpl.isActive ? '#FFFFFF' : '#F8FAFC',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid #E2E8F0',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '12px'
                  }}
                >
                  {tmpl.categories.map((cat, idx) => (
                    <div
                      key={cat.id || idx}
                      style={{
                        padding: '10px 14px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>
                          {cat.name}
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor: '#E0F2FE',
                            color: '#0369A1',
                            padding: '2px 6px',
                            borderRadius: '4px'
                          }}
                        >
                          Bobot {cat.weight}%
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                        {cat.indicators.length} Butir Indikator Observasi
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Info */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '14px',
                    fontSize: '12px',
                    color: '#94A3B8'
                  }}
                >
                  <span>
                    Total: {tmpl.categories.length} Dimensi • {totalIndicators} Indikator Rubrik • Bobot Total: 100%
                  </span>
                  <span>
                    Dibuat: {new Date(tmpl.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL 1: PREVIEW INSTRUMEN DETAIL */}
      <Modal
        isOpen={Boolean(previewTemplate)}
        onClose={() => setPreviewTemplate(null)}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="#2563EB" />
            <span>Pratinjau Instrumen: {previewTemplate?.version}</span>
          </div>
        }
        size="xl"
      >
        {previewTemplate && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Meta Card */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#1E293B' }}>
                  {previewTemplate.title}
                </h4>
                {previewTemplate.isActive && (
                  <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#DCFCE7', color: '#15803D', padding: '3px 8px', borderRadius: '4px' }}>
                    AKTIF DIGUNAKAN
                  </span>
                )}
              </div>
              <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#64748B' }}>
                {previewTemplate.description}
              </p>
            </div>

            {/* Categories & Indicators Detail List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {previewTemplate.categories.map((category, catIdx) => (
                <div
                  key={category.id || catIdx}
                  style={{
                    border: '1px solid #CBD5E1',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      backgroundColor: '#1E3A5F',
                      color: '#FFFFFF',
                      padding: '12px 18px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: '14px' }}>{category.name}</span>
                    <span
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 700
                      }}
                    >
                      Bobot Kontribusi: {category.weight}%
                    </span>
                  </div>

                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', backgroundColor: '#FFFFFF' }}>
                    {category.indicators.map((ind, indIdx) => (
                      <div
                        key={ind.id || indIdx}
                        style={{
                          border: '1px solid #E2E8F0',
                          borderRadius: '8px',
                          padding: '14px',
                          backgroundColor: '#FAFAFA'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              backgroundColor: '#1E3A5F',
                              color: '#FFFFFF',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontWeight: 700,
                              fontSize: '11px'
                            }}
                          >
                            {ind.code}
                          </span>
                          <span style={{ fontWeight: 700, fontSize: '13px', color: '#1E293B' }}>
                            {ind.label}
                          </span>
                        </div>

                        <p style={{ fontSize: '12px', color: '#64748B', margin: '6px 0 10px' }}>
                          {ind.description}
                        </p>

                        {/* 4 Rubric levels grid */}
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                            gap: '8px',
                            fontSize: '11px'
                          }}
                        >
                          <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '6px', padding: '8px' }}>
                            <strong style={{ color: '#DC2626' }}>Skor 1 (Kurang)</strong>
                            <div style={{ marginTop: '4px', color: '#475569' }}>{ind.rubric[1]}</div>
                          </div>
                          <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '6px', padding: '8px' }}>
                            <strong style={{ color: '#D97706' }}>Skor 2 (Cukup)</strong>
                            <div style={{ marginTop: '4px', color: '#475569' }}>{ind.rubric[2]}</div>
                          </div>
                          <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '6px', padding: '8px' }}>
                            <strong style={{ color: '#2563EB' }}>Skor 3 (Baik)</strong>
                            <div style={{ marginTop: '4px', color: '#475569' }}>{ind.rubric[3]}</div>
                          </div>
                          <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '6px', padding: '8px' }}>
                            <strong style={{ color: '#16A34A' }}>Skor 4 (Sangat Baik)</strong>
                            <div style={{ marginTop: '4px', color: '#475569' }}>{ind.rubric[4]}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setPreviewTemplate(null)}
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 2: CREATE / EDIT INSTRUMEN FORM */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="#2563EB" />
            <span>
              {editingTemplate
                ? `Edit Instrumen Supervisi: ${editingTemplate.version}`
                : 'Tambah Instrumen Supervisi Baru (SRS-F-4.1)'}
            </span>
          </div>
        }
        size="xl"
      >
        <form onSubmit={handleSaveForm} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Section 1: Basic Information */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>1. Identitas &amp; Versi Instrumen</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600, fontSize: '12px' }}>
                  Label Versi *
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Contoh: v2.2 - Kurikulum Merdeka 2026/2027"
                  value={formVersion}
                  onChange={e => setFormVersion(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600, fontSize: '12px' }}>
                  Judul Instrumen *
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Contoh: Instrumen Supervisi Akademik Pembelajaran PAI Terpadu"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '12px' }}>
                Deskripsi / Dasar Regulasi
              </label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="Rujukan regulasi resmi instrumen supervisi..."
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
              <input
                type="checkbox"
                checked={formIsActive}
                onChange={e => setFormIsActive(e.target.checked)}
              />
              <span style={{ fontWeight: 600, color: '#1E293B' }}>
                Tetapkan sebagai instrumen aktif utama sistem (menggantikan instrumen aktif sebelumnya)
              </span>
            </label>
          </div>

          {/* Section 2: Dimensions & Weights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '14px', color: '#1E293B' }}>
                  2. Dimensi Penilaian, Bobot, &amp; Indikator Rubrik
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    backgroundColor: totalWeight === 100 ? '#DCFCE7' : '#FEF3C7',
                    color: totalWeight === 100 ? '#15803D' : '#B45309'
                  }}
                >
                  Total Bobot: {totalWeight}% {totalWeight === 100 ? '✓ (Ideal 100%)' : '⚠ (Disarankan 100%)'}
                </span>
              </div>

              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={handleAddCategory}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={14} />
                <span>Tambah Dimensi/Kategori</span>
              </button>
            </div>

            {/* Categories Loop */}
            {formCategories.map((cat, catIdx) => (
              <div
                key={cat.id || catIdx}
                style={{
                  border: '1.5px solid #CBD5E1',
                  borderRadius: '12px',
                  backgroundColor: '#FFFFFF',
                  overflow: 'hidden'
                }}
              >
                {/* Category Header */}
                <div
                  style={{
                    backgroundColor: '#F1F5F9',
                    padding: '12px 16px',
                    borderBottom: '1px solid #CBD5E1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: '#1E3A5F' }}>
                      Dimensi {catIdx + 1}:
                    </span>
                    <input
                      type="text"
                      className="form-input"
                      style={{ fontSize: '13px', fontWeight: 600, flex: 1 }}
                      value={cat.name}
                      onChange={e => handleUpdateCategory(catIdx, 'name', e.target.value)}
                      placeholder="Nama Dimensi/Kategori..."
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Bobot (%):</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="form-input"
                        style={{ width: '70px', fontSize: '13px', textAlign: 'center', padding: '6px' }}
                        value={cat.weight}
                        onChange={e => handleUpdateCategory(catIdx, 'weight', e.target.value)}
                        required
                      />
                    </div>

                    <button
                      type="button"
                      className="btn btn-sm btn-ghost"
                      onClick={() => handleRemoveCategory(catIdx)}
                      title="Hapus Dimensi"
                      style={{ color: '#DC2626' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Indicators inside Category */}
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {cat.indicators.map((ind, indIdx) => {
                    const isExpanded = Boolean(expandedIndicators[ind.id]);

                    return (
                      <div
                        key={ind.id || indIdx}
                        style={{
                          border: '1px solid #E2E8F0',
                          borderRadius: '8px',
                          backgroundColor: '#F8FAFC',
                          padding: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                            <input
                              type="text"
                              className="form-input"
                              style={{ width: '60px', fontSize: '12px', fontWeight: 700, textAlign: 'center' }}
                              value={ind.code}
                              onChange={e => handleUpdateIndicator(catIdx, indIdx, 'code', e.target.value)}
                              placeholder="Kode"
                              required
                            />
                            <input
                              type="text"
                              className="form-input"
                              style={{ fontSize: '13px', fontWeight: 600, flex: 1 }}
                              value={ind.label}
                              onChange={e => handleUpdateIndicator(catIdx, indIdx, 'label', e.target.value)}
                              placeholder="Nama butir indikator..."
                              required
                            />
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <button
                              type="button"
                              className="btn btn-sm btn-ghost"
                              onClick={() => toggleIndicatorExpand(ind.id)}
                              style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <span>Rubrik Skala 1-4</span>
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm btn-ghost"
                              onClick={() => handleRemoveIndicator(catIdx, indIdx)}
                              style={{ color: '#DC2626' }}
                              title="Hapus Indikator"
                            >
                              <X size={15} />
                            </button>
                          </div>
                        </div>

                        <div style={{ marginTop: '8px' }}>
                          <input
                            type="text"
                            className="form-input"
                            style={{ fontSize: '12px' }}
                            value={ind.description}
                            onChange={e => handleUpdateIndicator(catIdx, indIdx, 'description', e.target.value)}
                            placeholder="Deskripsi fokus pengamatan indikator..."
                          />
                        </div>

                        {/* Collapsible Rubric 1-4 */}
                        {isExpanded && (
                          <div
                            style={{
                              marginTop: '12px',
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                              gap: '8px',
                              paddingTop: '10px',
                              borderTop: '1px dashed #CBD5E1'
                            }}
                          >
                            <div className="form-group" style={{ margin: 0 }}>
                              <label style={{ fontSize: '11px', fontWeight: 700, color: '#DC2626' }}>
                                Skor 1 (Kurang)
                              </label>
                              <textarea
                                className="form-textarea"
                                rows={2}
                                style={{ fontSize: '11px' }}
                                value={ind.rubric[1]}
                                onChange={e => handleUpdateRubric(catIdx, indIdx, 1, e.target.value)}
                              />
                            </div>

                            <div className="form-group" style={{ margin: 0 }}>
                              <label style={{ fontSize: '11px', fontWeight: 700, color: '#D97706' }}>
                                Skor 2 (Cukup)
                              </label>
                              <textarea
                                className="form-textarea"
                                rows={2}
                                style={{ fontSize: '11px' }}
                                value={ind.rubric[2]}
                                onChange={e => handleUpdateRubric(catIdx, indIdx, 2, e.target.value)}
                              />
                            </div>

                            <div className="form-group" style={{ margin: 0 }}>
                              <label style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB' }}>
                                Skor 3 (Baik)
                              </label>
                              <textarea
                                className="form-textarea"
                                rows={2}
                                style={{ fontSize: '11px' }}
                                value={ind.rubric[3]}
                                onChange={e => handleUpdateRubric(catIdx, indIdx, 3, e.target.value)}
                              />
                            </div>

                            <div className="form-group" style={{ margin: 0 }}>
                              <label style={{ fontSize: '11px', fontWeight: 700, color: '#16A34A' }}>
                                Skor 4 (Sangat Baik)
                              </label>
                              <textarea
                                className="form-textarea"
                                rows={2}
                                style={{ fontSize: '11px' }}
                                value={ind.rubric[4]}
                                onChange={e => handleUpdateRubric(catIdx, indIdx, 4, e.target.value)}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    className="btn btn-sm btn-ghost"
                    onClick={() => handleAddIndicator(catIdx)}
                    style={{ alignSelf: 'flex-start', color: '#2563EB', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Plus size={14} />
                    <span>+ Tambah Indikator ke {cat.name}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Form Actions Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              paddingTop: '16px',
              borderTop: '1px solid #E2E8F0'
            }}
          >
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsFormModalOpen(false)}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Check size={16} />
              <span>{editingTemplate ? 'Simpan Perubahan Instrumen' : 'Simpan & Terbitkan Instrumen Baru'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: DELETE CONFIRMATION */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#DC2626' }}>
            <Trash2 size={20} />
            <span>Konfirmasi Hapus Templat Instrumen</span>
          </div>
        }
      >
        {templateToDelete && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {deleteError ? (
              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '8px',
                  padding: '14px',
                  color: '#991B1B',
                  fontSize: '13px',
                  lineHeight: 1.5
                }}
              >
                <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <AlertCircle size={16} />
                  <span>Tidak Dapat Dihapus (Integritas Data PRD/SRS)</span>
                </div>
                {deleteError}
              </div>
            ) : (
              <p style={{ fontSize: '14px', color: '#334155', margin: 0, lineHeight: 1.5 }}>
                Apakah Anda yakin ingin menghapus instrumen supervisi{' '}
                <strong>{templateToDelete.version} - {templateToDelete.title}</strong>?
                Tindakan ini tidak dapat dibatalkan jika belum terikat pada laporan supervisi manapun.
              </p>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                {deleteError ? 'Tutup' : 'Batal'}
              </button>
              {!deleteError && (
                <button
                  type="button"
                  className="btn btn-destructive"
                  onClick={handleConfirmDelete}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Trash2 size={15} />
                  <span>Ya, Hapus Templat</span>
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
