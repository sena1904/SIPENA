import {
  User,
  School,
  SchoolAssignment,
  Teacher,
  AssessmentTemplate,
  Submission,
  SubmissionDocument,
  AssessmentAnswer,
  SupervisionReport,
  FollowUp,
  IntegrationLog,
  AuditLog
} from '../types';

export const initialSchools: School[] = [
  {
    id: 'school-1',
    name: 'SDN 01 Menteng Jakarta Pusat',
    npsn: '20108342',
    address: 'Jl. Besuki No. 4, RT.3/RW.5, Menteng, Kota Jakarta Pusat',
    district: 'Menteng',
    level: 'SD',
    headmasterName: 'Drs. H. Suryanto, M.Pd'
  },
  {
    id: 'school-2',
    name: 'SDN Cikini 02 Pagi',
    npsn: '20109112',
    address: 'Jl. Cikini Raya No. 73, Menteng, Kota Jakarta Pusat',
    district: 'Menteng',
    level: 'SD',
    headmasterName: 'Hj. Nurhayati, S.Pd., M.M.'
  },
  {
    id: 'school-3',
    name: 'SMPN 1 Jakarta',
    npsn: '20102551',
    address: 'Jl. Cikini Raya No. 87, Menteng, Kota Jakarta Pusat',
    district: 'Menteng',
    level: 'SMP',
    headmasterName: 'Bambang Irawan, M.Pd.'
  }
];

export const initialUsers: User[] = [
  {
    id: 'user-guru-1',
    name: 'Ahmad Dahlan, S.Pd.I',
    email: 'ahmad.dahlan@sekolah.belajar.id',
    role: 'guru',
    status: 'active',
    nip: '19850712 201001 1 018',
    schoolId: 'school-1',
    title: 'Guru PAI & Budi Pekerti (Fase B & C)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-guru-2',
    name: 'Siti Aminah, S.Ag',
    email: 'siti.aminah@sekolah.belajar.id',
    role: 'guru',
    status: 'active',
    nip: '19880914 201202 2 009',
    schoolId: 'school-1',
    title: 'Guru PAI & Budi Pekerti (Fase A)',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-ks-1',
    name: 'Drs. H. Suryanto, M.Pd',
    email: 'suryanto.ks@sekolah.belajar.id',
    role: 'kepala_sekolah',
    status: 'active',
    nip: '19680315 199403 1 004',
    schoolId: 'school-1',
    title: 'Kepala SDN 01 Menteng',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-pengawas-1',
    name: 'Dra. Hj. Siti Fatimah, M.Pd',
    email: 'siti.fatimah@kemenag.go.id',
    role: 'pengawas',
    status: 'active',
    nip: '19651120 199002 2 001',
    title: 'Pengawas Madya PAI Wilayah Menteng',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-admin-1',
    name: 'Muchsin Alatas, L.c',
    email: 'admin.sipena@kemenag.go.id',
    role: 'admin',
    status: 'active',
    nip: '19920401 201503 1 002',
    title: 'Administrator Teknis SIPENA PAI',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  }
];

export const initialSchoolAssignments: SchoolAssignment[] = [
  {
    id: 'assign-1',
    userId: 'user-ks-1',
    schoolId: 'school-1',
    roleType: 'kepala_sekolah',
    academicYear: '2026/2027'
  },
  {
    id: 'assign-2',
    userId: 'user-pengawas-1',
    schoolId: 'school-1',
    roleType: 'pengawas',
    academicYear: '2026/2027'
  },
  {
    id: 'assign-3',
    userId: 'user-pengawas-1',
    schoolId: 'school-2',
    roleType: 'pengawas',
    academicYear: '2026/2027'
  },
  {
    id: 'assign-4',
    userId: 'user-pengawas-1',
    schoolId: 'school-3',
    roleType: 'pengawas',
    academicYear: '2026/2027'
  }
];

