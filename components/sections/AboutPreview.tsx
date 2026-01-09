'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { siteConfig } from '@/lib/config';
import GlowWrapper from '@/components/ui/GlowWrapper';

const techHighlights = [
  'ROS2', 'Computer Vision', 'Machine Learning', 'Control Systems',
  'FPGA', 'Embedded Systems', 'Sensor Fusion', 'Autonomous Systems'
];

export function AboutPreview() {
  return (
    <section 
      id="about" 
      className="sticky top-0 min-h-screen bg-background z-10 flex flex-col pb-20 mb-[40vh] overflow-hidden"
    >
      {/* Ambient glow effects */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="section-container w-full relative z-10 pt-24 md:pt-32">
        {/* Sticky Header - Follows dynamic section pattern */}
        <div className="sticky top-20 z-20 py-1 bg-background/80 backdrop-blur-md -mx-4 px-4 mb-8 border-b border-white/5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              About Me<span className="text-accent">.</span>
            </h2>
            <div className="mt-1 flex flex-wrap justify-center items-center gap-x-6 gap-y-1 text-base md:text-lg text-foreground-secondary font-medium">
              <span className="flex items-center">
                4th Year Computer Engineering @ Concordia
              </span>
              <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-accent/40" />
              <span className="flex items-center">
                Robotics Researcher @ CUARL
              </span>
              <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-accent/40" />
              <span className="flex items-center">
                Team Lead @ Mimic Robotics
              </span>
            </div>
          </motion.div>
        </div>

        {/* Flex layout: Image on left, content on right */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 max-w-7xl mx-auto">
          {/* Left: Profile Picture */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-shrink-0"
          >
            <GlowWrapper 
              preset="card" 
              borderRadius={250} 
              spread={180} 
              mouseIntensity={1.0} 
              showHighlight={false}
              className="rounded-full animate-blob"
            >
              <div className="relative w-[340px] h-[340px] md:w-[480px] md:h-[480px]">
                {/* Profile image container with jellyfish animation */}
                <div className="absolute inset-0 animate-blob overflow-hidden border-4 border-accent/20 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent z-10" />
                  <Image
                    src="/images/hero/031058170035.jpg"
                    alt="Achal Patel"
                    fill
                    className="object-cover scale-110"
                    priority
                  />
                </div>

                {/* Floating accent rings that follow the blob */}
                <div className="absolute inset-[-10px] animate-blob border-2 border-accent/10 pointer-events-none" 
                     style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
                <div className="absolute inset-[-20px] animate-blob border border-accent/5 pointer-events-none" 
                     style={{ animationDuration: '30s' }} />
              </div>
            </GlowWrapper>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 space-y-6"
          >
            {/* Description */}
            <div className="space-y-4">
              <p className="text-lg text-foreground-secondary leading-relaxed">
                I build intelligent machines that interact with the physical world. My passion spans 
                embedded systems, robotics, and autonomous control systems—from FPGA design and CAN bus 
                protocols to VLA models and imitation learning.
              </p>
              <p className="text-lg text-foreground-secondary leading-relaxed">
                Currently developing <span className="text-accent font-semibold">dual-arm humanoid robots</span> for 
                my capstone and working at <span className="text-accent font-semibold">CUARL</span> on 
                extraterrestrial rovers with advanced computer vision systems.
              </p>
            </div>

            {/* Tech Highlights */}
            <div className="flex flex-wrap gap-2">
              {techHighlights.map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="px-3 py-1.5 text-sm rounded-lg bg-background-secondary border border-border text-foreground-secondary hover:border-accent/50 hover:text-accent transition-all duration-200 cursor-default"
                >
                  {tech}
                </motion.span>
              ))}
            </div>

            {/* CTA & Social */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <GlowWrapper preset="button" className="rounded-lg">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-dark text-white font-medium rounded-lg transition-all duration-200 hover:shadow-glow-sm"
                >
                  Read My Full Story
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </GlowWrapper>

              <div className="flex items-center gap-3">
                <a
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-foreground-secondary hover:text-accent hover:bg-accent/10 transition-all"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-foreground-secondary hover:text-accent hover:bg-accent/10 transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="p-2 rounded-lg text-foreground-secondary hover:text-accent hover:bg-accent/10 transition-all"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

