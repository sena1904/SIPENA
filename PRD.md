# PRD — SIPENA PAI (Sistem Informasi Penilaian dan Evaluasi PAI)

Oct 18, 2026 · Disusun oleh @Fathur

## Ringkasan Eksekutif

SIPENA PAI adalah sistem informasi berbasis web yang menggantikan proses supervisi pembelajaran PAI yang saat ini berjalan manual (kertas, spreadsheet terpisah, komunikasi informal) dengan satu alur digital yang menghubungkan tiga pihak: guru, kepala sekolah, dan pengawas sekolah, didukung administrator sistem.

Masalah inti yang diselesaikan: proses supervisi manual sulit ditelusuri (siapa menilai apa, kapan, dengan bukti apa), rawan dokumen hilang atau tertukar, lambat dalam siklus revisi, dan sulit direkap untuk pelaporan ke dinas atau yayasan. SIPENA PAI mengatasi ini dengan identitas unik per laporan, status yang dapat dilacak end-to-end, instrumen penilaian terstandardisasi, serta arsip otomatis ke Google Drive dan Google Sheets.

Nilai utama produk: (1) kejelasan status bagi guru — tidak ada lagi "menunggu tanpa kepastian"; (2) efisiensi bagi kepala sekolah — satu alur verifikasi-ke-pengesahan yang konsisten; (3) visibilitas bagi pengawas — rekap lintas sekolah binaan tanpa perlu meminta dokumen manual; (4) jejak audit yang mendukung akuntabilitas institusi.

## Latar Belakang dan Analisis Asumsi

Brief awal (BAB II–IV) sudah cukup matang secara fungsional, tetapi sebagai senior full-stack developer, beberapa asumsi perlu diuji secara eksplisit sebelum masuk tahap desain teknis, karena asumsi yang salah di sini akan mahal diperbaiki setelah implementasi:

1. **Asumsi “satu guru = satu sekolah”.** Brief tidak menyebut kasus guru honorer yang mengajar di beberapa sekolah. Jika kasus ini nyata di lapangan, relasi `teachers`–`schools` perlu many-to-many sejak awal, bukan ditambal belakangan.
2. **Asumsi ketersediaan Google Workspace.** Integrasi Drive/Sheets mengasumsikan setiap sekolah/yayasan punya akun Google Workspace terkelola. Perlu dikonfirmasi: apakah OAuth per-sekolah atau satu service account terpusat milik sistem? Ini menentukan model kredensial dan siapa yang “memiliki” folder Drive secara hukum.
3. **Asumsi koneksi internet stabil di sekolah.** Alur unggah bukti pembelajaran (foto, video, dokumen) mengasumsikan bandwidth memadai. Di banyak sekolah PAI (termasuk madrasah di daerah), ini belum tentu valid — perlu strategi unggah tahan-gangguan (resumable upload, kompresi otomatis).
4. **Asumsi satu instrumen penilaian berlaku untuk semua periode.** Brief menyebut `assessment_templates` tapi tidak menjelaskan versioning. Jika instrumen berubah tiap semester/tahun ajaran, laporan lama harus tetap merujuk ke versi instrumen saat dinilai, bukan versi terbaru.
5. **Asumsi pengawas hanya melihat, tidak menilai ulang.** Alur pengawas (3.3) bersifat observasional — ini perlu dikonfirmasi apakah sesuai regulasi supervisi PAI yang berlaku (biasanya pengawas punya kewenangan penilaian independen, bukan sekadar meninjau skor kepala sekolah).

Asumsi 1, 2, dan 4 berdampak langsung pada skema data (BAB IV) dan sebaiknya divalidasi dengan pemilik produk sebelum sprint pertama dimulai — lihat Bagian 14 untuk daftar pertanyaan terbuka.

## Tujuan, Sasaran, dan Metrik Keberhasilan

Tujuan produk: memindahkan 100% siklus supervisi PAI (administrasi → verifikasi → penilaian → pengesahan → tindak lanjut) dari proses manual ke platform digital dalam satu tahun ajaran, dengan jejak audit penuh.

