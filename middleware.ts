import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from './src/lib/supabase/middleware';

// Matriks Otorisasi Rute (Strict RBAC Route Matrix)
const ROLE_DASHBOARDS: Record<string, string> = {
  guru: '/dashboard/guru',
  kepala_sekolah: '/dashboard/kepala-sekolah',
  pengawas: '/dashboard/pengawas',
  admin: '/dashboard/admin'
};

const ROUTE_PERMISSIONS: { prefix: string; allowedRole: string }[] = [
  { prefix: '/dashboard/guru', allowedRole: 'guru' },
  { prefix: '/dashboard/kepala-sekolah', allowedRole: 'kepala_sekolah' },
  { prefix: '/dashboard/pengawas', allowedRole: 'pengawas' },
  { prefix: '/dashboard/admin', allowedRole: 'admin' }
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Update/refresh session via Supabase SSR
  const { user, response } = await updateSession(request);

  // Check auth role from Supabase Auth metadata OR secure cookie fallback
  let userRole: string | null = null;

  if (user) {
    userRole =
      (user.app_metadata?.role as string) ||
      (user.user_metadata?.role as string) ||
      null;
  }

  // Check fallback session cookie for local dev / seamless demo
  if (!userRole) {
    const roleCookie = request.cookies.get('sipena_session_role');
    if (roleCookie?.value) {
      userRole = roleCookie.value;
    }
  }

  const isAuthenticated = Boolean(userRole);

  // 1. If accessing Login page while already authenticated -> redirect to role dashboard
  if (pathname === '/login' && isAuthenticated && userRole) {
    const targetDashboard = ROLE_DASHBOARDS[userRole] || '/dashboard/guru';
    return NextResponse.redirect(new URL(targetDashboard, request.url));
  }

  // 2. Protect all /dashboard routes
  if (pathname.startsWith('/dashboard')) {
    // If not authenticated -> redirect to /login with redirect parameter
    if (!isAuthenticated || !userRole) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Strict Role-to-Route Authorization Check
    const matchingRule = ROUTE_PERMISSIONS.find(rule => pathname.startsWith(rule.prefix));

    if (matchingRule) {
      if (matchingRule.allowedRole !== userRole) {
        // PERMISI DITOLAK: Akses lintas-peran dicegah!
        // Alihkan pengguna ke dashboard resmi miliknya sendiri dengan notifikasi error
        const correctDashboard = ROLE_DASHBOARDS[userRole] || '/';
        const redirectedUrl = new URL(correctDashboard, request.url);
        redirectedUrl.searchParams.set('error', 'unauthorized_access_prevented');
        return NextResponse.redirect(redirectedUrl);
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login'
  ]
};
