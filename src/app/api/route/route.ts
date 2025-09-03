// app/api/route/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ORS_API_KEY = process.env.ORS_API_KEY;
const ORS_URL =
  "https://api.openrouteservice.org/v2/directions/driving-car/geojson";

const BodySchema = z.object({
  user: z.object({ lat: z.number(), lng: z.number() }),
  sitio: z.object({ lat: z.number(), lng: z.number() }),
});

export async function POST(req: NextRequest) {
  if (!ORS_API_KEY) {
    return NextResponse.json({ error: "Falta ORS_API_KEY" }, { status: 500 });
  }

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch (e) {
    return NextResponse.json(
      { error: "Payload inválido", detail: String(e) },
      { status: 400 }
    );
  }

  const coordinates: [number, number][] = [
    [body.user.lng, body.user.lat],
    [body.sitio.lng, body.sitio.lat],
  ];

  try {
    const r = await fetch(ORS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: ORS_API_KEY,
      },
      body: JSON.stringify({ coordinates }),
      // No cache: cada ruta depende de coords
      cache: "no-store",
    });

    if (!r.ok) {
      const text = await r.text();
      return NextResponse.json(
        { error: "ORS no OK", detail: text },
        { status: r.status }
      );
    }

    const geojson = await r.json();
    // Validación mínima
    if (!geojson?.features?.length) {
      return NextResponse.json({ error: "ORS vacío" }, { status: 502 });
    }

    return NextResponse.json(geojson, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Fallo ORS", detail: String(err) },
      { status: 502 }
    );
  }
}