| Sasaran | Metrik | Target MVP | Target 6 bulan pasca-rilis |
| --- | --- | --- | --- |
| Adopsi guru | % guru binaan aktif mengunggah pengajuan | 70% | 95% |
| Kecepatan verifikasi | Rata-rata waktu dari “Menunggu Verifikasi” ke keputusan kepala sekolah | ≤ 5 hari kerja | ≤ 2 hari kerja |
| Kualitas pengajuan pertama | % pengajuan yang lolos tanpa revisi | Diukur (baseline) | Naik 20% dari baseline |
| Keberhasilan integrasi | % pengesahan yang berhasil sinkron ke Drive & Sheets tanpa retry manual | 95% | 99% |
| Visibilitas pengawas | % laporan disahkan yang tersedia bagi pengawas dalam 24 jam | 90% | 99% |
| Keandalan sistem | Uptime API inti | 99.0% | 99.5% |

Metrik ini dipilih agar dapat diukur langsung dari data sistem (status, timestamp, log integrasi) tanpa survei manual — konsisten dengan prinsip bahwa setiap klaim keberhasilan harus bisa ditelusuri ke data, bukan asumsi.

## Target Pengguna dan Hak Akses (RBAC)

Empat peran dengan batas akses berbeda, diterapkan di level API (bukan hanya UI) agar tidak bisa dilewati lewat panggilan langsung:

| Peran | Fungsi utama | Lingkup data | Aksi yang dilarang |
| --- | --- | --- | --- |
| Guru | Mengisi administrasi, mengunggah bukti, mengirim/merevisi pengajuan, melihat hasil | Hanya laporan miliknya sendiri | Mengubah laporan setelah dikirim (kecuali revisi diminta); melihat laporan guru lain |
| Kepala sekolah | Verifikasi dokumen, mengisi instrumen, memberi catatan, mengesahkan laporan | Guru dan laporan dalam sekolah yang dikelolanya | Mengesahkan laporan sekolah lain; mengubah laporan yang sudah disahkan tanpa mekanisme revisi tercatat |
| Pengawas sekolah | Melihat laporan disahkan, memberi rekomendasi tindak lanjut | Sekolah binaan yang ditetapkan untuknya | Mengubah skor atau dokumen asli; melihat laporan sekolah di luar binaannya |
| Administrator | Mengelola akun, konfigurasi, instrumen, referensi data | Seluruh sistem sesuai kewenangan administrasi | Mengubah skor substantif laporan (hanya metadata/konfigurasi) |

Catatan desain: penugasan kepala sekolah–sekolah dan pengawas–sekolah binaan disimpan sebagai relasi eksplisit (`school_assignments`), bukan field tunggal, agar mendukung kasus satu sekolah dengan lebih dari satu pengawas atau rotasi penugasan antar tahun ajaran tanpa kehilangan riwayat.

## Ruang Lingkup

Pembagian MVP vs fase lanjutan didasarkan pada prinsip: MVP harus menutup satu siklus supervisi penuh (ujung ke ujung) agar bisa divalidasi dengan pengguna nyata, bukan sekadar fitur termudah.

**MVP (Fase 1) — in scope**

- Autentikasi berbasis peran (guru, kepala sekolah, pengawas, admin)
- Formulir administrasi pembelajaran + unggah bukti (dokumen, gambar)
- Alur verifikasi → revisi → penilaian → pengesahan (3.1–3.4)
- Instrumen penilaian dengan skor dan catatan
- Generate PDF laporan final
- Integrasi Google Drive (unggah PDF) dan Google Sheets (rekap) dengan log status integrasi
- Dashboard pengawas (rekap laporan sekolah binaan)
- Riwayat perubahan status dasar

**Out of scope untuk MVP (Fase 2+)**

- Notifikasi real-time (email/WhatsApp) saat status berubah
- Analitik tren penilaian lintas periode/sekolah
- Aplikasi mobile native (MVP web-responsive saja)
- Multi-tenant untuk yayasan dengan banyak unit sekolah lintas wilayah
- Workflow persetujuan berjenjang (lebih dari kepala sekolah → pengawas)
- Impor data historis dari sistem lama

