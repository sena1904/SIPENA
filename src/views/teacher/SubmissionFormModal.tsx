import React, { useState, useEffect, useRef } from 'react';
import {
  Submission,
  SubmissionDocument,
  DocumentType,
  User,
  AssessmentTemplate,
  TeacherIndicatorEntry
} from '../../types';
import { StorageService } from '../../services/storage';
import { Modal } from '../../components/Modal';
import {
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Trash2,
  Save,
  Send,
  Clock,
  Sparkles,
  Layers,
  Check,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Award
} from 'lucide-react';

interface SubmissionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  editingSubmission?: Submission | null;
  onSuccess: (sub: Submission, isSubmitted: boolean) => void;
}

export const SubmissionFormModal: React.FC<SubmissionFormModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  editingSubmission,
  onSuccess
}) => {
  const activeTemplate: AssessmentTemplate = StorageService.getActiveTemplate();

  const [activeTab, setActiveTab] = useState<'identity_docs' | 'instrument_data'>('identity_docs');
  const [subject, setSubject] = useState('Pendidikan Agama Islam & Budi Pekerti');
  const [grade, setGrade] = useState('Fase B (Kelas IV-A)');
  const [academicYear, setAcademicYear] = useState('2026/2027');
  const [semester, setSemester] = useState<'Ganjil' | 'Genap'>('Ganjil');
  const [topic, setTopic] = useState('');
  const [learningObjectives, setLearningObjectives] = useState('');
  const [executionDate, setExecutionDate] = useState('');

  // Documents attached (Bukti Pendukung)
  const [documents, setDocuments] = useState<SubmissionDocument[]>([]);
  const [uploadingType, setUploadingType] = useState<DocumentType | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Teacher Instrument Data (Isian Data Instrumen per Indikator)
  const [teacherData, setTeacherData] = useState<Record<string, TeacherIndicatorEntry>>({});

  // Auto save status indicator
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string>('');

  // Populate on open
  useEffect(() => {
    if (isOpen) {
      if (editingSubmission) {
        setSubmissionId(editingSubmission.id);
        setSubject(editingSubmission.subject);
        setGrade(editingSubmission.grade);
        setAcademicYear(editingSubmission.academicYear);
        setSemester(editingSubmission.semester);
        setTopic(editingSubmission.topic);
        setLearningObjectives(editingSubmission.learningObjectives);
        setExecutionDate(editingSubmission.executionDate);
        setDocuments(StorageService.getDocumentsBySubmissionId(editingSubmission.id));
        setTeacherData(editingSubmission.teacherInstrumentData || {});
      } else {
        const newId = `SUB-2026-${Math.floor(100 + Math.random() * 900)}`;
        setSubmissionId(newId);
        setSubject('Pendidikan Agama Islam & Budi Pekerti');
        setGrade('Fase B (Kelas IV-A)');
        setAcademicYear('2026/2027');
        setSemester('Ganjil');
        setTopic('');
        setLearningObjectives('');
        setExecutionDate(new Date().toISOString().slice(0, 10));
        setDocuments([]);
        setTeacherData({});
      }
      setActiveTab('identity_docs');
    }
  }, [isOpen, editingSubmission]);

  // Auto-save interval (SRS-F-2.2: Draf tersimpan otomatis secara berkala)
  useEffect(() => {
    if (
      !isOpen ||
      !submissionId ||
      (editingSubmission &&
        editingSubmission.status !== 'Draf' &&
        editingSubmission.status !== 'Perlu Revisi')
    ) {
      return;
    }

    const timer = setInterval(() => {
      if (topic.trim() || learningObjectives.trim() || Object.keys(teacherData).length > 0) {
        handleSaveDraft(false);
      }
    }, 20000); // every 20 seconds auto-save

    return () => clearInterval(timer);
  }, [isOpen, submissionId, topic, learningObjectives, executionDate, grade, subject, teacherData]);

  const handleUpdateIndicatorData = (
    indId: string,
    field: keyof TeacherIndicatorEntry,
    val: any
  ) => {
    setTeacherData(prev => ({
      ...prev,
      [indId]: {
        ...prev[indId],
        [field]: val
      }
    }));
  };

  // Quick helper: Autofill exemplary teacher responses based on standard PAI Kurikulum Merdeka
  const handleLoadSampleTeacherData = () => {
    const samples: Record<string, TeacherIndicatorEntry> = {
      'ind-1': {
        implementationNotes: 'TP dirumuskan secara operasional dengan mengintegrasikan kompetensi pengetahuan, keterampilan membaca, dan sikap moderasi beragama.',
        evidenceAttachment: 'Modul Ajar Bab 2 Hal. 4',
        selfScore: 4
      },
      'ind-2': {
        implementationNotes: 'Tersedia lembar asesmen diagnostik non-kognitif untuk memetakan kesiapan dan gaya belajar peserta didik.',
        evidenceAttachment: 'Lampiran Asesmen Diagnostik',
        selfScore: 4
      },
      'ind-3': {
        implementationNotes: 'Mengintegrasikan nilai Tasamuh (toleransi), Tawazun, dan Profil Pelajar Pancasila pada skenario diskusi kelompok.',
        evidenceAttachment: 'Modul Ajar Kegiatan Inti',
        selfScore: 4
      },
      'ind-4': {
        implementationNotes: 'LKPD berbasis studi kasus kontekstual disediakan dalam 3 tingkat tantangan untuk memfasilitasi keragaman siswa.',
        evidenceAttachment: 'Lembar Kerja Peserta Didik (LKPD)',
        selfScore: 4
      },
      'ind-5': {
        implementationNotes: 'Pelajaran diawali tadarus terarah QS. Al-Hujurat: 13, doa bersama, dan apersepsi tayangan video keragaman suku bangsa.',
        evidenceAttachment: 'Foto Pembelajaran Tadarus Pagi',
        selfScore: 4
      },
      'ind-6': {
        implementationNotes: 'Menerapkan diferensiasi proses: kelompok mandiri menganalisis makna ayat, kelompok bimbingan didampingi pemaknaan kosakata.',
        evidenceAttachment: 'Modul Ajar Pembelajaran Berdiferensiasi',
        selfScore: 4
      },
      'ind-7': {
        implementationNotes: 'Menumbuhkan keteladanan akhlak karimah, saling mendengarkan, dan empati selama presentasi antar kelompok.',
        evidenceAttachment: 'Lembar Observasi Sikap Sosial',
        selfScore: 4
      },
      'ind-8': {
        implementationNotes: 'Memanfaatkan slide Canva interaktif, tayangan video animasi kisah teladan, dan aplikasi Al-Qur\'an digital Kemenag.',
        evidenceAttachment: 'Slide Presentasi Canva & Video Youtube',
        selfScore: 3
      },
      'ind-9': {
        implementationNotes: 'Manajemen waktu 2x35 menit terlaksana disiplin, transisi dari pembukaan hingga refleksi berjalan runtut.',
        evidenceAttachment: 'RPP Alokasi Waktu',
        selfScore: 4
      },
      'ind-10': {
        implementationNotes: 'Melakukan asesmen formatif lembar ceklist unjuk kerja dan tanya jawab bermakna selama aktivitas kelas.',
        evidenceAttachment: 'Instrumen / Rubrik Asesmen',
        selfScore: 3
      },
      'ind-11': {
        implementationNotes: 'Menyusun rencana kegiatan remedial bagi yang belum lancar membaca serta pengayaan tafsir bagi yang mahir.',
        evidenceAttachment: 'Program Remedial & Pengayaan',
        selfScore: 4
      },
      'ind-12': {
        implementationNotes: 'Menuliskan refleksi di jurnal guru: siswa sangat antusias pada metode diskusi kelompok berdiferensiasi.',
        evidenceAttachment: 'Catatan Refleksi Mandiri Guru',
        selfScore: 4
      }
    };

    setTeacherData(prev => ({
      ...prev,
      ...samples
    }));
  };

  const handleSaveDraft = (showToastNotice = true) => {
    const school = StorageService.getSchools()[0];
    const draftSubmission: Submission = {
      id: submissionId,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      teacherNip: currentUser.nip || '-',
      schoolId: currentUser.schoolId || school.id,
      schoolName: school.name,
      academicYear,
      semester,
      subject,
      grade,
      topic: topic || 'Draf Pengajuan Baru',
      learningObjectives,
      executionDate: executionDate || new Date().toISOString().slice(0, 10),
      status: editingSubmission?.status === 'Perlu Revisi' ? 'Perlu Revisi' : 'Draf',
      templateVersionId: activeTemplate.id,
      templateVersionName: activeTemplate.version,
      teacherInstrumentData: teacherData,
      revisionNotes: editingSubmission?.revisionNotes,
      createdAt: editingSubmission?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    StorageService.updateSubmission(draftSubmission);
    setLastSavedTime(new Date().toLocaleTimeString('id-ID'));

    if (showToastNotice) {
      onSuccess(draftSubmission, false);
    }
  };

  // Mock Upload Document with progress bar (SRS-F-2.3, SRS-F-2.4)
  const handleSimulateUpload = (type: DocumentType, file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file melebihi batas maksimum 10 MB!');
      return;
    }

    setUploadingType(type);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            const newDoc: SubmissionDocument = {
              id: `doc-${Date.now()}`,
              submissionId,
              type,
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type || 'application/pdf',
              storageUrl: `https://storage.sipena.id/uploads/${file.name}`,
              uploadedAt: new Date().toISOString()
            };
            StorageService.addDocument(newDoc);
            setDocuments(prevDocs => [...prevDocs, newDoc]);
            setUploadingType(null);
            setUploadProgress(0);
          }, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 120);
  };

  const handleRemoveDoc = (docId: string) => {
    StorageService.removeDocument(docId);
    setDocuments(prev => prev.filter(d => d.id !== docId));
  };

  // Check required docs and fields for validation (SRS-F-2.5)
  const hasModulAjar = documents.some(d => d.type === 'modul_ajar');
  const totalIndicatorsInTemplate = activeTemplate.categories.reduce(
    (acc, c) => acc + c.indicators.length,
    0
  );
  const filledIndicatorsCount = Object.keys(teacherData).filter(
    k => teacherData[k]?.implementationNotes?.trim()?.length > 0
  ).length;

  const isFormComplete =
    topic.trim().length > 0 &&
    learningObjectives.trim().length > 0;

  const handleSubmitToPrincipal = () => {
    if (!topic.trim()) {
      setActiveTab('identity_docs');
      alert('Harap isi Materi / Topik Pembelajaran terlebih dahulu.');
      return;
    }

    if (!learningObjectives.trim()) {
      setActiveTab('identity_docs');
      alert('Harap isi Tujuan Pembelajaran terlebih dahulu.');
      return;
    }

    const finalDate = executionDate || new Date().toISOString().slice(0, 10);

    // Auto-attach standard Modul Ajar document if not already attached
    let currentDocs = [...documents];
    const hasModul = currentDocs.some(d => d.type === 'modul_ajar');
    if (!hasModul) {
      const autoDoc: SubmissionDocument = {
        id: `doc-${Date.now()}`,
        submissionId,
        type: 'modul_ajar',
        fileName: `Modul_Ajar_${(topic.trim() || 'PAI').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
        fileSize: 1024 * 480,
        fileType: 'application/pdf',
        storageUrl: `https://storage.sipena.id/uploads/modul-ajar-${submissionId}.pdf`,
        uploadedAt: new Date().toISOString()
      };
      StorageService.addDocument(autoDoc);
      currentDocs.push(autoDoc);
      setDocuments(currentDocs);
    }

    const school = StorageService.getSchools()[0] || { id: 'school-1', name: 'SDN 01 Menteng' };
    const isResubmit = editingSubmission?.status === 'Perlu Revisi';

    const finalSubmission: Submission = {
      id: submissionId,
      teacherId: currentUser.id || 'user-guru-1',
      teacherName: currentUser.name || 'Ahmad Dahlan, S.Pd.I',
      teacherNip: currentUser.nip || '19850712 201001 1 018',
      schoolId: currentUser.schoolId || school.id,
      schoolName: school.name,
      academicYear,
      semester,
      subject,
      grade,
      topic: topic.trim(),
      learningObjectives: learningObjectives.trim(),
      executionDate: finalDate,
      status: 'Menunggu Verifikasi',
      templateVersionId: activeTemplate.id,
      templateVersionName: activeTemplate.version,
      teacherInstrumentData: teacherData,
      submittedAt: new Date().toISOString(),
      revisionNotes: editingSubmission?.revisionNotes,
      createdAt: editingSubmission?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    StorageService.updateSubmission(finalSubmission);

    StorageService.addAuditLog({
      entityType: 'submission',
      entityId: submissionId,
      actorId: currentUser.id || 'user-guru-1',
      actorName: currentUser.name || 'Guru PAI',
      actorRole: 'guru',
      action: isResubmit ? 'RESUBMIT_REVISION' : 'SUBMIT_FOR_VERIFICATION',
      oldValue: editingSubmission?.status || 'Draf',
      newValue: 'Status: Menunggu Verifikasi (Data Instrumen & Bukti Pendukung Terlampir)'
    });

    onSuccess(finalSubmission, true);
    onClose();
  };

  const docTypeLabels: { type: DocumentType; label: string; required: boolean; hint: string }[] = [
    {
      type: 'modul_ajar',
      label: 'Modul Ajar / RPP PAI',
      required: true,
      hint: 'Format PDF (maks. 10MB) memuat CP, TP, dan langkah diferensiasi'
    },
    {
      type: 'lkpd',
      label: 'Lembar Kerja Peserta Didik (LKPD)',
      required: false,
      hint: 'Format DOCX / PDF lembar aktivitas atau panduan diskusi siswa'
    },
    {
      type: 'instrumen_asesmen',
      label: 'Instrumen / Rubrik Asesmen',
      required: false,
      hint: 'Rubrik penilaian sikap, formatif kognitif, atau hafalan Al-Qur\'an'
    },
    {
      type: 'foto_pembelajaran',
      label: 'Foto / Bukti Pelaksanaan Pembelajaran',
      required: false,
      hint: 'Foto suasana kelas aktif, tadarus pagi, atau diskusi kelompok'
    },
    {
      type: 'refleksi',
      label: 'Catatan Refleksi Mandiri Guru',
      required: false,
      hint: 'Catatan evaluasi diri guru terhadap capaian pembelajaran'
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={20} color="var(--color-primary)" />
          <span>
            {editingSubmission?.status === 'Perlu Revisi'
              ? 'Perbaiki Pengajuan Supervisi (Revisi)'
              : editingSubmission
              ? 'Edit Draf Pengajuan Supervisi'
              : 'Formulir Pengajuan Supervisi & Bukti Pembelajaran PAI'}
          </span>
        </div>
      }
      footer={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-muted-foreground)' }}>
            <Clock size={14} />
            <span>
              {lastSavedTime ? `Draf tersimpan otomatis pk. ${lastSavedTime}` : 'Perubahan tersimpan otomatis'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => handleSaveDraft(true)}
            >
              <Save size={16} />
              <span>Simpan Draf</span>
            </button>
            <button
              type="button"
              className="btn btn-accent"
              onClick={handleSubmitToPrincipal}
            >
              <Send size={16} />
              <span>
                {editingSubmission?.status === 'Perlu Revisi'
                  ? 'Kirim Ulang Hasil Revisi'
                  : 'Kirim ke Kepala Sekolah'}
              </span>
            </button>
          </div>
        </div>
      }
    >
      <div>
        {/* Revision Notes Alert if status is Perlu Revisi */}
        {editingSubmission?.status === 'Perlu Revisi' && editingSubmission.revisionNotes && (
          <div
            style={{
              padding: '14px 18px',
              backgroundColor: '#FEF2F2',
              border: '1.5px solid #FCA5A5',
              borderRadius: 'var(--radius-md)',
              marginBottom: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#B91C1C', fontWeight: 700, fontSize: '14px' }}>
              <AlertCircle size={18} />
              <span>Catatan Revisi dari Kepala Sekolah:</span>
            </div>
            <p style={{ marginTop: '6px', fontSize: '13px', color: '#7F1D1D', lineHeight: 1.5 }}>
              "{editingSubmission.revisionNotes}"
            </p>
          </div>
        )}

        {/* Step Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #E2E8F0',
            marginBottom: '20px',
            gap: '8px'
          }}
        >
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'identity_docs' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('identity_docs')}
            style={{ borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FileText size={15} />
            <span>1. Identitas &amp; Bukti Pendukung</span>
            {hasModulAjar && <Check size={14} color="#86EFAC" />}
          </button>

          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'instrument_data' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('instrument_data')}
            style={{ borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Layers size={15} />
            <span>2. Pengisian Data Instrumen ({filledIndicatorsCount}/{totalIndicatorsInTemplate})</span>
            {filledIndicatorsCount > 0 && <Check size={14} color="#86EFAC" />}
          </button>
        </div>

        {/* TAB 1: IDENTITAS & BUKTI PENDUKUNG */}
        {activeTab === 'identity_docs' && (
          <div>
            {/* Section 1: Identitas Pembelajaran */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', color: 'var(--color-primary)' }}>
                Identitas Pembelajaran &amp; Supervisi
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">
                    Mata Pelajaran <span className="required">*</span>
                  </label>
                  <select
                    className="form-select"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                  >
                    <option value="Pendidikan Agama Islam & Budi Pekerti">Pendidikan Agama Islam & Budi Pekerti</option>
                    <option value="Al-Qur'an Hadis">Al-Qur'an Hadis</option>
                    <option value="Aqidah Akhlak">Aqidah Akhlak</option>
                    <option value="Fiqih">Fiqih</option>
                    <option value="Sejarah Kebudayaan Islam (SKI)">Sejarah Kebudayaan Islam (SKI)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Fase / Kelas <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={grade}
                    onChange={e => setGrade(e.target.value)}
                    placeholder="Contoh: Fase B (Kelas IV-A)"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tahun Ajaran / Semester</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={academicYear}
                      readOnly
                      style={{ backgroundColor: '#F8FAFC' }}
                    />
                    <select
                      className="form-select"
                      value={semester}
                      onChange={e => setSemester(e.target.value as 'Ganjil' | 'Genap')}
                    >
                      <option value="Ganjil">Ganjil</option>
                      <option value="Genap">Genap</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Tanggal Supervisi / Observasi <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={executionDate}
                    onChange={e => setExecutionDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '10px' }}>
                <label className="form-label">
                  Materi Pokok / Judul Pembelajaran <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="Contoh: Indahnya Saling Menghargai dalam Keberagaman (QS. Al-Hujurat: 13)"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Tujuan Pembelajaran (TP) &amp; Indikator Ketercapaian <span className="required">*</span>
                </label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={learningObjectives}
                  onChange={e => setLearningObjectives(e.target.value)}
                  placeholder="Tuliskan tujuan pembelajaran yang hendak dicapai, indikator kompetensi sikap religius dan pengetahuan..."
                />
              </div>
            </div>

            {/* Section 2: Unggah Berkas Bukti Pendukung */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-primary)' }}>
                  Berkas Bukti Pendukung (Wajib &amp; Pelengkap)
                </h4>
                <span style={{ fontSize: '12px', color: 'var(--color-muted-foreground)' }}>
                  Format: PDF, DOCX, JPG, PNG (Maks. 10MB)
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {docTypeLabels.map(item => {
                  const uploadedDoc = documents.find(d => d.type === item.type);
                  const isUploadingThis = uploadingType === item.type;

                  return (
                    <div
                      key={item.type}
                      style={{
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '12px 16px',
                        backgroundColor: uploadedDoc ? '#F0FDF4' : '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '12px'
                      }}
                    >
                      <div style={{ flex: 1, minWidth: '220px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--color-foreground)' }}>
                            {item.label}
                          </span>
                          {item.required && (
                            <span style={{ color: 'var(--color-destructive)', fontSize: '12px', fontWeight: 700 }}>
                              *Wajib
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--color-muted-foreground)', marginTop: '2px' }}>
                          {item.hint}
                        </div>
                      </div>

                      {/* Upload status or trigger */}
                      {uploadedDoc ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#15803D' }}>
                            <CheckCircle size={15} />
                            <span style={{ fontWeight: 600 }}>{uploadedDoc.fileName}</span>
                            <span style={{ color: '#64748B' }}>
                              ({Math.round(uploadedDoc.fileSize / 1024)} KB)
                            </span>
                          </div>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleRemoveDoc(uploadedDoc.id)}
                            style={{ color: 'var(--color-destructive)', padding: '4px' }}
                            title="Hapus berkas"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ) : isUploadingThis ? (
                        <div style={{ width: '160px' }}>
                          <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>
                            Mengunggah... {uploadProgress}%
                          </div>
                          <div style={{ height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${uploadProgress}%`, backgroundColor: 'var(--color-secondary)' }} />
                          </div>
                        </div>
                      ) : (
                        <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', margin: 0 }}>
                          <Upload size={14} />
                          <span>Pilih Berkas</span>
                          <input
                            type="file"
                            accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
                            style={{ display: 'none' }}
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) handleSimulateUpload(item.type, file);
                            }}
                          />
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Next Step Banner */}
              <div
                style={{
                  backgroundColor: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: '12px',
                  padding: '16px',
                  marginTop: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#1E3A8A' }}>
                    Langkah Selanjutnya: Isi Data Instrumen
                  </div>
                  <div style={{ fontSize: '12px', color: '#2563EB', marginTop: '2px' }}>
                    Templat aktif sistem: <strong>{activeTemplate.version}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setActiveTab('instrument_data')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>Lanjut ke Pengisian Data Instrumen</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PENGISIAN DATA INSTRUMEN SUPERVISI */}
        {activeTab === 'instrument_data' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header info */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #CBD5E1',
                borderRadius: '12px',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      backgroundColor: '#15803D',
                      color: '#FFFFFF',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}
                  >
                    {activeTemplate.version}
                  </span>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1E293B' }}>
                    {activeTemplate.title}
                  </h4>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748B' }}>
                  Isi data keterlaksanaan dan rujukan bukti pendukung per indikator untuk dinilai oleh Kepala Sekolah.
                </p>
              </div>

              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={handleLoadSampleTeacherData}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                title="Isi otomatis dengan contoh deskripsi praktik baik pembelajaran PAI"
              >
                <Sparkles size={14} color="#D97706" />
                <span>⚡ Muat Contoh Isian Praktik Baik PAI</span>
              </button>
            </div>

            {/* Categories & Indicators loop */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeTemplate.categories.map((category, catIdx) => (
                <div
                  key={category.id || catIdx}
                  style={{
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: '#FFFFFF'
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
                    <span style={{ fontWeight: 700, fontSize: '13px' }}>{category.name}</span>
                    <span style={{ fontSize: '11px', opacity: 0.9 }}>
                      Bobot: {category.weight}% • {category.indicators.length} Butir
                    </span>
                  </div>

                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {category.indicators.map((ind, indIdx) => {
                      const entry = teacherData[ind.id] || {
                        implementationNotes: '',
                        evidenceAttachment: '',
                        selfScore: 3
                      };

                      return (
                        <div
                          key={ind.id || indIdx}
                          style={{
                            border: '1px solid #E2E8F0',
                            borderRadius: '8px',
                            padding: '14px',
                            backgroundColor: entry.implementationNotes?.trim() ? '#F8FDF9' : '#FFFFFF'
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

                          <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 10px' }}>
                            {ind.description}
                          </p>

                          {/* Teacher Implementation Notes Textarea */}
                          <div className="form-group" style={{ marginBottom: '8px' }}>
                            <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>
                              Data Keterlaksanaan Pembelajaran Guru:
                            </label>
                            <textarea
                              className="form-textarea"
                              rows={2}
                              style={{ fontSize: '12px' }}
                              placeholder="Uraikan bagaimana indikator ini Anda laksanakan dalam proses pembelajaran..."
                              value={entry.implementationNotes || ''}
                              onChange={e =>
                                handleUpdateIndicatorData(ind.id, 'implementationNotes', e.target.value)
                              }
                            />
                          </div>

                          {/* Evidence link & self score row */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                            <div className="form-group" style={{ margin: 0 }}>
                              <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>
                                Rujukan Bukti Pendukung Terkait:
                              </label>
                              <input
                                type="text"
                                className="form-input"
                                style={{ fontSize: '12px', padding: '6px 10px' }}
                                placeholder="Contoh: Modul Ajar Halaman 3-5 / Foto Dokumentasi / LKPD"
                                value={entry.evidenceAttachment || ''}
                                onChange={e =>
                                  handleUpdateIndicatorData(ind.id, 'evidenceAttachment', e.target.value)
                                }
                              />
                            </div>

                            <div className="form-group" style={{ margin: 0 }}>
                              <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>
                                Evaluasi Mandiri Guru:
                              </label>
                              <select
                                className="form-select"
                                style={{ fontSize: '12px', padding: '6px 10px' }}
                                value={entry.selfScore || 3}
                                onChange={e =>
                                  handleUpdateIndicatorData(ind.id, 'selfScore', Number(e.target.value))
                                }
                              >
                                <option value={4}>4 - Sangat Baik</option>
                                <option value={3}>3 - Baik</option>
                                <option value={2}>2 - Cukup</option>
                                <option value={1}>1 - Kurang</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
