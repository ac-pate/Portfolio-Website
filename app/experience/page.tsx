import type { Metadata } from 'next';
import { ExperienceList } from './ExperienceList';
import { getJobs } from '@/lib/mdx';

export const metadata: Metadata = {
  title: 'Experience',
  description: 'Professional experience in robotics, embedded systems, and engineering.',
};

export default function ExperiencePage() {
  const jobs = getJobs();

  return <ExperienceList jobs={jobs} />;
}