Memisahkan ini secara eksplisit mencegah scope creep yang umum terjadi pada proyek e-gov/edukasi: fitur “bagus untuk dimiliki” sering menunda rilis fitur inti yang justru menentukan apakah sistem dipakai sama sekali.

## User Stories dan Functional Requirements

**Modul Autentikasi**

- Sebagai pengguna, saya login dengan email/password dan diarahkan ke dashboard sesuai peran saya.
- FR-1.1: Sistem memvalidasi kredensial dan menetapkan sesi berbasis token dengan masa berlaku terbatas.
- FR-1.2: Admin dapat membuat, menonaktifkan, dan mereset akses akun.

**Modul Administrasi dan Bukti Pembelajaran**

- Sebagai guru, saya mengisi identitas pembelajaran dan mengunggah bukti agar dapat diverifikasi kepala sekolah.
- FR-2.1: Form wajib memvalidasi field kunci (mata pelajaran, kelas, periode) sebelum submit diaktifkan.
- FR-2.2: Unggah dokumen mendukung format umum (PDF, JPG, PNG, DOCX) dengan batas ukuran, dan menampilkan progres unggah.
- FR-2.3: Draf tersimpan otomatis agar guru tidak kehilangan input jika sesi terputus.

**Modul Verifikasi dan Revisi**

- Sebagai kepala sekolah, saya memeriksa kelengkapan dan mengembalikan pengajuan dengan catatan jika belum sesuai.
- FR-3.1: Kepala sekolah hanya dapat memproses pengajuan dari sekolah yang dikelolanya.
- FR-3.2: Pengembalian pengajuan wajib menyertakan catatan revisi (tidak boleh kosong).
- FR-3.3: Guru menerima status “Perlu Revisi” beserta catatan spesifik dan dapat mengirim ulang tanpa kehilangan data sebelumnya.

**Modul Instrumen Penilaian**

- Sebagai kepala sekolah, saya memberi skor per indikator agar nilai akhir terhitung otomatis.
- FR-4.1: Instrumen terdiri atas indikator, skala skor, dan bobot (jika digunakan), dikelola oleh admin dan diversi agar perubahan tidak memengaruhi laporan lama.
- FR-4.2: Sistem menghitung nilai akhir sesuai rumus instrumen aktif saat penilaian dilakukan, bukan saat diakses.

**Modul Pengesahan dan PDF**

- Sebagai kepala sekolah, saya mengesahkan laporan agar menjadi versi final yang tidak dapat diubah sembarangan.
- FR-5.1: Pengesahan mengunci laporan (immutable) dan mencatat timestamp, identitas pengesah.
- FR-5.2: Sistem menghasilkan PDF dari data final dalam waktu wajar (lihat NFR performa) dan menyimpan tautannya di `supervision_reports`.

**Modul Integrasi Google**

- Sebagai sistem, saya mengunggah PDF ke Drive dan mengirim rekap ke Sheets agar data dapat diakses dan diarsipkan.
- FR-6.1: Setiap percobaan integrasi dicatat di `integration_logs` dengan status (berhasil/gagal) per layanan (Drive, Sheets) secara terpisah.
- FR-6.2: Kegagalan satu layanan tidak memblokir keberhasilan layanan lain, dan dapat dicoba ulang tanpa duplikasi data.

**Modul Dashboard Pengawas**

- Sebagai pengawas, saya melihat rekap laporan sekolah binaan saya agar dapat memantau tanpa meminta dokumen manual.
- FR-7.1: Laporan hanya tampil bagi pengawas setelah status “Tersedia bagi Pengawas” tercapai.
- FR-7.2: Pengawas dapat menambah catatan tindak lanjut yang tersimpan terpisah dari penilaian kepala sekolah.

## Alur Kerja End-to-End dan State Machine Status

&#91;embedded content: alur status pengajuan · 1 keputusan, 1 loop revisi\]

