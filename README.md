# SIPENA PAI (Sistem Informasi Penilaian dan Evaluasi PAI)

Aplikasi Web Resmi Penilaian dan Supervisi Akademik Pembelajaran Pendidikan Agama Islam (PAI) berbasis regulasi Direktorat PAI Kementerian Agama RI & Kemendikbudristek.

Dibangun dengan standar **Senior Full-Stack Developer** mengacu penuh pada [PRD.md](file:///d:/Code/sipena/PRD.md), [SRS.md](file:///d:/Code/sipena/SRS.md), dan panduan desain cerdas [ui-ux-pro-max](file:///d:/Code/sipena/design-system/sipena-pai/MASTER.md).

---

## 🌟 Fitur Utama & Kepatuhan Spesifikasi (SRS & PRD)

### 1. Autentikasi & RBAC 4 Peran (SRS-F-1.1 – 1.6)
- **Guru PAI**: Mengisi identitas supervisi, draf otomatis, unggah modul ajar & bukti pembelajaran, penanganan siklus revisi, dan melihat hasil supervisi final.
- **Kepala Sekolah**: Memeriksa kelengkapan berkas sekolah binaan, meminta revisi dengan catatan wajib, menilai indikator dengan rubrik standar, serta mengesahkan laporan (*immutable*).
- **Pengawas Sekolah**: Memantau rekapitulasi mutu lintas sekolah binaan, membuka dokumen resmi terverifikasi, serta menetapkan Rencana Tindak Lanjut (*follow-up action plan*).
- **Administrator**: Manajemen akun pengguna (aktivasi/nonaktivasi/reset akses), versioning instrumen penilaian, pemantauan log sinkronisasi Google, serta unduhan cadangan CSV independen.

### 2. State Machine 9 Status End-to-End
1. `Draf` (Guru)
2. `Menunggu Verifikasi` (Kepala Sekolah)
3. `Perlu Revisi` (Loop perbaikan Guru & KS)
4. `Dalam Penilaian` (Kepala Sekolah)
5. `Menunggu Pengesahan` (Kepala Sekolah)
6. `Diproses untuk Publikasi` (Sistem: Generator PDF & Sinkronisasi Drive/Sheets)
7. `Tersedia bagi Pengawas` (Sistem)
8. `Ditinjau Pengawas` (Pengawas)
9. `Tindak Lanjut` (Pengawas)

### 3. Instrumen Penilaian Standar Kurikulum Merdeka PAI (SRS-F-4.1 – 4.6)
- **Domain A**: Perencanaan Pembelajaran (Bobot 30%)
- **Domain B**: Pelaksanaan Pembelajaran di Kelas / Observasi (Bobot 45%)
- **Domain C**: Evaluasi, Asesmen, dan Refleksi (Bobot 25%)
- Perhitungan nilai otomatis berbobot (0 – 100) dengan konversi predikat resmi:
  - `Amat Baik` (91 - 100)
  - `Baik` (81 - 90)
  - `Cukup` (71 - 80)
  - `Kurang` (< 71)

### 4. Pengesahan Digital & Pembuatan PDF Laporan Resmi (SRS-F-5.1 – 5.4)
- Dialog konfirmasi pengesahan mengunci laporan (*immutability lock*).
- Kop surat formal Kementerian Agama, QR Code verifikasi digital, rekap nilai per indikator, dan tanda tangan 3 pihak (Guru, Kepala Sekolah, Pengawas).
- Unduh langsung ke format PDF standar arsip (`jsPDF` + `html2canvas`) dalam waktu < 2 detik.

### 5. Ketahanan Sinkronisasi Google Drive & Sheets (SRS-F-6.1 – 6.6)
- Pencatatan log terpisah (*independent tracking*) antara Google Drive API dan Google Sheets API.
- Idempotensi berdasar ID Laporan mencegah duplikasi baris atau berkas ganda.
- Mekanisme coba ulang manual (*manual retry*) untuk kegagalan kuota/timeout sementara.
- Jalur cadangan ekspor CSV independen (NFR-13) tanpa ketergantungan pada Google API.

---

## 🎨 Desain Sistem (`ui-ux-pro-max`)

Mengikuti panduan master [design-system/sipena-pai/MASTER.md](file:///d:/Code/sipena/design-system/sipena-pai/MASTER.md):
- **Gaya Visual**: *Minimalism & Swiss Style* (bersih, lapang, fungsional, kontras tinggi WCAG AA ≥ 4.5:1).
- **Tipografi**:
  - Heading: **Lexend** (modern, ramah keterbacaan formal institusi).
  - Body: **Source Sans 3** (sangat nyaman dibaca untuk tabel data dan evaluasi naratif).
- **Palet Warna**:
  - Primary: `#1E3A5F` (*Trust Navy*)
  - Secondary: `#2563EB` (*Enterprise Blue*)
  - Accent / Stempel: `#16A34A` (*Islamic Emerald*)
  - Background: `#F8FAFC`
- **Ikonografi**: Vektor SVG murni (`lucide-react`) — tanpa emoji sebagai elemen struktural UI.

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi telah dikonfigurasi dan berjalan pada environment lokal:

```bash
# 1. Jalankan server pengembang Vite
npm run dev

# 2. Buka di peramban (browser)
http://localhost:3000/
```

Untuk membangun bundle produksi:
```bash
npm run build
```

---

## 👥 Akun Simulasi & Pengujian RBAC Cepat

Aplikasi menyediakan **Mode Simulasi RBAC** di bilah atas untuk menguji alur kerja dari semua perspektif dengan 1 klik:

1. **Ahmad Dahlan, S.Pd.I** (`guru`): Buat modul ajar, simpan draf otomatis, kirim pengajuan.
2. **Drs. H. Suryanto, M.Pd** (`kepala_sekolah`): Verifikasi berkas, kirim catatan revisi, nilai indikator observasi, sahkan laporan.
3. **Dra. Hj. Siti Fatimah, M.Pd** (`pengawas`): Rekap multi-sekolah, tinjau PDF resmi, tetapkan tindak lanjut.
4. **M. Fathurrahman, S.Kom** (`admin`): Manajemen pengguna, versioning instrumen, log integrasi Google & retry, audit trail.
