# SRS — SIPENA PAI (Software Requirements Specification)

Oct 18, 2026 · Disusun oleh @Fathur

## 1. Pendahuluan

**1.1 Tujuan Dokumen** Dokumen ini menerjemahkan PRD SIPENA PAI menjadi spesifikasi kebutuhan perangkat lunak yang presisi, dapat diuji, dan dapat ditelusuri ke tujuan bisnis — menjadi acuan tunggal bagi tim pengembang, QA, dan pemilik produk selama implementasi.

**1.2 Ruang Lingkup** Mencakup kebutuhan fungsional dan non-fungsional untuk MVP SIPENA PAI sebagaimana didefinisikan dalam PRD Bagian 4 (Ruang Lingkup): autentikasi, administrasi pembelajaran, verifikasi dan revisi, instrumen penilaian, pengesahan dan PDF, integrasi Google Drive/Sheets, dan dashboard pengawas. Fitur di luar MVP (notifikasi real-time, analitik tren, aplikasi mobile native, multi-tenant yayasan) tidak dispesifikasikan di sini.

**1.3 Definisi dan Akronim**

| Istilah | Keterangan |
| --- | --- |
| SRS | Software Requirements Specification |
| PRD | Product Requirements Document (dokumen pendahulu SRS ini) |
| RBAC | Role-Based Access Control |
| RLS | Row Level Security (kebijakan akses di level baris database) |
| PAI | Pendidikan Agama Islam |
| SLA | Service Level Agreement |

**1.4 Referensi** Dokumen ini mengacu langsung pada PRD — SIPENA PAI yang disusun sebelumnya, khususnya Bagian 3 (Tujuan dan KPI), Bagian 4 (Ruang Lingkup), Bagian 6 (Alur Kerja dan State Machine Status), dan Bagian 9 (Skema Data). Penomoran kebutuhan pada dokumen ini (SRS-F-x.x) merujuk ke modul yang sama dengan PRD Bagian 5.

## 2. Deskripsi Umum

**2.1 Perspektif Produk** SIPENA PAI adalah sistem baru (bukan pengganti sistem lama yang terintegrasi) yang berinteraksi dengan Google Drive API dan Google Sheets API sebagai layanan eksternal. Sistem berdiri sendiri dengan basis data sendiri sebagai sumber kebenaran; Drive dan Sheets adalah salinan turunan.

**2.2 Fungsi Produk (Ringkasan)** Tujuh kelompok fungsi utama: autentikasi dan RBAC; administrasi dan bukti pembelajaran; verifikasi dan revisi; instrumen dan penilaian; pengesahan dan pembuatan PDF; integrasi Drive/Sheets; dashboard dan tindak lanjut pengawas. Rincian pada Bagian 3–9.

**2.3 Karakteristik Pengguna**

| Kelas pengguna | Keahlian teknis diasumsikan | Frekuensi penggunaan |
| --- | --- | --- |
| Guru | Dasar; akses sering dari ponsel | Per periode supervisi (beberapa kali per semester) |
| Kepala sekolah | Dasar–menengah | Rutin, terutama saat ada pengajuan masuk |
| Pengawas sekolah | Dasar–menengah | Berkala, saat meninjau laporan sekolah binaan |
| Administrator | Menengah–tinggi | Insidental (manajemen akun, konfigurasi) |

**2.4 Batasan**

- Sistem bergantung pada ketersediaan layanan Google untuk fitur integrasi; kegagalan layanan ini tidak boleh memblokir alur inti (lihat kebutuhan non-fungsional NFR-3).
- MVP tidak mendukung multi-sekolah untuk satu guru kecuali Asumsi 1 (PRD Bagian 2) dikonfirmasi sebelum implementasi.
- Antarmuka hanya web-responsif; tidak ada aplikasi native pada MVP.

**2.5 Asumsi dan Ketergantungan**