Setelah pengesahan, laporan berlanjut ke tahap publikasi dan tinjauan pengawas (lihat tabel status lengkap di bawah) — proses ini tidak melibatkan keputusan guru/kepala sekolah lagi, sehingga digambarkan sebagai status berurutan, bukan diagram keputusan.

| Status | Pemilik aksi | Penjelasan |
| --- | --- | --- |
| Draf | Guru | Pengajuan sedang diisi, belum dikirim |
| Menunggu Verifikasi | Kepala sekolah | Dikirim guru, menunggu pemeriksaan kelengkapan |
| Perlu Revisi | Guru | Dokumen dikembalikan dengan catatan |
| Dalam Penilaian | Kepala sekolah | Dokumen lengkap, sedang dinilai |
| Menunggu Pengesahan | Kepala sekolah | Penilaian selesai, menunggu pengesahan final |
| Diproses untuk Publikasi | Sistem | PDF dibuat, sinkronisasi ke Drive & Sheets berjalan |
| Tersedia bagi Pengawas | Sistem | Prasyarat publikasi terpenuhi, laporan dapat dilihat pengawas |
| Ditinjau Pengawas | Pengawas | Pengawas telah membuka dan membaca laporan |
| Tindak Lanjut | Pengawas | Rekomendasi perbaikan sedang dipantau |

Transisi status bersifat satu arah kecuali jalur revisi (Perlu Revisi → Menunggu Verifikasi); laporan yang sudah berstatus Diproses untuk Publikasi ke atas tidak dapat kembali ke status sebelumnya — perubahan setelah titik ini wajib lewat mekanisme revisi tercatat (lihat Bagian 11).

## Non-Functional Requirements

| Kategori | Requirement |
| --- | --- |
| Performa | Generate PDF laporan ≤ 10 detik untuk dokumen hingga 20 halaman; waktu muat dashboard ≤ 2 detik pada koneksi 4G |
| Ketersediaan | Uptime API inti ≥ 99% (MVP), fitur integrasi Google tidak boleh memblokir alur inti saat Google API bermasalah |
| Keamanan | Semua endpoint diverifikasi hak akses di sisi server (bukan hanya UI); kata sandi di-hash (bcrypt/argon2); token sesi kedaluwarsa otomatis |
| Skalabilitas | Arsitektur mendukung pertambahan sekolah binaan tanpa migrasi skema besar (lihat Bagian 9 — relasi via tabel penugasan) |
| Aksesibilitas | Form utama dapat dioperasikan dengan keyboard; kontras warna memenuhi WCAG AA untuk teks penting |
| Auditabilitas | Setiap perubahan status, penilaian, dan pengesahan tercatat dengan aktor, waktu, dan nilai lama/baru |
| Portabilitas data | Rekap dapat diekspor independen dari Google Sheets (CSV) sebagai jalur cadangan jika integrasi gagal total |
| Kompatibilitas perangkat | Web responsif, berfungsi penuh di browser mobile standar (guru sering mengakses dari ponsel) |

Kompatibilitas perangkat sengaja ditekankan karena guru dan kepala sekolah di lapangan lebih sering mengakses sistem administrasi dari ponsel daripada laptop — ini praduga yang perlu divalidasi, bukan fakta pasti (lihat Bagian 14).

## Arsitektur Teknis

**Stack yang diusulkan:** Next.js (App Router) untuk frontend dan API routes, PostgreSQL sebagai database relasional, Supabase untuk autentikasi dan akses data terkelola (Row Level Security selaras dengan RBAC di Bagian 3), Google Drive API dan Google Sheets API untuk integrasi, hosting di Vercel (aplikasi) dan Supabase (database).

**Mengapa stack ini masuk akal:** Next.js memungkinkan frontend dan backend ringan dalam satu basis kode, mempercepat MVP. Supabase RLS memetakan langsung ke kebutuhan RBAC (guru hanya lihat data sendiri, kepala sekolah hanya sekolahnya) tanpa logika otorisasi terpisah di setiap endpoint — mengurangi risiko celah akses yang sering terjadi saat otorisasi hanya dicek di frontend.

