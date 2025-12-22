import { Hero } from '@/components/sections/Hero';
import { AboutPreview } from '@/components/sections/AboutPreview';
import { ProjectsPreview } from '@/components/sections/ProjectsPreview';
import { ExperiencePreview } from '@/components/sections/ExperiencePreview';
import { TimelineSection } from '@/components/sections/TimelineSection';
import { Contact } from '@/components/sections/Contact';
import { getProjects, getJobs, getTimeline } from '@/lib/mdx';

export default function HomePage() {
  const featuredProjects = getProjects().filter(p => p.frontmatter.featured);
  const featuredJobs = getJobs().filter(j => j.frontmatter.featured);
  const allTimelineItems = getTimeline();

  return (
    <>
      <Hero />
      <AboutPreview />
      <ProjectsPreview projects={featuredProjects} />
      <ExperiencePreview jobs={featuredJobs} />
      <TimelineSection items={allTimelineItems} />
      <Contact />
    </>
  );
}