export const initialTeachers: Teacher[] = [
  {
    id: 'teacher-1',
    userId: 'user-guru-1',
    schoolIds: ['school-1'],
    subject: 'Pendidikan Agama Islam dan Budi Pekerti',
    gradeLevel: 'Kelas IV & V'
  },
  {
    id: 'teacher-2',
    userId: 'user-guru-2',
    schoolIds: ['school-1', 'school-2'], // Many-to-many honorer support as in PRD!
    subject: 'Pendidikan Agama Islam dan Budi Pekerti',
    gradeLevel: 'Kelas I & II'
  }
];

export const initialAssessmentTemplates: AssessmentTemplate[] = [
  {
    id: 'tmpl-v2.1',
    version: 'v2.1 - Kurikulum Merdeka PAI 2026',
    title: 'Instrumen Supervisi Akademik Pembelajaran PAI Terpadu',
    description: 'Standar instrumen supervisi PAI resmi mengacu pada regulasi Direktorat PAI Ditjen Pendis Kemenag & Kemendikbudristek.',
    isActive: true,
    createdAt: '2026-07-01T08:00:00Z',
    categories: [
      {
        id: 'cat-perencanaan',
        name: 'A. Perencanaan Pembelajaran (Modul Ajar / RPP)',
        weight: 30,
        indicators: [
          {
            id: 'ind-1',
            code: 'A.1',
            label: 'Kesesuaian Capaian Pembelajaran (CP) dan Tujuan Pembelajaran (TP)',
            description: 'TP dirumuskan secara operasional dengan mengintegrasikan kompetensi pengetahuan, keterampilan, dan sikap religius.',
            rubric: {
              1: 'TP tidak mencerminkan CP dan tidak dapat diukur.',
              2: 'TP mencerminkan CP tetapi belum sepenuhnya terukur.',
              3: 'TP sesuai CP, terukur, dan mencakup pengetahuan serta sikap.',
              4: 'TP sangat komprehensif, operasional, berorientasi HOTS & penguatan karakter.'
            }
          },
          {
            id: 'ind-2',
            code: 'A.2',
            label: 'Rancangan Asesmen Diagnostik Kognitif dan Non-Kognitif',
            description: 'Tersedia instrumen awal untuk memetakan kesiapan belajar, gaya belajar, dan minat peserta didik.',
            rubric: {
              1: 'Tidak ada asesmen diagnostik yang dirancang.',
              2: 'Asesmen diagnostik ada namun sangat formalitas dan belum memetakan kebutuhan.',
              3: 'Asesmen diagnostik dirancang dengan jelas untuk mengidentifikasi kesiapan siswa.',
              4: 'Asesmen diagnostik komprehensif dan menjadi dasar diferensiasi pembelajaran.'
            }
          },
          {
            id: 'ind-3',
            code: 'A.3',
            label: 'Integrasi Profil Pelajar Pancasila & Nilai Moderasi Beragama',
            description: 'Memuat nilai Beriman Bertakwa, Berakhlak Mulia, Kebinekaan Global, serta nilai Wasathiyah (Tasamuh, Tawazun).',
            rubric: {
              1: 'Tidak ada penulisan Profil Pelajar maupun nilai moderasi.',
              2: 'Tertulis hanya sebatas redaksional tanpa skenario implementasi di langkah pembelajaran.',
              3: 'Terintegrasi dalam beberapa kegiatan inti pembelajaran.',
              4: 'Terintegrasi secara organik dan nyata di seluruh tahapan pembelajaran PAI.'
            }
          },
          {
            id: 'ind-4',
            code: 'A.4',
            label: 'Kelengkapan Bahan Ajar, LKPD, dan Media Pembelajaran',
            description: 'Bahan ajar dan LKPD mendukung kemandirian belajar dan pemahaman konsep secara mendalam.',
            rubric: {
              1: 'LKPD dan bahan ajar tidak tersedia atau fotokopi tidak layak.',
              2: 'Bahan ajar minim dan LKPD hanya berisi soal pilihan ganda sederhana.',
              3: 'LKPD terstruktur baik, menuntun pemahaman konsep siswa.',
              4: 'LKPD inovatif, kontekstual, berbasis masalah / studi kasus nyata kehidupan.'
            }
          }
        ]
      },
      {
        id: 'cat-pelaksanaan',
        name: 'B. Pelaksanaan Pembelajaran di Kelas / Observasi',
        weight: 45,
        indicators: [
          {
            id: 'ind-5',
            code: 'B.1',
            label: 'Apersepsi Bermakna & Pembiasaan Doa / Tadarus Al-Qur\'an',
            description: 'Membuka pelajaran dengan adab Islami, tadarus terarah, dan menghubungkan materi dengan pengalaman nyata.',
            rubric: {
              1: 'Pelajaran dibuka tergesa-gesa tanpa apersepsi dan pembiasaan adab.',
              2: 'Hanya berdoa singkat tanpa motivasi dan kaitan apersepsi.',
              3: 'Apersepsi terarah dan pembiasaan tadarus berjalan tertib.',
              4: 'Sangat khidmat, inspiratif, membangkitkan rasa ingin tahu peserta didik.'
            }
          },
          {
            id: 'ind-6',
            code: 'B.2',
            label: 'Penerapan Pembelajaran Berdiferensiasi (Konten/Proses/Produk)',
            description: 'Guru memfasilitasi kebutuhan belajar siswa yang beragam sesuai hasil asesmen diagnostik.',
            rubric: {
              1: 'Guru mengajar secara seragam (one-size-fits-all) tanpa diferensiasi.',
              2: 'Diferensiasi hanya sebatas variasi kecepatan tugas, bukan strategi.',
              3: 'Menerapkan diferensiasi proses atau konten dengan kelompok fleksibel.',
              4: 'Diferensiasi proses dan produk berjalan sangat alami, siswa terlayani optimal.'
            }
          },
          {
            id: 'ind-7',
            code: 'B.3',
            label: 'Internalisasi Nilai Karakter Islami (Akhlak Karimah)',
            description: 'Menumbuhkan keteladanan, rasa hormat, kejujuran, dan empati selama interaksi belajar.',
            rubric: {
              1: 'Guru hanya fokus materi kognitif tanpa pembinaan akhlak.',
              2: 'Pemberian nasihat akhlak hanya bersifat teguran sporadis.',
              3: 'Guru memberikan teladan dan mengaitkan materi dengan akhlak sehari-hari.',
              4: 'Pemberdayaan kultur akhlak karimah sangat kuat dan tercermin pada perilaku siswa.'
            }
          },
          {
            id: 'ind-8',
            code: 'B.4',
            label: 'Pemanfaatan Media Pembelajaran Digital / Interaktif (TIK)',
            description: 'Memanfaatkan media digital (video kisah teladan, presentasi interaktif, aplikasi Al-Qur\'an digital).',
            rubric: {
              1: 'Hanya menggunakan metode ceramah konvensional tanpa media.',
              2: 'Media terbatas pada buku teks pegangan guru.',
              3: 'Memanfaatkan media visual/audio digital yang relevan.',
              4: 'Memanfaatkan teknologi secara interaktif dan menstimulasi eksplorasi mandiri.'
            }
          },
          {
            id: 'ind-9',
            code: 'B.5',
            label: 'Manajemen Kelas, Keterlibatan Siswa, & Pengelolaan Waktu',
            description: 'Suasana belajar kondusif, demokratis, aktif, dan alokasi waktu terpenuhi sesuai modul.',
            rubric: {
              1: 'Kelas pasif atau gaduh tak terkendali, waktu terlampaui jauh.',
              2: 'Sebagian besar siswa pasif, interaksi satu arah.',
              3: 'Siswa aktif berpartisipasi dan waktu terkelola dengan baik.',
              4: 'Seluruh siswa sangat antusias, interaksi dinamis, manajemen waktu presisi.'
            }
          }
        ]
      },
      {
        id: 'cat-evaluasi',
        name: 'C. Evaluasi, Asesmen, dan Refleksi Pembelajaran',
        weight: 25,
        indicators: [
          {
            id: 'ind-10',
            code: 'C.1',
            label: 'Penerapan Asesmen Formatif Selama Proses Belajar',
            description: 'Mengukur pemahaman siswa di tengah pembelajaran (tanya jawab reflektif, kuis cepat, lembar ceklist).',
            rubric: {
              1: 'Tidak ada asesmen formatif selama proses belajar.',
              2: 'Hanya bertanya "apakah sudah paham?" tanpa instrumen terarah.',
              3: 'Melakukan asesmen formatif dengan teknik yang sesuai tujuan pembelajaran.',
              4: 'Asesmen formatif memberikan umpan balik langsung (constructive feedback) seketika.'
            }
          },
          {
            id: 'ind-11',
            code: 'C.2',
            label: 'Perencanaan Tindak Lanjut: Remedial dan Pengayaan',
            description: 'Tersedia rencana terprogram bagi siswa yang belum tuntas dan pengayaan bagi yang cepat paham.',
            rubric: {
              1: 'Tidak ada program remedial maupun pengayaan.',
              2: 'Remedial hanya sebatas menyuruh membaca ulang buku.',
              3: 'Tersedia program remedial dan pengayaan yang terencana.',
              4: 'Program remedial dan pengayaan adaptif sesuai kesulitan spesifik siswa.'
            }
          },
          {
            id: 'ind-12',
            code: 'C.3',
            label: 'Catatan Refleksi Diri Guru dan Evaluasi Ketercapaian',
            description: 'Guru menuliskan refleksi kritis tentang keberhasilan, kendala, dan komitmen perbaikan berikutnya.',
            rubric: {
              1: 'Guru tidak membuat catatan refleksi.',
              2: 'Catatan refleksi sangat singkat dan klise.',
              3: 'Refleksi mencakup kekuatan dan hal yang perlu ditingkatkan.',
              4: 'Refleksi mendalam dengan rencana perbaikan konkret untuk pertemuan selanjutnya.'
            }
          }
        ]
      }
    ]
  }
];