- Setiap sekolah/yayasan memiliki atau bersedia menyediakan akses Google Workspace untuk integrasi Drive/Sheets.
- Koneksi internet di lokasi guru dan kepala sekolah cukup untuk unggah dokumen berukuran wajar (≤ 10 MB per berkas, perlu dikonfirmasi).
- Regulasi supervisi PAI yang berlaku tidak mensyaratkan proses yang bertentangan dengan alur verifikasi-penilaian-pengesahan yang dirancang.

## 3. Kebutuhan Fungsional — Autentikasi dan Manajemen Akun

| ID | Deskripsi | Input | Proses | Output | Prioritas |
| --- | --- | --- | --- | --- | --- |
| SRS-F-1.1 | Login pengguna | Email, password | Validasi kredensial terhadap basis data; buat sesi token | Sesi aktif, redirect ke dashboard sesuai peran | Wajib |
| SRS-F-1.2 | Penolakan login gagal | Email, password salah | Validasi gagal | Pesan error generik (tidak membocorkan email terdaftar atau tidak) | Wajib |
| SRS-F-1.3 | Kedaluwarsa sesi otomatis | Token sesi | Sistem memeriksa masa berlaku token pada setiap request terproteksi | Logout otomatis jika kedaluwarsa, redirect ke halaman login | Wajib |
| SRS-F-1.4 | Admin membuat akun baru | Nama, email, peran, penugasan sekolah (jika relevan) | Validasi unik email; simpan akun dengan status aktif | Akun baru dengan kredensial awal (atau tautan atur password) | Wajib |
| SRS-F-1.5 | Admin menonaktifkan akun | ID akun | Ubah status akun menjadi nonaktif; invalidasi sesi aktif akun tsb | Akun tidak dapat login hingga diaktifkan kembali | Wajib |
| SRS-F-1.6 | Admin reset akses/password | ID akun | Generate kredensial sementara atau tautan reset | Notifikasi ke admin dengan kredensial/tautan baru | Wajib |

**Kebutuhan terkait keamanan (lihat juga Bagian 10):** kata sandi disimpan dalam bentuk hash (bcrypt/argon2), tidak pernah dalam teks biasa; percobaan login gagal berulang pada satu akun dibatasi (rate limiting) untuk mencegah brute-force.

## 4. Kebutuhan Fungsional — Administrasi dan Bukti Pembelajaran

| ID | Deskripsi | Input | Proses | Output | Prioritas |
| --- | --- | --- | --- | --- | --- |
| SRS-F-2.1 | Isi identitas pembelajaran | Mata pelajaran, kelas, periode supervisi | Validasi field wajib terisi | Data tersimpan sebagai draf (`supervision_submissions`, status Draf) | Wajib |
| SRS-F-2.2 | Simpan draf otomatis | Perubahan form | Auto-save berkala (mis. setiap 30 detik atau saat blur field) | Draf tidak hilang jika sesi terputus | Wajib |
| SRS-F-2.3 | Unggah dokumen administrasi dan bukti | Berkas (PDF, JPG, PNG, DOCX) | Validasi format dan ukuran maksimum; simpan ke storage, catat metadata di `documents` | Berkas tersimpan dan tertaut ke pengajuan | Wajib |
| SRS-F-2.4 | Tampilkan progres unggah | — | Sistem melaporkan persentase unggah berkas besar | Indikator progres visual | Diinginkan |
| SRS-F-2.5 | Validasi kelengkapan dasar sebelum kirim | Data form dan daftar dokumen wajib | Periksa field wajib dan dokumen wajib terunggah | Tombol “Kirim Pengajuan” aktif hanya jika lengkap | Wajib |
| SRS-F-2.6 | Kirim pengajuan | Pengajuan lengkap | Ubah status menjadi Menunggu Verifikasi; catat timestamp pengiriman | Notifikasi status di dashboard guru | Wajib |

**Batasan input:** ukuran berkas maksimum per unggahan direkomendasikan 10 MB (dapat disesuaikan di konfigurasi admin); format di luar daftar yang diizinkan ditolak dengan pesan error yang jelas.

## 5. Kebutuhan Fungsional — Verifikasi dan Revisi

