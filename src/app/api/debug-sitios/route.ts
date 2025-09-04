import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // 1) fetch with anon client (the imported one)
    const anonRes = await supabase.from('SitioTuristico').select('*', { count: 'exact' });

    // 2) if service role key is available, fetch with it too for comparison
    let serviceRes = null;
    const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (svcKey && url) {
      const svcClient = createClient(url, svcKey, { auth: { persistSession: false } });
      serviceRes = await svcClient.from('SitioTuristico').select('*', { count: 'exact' });
    }

    return NextResponse.json({ anon: anonRes, service: serviceRes });
  } catch (err) {
    console.error('api/debug-sitios error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
