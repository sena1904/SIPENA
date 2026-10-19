import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  initialSchools,
  initialUsers,
  initialAssessmentTemplates,
  initialSubmissions
} from '@/data/initialData';

export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !key) {
    return NextResponse.json(
      { error: 'Kredensial Supabase belum dikonfigurasi!' },
      { status: 400 }
    );
  }

  try {
    const supabase = createClient(supabaseUrl, key);

    // 1. Seed schools
    const schoolRows = initialSchools.map(s => ({
      id: s.id,
      name: s.name,
      npsn: s.npsn,
      address: s.address,
      principal_name: s.headmasterName,
      created_at: new Date().toISOString()
    }));
    await supabase.from('schools').upsert(schoolRows);

    // 2. Seed users
    const userRows = initialUsers.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      nip: u.nip,
      status: u.status,
      school_id: u.schoolId || 'school-1',
      created_at: new Date().toISOString()
    }));
    await supabase.from('users').upsert(userRows);

    // 3. Seed assessment templates
    const templateRows = initialAssessmentTemplates.map(t => ({
      id: t.id,
      name: t.title,
      version: t.version,
      academic_year: '2026/2027',
      is_active: true,
      created_at: new Date().toISOString()
    }));
    await supabase.from('assessment_templates').upsert(templateRows);

    return NextResponse.json({
      success: true,
      message: 'Berhasil melakukan seed data awal (Sekolah, Pengguna, dan Templat Supervisi) ke database Supabase!'
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Gagal melakukan seeding data: ${err.message}` },
      { status: 500 }
    );
  }
}