| ID | Deskripsi | Input | Proses | Output | Prioritas |
| --- | --- | --- | --- | --- | --- |
| SRS-F-3.1 | Tampilkan daftar pengajuan menunggu verifikasi | — | Query pengajuan berstatus Menunggu Verifikasi, difilter sesuai sekolah yang dikelola kepala sekolah (RBAC) | Daftar pengajuan terurut (mis. berdasarkan tanggal kirim) | Wajib |
| SRS-F-3.2 | Periksa kelengkapan dan kesesuaian bukti | Pengajuan terpilih | Tampilkan identitas, dokumen, dan bukti untuk ditinjau | Tampilan detail pengajuan | Wajib |
| SRS-F-3.3 | Kembalikan pengajuan untuk revisi | ID pengajuan, catatan revisi (wajib diisi) | Validasi catatan tidak kosong; ubah status menjadi Perlu Revisi; simpan catatan | Guru menerima status dan catatan revisi | Wajib |
| SRS-F-3.4 | Lanjutkan ke penilaian | ID pengajuan | Ubah status menjadi Dalam Penilaian | Pengajuan tersedia di modul instrumen penilaian (Bagian 6) | Wajib |
| SRS-F-3.5 | Guru mengirim ulang pengajuan yang direvisi | Dokumen/bukti diperbarui | Validasi kelengkapan ulang (sama seperti SRS-F-2.5); ubah status menjadi Menunggu Verifikasi | Pengajuan masuk kembali ke antrean verifikasi | Wajib |

**Aturan bisnis:** sistem tidak mengizinkan kepala sekolah melanjutkan ke penilaian (SRS-F-3.4) tanpa terlebih dahulu menandai pengajuan sebagai lengkap — mencegah penilaian terhadap dokumen yang belum diverifikasi, sesuai pemisahan tahap pada PRD Bagian 6.

## 6. Kebutuhan Fungsional — Instrumen dan Penilaian

| ID | Deskripsi | Input | Proses | Output | Prioritas |
| --- | --- | --- | --- | --- | --- |
| SRS-F-4.1 | Admin membuat/mengubah instrumen penilaian | Indikator, skala skor, bobot (opsional) | Simpan sebagai versi baru di `assessment_templates`; versi lama tidak terhapus | Instrumen baru tersedia untuk penilaian berikutnya | Wajib |
| SRS-F-4.2 | Tampilkan instrumen aktif saat penilaian | ID pengajuan berstatus Dalam Penilaian | Ambil versi instrumen yang berlaku saat ini | Formulir penilaian dengan indikator dan skala | Wajib |
| SRS-F-4.3 | Isi skor dan catatan per indikator | Skor per indikator, catatan observasi, temuan | Validasi skor dalam rentang skala yang ditentukan | Jawaban tersimpan di `assessment_answers`, tertaut ke versi instrumen yang dipakai | Wajib |
| SRS-F-4.4 | Hitung nilai akhir otomatis | Skor per indikator tersimpan | Terapkan rumus sesuai instrumen (skor × bobot, dijumlahkan, atau skema lain yang ditetapkan admin) | Nilai akhir ditampilkan sebagai ringkasan | Wajib |
| SRS-F-4.5 | Beri rekomendasi berbasis temuan | Catatan, temuan | Simpan sebagai bagian dari jawaban penilaian | Rekomendasi tampil di laporan final | Wajib |
| SRS-F-4.6 | Tampilkan ringkasan sebelum pengesahan | Seluruh jawaban penilaian | Kompilasi nilai akhir, catatan, rekomendasi | Halaman ringkasan untuk ditinjau kepala sekolah | Wajib |

**Catatan integritas data:** `assessment_answers` menyimpan referensi ke versi `assessment_templates` yang berlaku saat penilaian dilakukan (bukan referensi dinamis ke “versi terbaru”), agar laporan lama tetap konsisten meski instrumen diperbarui di kemudian hari (lihat PRD Bagian 2, Asumsi 4).

## 7. Kebutuhan Fungsional — Pengesahan dan PDF

