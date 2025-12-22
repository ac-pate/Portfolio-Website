import type { Metadata } from 'next';
import { ExtracurricularList } from './ExtracurricularList';
import { getExtracurricular } from '@/lib/mdx';

export const metadata: Metadata = {
  title: 'Extracurricular',
  description: 'Competitions, workshops, events, and other activities beyond academics.',
};

export default function ExtracurricularPage() {
  const extracurricular = getExtracurricular();

  return <ExtracurricularList extracurricular={extracurricular} />;
}