export const initialDocuments: SubmissionDocument[] = [
  {
    id: 'doc-1',
    submissionId: 'SUB-2026-001',
    type: 'modul_ajar',
    fileName: 'Modul_Ajar_PAI_Kelas4_Indahnya_Saling_Menghargai.pdf',
    fileSize: 2450000,
    fileType: 'application/pdf',
    storageUrl: 'https://example.com/storage/modul_ajar_001.pdf',
    uploadedAt: '2026-10-12T09:30:00Z'
  },
  {
    id: 'doc-2',
    submissionId: 'SUB-2026-001',
    type: 'lkpd',
    fileName: 'LKPD_Aktivitas_Kelompok_Keberagaman_Bangsa.docx',
    fileSize: 1120000,
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    storageUrl: 'https://example.com/storage/lkpd_001.docx',
    uploadedAt: '2026-10-12T09:35:00Z'
  },
  {
    id: 'doc-3',
    submissionId: 'SUB-2026-001',
    type: 'instrumen_asesmen',
    fileName: 'Rubrik_Penilaian_Sikap_dan_Kognitif_TP1.pdf',
    fileSize: 850000,
    fileType: 'application/pdf',
    storageUrl: 'https://example.com/storage/asesmen_001.pdf',
    uploadedAt: '2026-10-12T09:40:00Z'
  },
  {
    id: 'doc-4',
    submissionId: 'SUB-2026-001',
    type: 'foto_pembelajaran',
    fileName: 'Dokumentasi_Diskusi_Kelompok_dan_Tadarus.jpg',
    fileSize: 3200000,
    fileType: 'image/jpeg',
    storageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
    uploadedAt: '2026-10-12T09:42:00Z'
  },
  {
    id: 'doc-5',
    submissionId: 'SUB-2026-001',
    type: 'refleksi',
    fileName: 'Lembar_Refleksi_Guru_Pertemuan_1_2.pdf',
    fileSize: 620000,
    fileType: 'application/pdf',
    storageUrl: 'https://example.com/storage/refleksi_001.pdf',
    uploadedAt: '2026-10-12T09:45:00Z'
  },
  {
    id: 'doc-6',
    submissionId: 'SUB-2026-002',
    type: 'modul_ajar',
    fileName: 'Modul_Ajar_PAI_Kelas5_Kisah_Teladan_Nabi_Muhammad.pdf',
    fileSize: 2100000,
    fileType: 'application/pdf',
    storageUrl: 'https://example.com/storage/modul_ajar_002.pdf',
    uploadedAt: '2026-10-15T08:15:00Z'
  },
  {
    id: 'doc-7',
    submissionId: 'SUB-2026-002',
    type: 'lkpd',
    fileName: 'LKPD_Analisis_Peta_Konsep_Hijrah.pdf',
    fileSize: 950000,
    fileType: 'application/pdf',
    storageUrl: 'https://example.com/storage/lkpd_002.pdf',
    uploadedAt: '2026-10-15T08:20:00Z'
  },
  {
    id: 'doc-8',
    submissionId: 'SUB-2026-003',
    type: 'modul_ajar',
    fileName: 'Modul_Ajar_PAI_Kelas1_Rukun_Iman_Ciptaan_Allah.pdf',
    fileSize: 1800000,
    fileType: 'application/pdf',
    storageUrl: 'https://example.com/storage/modul_ajar_003.pdf',
    uploadedAt: '2026-10-16T11:00:00Z'
  }
];

