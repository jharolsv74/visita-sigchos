import { supabase } from '@/lib/supabase';

export type ProductoRow = {
  Id: number;
  IdEmprendimiento?: number | null;
  Nombre: string;
  Descripcion?: string | null;
  Valor?: number | null;
  ImagenUrl?: string | null;
};

export async function getProductosByEmprendimiento(emprId: number, rangeStart?: number, rangeEnd?: number): Promise<ProductoRow[]> {
  try {
    let query: any = supabase.from('Producto').select('*').eq('IdEmprendimiento', emprId).order('Id', { ascending: true });
    if (typeof rangeStart === 'number' && typeof rangeEnd === 'number') {
      query = query.range(rangeStart, rangeEnd);
    }
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching productos for emprendimiento', error);
      return [];
    }
    return (data as ProductoRow[]) ?? [];
  } catch (err) {
    console.error('Unexpected error fetching productos', err);
    return [];
  }
}
