import { supabase } from '@/lib/supabase';
import type { Home } from '@/types/db';

export async function getHome(): Promise<Home | null> {
  const { data, error } = await supabase.from('Home').select('*').limit(1) as any;
  if (error) {
    console.error('Error fetching Home row', error);
    return null;
  }
  return Array.isArray(data) && data.length > 0 ? (data[0] as Home) : null;
}