export const initialSubmissions: Submission[] = [
  {
    id: 'SUB-2026-001',
    teacherId: 'user-guru-1',
    teacherName: 'Ahmad Dahlan, S.Pd.I',
    teacherNip: '19850712 201001 1 018',
    schoolId: 'school-1',
    schoolName: 'SDN 01 Menteng Jakarta Pusat',
    academicYear: '2026/2027',
    semester: 'Ganjil',
    subject: 'Pendidikan Agama Islam & Budi Pekerti',
    grade: 'Fase B (Kelas IV-A)',
    topic: 'Indahnya Saling Menghargai dalam Keberagaman (QS. Al-Hujurat: 13)',
    learningObjectives: 'Peserta didik mampu menjelaskan pesan pokok QS. Al-Hujurat: 13 tentang keragaman manusia, mempraktikkan sikap saling menghargai dan toleran antar sesama dalam kehidupan sehari-hari.',
    executionDate: '2026-10-14',
    status: 'Tindak Lanjut',
    templateVersionId: 'tmpl-v2.1',
    templateVersionName: 'v2.1 - Kurikulum Merdeka PAI 2026',
    teacherInstrumentData: {
      'ind-1': {
        implementationNotes: 'TP dirumuskan secara operasional dengan mengintegrasikan ranah kognitif, afektif (sikap toleran), dan keterampilan membaca QS. Al-Hujurat: 13.',
        evidenceAttachment: 'Modul Ajar Bab 2 Hal. 4',
        selfScore: 4
      },
      'ind-2': {
        implementationNotes: 'Melakukan pemetaan awal dengan lembar ceklist minat dan kesiapan membaca Al-Qur\'an siswa.',
        evidenceAttachment: 'Lampiran Asesmen Diagnostik',
        selfScore: 4
      },
      'ind-3': {
        implementationNotes: 'Mengintegrasikan nilai Tasamuh (toleransi) dan kebinekaan global pada kegiatan diskusi kelompok studi kasus keragaman suku.',
        evidenceAttachment: 'Modul Ajar Langkah Kegiatan Inti',
        selfScore: 4
      },
      'ind-4': {
        implementationNotes: 'LKPD berbasis studi kasus bergambar disiapkan untuk 3 tingkatan kemampuan siswa.',
        evidenceAttachment: 'Berkas LKPD Diferensiasi',
        selfScore: 3
      },
      'ind-5': {
        implementationNotes: 'Pembelajaran diawali dengan tadarus bersama QS. Al-Hujurat ayat 13 dan apersepsi video keragaman budaya nusantara.',
        evidenceAttachment: 'Foto Pembelajaran Tadarus Pagi',
        selfScore: 4
      },
      'ind-6': {
        implementationNotes: 'Menerapkan diferensiasi proses: kelompok mahir menganalisis tafsir ringkas, kelompok berkembang dibimbing pemaknaan kosakata.',
        evidenceAttachment: 'Modul Ajar Skenario Pembelajaran Berdiferensiasi',
        selfScore: 4
      },
      'ind-7': {
        implementationNotes: 'Membiasakan budaya saling menghargai pendapat saat presentasi kelompok berlangsung.',
        evidenceAttachment: 'Lembar Observasi Sikap Sosial',
        selfScore: 4
      },
      'ind-8': {
        implementationNotes: 'Menayangkan slide presentasi interaktif Canva dan pemutaran audio murottal Al-Qur\'an bersuara merdu.',
        evidenceAttachment: 'Slide Presentasi Canva & Video Youtube',
        selfScore: 3
      },
      'ind-9': {
        implementationNotes: 'Pengelolaan waktu 2x35 menit berjalan sesuai jadwal dengan transisi antar fase yang tertib.',
        evidenceAttachment: 'RPP Alokasi Waktu',
        selfScore: 4
      },
      'ind-10': {
        implementationNotes: 'Menggunakan kuis refleksi singkat di tengah pembelajaran untuk memantau pemahaman konsep toleransi.',
        evidenceAttachment: 'Lembar Asesmen Formatif Cepat',
        selfScore: 3
      },
      'ind-11': {
        implementationNotes: 'Menyusun materi pengayaan bagi siswa yang telah hafal dan remedial bimbingan makhraj huruf.',
        evidenceAttachment: 'Rencana Program Remedial & Pengayaan',
        selfScore: 4
      },
      'ind-12': {
        implementationNotes: 'Menuliskan catatan refleksi di jurnal mengajar: siswa sangat antusias pada metode diskusi studi kasus.',
        evidenceAttachment: 'Jurnal Refleksi Mandiri Guru',
        selfScore: 4
      }
    },
    submittedAt: '2026-10-12T10:00:00Z',
    verifiedAt: '2026-10-13T08:30:00Z',
    verifiedBy: 'Drs. H. Suryanto, M.Pd',
    createdAt: '2026-10-11T14:00:00Z',
    updatedAt: '2026-10-17T15:00:00Z'
  },
  {
    id: 'SUB-2026-002',
    teacherId: 'user-guru-1',
    teacherName: 'Ahmad Dahlan, S.Pd.I',
    teacherNip: '19850712 201001 1 018',
    schoolId: 'school-1',
    schoolName: 'SDN 01 Menteng Jakarta Pusat',
    academicYear: '2026/2027',
    semester: 'Ganjil',
    subject: 'Pendidikan Agama Islam & Budi Pekerti',
    grade: 'Fase C (Kelas V-B)',
    topic: 'Meneladani Perjuangan Rasulullah SAW pada Peristiwa Fathu Makkah',
    learningObjectives: 'Peserta didik mampu menceritakan kronologi Fathu Makkah dan menunjukkan sikap pemaaf serta cinta damai dalam hubungan pertemanan.',
    executionDate: '2026-10-22',
    status: 'Menunggu Verifikasi',
    submittedAt: '2026-10-15T09:00:00Z',
    createdAt: '2026-10-15T07:30:00Z',
    updatedAt: '2026-10-15T09:00:00Z'
  },
  {
    id: 'SUB-2026-003',
    teacherId: 'user-guru-2',
    teacherName: 'Siti Aminah, S.Ag',
    teacherNip: '19880914 201202 2 009',
    schoolId: 'school-1',
    schoolName: 'SDN 01 Menteng Jakarta Pusat',
    academicYear: '2026/2027',
    semester: 'Ganjil',
    subject: 'Pendidikan Agama Islam & Budi Pekerti',
    grade: 'Fase A (Kelas I-C)',
    topic: 'Mengenal Ciptaan Allah SWT Melalui Asmaul Husna Al-Khaliq',
    learningObjectives: 'Peserta didik dapat melafalkan Al-Khaliq dengan makhraj tepat dan menyebutkan 3 ciptaan Allah di lingkungan sekitar sekolah.',
    executionDate: '2026-10-25',
    status: 'Perlu Revisi',
    revisionNotes: 'Mohon lengkapi instrumen asesmen formatif (lembar observasi unjuk kerja hafalan). LKPD juga mohon disesuaikan dengan instruksi bergambar untuk anak kelas 1 yang baru belajar membaca.',
    revisionDate: '2026-10-16T14:30:00Z',
    submittedAt: '2026-10-16T11:30:00Z',
    createdAt: '2026-10-16T10:00:00Z',
    updatedAt: '2026-10-16T14:30:00Z'
  },
  {
    id: 'SUB-2026-004',
    teacherId: 'user-guru-1',
    teacherName: 'Ahmad Dahlan, S.Pd.I',
    teacherNip: '19850712 201001 1 018',
    schoolId: 'school-1',
    schoolName: 'SDN 01 Menteng Jakarta Pusat',
    academicYear: '2026/2027',
    semester: 'Ganjil',
    subject: 'Pendidikan Agama Islam & Budi Pekerti',
    grade: 'Fase B (Kelas IV-B)',
    topic: 'Zakat, Infak, dan Sedekah Membawa Keberkahan',
    learningObjectives: 'Menganalisis perbedaan zakat fitrah, infak, dan sedekah serta mempraktikkan simulasi penghitungan zakat fitrah.',
    executionDate: '2026-11-05',
    status: 'Draf',
    createdAt: '2026-10-17T09:00:00Z',
    updatedAt: '2026-10-17T09:20:00Z'
  }
];

