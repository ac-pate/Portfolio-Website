import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getVolunteerBySlug, getAllVolunteerSlugs } from '@/lib/mdx';
import { VolunteerDetail } from './VolunteerDetail';

interface VolunteerPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllVolunteerSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: VolunteerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const volunteer = getVolunteerBySlug(slug);

  if (!volunteer) {
    return {
      title: 'Volunteer Work Not Found',
    };
  }

  return {
    title: `${volunteer.frontmatter.title} - ${volunteer.frontmatter.organization}`,
    description: volunteer.frontmatter.description,
  };
}

export default async function VolunteerDetailPage({ params }: VolunteerPageProps) {
  const { slug } = await params;
  const volunteer = getVolunteerBySlug(slug);

  if (!volunteer) {
    notFound();
  }

  return <VolunteerDetail volunteer={volunteer} />;
}

