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
    .from("ItemCatalogo")
    .select("Id, Codigo, Nombre")
    .or(`Codigo.eq.${CATEGORIA_NATURAL_CODE},Nombre.ilike.%Natural%`)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error obteniendo categoría 'Natural':", error);
    return null;
  }
  try {
    // 1) Intentar por Codigo exacto
    let res = await supabase
      .from("ItemCatalogo")
      .select("Id, Codigo, Nombre")
      .eq("Codigo", CATEGORIA_NATURAL_CODE)
      .limit(1)
      .maybeSingle();

    if (res.error) throw res.error;
    if (res.data?.Id) {
      console.log('[sitios.service] getCategoriaNaturalId (by Codigo) ->', res.data.Id);
      return res.data.Id;
    }

    // 2) Buscar por Nombre que contenga 'Natural'
    res = await supabase
      .from("ItemCatalogo")
      .select("Id, Codigo, Nombre")
      .ilike("Nombre", "%Natural%")
      .limit(1)
      .maybeSingle();

    if (res.error) throw res.error;
    if (res.data?.Id) {
      console.log('[sitios.service] getCategoriaNaturalId (by Nombre) ->', res.data.Id);
      return res.data.Id;
    }

    // 3) Intentar por Codigo parecido (fallback)
    res = await supabase
      .from("ItemCatalogo")
      .select("Id, Codigo, Nombre")
      .ilike("Codigo", "%NAT%")
      .limit(1)
      .maybeSingle();

    if (res.error) throw res.error;
    const id = res.data?.Id ?? null;
    console.log('[sitios.service] getCategoriaNaturalId (fallback) ->', id);
    return id;
  } catch (error) {
    console.error("Error obteniendo categoría 'Natural':", error);
    return null;
  }
}

export async function getSitiosNaturalesConUbicacion(): Promise<
  SitioConUbicacion[]
> {
  const naturalId = await getCategoriaNaturalId();

  // 1) Sitios por categoría (si no se encontró, devolvemos todos con TODO)
  let sitios: SitioTuristico[] = [];
  {
    const query = supabase
      .from("SitioTuristico")
      .select(
        "Id,Nombre,Descripcion,ImagenUrl,IdUbicacion,IdParroquia,IdCategoria"
      )
      .order("Id", { ascending: true });

    // Debug: log the query being executed
    try {
      console.log('[sitios.service] executing query on SitioTuristico, filter by IdCategoria=', naturalId ?? 'none');
      const result = naturalId
        ? await query.eq("IdCategoria", naturalId)
        : await query; // TODO: ajustar si tu categoría difiere

      console.log('[sitios.service] supabase response:', {
        error: result.error ? { message: result.error.message, details: result.error.details } : null,
        count: result.count ?? null,
        dataLength: Array.isArray(result.data) ? result.data.length : null,
      });

      if (result.error) throw result.error;
      sitios = result.data ?? [];
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
      .from("Ubicacion")
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

export async function getSitioById(id: number): Promise<SitioConUbicacion | null> {
  try {
    const { data: sitio, error } = await supabase
      .from('SitioTuristico')
      .select('Id,Nombre,Descripcion,ImagenUrl,IdUbicacion,IdParroquia,IdCategoria')
      .eq('Id', id)
      .maybeSingle();

    if (error) {
      console.error('[sitios.service] getSitioById error:', error);
      return null;
    }
    if (!sitio) return null;

    let ubicacion = null;
    if (sitio.IdUbicacion) {
      const { data: ub, error: ubErr } = await supabase
        .from('Ubicacion')
        .select('Id,Latitud,Longitud')
        .eq('Id', sitio.IdUbicacion)
        .maybeSingle();
      if (ubErr) {
        console.error('[sitios.service] getSitioById Ubicacion error:', ubErr);
      } else {
        ubicacion = ub ?? null;
      }
    }

    // Fetch related Parroquia name (if any)
    let parroquia = null;
    if (sitio.IdParroquia) {
      const { data: p, error: pErr } = await supabase
        .from('Parroquia')
        .select('Id,Nombre,ImagenUrl')
        .eq('Id', sitio.IdParroquia)
        .maybeSingle();
      if (pErr) {
        console.error('[sitios.service] getSitioById Parroquia error:', pErr);
      } else {
        parroquia = p ?? null;
      }
    }

    // Fetch related category (ItemCatalogo) name if available
    let categoria = null;
    if (sitio.IdCategoria) {
      const { data: c, error: cErr } = await supabase
        .from('ItemCatalogo')
        .select('Id,Nombre,Codigo,Valor')
        .eq('Id', sitio.IdCategoria)
        .maybeSingle();
      if (cErr) {
        console.error('[sitios.service] getSitioById Categoria error:', cErr);
      } else {
        categoria = c ?? null;
      }
    }

    return { sitio, ubicacion, parroquia, categoria } as unknown as SitioConUbicacion & { parroquia?: any; categoria?: any };
  } catch (err) {
    console.error('[sitios.service] unexpected error in getSitioById:', err);
    return null;
  }
}
