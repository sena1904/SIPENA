export type UserRole = 'guru' | 'kepala_sekolah' | 'pengawas' | 'admin';

export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  nip?: string;
  schoolId?: string; // Default primary school
  title?: string;
  avatarUrl?: string;
}

export interface School {
  id: string;
  name: string;
  npsn: string;
  address: string;
  district: string;
  level: 'SD' | 'SMP' | 'SMA' | 'SMK';
  headmasterName: string;
}

export interface SchoolAssignment {
  id: string;
  userId: string;
  schoolId: string;
  roleType: 'kepala_sekolah' | 'pengawas';
  academicYear: string;
}

export interface Teacher {
  id: string;
  userId: string;
  schoolIds: string[];
  subject: string;
  gradeLevel: string;
}

export type SubmissionStatus =
  | 'Draf'
  | 'Menunggu Verifikasi'
  | 'Perlu Revisi'
  | 'Dalam Penilaian'
  | 'Menunggu Pengesahan'
  | 'Diproses untuk Publikasi'
  | 'Tersedia bagi Pengawas'
  | 'Ditinjau Pengawas'
  | 'Tindak Lanjut';

export type DocumentType =
  | 'modul_ajar'
  | 'lkpd'
  | 'instrumen_asesmen'
  | 'foto_pembelajaran'
  | 'refleksi';

export interface SubmissionDocument {
  id: string;
  submissionId: string;
  type: DocumentType;
  fileName: string;
  fileSize: number; // in bytes
  fileType: string;
  storageUrl: string;
  uploadedAt: string;
}

export interface TeacherIndicatorEntry {
  implementationNotes: string; // Deskripsi pelaksanaan pembelajaran / data isian guru
  evidenceAttachment?: string; // Tautan / rujukan berkas bukti pendukung
  selfScore?: number; // Skor mandiri guru (1 - 4)
}

export interface Submission {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherNip: string;
  schoolId: string;
  schoolName: string;
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
  subject: string;
  grade: string;
  topic: string;
  learningObjectives: string;
  executionDate: string;
  status: SubmissionStatus;
  templateVersionId?: string; // Rujukan ke versi template instrumen dari Admin
  templateVersionName?: string; // Nama versi template instrumen
  teacherInstrumentData?: Record<string, TeacherIndicatorEntry>; // Isian data instrumen oleh Guru per indikator
  revisionNotes?: string;
  revisionDate?: string;
  submittedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Indicator {
  id: string;
  code: string;
  label: string;
  description: string;
  rubric: {
    1: string;
    2: string;
    3: string;
    4: string;
  };
}

export interface AssessmentCategory {
  id: string;
  name: string;
  weight: number; // percentage, sum = 100
  indicators: Indicator[];
}

export interface AssessmentTemplate {
  id: string;
  version: string;
  title: string;
  description: string;
  isActive: boolean;
  categories: AssessmentCategory[];
  createdAt: string;
}

export interface AssessmentAnswer {
  id: string;
  submissionId: string;
  templateVersionId: string;
  scores: Record<string, number>; // indicatorId -> score (1 - 4)
  notes: Record<string, string>; // indicatorId -> observation note
  overallFindings: string;
  overallRecommendation: string;
  assessedBy: string;
  assessedAt: string;
}

export type PredicateType = 'Amat Baik' | 'Baik' | 'Cukup' | 'Kurang';

export interface SupervisionReport {
  id: string;
  submissionId: string;
  templateVersionId: string;
  templateVersionName: string;
  finalScore: number;
  predicate: PredicateType;
  endorsedBy: string;
  endorserNip: string;
  endorsedAt: string;
  pdfUrl?: string;
  isImmutable: boolean;
}

export type FollowUpProgress = 'Belum Dimulai' | 'Sedang Berjalan' | 'Selesai';

export interface FollowUp {
  id: string;
  reportId: string;
  submissionId: string;
  supervisorId: string;
  supervisorName: string;
  recommendations: string;
  targetImprovement: string;
  dueDate: string;
  progress: FollowUpProgress;
  progressNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type IntegrationService = 'Google Drive' | 'Google Sheets';
export type IntegrationStatus = 'Berhasil' | 'Gagal' | 'Memproses';

export interface IntegrationLog {
  id: string;
  reportId: string;
  submissionId: string;
  service: IntegrationService;
  status: IntegrationStatus;
  attemptCount: number;
  message: string;
  payloadSummary: string;
  externalUrl?: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
}
