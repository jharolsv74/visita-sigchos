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

// Helper to normalize a name into a slug-like string used in routes
export function normalizeToSlug(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-');
}

export async function getParroquiaBySlug(slug: string): Promise<Parroquia | null> {
  // Try exact slug match if your table has a Slug column, otherwise match normalized Nombre
  // We'll fetch a few rows and compare normalized names to avoid changing DB schema.
  const { data, error } = await supabase.from('Parroquia').select('*').limit(20).order('Id', { ascending: true });
  if (error) {
    console.error('Error fetching parroquias for slug', error);
    return null;
  }
  const rows = (data as Parroquia[]) ?? [];
  const match = rows.find(r => normalizeToSlug(r.Nombre || '') === slug);
  return match ?? null;
}