export const initialAssessmentAnswers: AssessmentAnswer[] = [
  {
    id: 'ans-001',
    submissionId: 'SUB-2026-001',
    templateVersionId: 'tmpl-v2.1',
    scores: {
      'ind-1': 4,
      'ind-2': 4,
      'ind-3': 4,
      'ind-4': 3,
      'ind-5': 4,
      'ind-6': 4,
      'ind-7': 4,
      'ind-8': 3,
      'ind-9': 4,
      'ind-10': 3,
      'ind-11': 4,
      'ind-12': 4
    },
    notes: {
      'ind-1': 'Rumusan TP sangat jelas dan berorientasi HOTS.',
      'ind-3': 'Penanaman nilai moderasi beragama dan toleransi sangat hidup saat diskusi kelompok.',
      'ind-8': 'Pemanfaatan media tayang canva interaktif sudah bagus, bisa ditingkatkan dengan kuis live gamifikasi.'
    },
    overallFindings: 'Pembelajaran PAI berlangsung sangat inspiratif. Guru menunjukkan penguasaan materi yang prima, manajemen kelas hangat dan bersahabat, serta mampu mengaitkan ayat suci Al-Qur\'an dengan konteks kehidupan kebinekaan peserta didik.',
    overallRecommendation: 'Pertahankan kualitas pembelajaran berpusat pada siswa. Disarankan untuk membagikan praktik baik modul ajar berdiferensiasi ini pada forum KKG PAI Kecamatan Menteng.',
    assessedBy: 'Drs. H. Suryanto, M.Pd',
    assessedAt: '2026-10-14T13:45:00Z'
  }
];

