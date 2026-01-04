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
    // Optional: Add simple fade-in or other non-pinning animations here if desired
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="about" 
      className="sticky top-0 min-h-screen bg-background z-10 pb-20 mb-[40vh]"
    >
      <div className="section-container w-full pt-24 md:pt-32">
        {/* Sticky Header */}
        <div className="sticky top-20 z-10 py-4 bg-background/80 backdrop-blur-md -mx-4 px-4 mb-8 border-b border-white/5">
          <SectionHeading
            title="About Me"
            subtitle="Computer Engineering student at Concordia University"
          />
        </div>

        <div ref={contentRef}>

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

