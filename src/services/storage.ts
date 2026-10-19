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
import {
  initialUsers,
  initialSchools,
  initialSchoolAssignments,
  initialTeachers,
  initialAssessmentTemplates,
  initialSubmissions,
  initialDocuments,
  initialAssessmentAnswers,
  initialSupervisionReports,
  initialFollowUps,
  initialIntegrationLogs,
  initialAuditLogs
} from '../data/initialData';

const STORAGE_KEYS = {
  USERS: 'sipena_users',
  SCHOOLS: 'sipena_schools',
  ASSIGNMENTS: 'sipena_assignments',
  TEACHERS: 'sipena_teachers',
  TEMPLATES: 'sipena_templates',
  SUBMISSIONS: 'sipena_submissions',
  DOCUMENTS: 'sipena_documents',
  ANSWERS: 'sipena_answers',
  REPORTS: 'sipena_reports',
  FOLLOW_UPS: 'sipena_follow_ups',
  INTEGRATION_LOGS: 'sipena_integration_logs',
  AUDIT_LOGS: 'sipena_audit_logs',
  CURRENT_USER: 'sipena_current_user'
};

function getStoredItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(item);
  } catch {
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving to localStorage [${key}]`, err);
  }
}

export const StorageService = {
  // Reset all data to pristine initial seeds
  resetAll(): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
    localStorage.setItem(STORAGE_KEYS.SCHOOLS, JSON.stringify(initialSchools));
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(initialSchoolAssignments));
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(initialTeachers));
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(initialAssessmentTemplates));
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(initialSubmissions));
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(initialDocuments));
    localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(initialAssessmentAnswers));
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(initialSupervisionReports));
    localStorage.setItem(STORAGE_KEYS.FOLLOW_UPS, JSON.stringify(initialFollowUps));
    localStorage.setItem(STORAGE_KEYS.INTEGRATION_LOGS, JSON.stringify(initialIntegrationLogs));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(initialAuditLogs));
  },

  // Users
  getUsers(): User[] {
    return getStoredItem<User[]>(STORAGE_KEYS.USERS, initialUsers);
  },
  saveUsers(users: User[]): void {
    setStoredItem(STORAGE_KEYS.USERS, users);
  },
  getCurrentUser(): User {
    const defaultUser = initialUsers[0]; // Guru by default
    return getStoredItem<User>(STORAGE_KEYS.CURRENT_USER, defaultUser);
  },
  setCurrentUser(user: User): void {
    setStoredItem(STORAGE_KEYS.CURRENT_USER, user);
  },

  // Schools
  getSchools(): School[] {
    return getStoredItem<School[]>(STORAGE_KEYS.SCHOOLS, initialSchools);
  },
  saveSchools(schools: School[]): void {
    setStoredItem(STORAGE_KEYS.SCHOOLS, schools);
  },

  // School Assignments (Kepala Sekolah & Pengawas)
  getAssignments(): SchoolAssignment[] {
    return getStoredItem<SchoolAssignment[]>(STORAGE_KEYS.ASSIGNMENTS, initialSchoolAssignments);
  },
  saveAssignments(assignments: SchoolAssignment[]): void {
    setStoredItem(STORAGE_KEYS.ASSIGNMENTS, assignments);
  },

  // Teachers
  getTeachers(): Teacher[] {
    return getStoredItem<Teacher[]>(STORAGE_KEYS.TEACHERS, initialTeachers);
  },

  // Templates (SRS-F-4.1 - Versioning & CRUD)
  getTemplates(): AssessmentTemplate[] {
    return getStoredItem<AssessmentTemplate[]>(STORAGE_KEYS.TEMPLATES, initialAssessmentTemplates);
  },
  saveTemplates(templates: AssessmentTemplate[]): void {
    setStoredItem(STORAGE_KEYS.TEMPLATES, templates);
  },
  getActiveTemplate(): AssessmentTemplate {
    const list = this.getTemplates();
    return list.find(t => t.isActive) || list[0];
  },
  getTemplateById(id: string): AssessmentTemplate | undefined {
    return this.getTemplates().find(t => t.id === id);
  },
  saveTemplate(template: AssessmentTemplate, actor?: { id: string; name: string; role: any }): void {
    const list = this.getTemplates();
    const idx = list.findIndex(t => t.id === template.id);
    const isNew = idx < 0;
    const oldTemplate = !isNew ? list[idx] : null;

    if (isNew) {
      list.unshift(template);
    } else {
      list[idx] = template;
    }

    // If marked active, ensure other templates become inactive
    if (template.isActive) {
      list.forEach(t => {
        if (t.id !== template.id) {
          t.isActive = false;
        }
      });
    } else {
      // Ensure at least one template remains active
      const hasActive = list.some(t => t.isActive);
      if (!hasActive && list.length > 0) {
        list[0].isActive = true;
      }
    }

    this.saveTemplates(list);

    // Audit trail (SRS-F-4.1 & NFR-10)
    if (actor) {
      this.addAuditLog({
        entityType: 'assessment_template',
        entityId: template.id,
        actorId: actor.id,
        actorName: actor.name,
        actorRole: actor.role,
        action: isNew ? 'CREATE_TEMPLATE' : 'UPDATE_TEMPLATE',
        oldValue: oldTemplate ? `${oldTemplate.version} - ${oldTemplate.title}` : undefined,
        newValue: `${template.version} - ${template.title}`
      });
    }
  },
  setActiveTemplate(id: string, actor?: { id: string; name: string; role: any }): void {
    const list = this.getTemplates();
    let activatedVersion = '';
    list.forEach(t => {
      const willBeActive = t.id === id;
      t.isActive = willBeActive;
      if (willBeActive) activatedVersion = t.version;
    });
    this.saveTemplates(list);

    if (actor) {
      this.addAuditLog({
        entityType: 'assessment_template',
        entityId: id,
        actorId: actor.id,
        actorName: actor.name,
        actorRole: actor.role,
        action: 'SET_ACTIVE_TEMPLATE',
        newValue: `Versi aktif: ${activatedVersion}`
      });
    }
  },
  deleteTemplate(id: string, actor?: { id: string; name: string; role: any }): { success: boolean; error?: string } {
    const reports = this.getReports();
    const isUsedInReports = reports.some(r => r.templateVersionId === id);
    const answers = this.getAnswers();
    const isUsedInAnswers = answers.some(a => a.templateVersionId === id);

    if (isUsedInReports || isUsedInAnswers) {
      return {
        success: false,
        error: 'Instrumen ini tidak dapat dihapus karena telah terikat pada riwayat penilaian / laporan supervisi sebelumnya (SRS-F-4.1). Anda disarankan untuk menonaktifkannya agar arsip tetap valid.'
      };
    }

    const list = this.getTemplates();
    if (list.length <= 1) {
      return {
        success: false,
        error: 'Sistem harus memiliki minimal satu templat instrumen supervisi aktif.'
      };
    }

    const target = list.find(t => t.id === id);
    const filtered = list.filter(t => t.id !== id);
    if (target?.isActive && filtered.length > 0) {
      filtered[0].isActive = true;
    }
    this.saveTemplates(filtered);

    if (actor && target) {
      this.addAuditLog({
        entityType: 'assessment_template',
        entityId: id,
        actorId: actor.id,
        actorName: actor.name,
        actorRole: actor.role,
        action: 'DELETE_TEMPLATE',
        oldValue: `${target.version} - ${target.title}`
      });
    }

    return { success: true };
  },
  duplicateTemplate(id: string, newVersion?: string, actor?: { id: string; name: string; role: any }): AssessmentTemplate | null {
    const original = this.getTemplateById(id);
    if (!original) return null;

    const versionStr = newVersion || `${original.version} (Salinan ${new Date().toLocaleDateString('id-ID')})`;
    const cloned: AssessmentTemplate = {
      ...JSON.parse(JSON.stringify(original)),
      id: `tmpl-${Date.now()}`,
      version: versionStr,
      title: `${original.title} (Revisi Baru)`,
      isActive: false,
      createdAt: new Date().toISOString()
    };

    // Give new unique IDs to categories and indicators
    cloned.categories.forEach((cat, catIdx) => {
      cat.id = `cat-${Date.now()}-${catIdx}`;
      cat.indicators.forEach((ind, indIdx) => {
        ind.id = `ind-${Date.now()}-${catIdx}-${indIdx}`;
      });
    });

    this.saveTemplate(cloned, actor);
    return cloned;
  },

  // Submissions
  getSubmissions(): Submission[] {
    return getStoredItem<Submission[]>(STORAGE_KEYS.SUBMISSIONS, initialSubmissions);
  },
  saveSubmissions(submissions: Submission[]): void {
    setStoredItem(STORAGE_KEYS.SUBMISSIONS, submissions);
  },
  getSubmissionById(id: string): Submission | undefined {
    return this.getSubmissions().find(s => s.id === id);
  },
  updateSubmission(updated: Submission): void {
    const list = this.getSubmissions();
    const index = list.findIndex(s => s.id === updated.id);
    if (index >= 0) {
      list[index] = updated;
    } else {
      list.unshift(updated);
    }
    this.saveSubmissions(list);
  },

  // Documents
  getDocuments(): SubmissionDocument[] {
    return getStoredItem<SubmissionDocument[]>(STORAGE_KEYS.DOCUMENTS, initialDocuments);
  },
  saveDocuments(docs: SubmissionDocument[]): void {
    setStoredItem(STORAGE_KEYS.DOCUMENTS, docs);
  },
  getDocumentsBySubmissionId(subId: string): SubmissionDocument[] {
    return this.getDocuments().filter(d => d.submissionId === subId);
  },
  addDocument(doc: SubmissionDocument): void {
    const list = this.getDocuments();
    list.push(doc);
    this.saveDocuments(list);
  },
  removeDocument(id: string): void {
    const list = this.getDocuments().filter(d => d.id !== id);
    this.saveDocuments(list);
  },

  // Assessment Answers
  getAnswers(): AssessmentAnswer[] {
    return getStoredItem<AssessmentAnswer[]>(STORAGE_KEYS.ANSWERS, initialAssessmentAnswers);
  },
  saveAnswers(answers: AssessmentAnswer[]): void {
    setStoredItem(STORAGE_KEYS.ANSWERS, answers);
  },
  getAnswerBySubmissionId(subId: string): AssessmentAnswer | undefined {
    return this.getAnswers().find(a => a.submissionId === subId);
  },
  saveAnswerForSubmission(answer: AssessmentAnswer): void {
    const list = this.getAnswers();
    const index = list.findIndex(a => a.submissionId === answer.submissionId);
    if (index >= 0) {
      list[index] = answer;
    } else {
      list.push(answer);
    }
    this.saveAnswers(list);
  },

  // Reports
  getReports(): SupervisionReport[] {
    return getStoredItem<SupervisionReport[]>(STORAGE_KEYS.REPORTS, initialSupervisionReports);
  },
  saveReports(reports: SupervisionReport[]): void {
    setStoredItem(STORAGE_KEYS.REPORTS, reports);
  },
  getReportBySubmissionId(subId: string): SupervisionReport | undefined {
    return this.getReports().find(r => r.submissionId === subId);
  },
  addReport(report: SupervisionReport): void {
    const list = this.getReports();
    const index = list.findIndex(r => r.id === report.id || r.submissionId === report.submissionId);
    if (index >= 0) {
      list[index] = report;
    } else {
      list.push(report);
    }
    this.saveReports(list);
  },

  // Follow Ups
  getFollowUps(): FollowUp[] {
    return getStoredItem<FollowUp[]>(STORAGE_KEYS.FOLLOW_UPS, initialFollowUps);
  },
  saveFollowUps(followUps: FollowUp[]): void {
    setStoredItem(STORAGE_KEYS.FOLLOW_UPS, followUps);
  },
  getFollowUpByReportId(reportId: string): FollowUp | undefined {
    return this.getFollowUps().find(f => f.reportId === reportId);
  },
  saveFollowUp(followUp: FollowUp): void {
    const list = this.getFollowUps();
    const index = list.findIndex(f => f.id === followUp.id || f.reportId === followUp.reportId);
    if (index >= 0) {
      list[index] = followUp;
    } else {
      list.push(followUp);
    }
    this.saveFollowUps(list);
  },

  // Integration Logs
  getIntegrationLogs(): IntegrationLog[] {
    return getStoredItem<IntegrationLog[]>(STORAGE_KEYS.INTEGRATION_LOGS, initialIntegrationLogs);
  },
  saveIntegrationLogs(logs: IntegrationLog[]): void {
    setStoredItem(STORAGE_KEYS.INTEGRATION_LOGS, logs);
  },
  addIntegrationLog(log: IntegrationLog): void {
    const list = this.getIntegrationLogs();
    list.unshift(log); // newest first
    this.saveIntegrationLogs(list);
  },

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return getStoredItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs);
  },
  saveAuditLogs(logs: AuditLog[]): void {
    setStoredItem(STORAGE_KEYS.AUDIT_LOGS, logs);
  },
  addAuditLog(entry: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const list = this.getAuditLogs();
    const newEntry: AuditLog = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString()
    };
    list.unshift(newEntry);
    this.saveAuditLogs(list);
  }
};