| ID | Deskripsi | Input | Proses | Output | Prioritas |
| --- | --- | --- | --- | --- | --- |
| SRS-F-5.1 | Kepala sekolah mengesahkan laporan | Konfirmasi pengesahan pada ringkasan (SRS-F-4.6) | Kunci laporan (immutable); catat identitas pengesah dan timestamp; ubah status menjadi Diproses untuk Publikasi | Laporan final tercipta di `supervision_reports` | Wajib |
| SRS-F-5.2 | Generate PDF laporan | Data laporan final | Render data (identitas, nilai, catatan, rekomendasi) ke dokumen PDF | Berkas PDF tersimpan, tautan dicatat di `supervision_reports` | Wajib |
| SRS-F-5.3 | Cegah pengesahan ganda | ID pengajuan sudah berstatus disahkan | Validasi status sebelum memproses aksi pengesahan | Aksi ditolak dengan pesan “laporan sudah disahkan” | Wajib |
| SRS-F-5.4 | Revisi pasca-pengesahan (jika diperlukan) | Permintaan revisi dengan alasan tercatat | Buat versi baru laporan, tautkan ke versi sebelumnya; versi lama tetap tersimpan sebagai riwayat | Laporan versi baru, riwayat perubahan dapat ditelusuri | Diinginkan (lihat kriteria penerimaan Bagian 13) |

**Kebutuhan performa terkait (lihat juga NFR Bagian 10):** SRS-F-5.2 harus selesai ≤ 10 detik untuk dokumen hingga 20 halaman; jika gagal, sistem menampilkan status “gagal generate” dan menyediakan opsi coba ulang tanpa mengubah data laporan yang sudah dikunci.

## 8. Kebutuhan Fungsional — Integrasi Google Drive dan Sheets

| ID | Deskripsi | Input | Proses | Output | Prioritas |
| --- | --- | --- | --- | --- | --- |
| SRS-F-6.1 | Unggah PDF ke Google Drive | Berkas PDF laporan final | Unggah ke folder Drive yang ditentukan dengan akses terbatas; catat hasil ke `integration_logs` | Status unggah (berhasil/gagal) tercatat, tautan Drive tersimpan jika berhasil | Wajib |
| SRS-F-6.2 | Kirim rekap ke Google Sheets | ID laporan, identitas guru/sekolah, periode, nilai, status, tautan PDF | Upsert baris di Sheets menggunakan ID laporan sebagai kunci (mencegah duplikasi); catat hasil ke `integration_logs` | Status kirim (berhasil/gagal) tercatat terpisah dari SRS-F-6.1 | Wajib |
| SRS-F-6.3 | Retry otomatis untuk kegagalan sementara | Log integrasi berstatus gagal, kategori sementara (timeout, rate limit) | Retry dengan backoff bertahap, maksimum N percobaan (dikonfigurasi) | Status integrasi diperbarui setelah retry | Wajib |
| SRS-F-6.4 | Retry manual oleh admin | Permintaan retry dari admin untuk log gagal persisten | Ulangi proses unggah/kirim untuk entri terpilih | Status integrasi diperbarui, log percobaan baru ditambahkan | Wajib |
| SRS-F-6.5 | Tandai laporan tersedia bagi pengawas | Status integrasi Drive (dan Sheets, sesuai keputusan di PRD Bagian 10) | Periksa prasyarat publikasi terpenuhi | Status laporan berubah menjadi Tersedia bagi Pengawas | Wajib |
| SRS-F-6.6 | Ekspor rekap CSV independen | Permintaan admin/kepala sekolah | Generate CSV dari data database (tidak bergantung pada Sheets) | Berkas CSV terunduh sebagai jalur cadangan jika integrasi Sheets gagal total | Diinginkan |

**Kebutuhan eksplisit yang menunggu keputusan stakeholder:** definisi prasyarat publikasi pada SRS-F-6.5 (PDF saja vs PDF + Sheets) harus dikonfirmasi sebelum implementasi — lihat PRD Bagian 14.

## 9. Kebutuhan Fungsional — Dashboard Pengawas dan Tindak Lanjut

