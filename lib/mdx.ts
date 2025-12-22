/**
 * MDX Content Management
 * 
 * Handles reading and parsing MDX files from the content directory.
 * Provides functions to fetch projects, jobs, education, and volunteer work.
 * Also generates timeline items by combining all content types.
 * 
 * Content Structure:
 * - Projects: content/projects/*.mdx
 * - Jobs: content/jobs/*.mdx
 * - Education: content/education/*.mdx
 * - Volunteer: content/volunteer/*.mdx
 * 
 * Each MDX file contains frontmatter (YAML) and markdown content.
 * Functions automatically sort by date (newest first).
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export interface ProjectFrontmatter {
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  tags: string[];
  image?: string;
  coverImage?: string;
  github?: string;
  demo?: string;
  featured?: boolean;
  status?: 'completed' | 'in-progress' | 'archived';
}

export interface JobFrontmatter {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies?: string[];
  type?: 'full-time' | 'part-time' | 'internship' | 'contract';
  image?: string;
  coverImage?: string;
  featured?: boolean;
}

export interface EducationFrontmatter {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  location?: string;
  gpa?: string;
  honors?: string[];
  coursework?: string[];
  image?: string;
  coverImage?: string;
  featured?: boolean;
}

export interface VolunteerFrontmatter {
  title: string;
  organization: string;
  startDate: string;
  endDate?: string;
  description: string;
  image?: string;
  coverImage?: string;
  featured?: boolean;
}

export interface ExtracurricularFrontmatter {
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  type: 'competition' | 'workshop' | 'photography' | 'event' | 'other';
  location?: string;
  tags?: string[];
  image?: string;
  coverImage?: string;
  link?: string;
  award?: string;
  featured?: boolean;
}

export interface ContentItem<T> {
  slug: string;
  frontmatter: T;
  content: string;
}

export interface TimelineItem {
  type: 'project' | 'job' | 'education' | 'extracurricular';
  date: string;
  endDate?: string;
  title: string;
  subtitle: string;
  description: string;
  tags?: string[];
  slug?: string;
  link?: string;
  image?: string;
  github?: string;
  demo?: string;
}

function getContentFromDirectory<T>(directory: string): ContentItem<T>[] {
  const fullPath = path.join(contentDirectory, directory);

  if (!fs.existsSync(fullPath)) {
    return [];
  }

  const files = fs.readdirSync(fullPath).filter((file) => file.endsWith('.mdx'));

  return files.map((file) => {
    const filePath = path.join(fullPath, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    return {
      slug: file.replace('.mdx', ''),
      frontmatter: data as T,
      content,
    };
  });
}

export function getProjects(): ContentItem<ProjectFrontmatter>[] {
  const projects = getContentFromDirectory<any>('projects');
  // Map 'date' field to 'startDate' for backward compatibility
  const normalizedProjects = projects.map((project) => ({
    ...project,
    frontmatter: {
      ...project.frontmatter,
      startDate: project.frontmatter.startDate || project.frontmatter.date,
    } as ProjectFrontmatter,
  }));
  return normalizedProjects.sort((a, b) =>
    new Date(b.frontmatter.startDate).getTime() - new Date(a.frontmatter.startDate).getTime()
  );
}

export function getFeaturedProjects(): ContentItem<ProjectFrontmatter>[] {
  return getProjects().filter((p) => p.frontmatter.featured);
}

export function getProjectBySlug(slug: string): ContentItem<ProjectFrontmatter> | undefined {
  const projects = getProjects();
  return projects.find((p) => p.slug === slug);
}

export function getJobs(): ContentItem<JobFrontmatter>[] {
  const jobs = getContentFromDirectory<JobFrontmatter>('jobs');
  return jobs.sort((a, b) =>
    new Date(b.frontmatter.startDate).getTime() - new Date(a.frontmatter.startDate).getTime()
  );
}

export function getJobBySlug(slug: string): ContentItem<JobFrontmatter> | undefined {
  const jobs = getJobs();
  return jobs.find((j) => j.slug === slug);
}

export function getAllJobSlugs(): string[] {
  const jobsPath = path.join(contentDirectory, 'jobs');

  if (!fs.existsSync(jobsPath)) {
    return [];
  }

  return fs.readdirSync(jobsPath)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace('.mdx', ''));
}

export function getEducation(): ContentItem<EducationFrontmatter>[] {
  const education = getContentFromDirectory<EducationFrontmatter>('education');
  return education.sort((a, b) =>
    new Date(b.frontmatter.startDate).getTime() - new Date(a.frontmatter.startDate).getTime()
  );
}

export function getEducationBySlug(slug: string): ContentItem<EducationFrontmatter> | undefined {
  const education = getEducation();
  return education.find((e) => e.slug === slug);
}

export function getAllEducationSlugs(): string[] {
  const educationPath = path.join(contentDirectory, 'education');

  if (!fs.existsSync(educationPath)) {
    return [];
  }

  return fs.readdirSync(educationPath)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace('.mdx', ''));
}

export function getVolunteer(): ContentItem<VolunteerFrontmatter>[] {
  const volunteer = getContentFromDirectory<VolunteerFrontmatter>('volunteer');
  return volunteer.sort((a, b) =>
    new Date(b.frontmatter.startDate).getTime() - new Date(a.frontmatter.startDate).getTime()
  );
}

export function getVolunteerBySlug(slug: string): ContentItem<VolunteerFrontmatter> | undefined {
  const volunteer = getVolunteer();
  return volunteer.find((v) => v.slug === slug);
}

export function getAllVolunteerSlugs(): string[] {
  const volunteerPath = path.join(contentDirectory, 'volunteer');

  if (!fs.existsSync(volunteerPath)) {
    return [];
  }

  return fs.readdirSync(volunteerPath)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace('.mdx', ''));
}

export function getTimeline(): TimelineItem[] {
  const projects = getProjects();
  const jobs = getJobs();
  const education = getEducation();
  const extracurricular = getExtracurricular();

  const timelineItems: TimelineItem[] = [
    ...projects.map((p) => ({
      type: 'project' as const,
      date: p.frontmatter.startDate,
      endDate: p.frontmatter.endDate,
      title: p.frontmatter.title,
      subtitle: p.frontmatter.tags.slice(0, 3).join(' • '),
      description: p.frontmatter.description,
      tags: p.frontmatter.tags,
      slug: p.slug,
      link: `/projects/${p.slug}`,
      image: p.frontmatter.image,
      github: p.frontmatter.github,
      demo: p.frontmatter.demo,
    })),
    ...jobs.map((j) => ({
      type: 'job' as const,
      date: j.frontmatter.startDate,
      endDate: j.frontmatter.endDate,
      title: j.frontmatter.title,
      subtitle: j.frontmatter.company,
      description: j.frontmatter.description,
      tags: j.frontmatter.technologies,
      link: `/experience/${j.slug}`,
      image: j.frontmatter.image,
    })),
    ...education.map((e) => ({
      type: 'education' as const,
      date: e.frontmatter.startDate,
      endDate: e.frontmatter.endDate,
      title: e.frontmatter.degree,
      subtitle: e.frontmatter.institution,
      description: `${e.frontmatter.field}${e.frontmatter.gpa ? ` • GPA: ${e.frontmatter.gpa}` : ''}`,
      tags: e.frontmatter.coursework,
      link: `/education/${e.slug}`,
      image: e.frontmatter.image,
    })),
    ...extracurricular.map((ec) => ({
      type: 'extracurricular' as const,
      date: ec.frontmatter.startDate,
      endDate: ec.frontmatter.endDate,
      title: ec.frontmatter.title,
      subtitle: ec.frontmatter.description,
      description: ec.frontmatter.description,
      tags: ec.frontmatter.tags,
      slug: ec.slug,
      link: ec.frontmatter.link,
      image: ec.frontmatter.image,
    })),
  ];

  return timelineItems.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getAllProjectSlugs(): string[] {
  const projectsPath = path.join(contentDirectory, 'projects');

  if (!fs.existsSync(projectsPath)) {
    return [];
  }

  return fs.readdirSync(projectsPath)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace('.mdx', ''));
}

export function getExtracurricular(): ContentItem<ExtracurricularFrontmatter>[] {
  const extracurricular = getContentFromDirectory<ExtracurricularFrontmatter>('extracurricular');
  return extracurricular.sort((a, b) =>
    new Date(b.frontmatter.startDate).getTime() - new Date(a.frontmatter.startDate).getTime()
  );
}

export function getExtracurricularBySlug(slug: string): ContentItem<ExtracurricularFrontmatter> | undefined {
  const extracurricular = getExtracurricular();
  return extracurricular.find((e) => e.slug === slug);
}

export function getAllExtracurricularSlugs(): string[] {
  const extracurricularPath = path.join(contentDirectory, 'extracurricular');

  if (!fs.existsSync(extracurricularPath)) {
    return [];
  }

  return fs.readdirSync(extracurricularPath)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace('.mdx', ''));
}
