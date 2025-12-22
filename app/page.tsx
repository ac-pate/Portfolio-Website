import { Hero } from '@/components/sections/Hero';
import { AboutPreview } from '@/components/sections/AboutPreview';
import { ProjectsPreview } from '@/components/sections/ProjectsPreview';
import { ExperiencePreview } from '@/components/sections/ExperiencePreview';
import { TimelineSection } from '@/components/sections/TimelineSection';
import { Contact } from '@/components/sections/Contact';
import { getProjects, getJobs, getTimeline } from '@/lib/mdx';

export default function HomePage() {
  const projects = getProjects();
  const jobs = getJobs();
  const timelineItems = getTimeline();

  return (
    <>
      <Hero />
      <AboutPreview />
      <ProjectsPreview projects={projects} />
      <ExperiencePreview jobs={jobs} />
      <TimelineSection items={timelineItems.slice(0, 8)} />
      <Contact />
    </>
  );
}