| ID | Deskripsi | Input | Proses | Output | Prioritas |
| --- | --- | --- | --- | --- | --- |
| SRS-F-7.1 | Tampilkan rekap sekolah binaan | Identitas pengawas login | Query laporan dari sekolah sesuai `school_assignments`, filter status ≥ Tersedia bagi Pengawas | Daftar rekap: sekolah, guru, periode, nilai, status | Wajib |
| SRS-F-7.2 | Buka dan baca laporan (PDF) | ID laporan terpilih | Validasi laporan berstatus Tersedia bagi Pengawas dan dalam sekolah binaan pengawas | Tampilan/unduhan PDF laporan | Wajib |
| SRS-F-7.3 | Tandai laporan sebagai ditinjau | ID laporan dibuka pengawas | Ubah status menjadi Ditinjau Pengawas (jika belum) | Status laporan terbarui | Wajib |
| SRS-F-7.4 | Tambah catatan/rekomendasi tindak lanjut | Teks rekomendasi, target, tenggat (opsional) | Simpan ke `follow_ups`, tertaut ke laporan, tidak mengubah nilai asli | Catatan tampil di laporan dan riwayat tindak lanjut | Wajib |
| SRS-F-7.5 | Pantau progres tindak lanjut | ID laporan dengan tindak lanjut aktif | Tampilkan status progres (jika diperbarui) | Status “Tindak Lanjut” dengan riwayat catatan | Diinginkan |

**Batasan akses (RBAC):** SRS-F-7.1 dan SRS-F-7.2 wajib memvalidasi `school_assignments` di level query, bukan hanya menyembunyikan data di UI — konsisten dengan prinsip keamanan PRD Bagian 11.

## 10. Kebutuhan Antarmuka Eksternal

**10.1 Antarmuka Pengguna** Web responsif, mendukung lebar layar dari ponsel (≥ 360px) hingga desktop. Navigasi utama berbeda per peran sesuai dashboard masing-masing (PRD Bagian 3). Form kritis (kirim pengajuan, pengesahan) menampilkan konfirmasi sebelum aksi final dan tidak dapat dibatalkan.

**10.2 Antarmuka Perangkat Keras** Tidak ada kebutuhan perangkat keras khusus; berjalan di perangkat dengan browser modern (Chrome, Safari, Edge versi dua tahun terakhir) dan koneksi internet.

**10.3 Antarmuka Perangkat Lunak**

| Sistem eksternal | Jenis antarmuka | Tujuan |
| --- | --- | --- |
| Google Drive API | REST, OAuth 2.0 | Unggah dan penyimpanan PDF laporan (SRS-F-6.1) |
| Google Sheets API | REST, OAuth 2.0 | Sinkronisasi rekap data laporan (SRS-F-6.2) |
| Supabase Auth | SDK/REST | Autentikasi dan manajemen sesi (SRS-F-1.1–1.3) |
| PostgreSQL (via Supabase) | SQL/koneksi database | Penyimpanan data utama seluruh modul |

**10.4 Antarmuka Komunikasi** Seluruh komunikasi klien-server menggunakan HTTPS (TLS 1.2+). Tidak ada kebutuhan protokol komunikasi real-time (WebSocket) pada MVP; notifikasi push adalah fitur fase lanjutan (PRD Bagian 4).

## 11. Kebutuhan Non-Fungsional

