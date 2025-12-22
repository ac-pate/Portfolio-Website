'use client';

import { Github, Linkedin, Mail } from 'lucide-react';
import { siteConfig } from '@/lib/config';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background-secondary/30">
      <div className="section-container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <p className="text-sm text-muted">
            © {currentYear} {siteConfig.name}
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-foreground-secondary hover:text-accent hover:bg-accent/10 transition-all duration-200 block"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-foreground-secondary hover:text-accent hover:bg-accent/10 transition-all duration-200 block"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>

            <a
              href={`mailto:${siteConfig.email}`}
              className="p-2 rounded-lg text-foreground-secondary hover:text-accent hover:bg-accent/10 transition-all duration-200 block"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>

          {/* Built with */}
          <p className="text-sm text-muted">
            Built with Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
