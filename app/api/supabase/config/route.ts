import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey, databaseUrl } = body;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Supabase URL dan Anon Key wajib diisi!' },
        { status: 400 }
      );
    }

    const envContent = `# Supabase PostgreSQL Live Credentials (SIPENA PAI)
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl.trim()}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey.trim()}
SUPABASE_SERVICE_ROLE_KEY=${(supabaseServiceKey || '').trim()}
${databaseUrl ? `DATABASE_URL=${databaseUrl.trim()}` : ''}
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
`;

    const envPath = path.join(process.cwd(), '.env.local');
    fs.writeFileSync(envPath, envContent, 'utf-8');

    // Also update runtime process.env
    const envObj = process.env;
    Object.assign(envObj, {
      NEXT_PUBLIC_SUPABASE_URL: supabaseUrl.trim(),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey.trim(),
      ...(supabaseServiceKey ? { SUPABASE_SERVICE_ROLE_KEY: supabaseServiceKey.trim() } : {}),
      ...(databaseUrl ? { DATABASE_URL: databaseUrl.trim() } : {})
    });

    return NextResponse.json({
      success: true,
      message: 'Kredensial Supabase berhasil disimpan ke .env.local! Aplikasi kini terhubung ke Supabase Anda.'
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Gagal menyimpan konfigurasi: ${err.message}` },
      { status: 500 }
    );
  }
}
