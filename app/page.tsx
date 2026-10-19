'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Award,
  FileSpreadsheet,
  FileText,
  ArrowRight,
  BookOpen,
  Compass,
  ShieldCheck,
  CheckCircle2,
  LogIn,
  Mail,
  Phone,
  MapPin,
  Menu,
  X,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Layanan Utama (Feature Cards matching reference image)
  const layananUtama = [
    {
      title: 'Supervisi Pembelajaran',
      desc: 'Pendampingan dan evaluasi pembelajaran PAI secara terpadu dan objektif.',
      icon: <GraduationCap size={28} color="#0284C7" />,
      bgIcon: '#E0F2FE',
      borderColor: '#BAE6FD'
    },
    {
      title: 'Penilaian Panca Waluya',
      desc: 'Penilaian karakter berlandaskan lima dimensi Panca Waluya dan indikator mutu PAI.',
      icon: <Award size={28} color="#7C3AED" />,
      bgIcon: '#EDE9FE',
      borderColor: '#DDD6FE'
    },
    {
      title: 'Administrasi Guru',
      desc: 'Kelola data guru, modul ajar, dan dokumen pembelajaran secara rapi dan digital.',
      icon: <FileSpreadsheet size={28} color="#059669" />,
      bgIcon: '#D1FAE5',
      borderColor: '#A7F3D0'
    },
    {
      title: 'Laporan Supervisi',
      desc: 'Cetak laporan resmi dalam format PDF dengan validasi digital dan rekapitulasi.',
      icon: <FileText size={28} color="#D97706" />,
      bgIcon: '#FEF3C7',
      borderColor: '#FDE68A'
    }
  ];

  // Alur Penggunaan (Stepper matching reference image)
  const alurPenggunaan = [
    {
      step: '1',
      role: 'Guru',
      desc: 'Mengisi data administrasi dan mengunggah dokumen bukti pendukung pembelajaran.'
    },
    {
      step: '2',
      role: 'Kepala Sekolah',
      desc: 'Menilai observasi, memberikan catatan perbaikan, dan menyetujui laporan.'
    },
    {
      step: '3',
      role: 'Pengawas Sekolah',
      desc: 'Memantau capaian sekolah, memberi rekomendasi, dan menyusun tindak lanjut.'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC', color: '#0F172A', fontFamily: 'var(--font-body, "Source Sans 3", sans-serif)' }}>
      {/* 1. Header / Navbar */}
      <header
        style={{
          backgroundColor: '#0F2042',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 24px',
            height: '76px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Brand Logo & Name */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #4338CA 0%, #312E81 100%)',
                border: '2px solid #F59E0B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
                flexShrink: 0
              }}
            >
              <BookOpen size={24} color="#FDE68A" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-heading, "Lexend", sans-serif)',
                    fontSize: '22px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    letterSpacing: '0.5px'
                  }}
                >
                  SIPENA PAI
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#93C5FD', fontWeight: 500, letterSpacing: '0.2px', lineHeight: 1.2 }}>
                Sistem Informasi Pendampingan dan Evaluasi Pembelajaran PAI
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '28px'
            }}
            className="desktop-nav"
          >
            <a
              href="#beranda"
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#E2E8F0',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
            >
              Beranda
            </a>
            <a
              href="#tentang"
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#E2E8F0',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
            >
              Tentang
            </a>
            <a
              href="#panduan"
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#E2E8F0',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
            >
              Panduan
            </a>
            <a
              href="#kontak"
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#E2E8F0',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
            >
              Kontak
            </a>

            {/* CTA Button "Masuk" (without Google, matches user instruction) */}
            <Link
              href="/login"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#0F2042',
                padding: '9px 24px',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.2s ease',
                border: '1px solid rgba(255, 255, 255, 0.8)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#F1F5F9';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <LogIn size={16} color="#0F2042" />
              <span>Masuk</span>
            </Link>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              padding: '8px'
            }}
            className="mobile-toggle"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div
            style={{
              backgroundColor: '#0A1833',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '16px 24px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <a
              href="#beranda"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#E2E8F0', textDecoration: 'none', fontWeight: 600, fontSize: '15px' }}
            >
              Beranda
            </a>
            <a
              href="#tentang"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#E2E8F0', textDecoration: 'none', fontWeight: 600, fontSize: '15px' }}
            >
              Tentang
            </a>
            <a
              href="#panduan"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#E2E8F0', textDecoration: 'none', fontWeight: 600, fontSize: '15px' }}
            >
              Panduan
            </a>
            <a
              href="#kontak"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#E2E8F0', textDecoration: 'none', fontWeight: 600, fontSize: '15px' }}
            >
              Kontak
            </a>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                backgroundColor: '#FFFFFF',
                color: '#0F2042',
                padding: '12px 20px',
                borderRadius: '9999px',
                fontSize: '15px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                textDecoration: 'none',
                marginTop: '8px'
              }}
            >
              <LogIn size={18} />
              <span>Masuk</span>
            </Link>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section
        id="beranda"
        style={{
          position: 'relative',
          minHeight: '560px',
          backgroundImage: 'linear-gradient(90deg, rgba(10, 24, 52, 0.94) 0%, rgba(15, 32, 66, 0.88) 55%, rgba(15, 23, 42, 0.72) 100%), url("/images/hero-campus.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          color: '#FFFFFF',
          padding: '80px 24px 60px',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            width: '100%',
            position: 'relative',
            zIndex: 10
          }}
        >
          <div style={{ maxWidth: '680px' }}>
            {/* Tagline / Subtitle */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#93C5FD',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '20px'
              }}
            >
              <Sparkles size={15} color="#FBBF24" />
              <span>Portal Resmi Supervisi Pembelajaran PAI</span>
            </div>

            {/* Main Hero Title */}
            <h1
              style={{
                fontFamily: 'var(--font-heading, "Lexend", sans-serif)',
                fontSize: 'clamp(36px, 5vw, 52px)',
                fontWeight: 800,
                lineHeight: 1.15,
                color: '#FFFFFF',
                letterSpacing: '-0.5px',
                marginBottom: '14px',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.4)'
              }}
            >
              SIPENA PAI
            </h1>

            {/* Sub-headline */}
            <h2
              style={{
                fontFamily: 'var(--font-heading, "Lexend", sans-serif)',
                fontSize: 'clamp(18px, 2.5vw, 24px)',
                fontWeight: 600,
                lineHeight: 1.35,
                color: '#E0E7FF',
                marginBottom: '20px',
                textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)'
              }}
            >
              Sistem Informasi Pendampingan dan Evaluasi Pembelajaran PAI
            </h2>

            {/* Hero Description */}
            <p
              style={{
                fontSize: '15px',
                lineHeight: 1.7,
                color: '#CBD5E1',
                marginBottom: '36px',
                maxWidth: '620px'
              }}
            >
              Aplikasi untuk mendukung administrasi, penilaian, dan tindak lanjut supervisi pembelajaran Pendidikan Agama Islam di lingkungan satuan pendidikan secara terintegrasi, transparan, dan terstandarisasi.
            </p>

            {/* Hero CTA Button "Masuk" */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link
                href="/login"
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#0F2042',
                  padding: '14px 34px',
                  borderRadius: '9999px',
                  fontSize: '16px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  textDecoration: 'none',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.35)',
                  transition: 'all 0.25s ease',
                  border: '2px solid rgba(255, 255, 255, 0.9)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 14px 28px rgba(0, 0, 0, 0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.35)';
                }}
              >
                <LogIn size={20} color="#0F2042" />
                <span>Masuk</span>
                <ArrowRight size={18} color="#0F2042" />
              </Link>
            </div>
          </div>

          {/* Slogan at Bottom Right of Hero (Matches reference image) */}
          <div
            style={{
              position: 'relative',
              marginTop: '48px',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 20px',
                borderRadius: '9999px',
                background: 'rgba(15, 32, 66, 0.65)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#F8FAFC',
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '1px'
              }}
            >
              <span>Berakhlak</span>
              <span style={{ color: '#F59E0B' }}>•</span>
              <span>Berilmu</span>
              <span style={{ color: '#F59E0B' }}>•</span>
              <span>Berdaya</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section: Layanan Utama (Tentang) */}
      <section
        id="tentang"
        style={{
          padding: '80px 24px',
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%'
        }}
      >
        <div style={{ marginBottom: '36px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-heading, "Lexend", sans-serif)',
              fontSize: '28px',
              fontWeight: 800,
              color: '#0F172A',
              marginBottom: '8px'
            }}
          >
            Layanan Utama
          </h2>
          <p style={{ fontSize: '15px', color: '#64748B' }}>
            Empat pilar layanan digital untuk mendukung mutu supervisi dan tata kelola pembelajaran Pendidikan Agama Islam.
          </p>
        </div>

        {/* 4 Cards Grid (matching reference image) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px'
          }}
        >
          {layananUtama.map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '36px 24px',
                textAlign: 'center',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px -4px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.borderColor = item.borderColor;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.04)';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              {/* Icon Container with rounded square badge */}
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: item.bgIcon,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                {item.icon}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: 'var(--font-heading, "Lexend", sans-serif)',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#0F172A',
                  marginBottom: '12px'
                }}
              >
                {item.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: '13.5px',
                  color: '#64748B',
                  lineHeight: 1.6,
                  margin: 0
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Section: Alur Penggunaan (Panduan) */}
      <section
        id="panduan"
        style={{
          padding: '0 24px 80px',
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%'
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
            padding: '40px 36px'
          }}
        >
          <div style={{ marginBottom: '36px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-heading, "Lexend", sans-serif)',
                fontSize: '24px',
                fontWeight: 800,
                color: '#0F172A',
                marginBottom: '6px'
              }}
            >
              Alur Penggunaan
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B' }}>
              Siklus supervisi terintegrasi dalam tiga tahapan kerja kolaboratif antara pendidik dan pembina satuan pendidikan.
            </p>
          </div>

          {/* Stepper Horizontal Flow (matching reference image) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '20px',
              flexWrap: 'wrap'
            }}
            className="alur-container"
          >
            {alurPenggunaan.map((item, idx) => (
              <React.Fragment key={item.step}>
                {/* Step Item */}
                <div
                  style={{
                    flex: '1 1 240px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px'
                  }}
                >
                  {/* Step Number Circle */}
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: '#2563EB',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: 700,
                      flexShrink: 0,
                      boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)'
                    }}
                  >
                    {item.step}
                  </div>

                  {/* Content */}
                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-heading, "Lexend", sans-serif)',
                        fontSize: '17px',
                        fontWeight: 700,
                        color: '#0F172A',
                        marginBottom: '6px'
                      }}
                    >
                      {item.role}
                    </h3>
                    <p
                      style={{
                        fontSize: '13.5px',
                        color: '#64748B',
                        lineHeight: 1.55,
                        margin: 0
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Arrow Divider (except after the last item) */}
                {idx < alurPenggunaan.length - 1 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingTop: '10px',
                      color: '#94A3B8'
                    }}
                    className="alur-arrow"
                  >
                    <ArrowRight size={24} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Section: Informasi Regulasi & Keunggulan Terintegrasi */}
      <section
        style={{
          backgroundColor: '#F1F5F9',
          borderTop: '1px solid #E2E8F0',
          borderBottom: '1px solid #E2E8F0',
          padding: '64px 24px'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#2563EB',
                backgroundColor: '#DBEAFE',
                padding: '4px 12px',
                borderRadius: '9999px',
                display: 'inline-block',
                marginBottom: '12px'
              }}
            >
              Standarisasi Mutu PAI
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-heading, "Lexend", sans-serif)',
                fontSize: '28px',
                fontWeight: 800,
                color: '#0F172A',
                marginBottom: '10px'
              }}
            >
              Dirancang Sesuai Kurikulum Merdeka & Standar Kemenag
            </h2>
            <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.6 }}>
              SIPENA PAI menghadirkan tata kelola supervisi yang transparan, aman, dan dapat dipertanggungjawabkan bagi seluruh pemangku kepentingan madrasah dan sekolah umum.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px'
            }}
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '28px',
                borderRadius: '16px',
                border: '1px solid #E2E8F0'
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}
              >
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                Keamanan & Integritas Dokumen
              </h3>
              <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.6 }}>
                Laporan supervisi yang telah disahkan bersifat <em>immutable</em> dan dilengkapi audit trail pencatatan riwayat verifikasi secara lengkap.
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '28px',
                borderRadius: '16px',
                border: '1px solid #E2E8F0'
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#E0F2FE',
                  color: '#0284C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}
              >
                <CheckCircle2 size={24} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                100% Digital & Paperless
              </h3>
              <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.6 }}>
                Mendukung efisiensi administrasi madrasah dengan modul ajar terintegrasi, instrumen rubrik digital, dan ekspor laporan PDF instan.
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '28px',
                borderRadius: '16px',
                border: '1px solid #E2E8F0'
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#EDE9FE',
                  color: '#7C3AED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}
              >
                <Compass size={24} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                Tindak Lanjut Terarah
              </h3>
              <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.6 }}>
                Pengawas sekolah dapat memberikan rekomendasi dan Rencana Tindak Lanjut (RTL) yang dapat dipantau perkembangannya secara berkala.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Section: Kontak & Layanan Bantuan */}
      <section
        id="kontak"
        style={{
          padding: '80px 24px',
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%'
        }}
      >
        <div
          style={{
            backgroundColor: '#0F2042',
            borderRadius: '24px',
            color: '#FFFFFF',
            padding: '54px 40px',
            backgroundImage: 'radial-gradient(circle at top right, rgba(37, 99, 235, 0.25), transparent 50%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}
          >
            <Mail size={28} color="#93C5FD" />
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-heading, "Lexend", sans-serif)',
              fontSize: '28px',
              fontWeight: 800,
              color: '#FFFFFF',
              marginBottom: '12px'
            }}
          >
            Pusat Layanan & Bantuan Teknis
          </h2>
          <p
            style={{
              fontSize: '15px',
              color: '#CBD5E1',
              maxWidth: '600px',
              marginBottom: '36px',
              lineHeight: 1.6
            }}
          >
            Butuh pendampingan penggunaan sistem atau kendala akun dinas? Tim layanan teknis kami siap membantu satuan pendidikan Anda.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '36px'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                padding: '10px 20px',
                borderRadius: '9999px',
                fontSize: '14px',
                color: '#E2E8F0'
              }}
            >
              <Mail size={16} color="#93C5FD" />
              <span>layanan@sipena-pai.id</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                padding: '10px 20px',
                borderRadius: '9999px',
                fontSize: '14px',
                color: '#E2E8F0'
              }}
            >
              <Phone size={16} color="#93C5FD" />
              <span>Senin – Jumat (08.00 – 16.00 WIB)</span>
            </div>
          </div>

          <Link
            href="/login"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#0F2042',
              padding: '12px 32px',
              borderRadius: '9999px',
              fontSize: '15px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
              transition: 'all 0.2s'
            }}
          >
            <LogIn size={18} />
            <span>Masuk ke Portal Supervisi</span>
          </Link>
        </div>
      </section>

      {/* 7. Footer (matching reference image) */}
      <footer
        style={{
          marginTop: 'auto',
          backgroundColor: '#0A1833',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          color: '#94A3B8',
          padding: '48px 24px 32px',
          fontSize: '13px'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '36px',
              paddingBottom: '36px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            {/* Col 1: Brand & Desc */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #4338CA 0%, #312E81 100%)',
                    border: '1.5px solid #F59E0B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FDE68A'
                  }}
                >
                  <BookOpen size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.5px' }}>
                    SIPENA PAI
                  </span>
                  <div style={{ fontSize: '11px', color: '#93C5FD' }}>
                    Sistem Informasi Supervisi PAI
                  </div>
                </div>
              </div>
              <p style={{ color: '#94A3B8', lineHeight: 1.6, fontSize: '13px' }}>
                Aplikasi resmi pendampingan dan evaluasi pembelajaran Pendidikan Agama Islam berbasis standar mutu nasional.
              </p>
            </div>

            {/* Col 2: Fakultas & Satuan Kerja */}
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>
                Pengembangan & Satuan Kerja
              </h4>
              <p style={{ color: '#94A3B8', lineHeight: 1.6, fontSize: '13px', margin: 0 }}>
                Fakultas Agama Islam / Pendidikan Agama Islam<br />
                Kementerian Agama Republik Indonesia<br />
                Wilayah Pembinaan Pendidikan Islam
              </p>
            </div>

            {/* Col 3: Navigasi Cepat */}
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>
                Tautan Cepat
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="#beranda" style={{ color: '#94A3B8', textDecoration: 'none' }}>Beranda</a>
                <a href="#tentang" style={{ color: '#94A3B8', textDecoration: 'none' }}>Layanan Utama (Tentang)</a>
                <a href="#panduan" style={{ color: '#94A3B8', textDecoration: 'none' }}>Alur Penggunaan (Panduan)</a>
                <a href="#kontak" style={{ color: '#94A3B8', textDecoration: 'none' }}>Kontak & Bantuan</a>
                <Link href="/login" style={{ color: '#93C5FD', textDecoration: 'none', fontWeight: 600 }}>Masuk ke Sistem</Link>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Slogan */}
          <div
            style={{
              paddingTop: '24px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div>
              © 2026 SIPENA PAI. Seluruh Hak Cipta Dilindungi.
            </div>
            <div style={{ color: '#E2E8F0', fontWeight: 600, letterSpacing: '0.5px' }}>
              Berakhlak · Berilmu · Berdaya
            </div>
          </div>
        </div>
      </footer>

      {/* Responsive Styles helper */}
      <style jsx>{`
        @media (min-width: 769px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          .alur-arrow {
            display: none !important;
          }
          .alur-container {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
}
