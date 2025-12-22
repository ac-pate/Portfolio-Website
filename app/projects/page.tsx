import type { Metadata } from 'next';
import { ProjectsListPage } from './ProjectsListPage';
import { getProjects } from '@/lib/mdx';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'A collection of my engineering and software projects.',
};

export default function ProjectsPage() {
  const projects = getProjects();

  return <ProjectsListPage projects={projects} />;
}
