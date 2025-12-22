import type { Metadata } from 'next';
import { EducationList } from './EducationList';
import { getEducation } from '@/lib/mdx';

export const metadata: Metadata = {
  title: 'Education',
  description: 'Academic background and coursework in computer engineering.',
};

export default function EducationPage() {
  const education = getEducation();

  return <EducationList education={education} />;
}

