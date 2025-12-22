'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Code2, Cpu, Cog } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Ensure ScrollTrigger is registered
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const highlights = [
  { icon: Cpu, label: 'Embedded Systems' },
  { icon: Cog, label: 'Robotics' },
  { icon: Code2, label: 'ROS2 & Control' },
];

export function AboutPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !stickyRef.current || !contentRef.current) return;

    // Pin for 100vh. While pinned, the next section (Projects) will wipe over.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=100%',
        pin: stickyRef.current,
        pinSpacing: false, 
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    // Animate content exit synchronized with the incoming wipe
    tl.to(contentRef.current, {
      opacity: 0,
      y: -50,
      duration: 1,
      ease: 'power1.in', // Keep it visible a bit longer so wipe covers it
    });

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="about" 
      className="relative h-screen bg-background z-10"
    >
      <div 
        ref={stickyRef} 
        className="h-screen w-full flex items-center justify-center overflow-hidden"
      >
        <div ref={contentRef} className="section-container w-full">
          <SectionHeading
            title="About Me"
            subtitle="Computer Engineering student at Concordia University"
          />

          <div className="max-w-3xl mx-auto">
            <div className="text-center space-y-6">
              <p className="text-lg text-foreground-secondary leading-relaxed">
                I build intelligent machines that interact with the physical world. 
                Currently working on experimental space-rover platforms at CUARL and 
                leading robotics projects through IEEE Concordia.
              </p>

              {/* Quick highlights */}
              <div className="flex flex-wrap justify-center gap-4 py-4">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-background-secondary border border-border"
                  >
                    <item.icon className="w-4 h-4 text-accent" />
                    <span className="text-sm text-foreground-secondary">{item.label}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-accent font-medium hover:underline"
              >
                Learn more about me
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

