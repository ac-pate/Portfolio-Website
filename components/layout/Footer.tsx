'use client';

import { Github, Linkedin, Mail } from 'lucide-react';
import { siteConfig } from '@/lib/config';
import { useSound } from '@/components/providers/SoundProvider';
import GlowWrapper from '@/components/ui/GlowWrapper';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { playHoverSound, playClickSound } = useSound();

  return (
    <footer className="relative group border-t border-border bg-background-secondary/30 transition-colors duration-300 hover:bg-background-secondary/50 hover:border-accent/20" style={{ zIndex: 100000 }}>
      <div className="section-container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <p className="text-sm text-muted group-hover:text-foreground transition-colors duration-300">
            © {currentYear} {siteConfig.name}
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4 relative z-10">
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={playHoverSound}
              onClick={playClickSound}
              className="p-2 rounded-lg text-foreground-secondary hover:text-accent hover:bg-accent/10 hover:scale-110 transition-all duration-200 hover:shadow-glow-sm border border-transparent hover:border-accent/30"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={playHoverSound}
              onClick={playClickSound}
              className="p-2 rounded-lg text-foreground-secondary hover:text-accent hover:bg-accent/10 hover:scale-110 transition-all duration-200 hover:shadow-glow-sm border border-transparent hover:border-accent/30"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>

            <a
              href={`mailto:${siteConfig.email}`}
              onMouseEnter={playHoverSound}
              onClick={playClickSound}
              className="p-2 rounded-lg text-foreground-secondary hover:text-accent hover:bg-accent/10 hover:scale-110 transition-all duration-200 hover:shadow-glow-sm border border-transparent hover:border-accent/30"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>

          {/* Built with */}
          <p className="text-sm text-muted group-hover:text-foreground transition-colors duration-300">
            Built with Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
