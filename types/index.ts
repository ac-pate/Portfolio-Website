export interface NavItem {
  label: string;
  href: string;
  isAnchor?: boolean;
}

export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  tagline: string;
  email: string;
  social: {
    github: string;
    linkedin: string;
    twitter?: string;
  };
  navItems: NavItem[];
}

