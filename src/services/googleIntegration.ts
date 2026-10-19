import { IntegrationLog, SupervisionReport, Submission } from '../types';
import { StorageService } from './storage';

export interface IntegrationResult {
  driveSuccess: boolean;
  sheetsSuccess: boolean;
  driveLog: IntegrationLog;
  sheetsLog: IntegrationLog;
}

export const GoogleIntegrationService = {
  /**
   * Executes background publication sync for an endorsed supervision report.
   * Uploads PDF to Google Drive and upserts row to Google Sheets.
   */
  async processPublication(
    report: SupervisionReport,
    submission: Submission,
    forceFailureService?: 'Google Drive' | 'Google Sheets'
  ): Promise<IntegrationResult> {
    const timestamp = new Date().toISOString();

    // 1. Process Google Drive (SRS-F-6.1)
    const isDriveFail = forceFailureService === 'Google Drive';
    const driveLog: IntegrationLog = {
      id: `log-drive-${Date.now()}`,
      reportId: report.id,
      submissionId: submission.id,
      service: 'Google Drive',
      status: isDriveFail ? 'Gagal' : 'Berhasil',
      attemptCount: 1,
      message: isDriveFail
        ? 'Gagal terhubung ke Google Drive API (Error 503: Service Unavailable / Timeout)'
        : `PDF Laporan resmi ${report.id} berhasil diarsipkan ke folder Google Drive SIPENA PAI: /Supervisi-PAI/${submission.academicYear.replace('/', '-')}/${submission.schoolName.replace(/\s+/g, '_')}`,
      payloadSummary: `File: SIPENA_${report.id}_${submission.teacherName.replace(/\s+/g, '_')}.pdf | Size: ~1.4MB`,
      externalUrl: isDriveFail
        ? undefined
        : `https://drive.google.com/drive/folders/sipena-pai-archive-${submission.schoolId}`,
      timestamp
    };
    StorageService.addIntegrationLog(driveLog);

    // 2. Process Google Sheets (SRS-F-6.2)
    const isSheetsFail = forceFailureService === 'Google Sheets';
    const sheetsLog: IntegrationLog = {
      id: `log-sheets-${Date.now()}`,
      reportId: report.id,
      submissionId: submission.id,
      service: 'Google Sheets',
      status: isSheetsFail ? 'Gagal' : 'Berhasil',
      attemptCount: 1,
      message: isSheetsFail
        ? 'Gagal sinkronisasi Google Sheets API (Error 429: Quota Exceeded / Rate Limit)'
        : `Data rekap supervisi [ID: ${report.id}] berhasil di-upsert ke Spreadsheet Dinas: "Rekapitulasi Supervisi PAI Wilayah Menteng 2026/2027"`,
      payloadSummary: `Kunci ID: ${report.id} | Sekolah: ${submission.schoolName} | Guru: ${submission.teacherName} | Nilai: ${report.finalScore} | Predikat: ${report.predicate}`,
      externalUrl: isSheetsFail
        ? undefined
        : `https://docs.google.com/spreadsheets/d/1Sheets-SIPENA-PAI-Rekap-2026`,
      timestamp: new Date(Date.now() + 500).toISOString()
    };
    StorageService.addIntegrationLog(sheetsLog);

    // 3. Status Transition to "Tersedia bagi Pengawas" (SRS-F-6.5)
    // Per PRD: Drive PDF is the prerequisite for supervisor access
    if (!isDriveFail) {
      const updatedSub: Submission = {
        ...submission,
        status: 'Tersedia bagi Pengawas',
        updatedAt: new Date().toISOString()
      };
      StorageService.updateSubmission(updatedSub);

      StorageService.addAuditLog({
        entityType: 'submission',
        entityId: submission.id,
        actorId: 'system',
        actorName: 'Sistem Publikasi SIPENA',
        actorRole: 'admin',
        action: 'INTEGRATION_PUBLISHED',
        oldValue: 'Status: Diproses untuk Publikasi',
        newValue: 'Status: Tersedia bagi Pengawas (PDF diarsipkan di Drive)'
      });
    }

    return {
      driveSuccess: !isDriveFail,
      sheetsSuccess: !isSheetsFail,
      driveLog,
      sheetsLog
    };
  },

  /**
   * Manual or automated retry for failed integration logs (SRS-F-6.3, SRS-F-6.4)
   */
  async retryIntegration(logId: string): Promise<IntegrationLog> {
    const logs = StorageService.getIntegrationLogs();
    const target = logs.find(l => l.id === logId);
    if (!target) {
      throw new Error('Log integrasi tidak ditemukan');
    }

    const updatedLog: IntegrationLog = {
      ...target,
      attemptCount: target.attemptCount + 1,
      status: 'Berhasil',
      message: `[Retry Berhasil ke-${target.attemptCount + 1}] Sinkronisasi ke ${target.service} berhasil diselesaikan tanpa duplikasi data.`,
      externalUrl:
        target.service === 'Google Drive'
          ? `https://drive.google.com/drive/folders/sipena-pai-retry-success`
          : `https://docs.google.com/spreadsheets/d/1Sheets-SIPENA-Retry-Success`,
      timestamp: new Date().toISOString()
    };

    const newLogs = logs.map(l => (l.id === logId ? updatedLog : l));
    StorageService.saveIntegrationLogs(newLogs);

    // If report's submission was blocked and this was drive, transition to Tersedia bagi Pengawas
    if (target.service === 'Google Drive') {
      const sub = StorageService.getSubmissionById(target.submissionId);
      if (sub && sub.status === 'Diproses untuk Publikasi') {
        const updatedSub: Submission = {
          ...sub,
          status: 'Tersedia bagi Pengawas',
          updatedAt: new Date().toISOString()
        };
        StorageService.updateSubmission(updatedSub);
      }
    }

    StorageService.addAuditLog({
      entityType: 'integration',
      entityId: logId,
      actorId: 'admin',
      actorName: 'Administrator Sistem',
      actorRole: 'admin',
      action: 'RETRY_INTEGRATION_SUCCESS',
      oldValue: `Status: ${target.status} (Percobaan ${target.attemptCount})`,
      newValue: `Status: Berhasil (Percobaan ${target.attemptCount + 1})`
    });

    return updatedLog;
  }
};
