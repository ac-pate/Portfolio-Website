import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getExtracurricularBySlug, getAllExtracurricularSlugs } from '@/lib/mdx';
import { ExtracurricularDetail } from './ExtracurricularDetail';

interface ExtracurricularPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllExtracurricularSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ExtracurricularPageProps): Promise<Metadata> {
  const { slug } = await params;
  const extracurricular = getExtracurricularBySlug(slug);

  if (!extracurricular) {
    return {
      title: 'Extracurricular Not Found',
    };
  }

  return {
    title: extracurricular.frontmatter.title,
    description: extracurricular.frontmatter.description,
  };
}

export default async function ExtracurricularDetailPage({ params }: ExtracurricularPageProps) {
  const { slug } = await params;
  const extracurricular = getExtracurricularBySlug(slug);

  if (!extracurricular) {
    notFound();
  }

  return <ExtracurricularDetail extracurricular={extracurricular} />;
}





