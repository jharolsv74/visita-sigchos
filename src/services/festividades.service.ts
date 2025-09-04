import { supabase } from '@/lib/supabase';
import type { Parroquia } from '@/types/db';

export type FestividadRow = {
  Id: number;
  IdParroquia?: number | null;
  Nombre: string;
  Fecha?: string | null;
  Historia?: string | null;
  ImagenUrl?: string | null;
  IdGaleria?: number | null; // present but not expanding relation
  Parroquia?: Parroquia | null;
};

export async function getFestividades(rangeStart?: number, rangeEnd?: number): Promise<FestividadRow[]> {
  try {
    let query: any = supabase.from('Festividad').select('*').order('Id', { ascending: true });
    if (typeof rangeStart === 'number' && typeof rangeEnd === 'number') {
      query = query.range(rangeStart, rangeEnd);
    }
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching festividades', error);
      return [];
    }
    return (data as FestividadRow[]) ?? [];
  } catch (err) {
    console.error('Unexpected error fetching festividades', err);
    return [];
  }
}

export async function getFestividadesWithParroquia(rangeStart?: number, rangeEnd?: number): Promise<FestividadRow[]> {
  try {
    let query: any = supabase.from('Festividad').select('*, Parroquia(*)').order('Id', { ascending: true });
    if (typeof rangeStart === 'number' && typeof rangeEnd === 'number') {
      query = query.range(rangeStart, rangeEnd);
    }
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching festividades with parroquia', error);
      return [];
    }
    return (data as FestividadRow[]) ?? [];
  } catch (err) {
    console.error('Unexpected error fetching festividades with parroquia', err);
    return [];
  }
}

export async function getFestividadById(id: number): Promise<FestividadRow | null> {
  try {
    const { data, error } = await supabase.from('Festividad').select('*').eq('Id', id).limit(1).single();
    if (error) {
      console.error('Error fetching festividad by id', error);
      return null;
    }
    return data as FestividadRow;
  } catch (err) {
    console.error('Unexpected error fetching festividad by id', err);
    return null;
  }
}