export const initialSupervisionReports: SupervisionReport[] = [
  {
    id: 'REP-2026-001',
    submissionId: 'SUB-2026-001',
    templateVersionId: 'tmpl-v2.1',
    templateVersionName: 'v2.1 - Kurikulum Merdeka PAI 2026',
    finalScore: 94.2,
    predicate: 'Amat Baik',
    endorsedBy: 'Drs. H. Suryanto, M.Pd',
    endorserNip: '19680315 199403 1 004',
    endorsedAt: '2026-10-14T14:30:00Z',
    pdfUrl: 'https://example.com/reports/SIPENA_SUPERVISI_AHMAD_DAHLAN_2026.pdf',
    isImmutable: true
  }
];

export const initialFollowUps: FollowUp[] = [
  {
    id: 'flw-001',
    reportId: 'REP-2026-001',
    submissionId: 'SUB-2026-001',
    supervisorId: 'user-pengawas-1',
    supervisorName: 'Dra. Hj. Siti Fatimah, M.Pd',
    recommendations: 'Hasil supervisi menunjukkan performa pembelajaran sangat istimewa (94.2 - Amat Baik). Direkomendasikan untuk menyusun portofolio best practice PAI Berdiferensiasi dan menjadi narasumber pendampingan guru muda di gugus binaan.',
    targetImprovement: 'Penyusunan video pembelajaran pendek best practice PAI untuk platform PMM (Platform Merdeka Mengajar).',
    dueDate: '2026-11-30',
    progress: 'Sedang Berjalan',
    progressNotes: 'Guru sedang dalam tahap editing video modul ajar toleransi bersama tim media sekolah.',
    createdAt: '2026-10-17T11:00:00Z',
    updatedAt: '2026-10-17T15:00:00Z'
  }
];

