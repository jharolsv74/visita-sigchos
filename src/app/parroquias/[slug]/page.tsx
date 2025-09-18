import React from 'react';
import { notFound } from 'next/navigation';
import ParroquiaTemplate from '@/components/ParroquiaTemplate';
import { getParroquiaBySlug } from '@/services/parroquias.service';

type Props = {
  params: { slug: string };
};

export default async function Page({ params }: Props) {
  // In Next.js params may be a promise in some runtime modes; await it before using.
  const { slug } = (await params) as { slug: string };
  const parroquia = await getParroquiaBySlug(slug);
  if (!parroquia) return notFound();
  return <ParroquiaTemplate parroquia={parroquia} />;
}
