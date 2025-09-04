// types/db.ts
export type Ubicacion = {
  Id: number;
  Latitud: number;
  Longitud: number;
};

export type SitioTuristico = {
  Id: number;
  Nombre: string;
  Descripcion: string | null;
  ImagenUrl: string | null;
  IdUbicacion: number | null;
  IdParroquia: number | null;
  IdCategoria: number | null;
};

export type ItemCatalogo = {
  Id: number;
  IdCatalogo: number;
  Codigo: string;
  Nombre: string;
  Valor?: string | null;
};

export type SitioConUbicacion = {
  sitio: SitioTuristico;
  ubicacion: Ubicacion | null;
};

export type RutaGeoJSON = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    geometry: { type: "LineString"; coordinates: [number, number][] };
    properties?: Record<string, unknown>;
  }>;
};

export type Autoridad = {
  Id: number;
  Nombre: string;
  Cargo?: string | null;
  Email?: string | null;
  Telefono?: string | null;
  ImagenUrl?: string | null;
  [key: string]: unknown;
};

export type Parroquia = {
  Id: number;
  IdCanton?: number | null;
  Nombre: string;
  Descripcion?: string | null;
  ImagenUrl?: string | null;
  [key: string]: unknown;
};

export type Home = {
  Id: number;
  Nombre: string;
  ImagenUrl?: string | null;
  [key: string]: unknown;
};

export type Canton = {
  Id: number;
  Nombre: string;
  Descripcion?: string | null;
  ImagenUrl?: string | null;
  [key: string]: unknown;
};

export type Galeria = {
  Id: number;
  Nombre: string;
  Descripcion?: string | null;
  [key: string]: unknown;
};

export type DetalleGaleria = {
  Id: number;
  IdGaleria: number;
  ImagenUrl: string | null;
  [key: string]: unknown;
};

export type Emprendimiento = {
  Id: number;
  IdCategoria: number | null;
  IdUbicacion?: number | null;
  IdParroquia?: number | null;
  Nombre: string;
  Horario?: string | null;
  Descripcion?: string | null;
  Valor?: number | null; 
  IdGaleria?: number | null;
  [key: string]: unknown;
};

export type Catalogo = {
  Id: number;
  codigo: string;
  Descripcion?: string | null;
  [key: string]: unknown;
}

export type Transporte = {
  Id: number;
  IdParroquia?: number | null;
  Nombre: string;
  Descripcion?: string | null;
  Ruta?: string | null;
  Horario?: string | null;
  ImagenUrl?: string | null;
  [key: string]: unknown;
}