import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  // Check if configured with custom user URL (not the default placeholder)
  const isCustomConfigured =
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes('sipena-pai-supervisi.supabase.co') &&
    !supabaseAnonKey.includes('sample_anon_key');

  if (!isCustomConfigured) {
    return NextResponse.json({
      connected: false,
      mode: 'mock_local',
      message: 'Mode Local Storage aktif (Kredensial Supabase pribadi belum dihubungkan)',
      config: {
        url: supabaseUrl || 'Belum diatur',
        hasAnonKey: Boolean(supabaseAnonKey),
        hasServiceKey: Boolean(serviceKey)
      }
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    // Ping public table 'schools'
    const { data, error } = await supabase.from('schools').select('id, name').limit(1);

    if (error) {
      return NextResponse.json({
        connected: false,
        mode: 'error',
        message: `Terhubung ke URL Supabase, namun query gagal: ${error.message}. Pastikan migrasi SQL (01_schema.sql) telah dijalankan di SQL Editor Supabase Anda.`,
        error: error.message,
        config: { url: supabaseUrl, hasAnonKey: true }
      });
    }

    return NextResponse.json({
      connected: true,
      mode: 'live_supabase',
      message: 'Berhasil terhubung ke database PostgreSQL Supabase live!',
      schoolsFound: data?.length || 0,
      config: { url: supabaseUrl, hasAnonKey: true }
    });
  } catch (err: any) {
    return NextResponse.json({
      connected: false,
      mode: 'error',
      message: `Gagal menghubungi Supabase: ${err.message || 'Network error'}`,
      config: { url: supabaseUrl, hasAnonKey: Boolean(supabaseAnonKey) }
    });
  }
}
