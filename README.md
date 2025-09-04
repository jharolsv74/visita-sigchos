# Visita Sigchos

Este proyecto es una aplicación web construida con Next.js para promover el turismo en Sigchos.

## Requisitos
- Node.js (v18 o superior recomendado)
- npm (v9 o superior recomendado)

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/jharolsv74/visita-sigchos.git
   ```
2. Ingresa al directorio del proyecto:
   ```bash
   cd visita-sigchos
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```

## Uso

Para iniciar la aplicación en modo desarrollo:

```bash
npm run dev
```

Luego abre tu navegador en [http://localhost:3000].

## Estructura del proyecto
- `src/app/` — Páginas y rutas principales de la aplicación
- `src/components/` — Componentes reutilizables
- `src/data/` — Archivos de datos (por ejemplo, atractivos turísticos)
- `public/` — Imágenes y archivos estáticos

## Scripts útiles
- `npm run dev` — Inicia el servidor de desarrollo
- `npm run build` — Genera la versión de producción
- `npm start` — Inicia la app en modo producción

## Licencia

Este proyecto es de uso educativo y promocional para la parroquia Sigchos.

## Variables de entorno (desarrollo)

Para desarrollo local crea un archivo `.env` en la raíz del proyecto (ya está en `.gitignore`).
Ejemplo mínimo (no subirlo a git):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu-anon-key>

# OpenRouteService (opcional, para rutas)
ORS_API_KEY=<tu-ors-key>
```

Si necesitas que deje de fallar en entornos sin variables, modifica `src/lib/supabase.ts` para manejarlo de forma segura —pero evita commitear claves reales.
