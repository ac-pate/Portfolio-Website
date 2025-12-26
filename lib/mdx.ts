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
  term: string; // Academic term (e.g., "Fall 2025", "Winter 2024")
  description?: string; // Optional body/description
  startDate?: string; // Optional - not used for term calculation
  endDate?: string; // Optional - not used for term calculation
  tags: string[];
  image?: string;
  coverImage?: string;
  github?: string;
  demo?: string;
  featured?: boolean;
  status?: 'completed' | 'in-progress' | 'archived';
  projectType?: ('Personal' | 'Competition' | 'IEEE Concordia' | 'Academic' | 'Job')[];
  galleryImages?: string[];
}

export interface JobFrontmatter {
  title: string;
  company: string;
  term: string; // Academic term (e.g., "Fall 2025", "Winter 2024")
  location: string;
  startDate?: string; // Optional - not used for term calculation
  endDate?: string; // Optional - not used for term calculation
  description?: string; // Optional body/description
  technologies?: string[];
  type?: 'full-time' | 'part-time' | 'internship' | 'contract';
  image?: string;
  coverImage?: string;
  featured?: boolean;
  galleryImages?: string[];
}

export interface EducationFrontmatter {
  institution: string;
  degree: string;
  term: string; // Academic term (e.g., "Fall 2025", "Winter 2024")
  field: string;
  startDate?: string; // Optional - not used for term calculation
  endDate?: string; // Optional - not used for term calculation
  location?: string;
  gpa?: string;
  honors?: string[];
  coursework?: string[];
  image?: string;
  coverImage?: string;
  featured?: boolean;
  galleryImages?: string[];
}

export interface VolunteerFrontmatter {
  title: string;
  organization: string;
  term: string; // Academic term (e.g., "Fall 2025", "Winter 2024")
  startDate?: string; // Optional - not used for term calculation
  endDate?: string; // Optional - not used for term calculation
  description?: string; // Optional body/description
  image?: string;
  coverImage?: string;
  featured?: boolean;
  galleryImages?: string[];
}

export interface ExtracurricularFrontmatter {
  title: string;
  term: string; // Academic term (e.g., "Fall 2025", "Winter 2024")
  description?: string; // Optional body/description
  startDate?: string; // Optional - not used for term calculation
  endDate?: string; // Optional - not used for term calculation
  type: 'competition' | 'workshop' | 'photography' | 'event' | 'other';
  location?: string;
  tags?: string[];
  image?: string;
  coverImage?: string;
  link?: string;
  award?: string;
  featured?: boolean;
  galleryImages?: string[];
}

export interface ContentItem<T> {
  slug: string;
  frontmatter: T;
  content: string;
}

export interface TimelineItem {
  type: 'project' | 'job' | 'education' | 'extracurricular';
  term: string; // Academic term (e.g., "Fall 2025", "Winter 2024") - used for sorting
  date?: string; // Optional - kept for backward compatibility but not used for sorting
  endDate?: string; // Optional - kept for backward compatibility but not used for sorting
  title: string;
  subtitle: string;
  description?: string; // Optional
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
  // Map 'date' field to 'startDate' for backward compatibility (not used for sorting)
  const normalizedProjects = projects.map((project) => ({
    ...project,
    frontmatter: {
      ...project.frontmatter,
      startDate: project.frontmatter.startDate || project.frontmatter.date,
    } as ProjectFrontmatter,
  }));
  
