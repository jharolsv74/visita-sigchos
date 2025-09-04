import { supabase } from '@/lib/supabase';
import type { Parroquia } from '@/types/db';

export type TransporteRow = {
  Id: number;
  IdParroquia?: number | null;
  Nombre: string;
  Descripcion?: string | null;
  Ruta?: string | null;
  Horario?: string | null;
  ImagenUrl?: string | null;
  Parroquia?: Parroquia | null;
};

export async function getTransportes(rangeStart?: number, rangeEnd?: number): Promise<TransporteRow[]> {
  try {
    let query: any = supabase.from('Transporte').select('*').order('Id', { ascending: true });
    if (typeof rangeStart === 'number' && typeof rangeEnd === 'number') {
      query = query.range(rangeStart, rangeEnd);
    }
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching transportes', error);
      return [];
    }
    return (data as TransporteRow[]) ?? [];
  } catch (err) {
    console.error('Unexpected error fetching transportes', err);
    return [];
  }
}

export async function getTransportesWithParroquia(rangeStart?: number, rangeEnd?: number): Promise<TransporteRow[]> {
  try {
    let query: any = supabase.from('Transporte').select('*, Parroquia(*)').order('Id', { ascending: true });
    if (typeof rangeStart === 'number' && typeof rangeEnd === 'number') {
      query = query.range(rangeStart, rangeEnd);
    }
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching transportes with parroquia', error);
      return [];
    }
    return (data as TransporteRow[]) ?? [];
  } catch (err) {
    console.error('Unexpected error fetching transportes with parroquia', err);
    return [];
  }
}

export async function getTransporteById(id: number): Promise<TransporteRow | null> {
  try {
    const { data, error } = await supabase.from('Transporte').select('*').eq('Id', id).limit(1).single();
    if (error) {
      console.error('Error fetching transporte by id', error);
      return null;
    }
    return data as TransporteRow;
  } catch (err) {
    console.error('Unexpected error fetching transporte by id', err);
    return null;
  }
}
