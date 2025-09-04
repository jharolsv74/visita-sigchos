import { supabase } from '@/lib/supabase';
import type { Galeria, DetalleGaleria } from '@/types/db';

export type GaleriaWithDetalles = Galeria & { GaleriaDetalle?: DetalleGaleria[] };

export async function getGaleriasWithDetalles(rangeStart?: number, rangeEnd?: number): Promise<GaleriaWithDetalles[]> {
  let query = supabase.from('Galeria').select('*, GaleriaDetalle(*)').order('Id', { ascending: true });
  if (typeof rangeStart === 'number' && typeof rangeEnd === 'number') {
    query = query.range(rangeStart, rangeEnd) as any;
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching galerias with detalles', error);
    return [];
  }
  return (data as GaleriaWithDetalles[]) ?? [];
}
