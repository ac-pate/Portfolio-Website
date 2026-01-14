import { Hero } from '@/components/sections/Hero';
import { AboutPreview } from '@/components/sections/AboutPreview';
import { ProjectsPreview } from '@/components/sections/ProjectsPreview';
import { ExperiencePreview } from '@/components/sections/ExperiencePreview';
import { TimelineSection } from '@/components/sections/TimelineSection';
import { Preloader } from '@/components/ui/Preloader';

import { getProjects, getJobs, getTimeline, getHomepageContent } from '@/lib/mdx';

export default function HomePage() {
  const featuredProjects = getProjects().filter(p => p.frontmatter.featured);
  const featuredJobs = getJobs().filter(j => j.frontmatter.featured);
  const allTimelineItems = getTimeline();
  const homepageContent = getHomepageContent();

  return (
    <>
      <Preloader />
      <Hero content={homepageContent.hero} />
      <AboutPreview content={homepageContent.aboutPreview} />
      <ProjectsPreview projects={featuredProjects} content={homepageContent.projectsPreview} />
      <ExperiencePreview jobs={featuredJobs} content={homepageContent.experiencePreview} />
      <TimelineSection items={allTimelineItems} content={homepageContent.timeline} />
    </>
  );
}
