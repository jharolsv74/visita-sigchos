import React from 'react';
import { notFound } from 'next/navigation';
import SitioTemplate from '@/components/SitioTemplate';
import { getSitioById } from '@/services/sitios.service';

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const idNum = Number(params.id);
  if (Number.isNaN(idNum)) return notFound();
  const sitio = await getSitioById(idNum);
  if (!sitio) return notFound();
  return <SitioTemplate sitioWithUbicacion={sitio} />;
}
