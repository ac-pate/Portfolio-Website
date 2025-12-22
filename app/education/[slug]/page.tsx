import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getEducationBySlug, getAllEducationSlugs } from '@/lib/mdx';
import { EducationDetail } from './EducationDetail';

interface EducationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllEducationSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: EducationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const education = getEducationBySlug(slug);

  if (!education) {
    return {
      title: 'Education Not Found',
    };
  }

  return {
    title: `${education.frontmatter.degree} - ${education.frontmatter.institution}`,
    description: education.frontmatter.field,
  };
}

export default async function EducationDetailPage({ params }: EducationPageProps) {
  const { slug } = await params;
  const education = getEducationBySlug(slug);

  if (!education) {
    notFound();
  }

  return <EducationDetail education={education} />;
}

