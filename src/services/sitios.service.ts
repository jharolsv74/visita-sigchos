// services/sitios.service.ts
import { supabase } from "@/lib/supabase";
import type {
  SitioConUbicacion,
  SitioTuristico,
  Ubicacion,
  ItemCatalogo,
} from "@/types/db";

// Puedes filtrar por Código de ItemCatalogo = 'NATURAL' (ajusta si tu código difiere)
const CATEGORIA_NATURAL_CODE = "NATURAL"; // TODO: confirma si tu código real es este

export async function getCategoriaNaturalId(): Promise<number | null> {
  // Busca una fila de ItemCatalogo cuyo Codigo sea 'NATURAL' o el Nombre contenga 'Natural'
  const { data, error } = await supabase
    .from<ItemCatalogo>("ItemCatalogo")
    .select("Id, Codigo, Nombre")
    .or(`Codigo.eq.${CATEGORIA_NATURAL_CODE},Nombre.ilike.%Natural%`)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error obteniendo categoría 'Natural':", error);
    return null;
  }
  return data?.Id ?? null;
}

export async function getSitiosNaturalesConUbicacion(): Promise<
  SitioConUbicacion[]
> {
  const naturalId = await getCategoriaNaturalId();

  // 1) Sitios por categoría (si no se encontró, devolvemos todos con TODO)
  let sitios: SitioTuristico[] = [];
  {
    const query = supabase
      .from<SitioTuristico>("SitioTuristico")
      .select(
        "Id,Nombre,Descripcion,ImagenUrl,IdUbicacion,IdParroquia,IdCategoria"
      )
      .order("Id", { ascending: true });

    const { data, error } = naturalId
      ? await query.eq("IdCategoria", naturalId)
      : await query; // TODO: ajustar si tu categoría difiere

    if (error) throw error;
    sitios = data ?? [];
  }

  // 2) Traemos ubicaciones necesarias en un solo select
  const ubicacionIds = Array.from(
    new Set(sitios.map((s) => s.IdUbicacion).filter(Boolean))
  ) as number[];

  let ubicacionesMap = new Map<number, Ubicacion>();
  if (ubicacionIds.length) {
    const { data: ubicaciones, error: ubErr } = await supabase
      .from<Ubicacion>("Ubicacion")
      .select("Id,Latitud,Longitud")
      .in("Id", ubicacionIds);

    if (ubErr) throw ubErr;
    (ubicaciones ?? []).forEach((u) => ubicacionesMap.set(u.Id, u));
  }

  return sitios.map((sitio) => ({
    sitio,
    ubicacion: sitio.IdUbicacion
      ? ubicacionesMap.get(sitio.IdUbicacion) ?? null
      : null,
  }));
}
