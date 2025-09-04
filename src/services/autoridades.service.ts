// services/autoridades.service.ts
import { supabase } from "@/lib/supabase";
import type { Autoridad } from "@/types/db";

export async function getAutoridades(): Promise<Autoridad[]> {
  const { data, error } = await supabase
    .from("Autoridad")
    .select("*")
    .order("Id", { ascending: true });

  if (error) {
    console.error("Error obteniendo autoridades:", error);
    return [];
  }
  return (data as Autoridad[]) ?? [];
}
