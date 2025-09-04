import { supabase } from '@/lib/supabase';
import type { Emprendimiento, Ubicacion, Parroquia, Galeria, ItemCatalogo } from '@/types/db';

export type EmprendimientoWithRelations = Emprendimiento & {
  Ubicacion?: Ubicacion | null;
  Parroquia?: Parroquia | null;
  Galeria?: Galeria | null;
  ItemCatalogo?: ItemCatalogo | null;
};

/**
 * Fetch emprendimientos and include related rows when possible.
 * Relies on DB foreign key relationships so Supabase can fetch related tables with `select`.
 */
export async function getEmprendimientosWithRelations(rangeStart?: number, rangeEnd?: number): Promise<EmprendimientoWithRelations[]> {
  let query = supabase
    .from('Emprendimiento')
    .select(`*, Ubicacion(*), Parroquia(*), Galeria(*), ItemCatalogo(*)`)
    .order('Id', { ascending: true });

  if (typeof rangeStart === 'number' && typeof rangeEnd === 'number') {
    query = (query as any).range(rangeStart, rangeEnd);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching emprendimientos', error);
    return [];
  }

  return (data as EmprendimientoWithRelations[]) ?? [];
}