**Alternatif yang dipertimbangkan dan alasan tidak dipilih untuk MVP:**

- *NestJS/Express terpisah + React terpisah* — lebih fleksibel untuk tim besar, tapi menambah kompleksitas deployment dan koordinasi yang tidak sepadan untuk tim kecil di tahap MVP.
- *Firebase (Firestore) sebagai pengganti PostgreSQL* — lebih cepat untuk prototipe, tapi data supervisi bersifat relasional dan butuh query agregat lintas tabel (rekap pengawas, laporan per periode) yang lebih alami di SQL daripada NoSQL.
- *Self-hosted PostgreSQL di luar Supabase* — menghemat biaya jangka panjang, tapi menambah beban operasional (backup, patching) yang belum perlu ditanggung di MVP.

**Catatan kritis:** Supabase RLS efektif untuk mencegah akses lintas-tenant, tapi tim tetap perlu menulis test otorisasi eksplisit (bukan hanya mengandalkan RLS “diam-diam benar”), karena kesalahan policy RLS seringkali baru terlihat saat data produksi sudah berjalan.

## Skema Data Utama

| Tabel | Data yang dikelola | Catatan desain |
| --- | --- | --- |
| users | Identitas akun, email/login, peran, status | Satu baris per akun, peran menentukan RLS |
| schools | Identitas dan informasi sekolah | — |
| school\_assignments | Relasi kepala sekolah/pengawas – sekolah | Many-to-many, mendukung multi-penugasan dan riwayat per tahun ajaran |
| teachers | Profil guru, keterkaitan sekolah | Disarankan many-to-many ke schools jika guru lintas-sekolah nyata terjadi (lihat Asumsi 1, Bagian 2) |
| supervision\_submissions | Pengajuan, periode, jadwal, status | Status mengikuti state machine di Bagian 6 |
| documents | Jenis dokumen, metadata, pemilik, lokasi | Lokasi fisik file (storage path), bukan file itu sendiri |
| assessment\_templates | Instrumen, indikator, skala, bobot | Perlu field versi eksplisit; laporan merujuk versi saat dinilai, bukan versi terbaru (lihat Asumsi 4) |
| assessment\_answers | Skor, jawaban, catatan per indikator | Terhubung ke versi template yang berlaku saat penilaian |
| supervision\_reports | Nilai akhir, status pengesahan, ID & tautan PDF | Immutable setelah pengesahan; perubahan lewat follow\_ups atau revisi tercatat |
| follow\_ups | Rekomendasi, target, tenggat, progres | Dapat diisi pengawas tanpa mengubah nilai laporan asli |
| integration\_logs | Status & riwayat pengiriman ke Drive/Sheets | Satu baris per percobaan per layanan, mendukung retry granular (lihat Bagian 10) |

Tabel ini konsisten dengan rancangan awal di BAB IV brief, dengan dua penambahan yang direkomendasikan: versi eksplisit pada `assessment_templates`, dan opsi relasi many-to-many pada `teachers`–`schools` — keduanya murah untuk ditambahkan sekarang, mahal untuk ditambal setelah data produksi berjalan.

## Integrasi Google Drive dan Google Sheets

Alur: pengesahan → database menyimpan status final → generate PDF → unggah ke folder Drive dengan akses terbatas → kirim rekap (ID laporan, identitas guru/sekolah, periode, nilai, status, tautan file) ke Sheets.

**Prinsip desain kritis:** database tetap menjadi sumber kebenaran (source of truth). PDF dan Sheets adalah salinan turunan, bukan sumber data utama — ini penting karena layanan Google dapat gagal sementara tanpa mengorbankan integritas data inti.

**Penanganan kegagalan (wajib, bukan opsional):**

