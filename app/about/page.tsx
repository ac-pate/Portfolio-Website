import type { Metadata } from 'next';
import { AboutPage } from './AboutPage';
import { getEducation, getAboutContent } from '@/lib/mdx';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about Achal Patel - Computer Engineering student at Concordia University.',
};

export default function About() {
  const education = getEducation();
  const aboutContent = getAboutContent();

  return <AboutPage education={education} content={aboutContent} />;
}