export const initialIntegrationLogs: IntegrationLog[] = [
  {
    id: 'log-001',
    reportId: 'REP-2026-001',
    submissionId: 'SUB-2026-001',
    service: 'Google Drive',
    status: 'Berhasil',
    attemptCount: 1,
    message: 'PDF Laporan berhasil diarsipkan ke folder Google Drive: SIPENA-PAI/Menteng/2026-Ganjil',
    payloadSummary: 'File: SIPENA_SUPERVISI_AHMAD_DAHLAN_2026.pdf (1.2 MB)',
    externalUrl: 'https://drive.google.com/drive/folders/1A2B3C4D5E6F7G8H9-sample',
    timestamp: '2026-10-14T14:32:10Z'
  },
  {
    id: 'log-002',
    reportId: 'REP-2026-001',
    submissionId: 'SUB-2026-001',
    service: 'Google Sheets',
    status: 'Berhasil',
    attemptCount: 1,
    message: 'Baris rekap supervisi berhasil di-upsert ke Spreadsheet Dinas Rekapitulasi Supervisi PAI 2026.',
    payloadSummary: 'Row upserted: ID=REP-2026-001 | Guru: Ahmad Dahlan | Nilai: 94.2 | Predikat: Amat Baik',
    externalUrl: 'https://docs.google.com/spreadsheets/d/1SheetsSampleId-SIPENA-2026',
    timestamp: '2026-10-14T14:32:15Z'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'audit-1',
    entityType: 'submission',
    entityId: 'SUB-2026-001',
    actorId: 'user-guru-1',
    actorName: 'Ahmad Dahlan, S.Pd.I',
    actorRole: 'guru',
    action: 'CREATE_SUBMISSION',
    newValue: 'Status: Draf',
    timestamp: '2026-10-11T14:00:00Z'
  },
  {
    id: 'audit-2',
    entityType: 'submission',
    entityId: 'SUB-2026-001',
    actorId: 'user-guru-1',
    actorName: 'Ahmad Dahlan, S.Pd.I',
    actorRole: 'guru',
    action: 'SUBMIT_FOR_VERIFICATION',
    oldValue: 'Status: Draf',
    newValue: 'Status: Menunggu Verifikasi',
    timestamp: '2026-10-12T10:00:00Z'
  },
  {
    id: 'audit-3',
    entityType: 'submission',
    entityId: 'SUB-2026-001',
    actorId: 'user-ks-1',
    actorName: 'Drs. H. Suryanto, M.Pd',
    actorRole: 'kepala_sekolah',
    action: 'VERIFY_DOCUMENTS',
    oldValue: 'Status: Menunggu Verifikasi',
    newValue: 'Status: Dalam Penilaian',
    timestamp: '2026-10-13T08:30:00Z'
  },
  {
    id: 'audit-4',
    entityType: 'report',
    entityId: 'REP-2026-001',
    actorId: 'user-ks-1',
    actorName: 'Drs. H. Suryanto, M.Pd',
    actorRole: 'kepala_sekolah',
    action: 'ENDORSE_REPORT',
    oldValue: 'Status: Dalam Penilaian',
    newValue: 'Status: Diproses untuk Publikasi -> Tersedia bagi Pengawas (Nilai: 94.2)',
    timestamp: '2026-10-14T14:30:00Z'
  },
  {
    id: 'audit-5',
    entityType: 'follow_up',
    entityId: 'flw-001',
    actorId: 'user-pengawas-1',
    actorName: 'Dra. Hj. Siti Fatimah, M.Pd',
    actorRole: 'pengawas',
    action: 'ADD_FOLLOW_UP',
    newValue: 'Status: Tindak Lanjut (Due: 2026-11-30)',
    timestamp: '2026-10-17T11:00:00Z'
  }
];
