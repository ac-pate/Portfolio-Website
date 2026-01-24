'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { siteConfig } from '@/lib/config';
import GlowWrapper from '@/components/ui/GlowWrapper';
import { useSound } from '@/components/providers/SoundProvider';

interface AboutPreviewContent {
  quote: string;
  technicalInterests: string[];
}

interface AboutPreviewProps {
  content: AboutPreviewContent;
}

// --- FEATURE TOGGLE & DATA ---
const ENABLE_IMAGE_FLICKER = true; 

const FLICKER_IMAGES = [
  "/images/hero/031058170035.jpg", // Original image
  "/images/uploads/DSCF3024.JPG",
  "/images/uploads/IMG_7786.JPG",
  "/images/uploads/DSCF3078.JPG",
  "/images/uploads/20240801_162018.jpg",
  "/images/uploads/img_20241024_121548_698.jpg",
  "/images/uploads/20240217_145723.jpg",
  "/images/uploads/DSCF2999.JPG",
  "/images/uploads/20250216_060005.jpg",
  "/images/uploads/IMG_7778.JPG",
  "/images/uploads/20241220_151604.jpg",
  "/images/uploads/20241220_165236.jpg",
];

function InfographicSummary() {
  return (
    <div className="space-y-8 w-full">
      <div className="space-y-4">
        <p className="text-lg md:text-xl text-foreground font-display font-bold leading-tight">
          &ldquo;I build intelligent machines that interact with the physical world.&rdquo;
        </p>
      </div>

      {/* Strengths & Weaknesses - Refined Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <span className="text-emerald-500 font-bold">+</span>
            </div>
            <h4 className="text-lg font-display font-bold text-foreground">Strengths</h4>
          </div>
          <ul className="space-y-4">
            {[
              "Addicted to precision machining and control theory.",
              "Fluent in low-latency communication (CAN, SPI, C++).",
              "High torque problem-solving capacity under pressure."
            ].map((strength, i) => (
              <li key={i} className="flex gap-3 text-sm text-foreground-secondary leading-relaxed">
                <div className="mt-1.5 w-1 h-1 rounded-full bg-accent flex-shrink-0" />
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
              <span className="text-accent font-bold">−</span>
            </div>
            <h4 className="text-lg font-display font-bold text-foreground">Weaknesses</h4>
          </div>
          <ul className="space-y-4">
            {[
              "Cannot stop optimizing until O(1) is achieved.",
              "Propensity to disassemble and 'improve' working devices.",
              "CPU stalls when coffee levels fall below 20%."
            ].map((weakness, i) => (
              <li key={i} className="flex gap-3 text-sm text-foreground-secondary leading-relaxed">
                <div className="mt-1.5 w-1 h-1 rounded-full bg-accent/40 flex-shrink-0" />
                {weakness}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
// -----------------------------

export function AboutPreview({ content }: AboutPreviewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const { playFlickerSound, stopFlickerSound } = useSound();

  // Flicker Logic
  useEffect(() => {
    if (!ENABLE_IMAGE_FLICKER || !isHovering) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % FLICKER_IMAGES.length);
    }, 220); // Syncs with camera-flicker.mp3 burst frequency

    return () => clearInterval(interval);
  }, [isHovering]);

  return (
    <section 
      id="about" 
      className="sticky top-0 min-h-screen bg-background z-10 flex flex-col pb-20 mb-[60vh] overflow-hidden"
    >
      <div className="section-container w-full relative z-10 pt-12 lg:px-4">
        {/* Sticky Header - Follows dynamic section pattern */}
        <div className="sticky top-16 z-20 pt-2 pb-1 bg-background/80 backdrop-blur-md -mx-4 px-4 mb-6 border-b border-white/5">
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
            {/* <div className="mt-2 flex justify-center items-center gap-x-4 gap-y-2 text-sm md:text-base text-foreground-secondary font-medium">
              <span className="whitespace-nowrap">4th Year Computer Engineering @ Concordia</span>
              <span className="hidden md:inline text-accent/30 text-lg select-none">|</span>
              <span className="whitespace-nowrap">Teaching Assistant @ Concordia</span>
              <span className="hidden md:inline text-accent/30 text-lg select-none">|</span>
              <span className="whitespace-nowrap">Robotics Researcher @ CUARL</span>
              <span className="hidden md:inline text-accent/30 text-lg select-none">|</span>
              <span className="whitespace-nowrap">Team Lead @ Mimic Robotics</span>
            </div> */}
          </motion.div>
        </div>

        {/* 1. Career Path Diagram - Scrollable on mobile, edge to edge on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="hidden md:block w-full mb-12 md:mb-16 mt-8 md:mt-12 relative -mx-4 md:-mx-8"
        >
          <div className="relative overflow-x-auto md:overflow-hidden z-20 group scrollbar-hide">
            <Image 
              src="/images/about/career_path.png" 
              alt="Engineering Career Path Diagram" 
              width={1920} 
              height={200} 
              className="min-w-[800px] md:min-w-0 md:w-full h-auto transition-transform duration-500"
              priority
            />
          </div>
        </motion.div>

        {/* 2. Image and Overlapping Text Grid */}
        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 max-w-7xl mx-auto items-start relative px-2 sm:px-4">
          
          {/* Left: Profile Photo Column - not sticky on mobile */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 flex flex-col items-center lg:items-start xl:sticky xl:top-20 z-10 xl:-mt-12"
          >
            <GlowWrapper 
              preset="card" 
              borderRadius={200} 
              spread={160} 
              innerBleed={300}
              mouseIntensity={1.0} 
              showHighlight={false}
              className="rounded-full animate-blob cursor-pointer"
            >
              <Link 
                href="/about"
                className="block relative w-[180px] h-[180px] sm:w-[280px] sm:h-[280px] md:w-[300px] md:h-[300px] lg:w-[320px] lg:h-[320px] xl:w-[380px] xl:h-[380px] 2xl:w-[420px] 2xl:h-[420px]"
                onMouseEnter={() => {
                  setIsHovering(true);
                  playFlickerSound();
                }}
                onMouseLeave={() => {
                  setIsHovering(false);
                  stopFlickerSound();
                }}
              >
                {/* Profile image container with jellyfish animation */}
                <div className="absolute inset-0 animate-blob overflow-hidden border-4 border-accent/20 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/1 to-transparent z-10" />
                  <Image
                    src={FLICKER_IMAGES[currentImageIndex]}
                    alt="Achal Patel"
                    fill
                    className="object-cover scale-110"
                    priority
                  />
                </div>

                {/* Floating accent rings */}
                <div className="absolute inset-[-10px] animate-blob border-2 border-accent/10 pointer-events-none" 
                     style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
                <div className="absolute inset-[-20px] animate-blob border border-accent/5 pointer-events-none" 
                     style={{ animationDuration: '30s' }} />
              </Link>
            </GlowWrapper>


          </motion.div>

          {/* Right: Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 flex flex-col space-y-8"
          >
            {/* 1. Overlapping Quote Row - only overlap on xl+ screens */}
            <div className="relative z-20 xl:-ml-32 xl:mt-0 xl:pr-4">
              <p 
                className="text-sm sm:text-lg md:text-xl xl:text-2xl text-foreground font-display font-bold leading-tight italic"
              >
                &ldquo;{content.quote}&rdquo;
              </p>
            </div>

            {/* 2. Standard Detail Row - No Overlap */}
            <div className="space-y-8 relative z-0">
              {/* Tech Highlights moved here - above strengths on the right */}
              <div className="space-y-3">
                <h5 className="text-[12px] uppercase tracking-[0.2em] text-accent/90 font-bold ml-1">
                  Technical Interests & Expertise
                </h5>
                <div className="flex flex-wrap gap-2 line-clamp-3 max-h-[7.5rem] overflow-hidden">
                  {content.technicalInterests.map((tech, index) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="px-1.5 py-0.5 sm:px-3 sm:py-1.5 text-[9px] sm:text-xs rounded-lg bg-background-secondary border border-border text-foreground-secondary hover:border-accent/50 hover:text-accent transition-all duration-200 cursor-default"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Action Buttons Section */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
                <GlowWrapper preset="button" className="rounded-lg w-auto">
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent hover:bg-accent-dark text-white font-medium rounded-lg transition-all duration-200 hover:shadow-glow-sm whitespace-nowrap"
                  >
                    Read My Full Story
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </GlowWrapper>

                <div className="flex items-center gap-3 sm:gap-4">
                  <a
                    href={siteConfig.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 sm:p-3 rounded-xl bg-background-secondary border border-border text-foreground-secondary hover:text-accent hover:border-accent/30 transition-all shadow-sm"
                    aria-label="GitHub"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href={siteConfig.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 sm:p-3 rounded-xl bg-background-secondary border border-border text-foreground-secondary hover:text-accent hover:border-accent/30 transition-all shadow-sm"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="p-2.5 sm:p-3 rounded-xl bg-background-secondary border border-border text-foreground-secondary hover:text-accent hover:border-accent/30 transition-all shadow-sm"
                    aria-label="Email"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