- Setiap percobaan ke Drive dan ke Sheets dicatat terpisah di `integration_logs` dengan status sendiri — PDF berhasil diunggah tapi Sheets gagal HARUS tetap tercatat sebagai dua hasil berbeda, bukan satu status gabungan.
- Retry otomatis dengan backoff untuk kegagalan sementara (timeout, rate limit); retry manual oleh admin untuk kegagalan persisten.
- Status “Tersedia bagi Pengawas” hanya tercapai setelah prasyarat publikasi terpenuhi — definisi “prasyarat” perlu diputuskan eksplisit: apakah PDF saja cukup, atau PDF + Sheets keduanya wajib? (lihat Bagian 14, pertanyaan terbuka)
- Idempotensi: retry tidak boleh membuat duplikasi baris di Sheets atau file ganda di Drive — gunakan ID laporan sebagai kunci upsert.

**Kontra-argumen yang perlu dipertimbangkan:** mengharuskan Sheets berhasil sebelum laporan tersedia bagi pengawas berisiko memblokir alur kerja hanya karena masalah pihak ketiga (kuota API Google, downtime). Alternatif yang lebih tangguh: laporan tersedia bagi pengawas begitu PDF berhasil dan tersimpan di database, sementara Sheets menjadi lapisan pelaporan sekunder yang boleh menyusul (eventually consistent). Keputusan ini sebaiknya dikonfirmasi dengan pemilik produk karena berdampak pada ekspektasi SLA (Bagian 2, target 24 jam).

## Keamanan dan Tata Kelola Data

- Hak akses ditegakkan di level database (RLS) dan API, berdasarkan peran, sekolah, dan penugasan — bukan hanya disembunyikan di UI; pengguna tidak boleh melihat laporan di luar kewenangannya meskipun mencoba mengakses URL/endpoint secara langsung.
- File di Google Drive menggunakan akses terbatas (shared dengan akun tertentu), bukan tautan publik secara default.
- Setiap perubahan status, penilaian, pengesahan, dan percobaan integrasi dicatat dengan aktor, waktu, dan nilai lama/baru agar dapat ditelusuri (lihat Bagian 9, `integration_logs`).
- Laporan final memiliki versi dan waktu pengesahan; perubahan setelah pengesahan hanya melalui mekanisme revisi yang tercatat, tidak pernah menimpa data lama secara diam-diam.
- Data pribadi (identitas guru, siswa jika relevan) dikumpulkan seperlunya, disimpan dengan pengamanan memadai (enkripsi saat transit dan saat disimpan, minimal untuk kredensial), dan dikelola mengikuti ketentuan perlindungan data pribadi yang berlaku di Indonesia (UU PDP).
- Sistem menyediakan pencadangan basis data terjadwal dan prosedur pemulihan terdokumentasi apabila terjadi kegagalan layanan.

**Pertanyaan kritis yang belum terjawab brief:** siapa pemilik data secara hukum — sekolah individual, yayasan/dinas, atau penyedia sistem? Ini menentukan kebijakan retensi data saat sebuah sekolah berhenti menggunakan sistem, dan siapa yang berwenang meminta penghapusan data sesuai UU PDP. Sebaiknya diklarifikasi sebelum implementasi fitur ekspor/penghapusan data.

## Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Adopsi rendah — guru kembali ke proses manual karena dianggap merepotkan | Tinggi | Formulir ringkas, draf tersimpan otomatis, akses mobile-friendly; pilot di satu sekolah sebelum rilis penuh |
| Ketergantungan pada Google API — kuota/downtime menghambat pengesahan | Sedang | Database tetap sumber kebenaran (Bagian 10); laporan tidak terkunci menunggu Google, hanya status publikasi yang tertunda |
| Kesalahan kebijakan RLS membocorkan data lintas sekolah | Tinggi (kepercayaan) | Test otorisasi eksplisit per peran sebelum rilis, bukan hanya mengandalkan RLS (Bagian 8) |
| Perubahan instrumen penilaian merusak laporan lama | Sedang | Versioning instrumen wajib sejak awal (Bagian 2, Asumsi 4) |
| Kualitas bukti pembelajaran rendah (foto buram, dokumen salah) lolos ke penilaian | Sedang | Validasi dasar (format, ukuran) otomatis; validasi substansi tetap tanggung jawab kepala sekolah di tahap verifikasi |
| Guru lintas-sekolah tidak tertampung skema data | Sedang | Validasi asumsi 1 dengan stakeholder sebelum sprint pertama; desain relasi many-to-many jika terbukti nyata |

