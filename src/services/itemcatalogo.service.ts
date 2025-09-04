import { supabase } from '@/lib/supabase';
import type { ItemCatalogo } from '@/types/db';

export async function getItemCatalogos(): Promise<ItemCatalogo[]> {
  const { data, error } = await supabase.from('ItemCatalogo').select('Id, Nombre, Codigo').order('Id', { ascending: true });
  if (error) {
    console.error('Error fetching ItemCatalogo', error);
    return [];
  }
  return (data as ItemCatalogo[]) ?? [];
}
