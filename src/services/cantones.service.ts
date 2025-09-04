import { supabase } from '@/lib/supabase';
import type { Canton } from '@/types/db';

export async function getCantones(rangeStart?: number, rangeEnd?: number): Promise<Canton[]> {
  let query = supabase.from('Canton').select('*').order('Id', { ascending: true });
  if (typeof rangeStart === 'number' && typeof rangeEnd === 'number') {
    query = query.range(rangeStart, rangeEnd) as any;
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching cantones', error);
    return [];
  }
  return (data as Canton[]) ?? [];
}