Kontra-argumen terhadap desain pengesahan “immutable” (Bagian 5): beberapa tim mungkin berargumen bahwa laporan final harus bisa diedit langsung oleh kepala sekolah untuk kasus kesalahan ketik kecil, demi kepraktisan. Rekomendasi tetap mempertahankan immutability dengan mekanisme revisi tercatat, karena laporan supervisi berfungsi sebagai dokumen akuntabilitas — kemudahan edit langsung membuka risiko manipulasi nilai pasca-pengesahan yang jauh lebih mahal daripada ketidaknyamanan proses revisi formal.

## Roadmap Fase Pengembangan

| Fase | Fokus | Keluaran utama |
| --- | --- | --- |
| Fase 0 — Validasi (2–3 minggu) | Konfirmasi asumsi Bagian 2 dan pertanyaan terbuka Bagian 14 dengan stakeholder | Dokumen keputusan yang mengunci skema data final |
| Fase 1 — MVP inti (6–8 minggu) | Autentikasi, administrasi, verifikasi/revisi, penilaian, pengesahan, PDF | Satu siklus supervisi penuh berjalan tanpa integrasi Google |
| Fase 2 — Integrasi dan dashboard pengawas (3–4 minggu) | Integrasi Drive/Sheets dengan log kegagalan, dashboard pengawas | MVP lengkap sesuai lingkup Bagian 4 |
| Fase 3 — Pilot terbatas (4–6 minggu) | Rilis ke 1–2 sekolah, kumpulkan data adopsi dan kecepatan verifikasi (Bagian 2) | Baseline metrik nyata, daftar perbaikan prioritas |
| Fase 4 — Rilis bertahap dan fitur lanjutan | Notifikasi, analitik tren, kemungkinan multi-tenant yayasan | Sesuai hasil pilot dan prioritas bisnis |

Fase 0 sengaja ditempatkan sebelum coding dimulai — ini bukan birokrasi tambahan, tapi konsekuensi logis dari analisis asumsi di Bagian 2: mengunci skema data (terutama relasi guru–sekolah dan versioning instrumen) sebelum Fase 1 jauh lebih murah daripada migrasi data produksi di Fase 3.

## Asumsi Terbuka dan Pertanyaan untuk Stakeholder

- [ ] Apakah ada guru yang mengajar di lebih dari satu sekolah? Jika ya, relasi `teachers`–`schools` perlu many-to-many sejak Fase 1.
- [ ] Model kredensial Google: OAuth per-sekolah (setiap sekolah menyambungkan akun Google sendiri) atau satu service account terpusat milik sistem?
- [ ] Apakah instrumen penilaian berubah antar semester/tahun ajaran? Jika ya, seberapa sering, dan siapa yang berwenang mengubahnya?
- [ ] Apakah pengawas memiliki kewenangan menilai ulang/independen, atau murni meninjau hasil kepala sekolah sesuai regulasi supervisi PAI yang berlaku?
- [ ] Definisi “prasyarat publikasi” (Bagian 10): apakah PDF saja cukup untuk status “Tersedia bagi Pengawas”, atau Sheets juga wajib berhasil?
- [ ] Siapa pemilik data secara hukum (sekolah, yayasan/dinas, atau penyedia sistem) — menentukan kebijakan retensi dan penghapusan data sesuai UU PDP?
- [ ] Apakah akses internet di sekolah binaan cukup stabil untuk unggah dokumen/gambar, atau perlu strategi unggah tahan-gangguan sejak MVP?

Menjawab tujuh pertanyaan ini sebelum Fase 1 dimulai (lihat Roadmap, Bagian 13) adalah langkah dengan rasio biaya-manfaat tertinggi dalam keseluruhan proyek: masing-masing murah untuk diklarifikasi sekarang lewat satu sesi diskusi, tapi mahal untuk diperbaiki setelah skema data dan alur kerja terlanjur diimplementasikan.