  // Sort by term instead of date
  // NOTE: Date-based term calculation (getAcademicTerm) is not being used anymore
  // We now rely on the 'term' property in frontmatter
  return normalizedProjects.sort((a, b) => {
    const [aYear, aSeason] = parseTermForSorting(a.frontmatter.term);
    const [bYear, bSeason] = parseTermForSorting(b.frontmatter.term);
    
    if (aYear !== bYear) {
      return bYear - aYear; // Newer first
    }
    return bSeason - aSeason; // Summer > Winter > Fall (reverse for newest first)
  });
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
  // Sort by term instead of date
  // NOTE: Date-based term calculation (getAcademicTerm) is not being used anymore
  return jobs.sort((a, b) => {
    const [aYear, aSeason] = parseTermForSorting(a.frontmatter.term);
    const [bYear, bSeason] = parseTermForSorting(b.frontmatter.term);
    
    if (aYear !== bYear) {
      return bYear - aYear; // Newer first
    }
    return bSeason - aSeason; // Summer > Winter > Fall (reverse for newest first)
  });
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
  // Sort by term instead of date
  // NOTE: Date-based term calculation (getAcademicTerm) is not being used anymore
  return education.sort((a, b) => {
    const [aYear, aSeason] = parseTermForSorting(a.frontmatter.term);
    const [bYear, bSeason] = parseTermForSorting(b.frontmatter.term);
    
    if (aYear !== bYear) {
      return bYear - aYear; // Newer first
    }
    return bSeason - aSeason; // Summer > Winter > Fall (reverse for newest first)
  });
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
  // Sort by term instead of date
  // NOTE: Date-based term calculation (getAcademicTerm) is not being used anymore
  return volunteer.sort((a, b) => {
    const [aYear, aSeason] = parseTermForSorting(a.frontmatter.term);
    const [bYear, bSeason] = parseTermForSorting(b.frontmatter.term);
    
    if (aYear !== bYear) {
      return bYear - aYear; // Newer first
    }
    return bSeason - aSeason; // Summer > Winter > Fall (reverse for newest first)
  });
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

/**
 * Parses term string (e.g., "Fall 2025") into sortable components
 * Returns [year, seasonOrder] for sorting: [2025, 1] where 1=Fall, 2=Winter, 3=Summer
 */
function parseTermForSorting(term: string): [number, number] {
  const parts = term.trim().split(' ');
  const season = parts[0]; // "Fall", "Winter", or "Summer"
  const year = parseInt(parts[1] || '0', 10);
  
  const seasonOrder: Record<string, number> = {
    'Fall': 1,
    'Winter': 2,
    'Summer': 3,
  };
  
  return [year, seasonOrder[season] || 0];
}

export function getTimeline(): TimelineItem[] {
  const projects = getProjects();
  const jobs = getJobs();
  const education = getEducation();
  const extracurricular = getExtracurricular();

  const timelineItems: TimelineItem[] = [
    ...projects.map((p) => ({
      type: 'project' as const,
      term: p.frontmatter.term,
      date: p.frontmatter.startDate, // Optional - kept for backward compatibility
      endDate: p.frontmatter.endDate, // Optional - kept for backward compatibility
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
      term: j.frontmatter.term,
      date: j.frontmatter.startDate, // Optional - kept for backward compatibility
      endDate: j.frontmatter.endDate, // Optional - kept for backward compatibility
      title: j.frontmatter.title,
      subtitle: j.frontmatter.company,
      description: j.frontmatter.description,
      tags: j.frontmatter.technologies,
      link: `/experience/${j.slug}`,
      image: j.frontmatter.image,
    })),
    ...education.map((e) => ({
      type: 'education' as const,
      term: e.frontmatter.term,
      date: e.frontmatter.startDate, // Optional - kept for backward compatibility
      endDate: e.frontmatter.endDate, // Optional - kept for backward compatibility
      title: e.frontmatter.degree,
      subtitle: e.frontmatter.institution,
      description: `${e.frontmatter.field}${e.frontmatter.gpa ? ` • GPA: ${e.frontmatter.gpa}` : ''}`,
      tags: e.frontmatter.coursework,
      link: `/education/${e.slug}`,
      image: e.frontmatter.image,
    })),
    ...extracurricular.map((ec) => ({
      type: 'extracurricular' as const,
      term: ec.frontmatter.term,
      date: ec.frontmatter.startDate, // Optional - kept for backward compatibility
      endDate: ec.frontmatter.endDate, // Optional - kept for backward compatibility
      title: ec.frontmatter.title,
      subtitle: ec.frontmatter.description || '',
      description: ec.frontmatter.description,
      tags: ec.frontmatter.tags,
      slug: ec.slug,
      link: ec.frontmatter.link,
      image: ec.frontmatter.image,
    })),
  ];

  // Sort timeline items by term (NOT by date):
  // 1. Primary: by year (earlier year = appears earlier)
  // 2. Secondary: if same year, by season (Fall < Winter < Summer)
  return timelineItems.sort((a, b) => {
    const [aYear, aSeason] = parseTermForSorting(a.term);
    const [bYear, bSeason] = parseTermForSorting(b.term);
    
    // Primary sort: year
    if (aYear !== bYear) {
      return aYear - bYear; // Earlier year = earlier in timeline
    }
    
    // Secondary sort: season (if same year)
    return aSeason - bSeason; // Fall (1) < Winter (2) < Summer (3)
  });
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
  // Sort by term instead of date
  // NOTE: Date-based term calculation (getAcademicTerm) is not being used anymore
  return extracurricular.sort((a, b) => {
    const [aYear, aSeason] = parseTermForSorting(a.frontmatter.term);
    const [bYear, bSeason] = parseTermForSorting(b.frontmatter.term);
    
    if (aYear !== bYear) {
      return bYear - aYear; // Newer first
    }
    return bSeason - aSeason; // Summer > Winter > Fall (reverse for newest first)
  });
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
