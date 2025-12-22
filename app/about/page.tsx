import type { Metadata } from 'next';
import { AboutPage } from './AboutPage';
import { getJobs, getEducation, getVolunteer } from '@/lib/mdx';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about Achal Patel - Computer Engineering student at Concordia University.',
};

export default function About() {
  const jobs = getJobs();
  const education = getEducation();
  const volunteer = getVolunteer();

  return <AboutPage jobs={jobs} education={education} volunteer={volunteer} />;
}
