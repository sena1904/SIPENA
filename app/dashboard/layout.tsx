'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { User } from '@/types';
import { initialUsers } from '@/data/initialData';
import { StorageService } from '@/services/storage';
import { CsvExportService } from '@/services/csvExport';
import { SupabaseModal } from '@/components/SupabaseModal';
import {
  GraduationCap,
  Award,
  Compass,
  ShieldCheck,
  LayoutDashboard,
  User as UserIcon,
  FileText,
  FileCheck2,
  Calendar,
  History,
  LogOut,
  Bell,
  CheckCircle2,
  Layers,
  FileSpreadsheet,
  Download,
  Database,
  Menu,
  X
} from 'lucide-react';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    // Check Supabase connection health
    fetch('/api/supabase/status')
      .then(res => res.json())
      .then(data => {
        setSupabaseConnected(Boolean(data.connected));
      })
      .catch(() => setSupabaseConnected(false));
  }, [isSupabaseModalOpen]);

  useEffect(() => {
    try {
      const match = document.cookie.match(/sipena_session_role=([^;]+)/);
      const role = match ? match[1] : null;

      if (!role) {
        router.push('/login');
        return;
      }

      const storedUser = StorageService.getCurrentUser();
      if (storedUser && storedUser.role === role) {
        setCurrentUser(storedUser);
      } else {
        const foundUser = initialUsers.find(u => u.role === role) || initialUsers[0];
        setCurrentUser(foundUser);
      }
    } catch {
      router.push('/login');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    document.cookie = 'sipena_session_role=; path=/; max-age=0; SameSite=Lax';
    document.cookie = 'sipena_session_user=; path=/; max-age=0; SameSite=Lax';
    localStorage.removeItem('sipena_current_user');
    router.push('/login');
    router.refresh();
  };

  if (!currentUser) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' }}>
        <div style={{ textAlign: 'center', color: '#64748B' }}>
          <GraduationCap size={40} style={{ margin: '0 auto 12px', opacity: 0.6 }} />
          <div>Memvalidasi Sesi & Hak Akses...</div>
        </div>
      </div>
    );
  }

  // Indonesian Date Formatting matching the image top right (e.g. "Selasa, 13 Mei 2025")
  const currentDateFormatted = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Navigation Items per Role matching the sidebar style from the image
  const getNavItems = () => {
    switch (currentUser.role) {
      case 'guru':
        return [
          { label: 'Dashboard', icon: <LayoutDashboard size={18} />, href: '/dashboard/guru' },
          { label: 'Profil Guru', icon: <UserIcon size={18} />, href: '/dashboard/guru/profil' },
          { label: 'Administrasi Modul', icon: <FileText size={18} />, href: '/dashboard/guru/administrasi' },
          { label: 'Supervisi Saya', icon: <FileCheck2 size={18} />, href: '/dashboard/guru/supervisi' },
          { label: 'Riwayat Laporan', icon: <Award size={18} />, href: '/dashboard/guru/riwayat' }
        ];
      case 'kepala_sekolah':
        return [
          { label: 'Dashboard KS', icon: <LayoutDashboard size={18} />, href: '/dashboard/kepala-sekolah' },
          { label: 'Verifikasi Berkas', icon: <FileCheck2 size={18} />, href: '/dashboard/kepala-sekolah/verifikasi' },
          { label: 'Instrumen Penilaian', icon: <Award size={18} />, href: '/dashboard/kepala-sekolah/penilaian' },
          { label: 'Pengesahan Laporan', icon: <History size={18} />, href: '/dashboard/kepala-sekolah/pengesahan' },
          { label: 'Profil Sekolah', icon: <UserIcon size={18} />, href: '/dashboard/kepala-sekolah/sekolah' }
        ];
      case 'pengawas':
        return [
          { label: 'Dashboard Pengawas', icon: <LayoutDashboard size={18} />, href: '/dashboard/pengawas' },
          { label: 'Rekap Sekolah Binaan', icon: <Compass size={18} />, href: '/dashboard/pengawas/rekap' },
          { label: 'Tinjauan Laporan', icon: <FileCheck2 size={18} />, href: '/dashboard/pengawas/tinjauan' },
          { label: 'Tindak Lanjut (RTL)', icon: <Award size={18} />, href: '/dashboard/pengawas/rtl' },
          { label: 'Riwayat Supervisi', icon: <History size={18} />, href: '/dashboard/pengawas/riwayat' }
        ];
      case 'admin':
        return [
          { label: 'Dashboard Admin', icon: <LayoutDashboard size={18} />, href: '/dashboard/admin' },
          { label: 'Manajemen Pengguna', icon: <UserIcon size={18} />, href: '/dashboard/admin/users' },
          { label: 'Templat Instrumen', icon: <Layers size={18} />, href: '/dashboard/admin/templates' }
        ];
    }
  };

  const navItems = getNavItems();

  const getRoleTitle = () => {
    switch (currentUser.role) {
      case 'guru':
        return 'Dashboard Guru';
      case 'kepala_sekolah':
        return 'Dashboard Kepala Sekolah';
      case 'pengawas':
        return 'Dashboard Pengawas';
      case 'admin':
        return 'Dashboard Administrator';
    }
  };

  const getHeaderTitle = () => {
    const current = navItems.find(i => i.href === pathname);
    if (current) {
      if (
        current.href === '/dashboard/guru' ||
        current.href === '/dashboard/kepala-sekolah' ||
        current.href === '/dashboard/pengawas' ||
        current.href === '/dashboard/admin'
      ) {
        return getRoleTitle();
      }
      return `${getRoleTitle()} — ${current.label}`;
    }
    return getRoleTitle();
  };

  const getRoleLabelClean = () => {
    switch (currentUser.role) {
      case 'guru':
        return 'Guru PAI';
      case 'kepala_sekolah':
        return 'Kepala Sekolah';
      case 'pengawas':
        return 'Pengawas Sekolah';
      case 'admin':
        return 'Administrator';
    }
  };

  return (
    <div className="dashboard-root">
      {/* Mobile Drawer Backdrop */}
      <div
        className={`mobile-backdrop ${isMobileNavOpen ? 'mobile-open' : ''}`}
        onClick={() => setIsMobileNavOpen(false)}
        aria-hidden="true"
      />

      {/* =========================================================================
          LEFT SIDEBAR (Responsive drawer on mobile, fixed on desktop #191C4D)
         ========================================================================= */}
      <aside className={`dashboard-sidebar ${isMobileNavOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div style={{ padding: '24px 20px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: '#F59E0B', // Golden emblem background
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#191C4D',
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.35)',
                  flexShrink: 0
                }}
              >
                <GraduationCap size={24} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '19px',
                    fontWeight: 800,
                    letterSpacing: '0.3px',
                    color: '#FFFFFF'
                  }}
                >
                  SIPENA PAI
                </div>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              className="mobile-nav-close"
              onClick={() => setIsMobileNavOpen(false)}
              aria-label="Tutup navigasi"
            >
              <X size={18} />
            </button>
          </div>

          {/* User Greeting Box under logo */}
          <div style={{ marginTop: '20px', padding: '0 4px' }}>
            <div style={{ fontSize: '11px', color: '#93A4C7' }}>Selamat datang,</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', marginTop: '2px', lineHeight: 1.3 }}>
              {currentUser.name}
            </div>
            <div style={{ fontSize: '11px', color: '#818CF8', marginTop: '2px', fontWeight: 600 }}>
              ({getRoleLabelClean()})
            </div>
          </div>
        </div>

        {/* Navigation Menu Links */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileNavOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#FFFFFF' : '#A5B4FC',
                  backgroundColor: isActive ? '#343B8F' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 150ms ease'
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Pin: Logout Button */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: '#CBD5E1',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '8px 4px',
              transition: 'color 150ms ease'
            }}
          >
            <LogOut size={16} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* =========================================================================
          RIGHT MAIN WRAPPER (Responsive offset: 260px desktop, 0 on mobile)
         ========================================================================= */}
      <div className="dashboard-main-wrapper">
        {/* Top Header */}
        <header className="dashboard-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
            {/* Hamburger Toggle on Mobile */}
            <button
              type="button"
              className="mobile-nav-toggle"
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Buka menu navigasi"
            >
              <Menu size={20} />
            </button>

            <h1
              className="dashboard-header-title"
              style={{
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {getHeaderTitle()}
            </h1>
          </div>

          {/* Right Header: Indonesian Date + Notification Bell */}
          <div className="dashboard-header-right">
            <span className="dashboard-header-date" style={{ fontSize: '13px', fontWeight: 500, color: '#64748B' }}>
              {currentDateFormatted}
            </span>

            {/* Notification Bell */}
            <div
              style={{
                position: 'relative',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                flexShrink: 0
              }}
              title="Notifikasi Supervisi"
            >
              <Bell size={18} color="#475569" />
              <span
                style={{
                  position: 'absolute',
                  top: '7px',
                  right: '7px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#EF4444',
                  border: '1.5px solid #FFFFFF'
                }}
              />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="dashboard-main-content">
          {children}
        </main>
      </div>

      {/* Supabase Connection & Configuration Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />
    </div>
  );
}
