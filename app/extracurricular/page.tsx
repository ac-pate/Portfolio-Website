import type { Metadata } from 'next';
import { ExtracurricularList } from './ExtracurricularList';
import { getExtracurricular, getVolunteer } from '@/lib/mdx';

export const metadata: Metadata = {
  title: 'Extracurricular',
  description: 'Competitions, workshops, events, and other activities beyond academics.',
};

export default function ExtracurricularPage() {
  const extracurricular = getExtracurricular();
  const volunteer = getVolunteer();

  return <ExtracurricularList extracurricular={extracurricular} volunteer={volunteer} />;
}

