'use client';

import { useEffect, useRef } from 'react';
import { Mail, Github, Linkedin, MapPin } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '@/lib/config';

// Ensure ScrollTrigger is registered
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function Contact() {
  const contactRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contactRef.current || !contentRef.current) return;

    // Find the TimelineSection to coordinate fade timing
    const timelineSection = document.querySelector('#timeline');
    if (!timelineSection) return;

    // Set initial opacity to 0
    gsap.set(contentRef.current, { opacity: 0 });

    // Wait for Timeline3D to initialize and get its scroll distance
    const setupFade = () => {
      // Find the Timeline3D wrapper element (has inline style with height)
      const timelineWrapper = timelineSection.querySelector('[class*="relative w-full"]') as HTMLElement;
      if (!timelineWrapper) {
        // Retry if Timeline3D hasn't initialized yet
        setTimeout(setupFade, 100);
        return null;
      }

      // Get computed height or inline style height
      const heightStyle = timelineWrapper.style.height;
      if (!heightStyle) {
        setTimeout(setupFade, 100);
        return null;
      }

      // Extract vh value (e.g., "500vh" -> 500)
      const totalScrollVh = parseFloat(heightStyle);
      if (!totalScrollVh || totalScrollVh === 0) {
        setTimeout(setupFade, 100);
        return null;
      }

      // Match Timeline3D's EXIT_HOLD_VH constant (100vh)
      const EXIT_HOLD_VH = 100;
      const scrollDistanceVh = totalScrollVh - EXIT_HOLD_VH;
      const fadeStart = scrollDistanceVh / totalScrollVh;

      // Create ScrollTrigger that syncs with Timeline3D fade-out
      const trigger = ScrollTrigger.create({
        trigger: timelineSection,
        start: 'top top',
        end: `+=${totalScrollVh}vh`,
        scrub: 2.5, // Match Timeline3D's SCROLL_SCRUB_SPEED
        onUpdate: (self) => {
          if (!contentRef.current) return;
          
          const progress = self.progress;
          
          // Fade in Contact as Timeline3D fades out (during EXIT_HOLD_VH period)
          if (progress >= fadeStart) {
            const fadeT = Math.min(Math.max((progress - fadeStart) / (1 - fadeStart), 0), 1);
            contentRef.current.style.opacity = String(fadeT);
          } else {
            contentRef.current.style.opacity = '0';
          }
        },
      });

      return trigger;
    };

    let trigger: ScrollTrigger | null = null;
    const timeoutId = setTimeout(() => {
      trigger = setupFade();
    }, 200); // Give Timeline3D time to initialize

    return () => {
      clearTimeout(timeoutId);
      if (trigger) trigger.kill();
    };
  }, []);

  return (
    <section 
      ref={contactRef}
      id="contact" 
      className="relative z-50 -mt-[100vh] py-16 bg-background-secondary/30"
    >
      <div className="section-container">
        <div
          ref={contentRef}
          className="text-center max-w-md mx-auto"
        >
          <h2 className="text-2xl font-display font-bold mb-6">Get in Touch</h2>
          
          <div className="flex justify-center gap-6 mb-6">
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-2 text-foreground-secondary hover:text-accent transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span>Email</span>
            </a>
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground-secondary hover:text-accent transition-colors"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </a>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground-secondary hover:text-accent transition-colors"
            >
              <Linkedin className="w-5 h-5" />
              <span>LinkedIn</span>
            </a>
          </div>

          <p className="text-sm text-muted flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4" />
            Montreal, QC • Open to opportunities
          </p>
        </div>
      </div>
    </section>
  );
}
