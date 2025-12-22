import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getJobBySlug, getAllJobSlugs } from '@/lib/mdx';
import { ExperienceDetail } from './ExperienceDetail';

interface ExperiencePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllJobSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ExperiencePageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = getJobBySlug(slug);

  if (!job) {
    return {
      title: 'Experience Not Found',
    };
  }

  return {
    title: `${job.frontmatter.title} at ${job.frontmatter.company}`,
    description: job.frontmatter.description,
  };
}

export default async function ExperienceDetailPage({ params }: ExperiencePageProps) {
  const { slug } = await params;
  const job = getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  return <ExperienceDetail job={job} />;
}

