import { StorageService } from './storage';

export const CsvExportService = {
  /**
   * Generates and downloads independent CSV backup of all supervision data
   * per SRS-F-6.6 and NFR-13.
   */
  exportSupervisionSummary(): void {
    const submissions = StorageService.getSubmissions();
    const reports = StorageService.getReports();
    const followUps = StorageService.getFollowUps();

    const headers = [
      'ID Pengajuan',
      'ID Laporan',
      'Nama Guru',
      'NIP Guru',
      'Sekolah',
      'Tahun Ajaran',
      'Semester',
      'Mata Pelajaran',
      'Kelas / Fase',
      'Materi / Topik',
      'Tanggal Pelaksanaan',
      'Status Terakhir',
      'Nilai Akhir',
      'Predikat',
      'Disahkan Oleh',
      'Tanggal Pengesahan',
      'Rekomendasi Pengawas',
      'Target Tindak Lanjut',
      'Tenggat Waktu',
      'Progres Tindak Lanjut'
    ];

    const rows = submissions.map(sub => {
      const rep = reports.find(r => r.submissionId === sub.id);
      const flw = rep ? followUps.find(f => f.reportId === rep.id) : undefined;

      return [
        `"${sub.id}"`,
        rep ? `"${rep.id}"` : '""',
        `"${sub.teacherName}"`,
        `"${sub.teacherNip}"`,
        `"${sub.schoolName}"`,
        `"${sub.academicYear}"`,
        `"${sub.semester}"`,
        `"${sub.subject}"`,
        `"${sub.grade}"`,
        `"${sub.topic.replace(/"/g, '""')}"`,
        `"${sub.executionDate}"`,
        `"${sub.status}"`,
        rep ? rep.finalScore.toFixed(1) : '""',
        rep ? `"${rep.predicate}"` : '""',
        rep ? `"${rep.endorsedBy}"` : '""',
        rep ? `"${new Date(rep.endorsedAt).toLocaleDateString('id-ID')}"` : '""',
        flw ? `"${flw.recommendations.replace(/"/g, '""')}"` : '""',
        flw ? `"${flw.targetImprovement.replace(/"/g, '""')}"` : '""',
        flw ? `"${flw.dueDate}"` : '""',
        flw ? `"${flw.progress}"` : '""'
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SIPENA_PAI_REKAP_SUPERVISI_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