| ID | Kategori | Kebutuhan | Metrik/Kriteria Terukur |
| --- | --- | --- | --- |
| NFR-1 | Performa | Waktu muat dashboard | ≤ 2 detik pada koneksi 4G, 95th percentile |
| NFR-2 | Performa | Generate PDF | ≤ 10 detik untuk dokumen hingga 20 halaman |
| NFR-3 | Reliabilitas | Alur inti tidak terblokir oleh kegagalan Google API | 100% pengesahan berhasil tersimpan di database meskipun Drive/Sheets gagal sementara |
| NFR-4 | Reliabilitas | Uptime API inti | ≥ 99.0% per bulan (MVP) |
| NFR-5 | Keamanan | Otorisasi di sisi server | 100% endpoint sensitif memvalidasi peran dan kepemilikan data sebelum memproses request |
| NFR-6 | Keamanan | Penyimpanan kata sandi | Hash dengan bcrypt/argon2, tidak ada teks biasa di database atau log |
| NFR-7 | Keamanan | Masa berlaku sesi | Token kedaluwarsa ≤ 8 jam tidak aktif (dapat dikonfigurasi) |
| NFR-8 | Usability | Form dapat dioperasikan dengan keyboard | Seluruh field dan tombol pada form utama dapat diakses via Tab/Enter |
| NFR-9 | Usability | Kontras warna | Memenuhi WCAG AA (rasio kontras ≥ 4.5:1 untuk teks normal) |
| NFR-10 | Auditabilitas | Jejak perubahan | 100% perubahan status, penilaian, dan pengesahan tercatat dengan aktor, waktu, nilai lama/baru |
| NFR-11 | Skalabilitas | Pertambahan sekolah binaan | Tidak memerlukan migrasi skema untuk penambahan sekolah, guru, atau penugasan baru |
| NFR-12 | Maintainability | Versioning instrumen | Perubahan instrumen tidak memengaruhi laporan yang sudah dinilai dengan versi sebelumnya |
| NFR-13 | Portabilitas data | Ekspor independen | Rekap dapat diekspor CSV tanpa bergantung pada keberhasilan integrasi Sheets |
| NFR-14 | Kompatibilitas | Perangkat mobile | Fungsi penuh pada browser mobile standar, lebar layar ≥ 360px |

Setiap NFR di atas idealnya memiliki skenario pengujian eksplisit sebelum rilis (lihat Bagian 13, Kriteria Penerimaan) — kebutuhan non-fungsional yang tidak diuji cenderung terabaikan saat tenggat implementasi mendesak.

## 12. Kebutuhan Data

| Entitas | Atribut kunci | Aturan integritas |
| --- | --- | --- |
| users | id, email (unik), role, status | Email unik di seluruh sistem; role hanya salah satu dari {guru, kepala\_sekolah, pengawas, admin} |
| schools | id, nama, alamat | — |
| school\_assignments | id, user\_id, school\_id, peran\_penugasan, periode | Kombinasi user\_id + school\_id + periode harus unik per jenis penugasan |
| teachers | id, user\_id, school\_id(s) | user\_id wajib merujuk ke users dengan role guru |
| supervision\_submissions | id, teacher\_id, school\_id, periode, status | status hanya salah satu dari sembilan nilai pada state machine (PRD Bagian 6); transisi status divalidasi di level aplikasi |
| documents | id, submission\_id, jenis, lokasi\_file, ukuran | submission\_id wajib merujuk ke pengajuan yang valid |
| assessment\_templates | id, versi, indikator\[\], skala | versi bersifat immutable setelah dipakai dalam satu penilaian |
| assessment\_answers | id, submission\_id, template\_version\_id, skor, catatan | template\_version\_id wajib merujuk ke versi spesifik, bukan “versi terbaru” |
| supervision\_reports | id, submission\_id, nilai\_akhir, status\_pengesahan, pdf\_url, disahkan\_oleh, disahkan\_pada | Immutable setelah disahkan; perubahan hanya via mekanisme versi baru (SRS-F-5.4) |
| follow\_ups | id, report\_id, rekomendasi, target, tenggat, progres | report\_id wajib merujuk ke laporan berstatus ≥ Tersedia bagi Pengawas |
| integration\_logs | id, report\_id, layanan (drive/sheets), status, percobaan\_ke, timestamp | Satu baris per percobaan; tidak menimpa baris sebelumnya |

Seluruh relasi antar-entitas menggunakan foreign key dengan constraint tegas (bukan hanya validasi di aplikasi) untuk mencegah data yatim (orphan records) yang sulit dideteksi saat volume data bertambah.

## 13. Matriks Ketertelusuran

Menghubungkan kelompok kebutuhan fungsional ke tujuan dan metrik keberhasilan pada PRD (Bagian 3), agar setiap kebutuhan dapat dijustifikasi dan setiap tujuan bisnis memiliki kebutuhan yang mewujudkannya.

