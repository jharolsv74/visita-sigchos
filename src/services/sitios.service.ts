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
  const id = data?.Id ?? null;
  console.log('[sitios.service] getCategoriaNaturalId ->', id);
  return id;
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

    // Debug: log the query being executed
    try {
      console.log('[sitios.service] executing query on SitioTuristico, filter by IdCategoria=', naturalId ?? 'none');
      let result = naturalId
        ? await query.eq("IdCategoria", naturalId)
        : await query; // TODO: ajustar si tu categoría difiere

      console.log('[sitios.service] supabase response (initial):', {
        error: result.error ? { message: result.error.message, details: result.error.details } : null,
        count: result.count ?? null,
        dataLength: Array.isArray(result.data) ? result.data.length : null,
      });

      if (result.error) throw result.error;

      // Fallback: si filtramos por categoría y no hay filas, traer todos los sitios
      if (naturalId && Array.isArray(result.data) && result.data.length === 0) {
        console.warn('[sitios.service] category filter returned 0 rows for IdCategoria=', naturalId, '- performing fallback to fetch all sitios');
        const allRes = await query;
        console.log('[sitios.service] supabase response (fallback all):', {
          error: allRes.error ? { message: allRes.error.message, details: allRes.error.details } : null,
          count: allRes.count ?? null,
          dataLength: Array.isArray(allRes.data) ? allRes.data.length : null,
        });
        if (allRes.error) throw allRes.error;
        sitios = allRes.data ?? [];
      } else {
        sitios = result.data ?? [];
      }
    } catch (err) {
      console.error('[sitios.service] error fetching sitios:', err);
      throw err;
    }
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
