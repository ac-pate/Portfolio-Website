import type { Metadata } from 'next';
import { VolunteerList } from './VolunteerList';
import { getVolunteer } from '@/lib/mdx';

export const metadata: Metadata = {
  title: 'Volunteer Work',
  description: 'Leadership roles, community service, and volunteer activities.',
};

export default function VolunteerPage() {
  const volunteer = getVolunteer();

  return <VolunteerList volunteer={volunteer} />;
}

