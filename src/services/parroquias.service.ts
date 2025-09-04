import { supabase } from '@/lib/supabase';
import type { Parroquia } from '@/types/db';

export async function getParroquias(rangeStart?: number, rangeEnd?: number): Promise<Parroquia[]> {
  let query = supabase.from('Parroquia').select('*').order('Id', { ascending: true });
  if (typeof rangeStart === 'number' && typeof rangeEnd === 'number') {
    query = query.range(rangeStart, rangeEnd) as any;
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching parroquias', error);
    return [];
  }
  return (data as Parroquia[]) ?? [];
}
