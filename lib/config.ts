/**
 * Site Configuration
 * 
 * Central configuration file for the entire portfolio site.
 * Contains personal information, social links, and navigation menu items.
 * 
 * TWEAKABLE: All values here can be modified to update site-wide information.
 * - name: Your full name (used in titles, footer)
 * - title: SEO title and meta description
 * - email: Contact email
 * - social: GitHub and LinkedIn URLs
 * - navItems: Navigation menu structure (add/remove/reorder items)
 */
import type { SiteConfig } from '@/types';

export const siteConfig: SiteConfig = {
  name: 'Achal Patel',
  title: 'Computer Engineering Student | Robotics & Embedded Systems',
  description: 'Portfolio of Achal Patel - Computer Engineering student at Concordia University, passionate about robotics, embedded systems, and autonomous systems.',
  tagline: 'Building intelligent machines, one system at a time.',
  email: 'Achalypatel3403@gmail.com',
  social: {
    github: 'https://github.com/ac-pate',
    linkedin: 'https://linkedin.com/in/achal-patel',
  },
  navItems: [
    { label: 'About', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Experience', href: '/experience' },
    { label: 'Extracurricular', href: '/extracurricular' },
    { label: 'Resume', href: '/resume' },
    { label: 'Photography', href: '/photography' },
  ],
};