| Tujuan PRD (Bagian 3) | Kebutuhan fungsional terkait | Kebutuhan non-fungsional terkait |
| --- | --- | --- |
| Adopsi guru 70%→95% | SRS-F-2.1–2.6 (form ringkas, draf otomatis) | NFR-8, NFR-9, NFR-14 (usability, mobile) |
| Kecepatan verifikasi ≤5→2 hari kerja | SRS-F-3.1–3.5 (alur verifikasi-revisi) | NFR-1 (performa dashboard) |
| Keberhasilan integrasi ≥95%→99% | SRS-F-6.1–6.4 (unggah, retry) | NFR-3 (reliabilitas alur inti) |
| Visibilitas pengawas ≤90%→99% dalam 24 jam | SRS-F-6.5, SRS-F-7.1–7.2 | NFR-3, NFR-4 |
| Keandalan sistem ≥99.0%→99.5% uptime | Seluruh modul (ketergantungan infrastruktur) | NFR-4 |
| Akuntabilitas/jejak audit | SRS-F-5.1, SRS-F-5.3–5.4 | NFR-10 |

Matriks ini sebaiknya diperbarui setiap kali kebutuhan baru ditambahkan pada fase implementasi, agar tidak ada fitur yang dibangun tanpa tujuan bisnis yang jelas (dan sebaliknya, tidak ada tujuan tanpa kebutuhan yang mewujudkannya).

## 14. Kriteria Penerimaan dan Pendekatan Validasi

| Modul | Kriteria penerimaan utama | Metode validasi |
| --- | --- | --- |
| Autentikasi | Peran yang salah tidak dapat mengakses dashboard/data peran lain, termasuk via akses URL langsung | Pengujian otorisasi otomatis per endpoint (bukan hanya pengujian UI) |
| Administrasi | Draf tidak hilang setelah sesi terputus secara paksa (refresh, koneksi putus) | Pengujian skenario interupsi manual dan otomatis |
| Verifikasi/Revisi | Pengajuan tidak dapat lanjut ke penilaian tanpa ditandai lengkap oleh kepala sekolah | Pengujian alur negatif (mencoba melewati tahap) |
| Instrumen/Penilaian | Laporan lama tetap menampilkan nilai sesuai versi instrumen saat dinilai, meski instrumen diperbarui | Pengujian regresi setelah pembuatan versi instrumen baru |
| Pengesahan/PDF | Laporan yang sudah disahkan tidak dapat diubah tanpa mekanisme revisi tercatat | Pengujian upaya ubah langsung ke database/API |
| Integrasi Google | Kegagalan Sheets tidak mencegah pengesahan tersimpan di database | Simulasi kegagalan API (mock/fault injection) |
| Dashboard Pengawas | Pengawas hanya melihat laporan dari sekolah binaan yang ditetapkan | Pengujian akses lintas-penugasan dengan akun berbeda |

**Definisi selesai (Definition of Done) untuk MVP:** seluruh kebutuhan berprioritas Wajib pada Bagian 3–9 lulus pengujian fungsional, seluruh NFR pada Bagian 11 terukur dan memenuhi ambang batas, dan satu siklus end-to-end (Draf → Tindak Lanjut) berhasil dijalankan tanpa intervensi manual pada data produksi uji.

## Lampiran: Glosarium

| Istilah | Definisi |
| --- | --- |
| Pengajuan | Kumpulan data administrasi dan bukti pembelajaran yang dikirim guru untuk disupervisi |
| Instrumen | Perangkat penilaian berisi indikator, skala skor, dan bobot |
| Pengesahan | Tindakan kepala sekolah mengunci laporan sebagai versi final |
| Sekolah binaan | Sekolah yang berada dalam kewenangan pengawasan seorang pengawas |
| Tindak lanjut | Rekomendasi perbaikan yang dipantau pasca-pengesahan laporan |
| Immutable | Data yang tidak dapat diubah setelah mencapai status tertentu, kecuali melalui mekanisme revisi tercatat |
| Upsert | Operasi yang memperbarui baris jika sudah ada, atau membuat baru jika belum ada, berdasarkan kunci unik |
