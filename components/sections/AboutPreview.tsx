'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { siteConfig } from '@/lib/config';
import GlowWrapper from '@/components/ui/GlowWrapper';
import { useSound } from '@/components/providers/SoundProvider';

const techHighlights = [
  'ROS2', 'Computer Vision', 'Machine Learning', 'Control Systems',
  'FPGA', 'Embedded Systems', 'Sensor Fusion'
];

// --- FEATURE TOGGLE & DATA ---
const ENABLE_IMAGE_FLICKER = true; 

const FLICKER_IMAGES = [
  "/images/hero/031058170035.jpg", // Original image
  "/images/uploads/DSCF3024.JPG",
  "/images/uploads/IMG_7789.JPG",
  "/images/uploads/DSCF3078.JPG",
  "/images/uploads/20240317-p1933148.jpg",
  "/images/uploads/IMG_7782.JPG",
  "/images/uploads/20240217_145723.jpg",
  "/images/uploads/DSCF2999.JPG",
  "/images/uploads/20250216_060005.jpg",
  "/images/uploads/IMG_7778.JPG",
  "/images/uploads/20241220_151604.jpg",
];

function InfographicSummary() {
  return (
    <div className="space-y-8 w-full">
      <div className="space-y-4">
        <p className="text-lg md:text-xl text-foreground font-medium leading-tight">
          &ldquo;I build intelligent machines that interacts with the physical world. Passionate about 
          bridging the gap between silicon and sensing.&rdquo;
        </p>
      </div>

      {/* Career Path Diagram */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/20 group">
        <Image 
          src="/images/about/career-path.png" 
          alt="Engineering Career Path Diagram" 
          width={800} 
          height={400} 
          className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]"
        />
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

export function AboutPreview() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const { playFlickerSound, stopFlickerSound } = useSound();

  // Flicker Logic
  useEffect(() => {
    if (!ENABLE_IMAGE_FLICKER || !isHovering) {
      // setCurrentImageIndex(0); // Reset to main image when not hovering
      return;
    }

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % FLICKER_IMAGES.length);
    }, 200); // Syncs with camera-flicker.mp3 burst frequency

    return () => clearInterval(interval);
  }, [isHovering]);

  return (
    <section 
      id="about" 
      className="sticky top-0 min-h-screen bg-background z-10 flex flex-col pb-20 mb-[60vh] overflow-hidden"
    >
      <div className="section-container w-full relative z-10 pt-12 lg:px-4">
        {/* Sticky Header - Follows dynamic section pattern */}
        <div className="sticky top-16 z-20 py-2 bg-background/80 backdrop-blur-md -mx-4 px-4 mb-10 border-b border-white/5">
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
            <div className="mt-2 flex justify-center items-center gap-x-4 gap-y-2 text-sm md:text-base text-foreground-secondary font-medium">
              <span className="whitespace-nowrap">4th Year Computer Engineering @ Concordia</span>
              <span className="hidden md:inline text-accent/30 text-lg select-none">|</span>
              <span className="whitespace-nowrap">Teaching Assistant @ Concordia</span>
              <span className="hidden md:inline text-accent/30 text-lg select-none">|</span>
              <span className="whitespace-nowrap">Robotics Researcher @ CUARL</span>
              <span className="hidden md:inline text-accent/30 text-lg select-none">|</span>
              <span className="whitespace-nowrap">Team Lead @ Mimic Robotics</span>
            </div>
          </motion.div>
        </div>

        {/* Flex layout: Image on left, content on right */}
        <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-14 max-w-6xl mx-auto">
          {/* Left: Profile Picture & Actions */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-shrink-0 flex flex-col items-center lg:items-start space-y-8 lg:sticky lg:top-48"
          >
            <GlowWrapper 
              preset="card" 
              borderRadius={210} 
              spread={150} 
              innerBleed={300}
              mouseIntensity={1.0} 
              showHighlight={false}
              className="rounded-full animate-blob cursor-pointer"
            >
              <Link 
                href="/about"
                className="block relative w-[340px] h-[340px] md:w-[400px] md:h-[400px]"
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

                {/* Floating accent rings that follow the blob */}
                <div className="absolute inset-[-10px] animate-blob border-2 border-accent/10 pointer-events-none" 
                     style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
                <div className="absolute inset-[-20px] animate-blob border border-accent/5 pointer-events-none" 
                     style={{ animationDuration: '30s' }} />
              </Link>
            </GlowWrapper>

            {/* Tech Highlights moved here - between image and buttons */}
            <div className="flex flex-wrap gap-2 max-w-[420px] justify-center lg:justify-start">
              {techHighlights.map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-background-secondary border border-border text-foreground-secondary hover:border-accent/50 hover:text-accent transition-all duration-200 cursor-default"
                >
                  {tech}
                </motion.span>
              ))}
            </div>

            {/* CTA & Social Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <GlowWrapper preset="button" className="rounded-lg">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-dark text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-glow-sm whitespace-nowrap"
                >
                  Read My Full Story
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </GlowWrapper>

              <div className="flex items-center gap-2">
                <a
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-background-secondary border border-border text-foreground-secondary hover:text-accent hover:border-accent/30 transition-all"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-background-secondary border border-border text-foreground-secondary hover:text-accent hover:border-accent/30 transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="p-2.5 rounded-lg bg-background-secondary border border-border text-foreground-secondary hover:text-accent hover:border-accent/30 transition-all"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right: Content - Transparentized */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 space-y-10"
          >
            {/* Infographic Summary */}
            <InfographicSummary />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

