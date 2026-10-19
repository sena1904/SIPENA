/**
 * SIPENA PAI - Automated RBAC Matrix & Route Guard Integration Test
 * Verifies strict Edge Middleware route isolation and cross-role prevention
 * Run with: node tests/rbac-matrix.test.mjs
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

const testCases = [
  // 1. Unauthenticated attempts must be redirected to /login
  {
    name: '[Security] Unauthenticated access to /dashboard/guru redirects to /login',
    url: `${BASE_URL}/dashboard/guru`,
    expectedStatus: 307,
    expectedLocationIncludes: '/login'
  },
  {
    name: '[Security] Unauthenticated access to /dashboard/kepala-sekolah redirects to /login',
    url: `${BASE_URL}/dashboard/kepala-sekolah`,
    expectedStatus: 307,
    expectedLocationIncludes: '/login'
  },
  {
    name: '[Security] Unauthenticated access to /dashboard/pengawas redirects to /login',
    url: `${BASE_URL}/dashboard/pengawas`,
    expectedStatus: 307,
    expectedLocationIncludes: '/login'
  },
  {
    name: '[Security] Unauthenticated access to /dashboard/admin redirects to /login',
    url: `${BASE_URL}/dashboard/admin`,
    expectedStatus: 307,
    expectedLocationIncludes: '/login'
  },

  // 2. Cross-Role Access Violation Prevention (Penetration Test)
  {
    name: '[Penetration Test] Guru attempting to access /dashboard/kepala-sekolah is blocked & redirected',
    url: `${BASE_URL}/dashboard/kepala-sekolah`,
    cookies: 'sipena_session_role=guru',
    expectedStatus: 307,
    expectedLocationIncludes: '/dashboard/guru?error=unauthorized_access_prevented'
  },
  {
    name: '[Penetration Test] Guru attempting to access /dashboard/admin is blocked & redirected',
    url: `${BASE_URL}/dashboard/admin`,
    cookies: 'sipena_session_role=guru',
    expectedStatus: 307,
    expectedLocationIncludes: '/dashboard/guru?error=unauthorized_access_prevented'
  },
  {
    name: '[Penetration Test] Kepala Sekolah attempting to access /dashboard/admin is blocked',
    url: `${BASE_URL}/dashboard/admin`,
    cookies: 'sipena_session_role=kepala_sekolah',
    expectedStatus: 307,
    expectedLocationIncludes: '/dashboard/kepala-sekolah?error=unauthorized_access_prevented'
  },
  {
    name: '[Penetration Test] Pengawas attempting to access /dashboard/guru is blocked',
    url: `${BASE_URL}/dashboard/guru`,
    cookies: 'sipena_session_role=pengawas',
    expectedStatus: 307,
    expectedLocationIncludes: '/dashboard/pengawas?error=unauthorized_access_prevented'
  },

  // 3. Authorized Role Access (Must succeed with HTTP 200)
  {
    name: '[Authorized] Guru accessing /dashboard/guru succeeds',
    url: `${BASE_URL}/dashboard/guru`,
    cookies: 'sipena_session_role=guru',
    expectedStatus: 200
  },
  {
    name: '[Authorized] Kepala Sekolah accessing /dashboard/kepala-sekolah succeeds',
    url: `${BASE_URL}/dashboard/kepala-sekolah`,
    cookies: 'sipena_session_role=kepala_sekolah',
    expectedStatus: 200
  },
  {
    name: '[Authorized] Pengawas accessing /dashboard/pengawas succeeds',
    url: `${BASE_URL}/dashboard/pengawas`,
    cookies: 'sipena_session_role=pengawas',
    expectedStatus: 200
  },
  {
    name: '[Authorized] Admin accessing /dashboard/admin succeeds',
    url: `${BASE_URL}/dashboard/admin`,
    cookies: 'sipena_session_role=admin',
    expectedStatus: 200
  },

  // 4. Public Landing Page
  {
    name: '[Public] Landing page is accessible to everyone',
    url: `${BASE_URL}/`,
    expectedStatus: 200
  }
];

async function runRbacTests() {
  console.log('================================================================');
  console.log('🔒 SIPENA PAI - Automated RBAC Matrix & Route Guard Test Suite');
  console.log(`Target Host: ${BASE_URL}`);
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  for (const test of testCases) {
    try {
      const response = await fetch(test.url, {
        method: 'GET',
        headers: {
          ...(test.cookies ? { Cookie: test.cookies } : {})
        },
        redirect: 'manual'
      });

      const actualStatus = response.status;
      const locationHeader = response.headers.get('location') || '';

      const statusMatch = actualStatus === test.expectedStatus;
      const locationMatch = test.expectedLocationIncludes
        ? locationHeader.includes(test.expectedLocationIncludes)
        : true;

      if (statusMatch && locationMatch) {
        console.log(`✅ PASS: ${test.name}`);
        console.log(`   Status: ${actualStatus} | Location: ${locationHeader || 'N/A'}`);
        passed++;
      } else {
        console.error(`❌ FAIL: ${test.name}`);
        console.error(`   Expected Status: ${test.expectedStatus}, got ${actualStatus}`);
        if (test.expectedLocationIncludes) {
          console.error(`   Expected Location to include: "${test.expectedLocationIncludes}", got "${locationHeader}"`);
        }
        failed++;
      }
    } catch (err) {
      console.error(`❌ ERROR: ${test.name}`);
      console.error(`   ${err.message}`);
      failed++;
    }
    console.log('----------------------------------------------------------------');
  }

  console.log(`\n================================================================`);
  console.log(`🏁 RBAC TEST RESULTS: ${passed} PASSED, ${failed} FAILED (TOTAL: ${testCases.length})`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runRbacTests();
