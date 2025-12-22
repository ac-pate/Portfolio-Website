'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, FileText, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '@/lib/config';
import GlowWrapper from '@/components/ui/GlowWrapper';

// Ensure ScrollTrigger is registered
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
    const heroRef = useRef<HTMLDivElement>(null);
    const stickyRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!heroRef.current || !stickyRef.current || !contentRef.current) return;

        // Total scroll distance is 300vh (height of heroRef)
        // This provides 3 phases:
        // 1. 0-100vh: Hero Text Wipes Out
        // 2. 100-200vh: Video Hold (Nothing else visible)
        // 3. 200-300vh: About Me Wipes In (covers the video)
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: heroRef.current,
                start: 'top top',
                end: 'bottom top', 
                pin: stickyRef.current,
                pinSpacing: false, // Allows next section to overlap at the end of the track
                scrub: true,
                invalidateOnRefresh: true,
            },
        });

        // Phase 1: Text Disappears (0 to 1/3 of the 300vh scroll)
        tl.to([contentRef.current, overlayRef.current], {
            opacity: 0,
            y: (index) => index === 0 ? -100 : 0, // Only translate text, not full-screen overlay
            duration: 1, 
            ease: 'none',
        });

        // Phase 2: Video Hold (1/3 to 2/3 of the scroll)
        // Video stays visually frozen while user scrolls through empty space
        // Return video to full opacity during this phase
        tl.to(videoRef.current, {
            opacity: 1,
            duration: 1,
            ease: 'power2.inOut'
        }, "-=0.5"); // Start slightly before Phase 1 ends for smoothness

        // Phase 3: Transition (2/3 to 3/3)
        // This phase is where the next section (starting at 300vh) moves from 100vh to 0vh
        tl.to({}, { duration: 1 });

        return () => {
            if (tl.scrollTrigger) tl.scrollTrigger.kill();
            tl.kill();
        };
    }, []);

    return (
        /* 
          HERO TRACK:
          Provides the scroll length for pinning. 
          Height is 300vh to accommodate text exit, hold, and wipe entry.
        */
        <section 
            ref={heroRef} 
            className="relative h-[300vh] w-full bg-black z-0"
            id="hero"
        >
            {/* 
                STICKY WRAPPER:
                Pinned for the entire duration of heroRef.
            */}
            <div ref={stickyRef} className="h-screen w-full overflow-hidden">
                {/* Video Background */}
                <div className="absolute inset-0 z-0">
                    <video
                        ref={videoRef}
                        className="absolute inset-0 h-full w-full object-cover opacity-50"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        style={{
                            willChange: 'transform',
                            transform: 'translateZ(0)' // HW acceleration
                        }}
                    >
                        <source src="/videos/hero_bg_1.mp4" type="video/mp4" />
                    </video>
                </div>

                {/* Dark Overlay for contrast (separate layer to animate out) */}
                <div 
                    ref={overlayRef}
                    className="absolute inset-0 z-5 bg-gradient-to-b from-black/80 via-black/20 to-black pointer-events-none" 
                />

                {/* 
                    HERO TEXT CONTENT:
                    Animated by GSAP timeline.
                */}
                <div
                    ref={contentRef}
                    className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center pointer-events-none"
                >
                    <div className="max-w-4xl pointer-events-auto">
                        {/* Eyebrow */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="mb-8 flex justify-center"
                        >
                            <GlowWrapper preset="badge" className="rounded-full">
                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium backdrop-blur-md">
                                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                    Open to opportunities
                                </span>
                            </GlowWrapper>
                        </motion.div>

                        {/* Main heading */}
                        <h1 className="text-display-lg md:text-display-2xl font-display font-bold text-white mb-6 tracking-tight">
                            Hi, I&apos;m{' '}
                            <span className="relative inline-block">
                                <span className="text-accent-glow">
                                    {siteConfig.name.split(' ')[0]}
                                </span>
                                <motion.span
                                    className="absolute -bottom-2 left-0 right-0 h-1.5 bg-accent rounded-full shadow-glow-sm"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                />
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-2xl md:text-3xl text-white/90 mb-6 font-display"
                        >
                            {siteConfig.title}
                        </motion.p>

                        {/* Tagline */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-lg md:text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed"
                        >
                            {siteConfig.tagline}
                        </motion.p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <motion.div 
                                whileHover={{ scale: 1.05 }} 
                                whileTap={{ scale: 0.95 }}
                            >
                                <GlowWrapper preset="button" className="rounded-xl">
                                    <Link href="/projects" className="flex items-center gap-3 px-8 py-4 bg-accent text-white rounded-xl font-semibold text-lg hover:bg-accent/90 transition-all shadow-glow-sm">
                                        <FolderOpen className="w-6 h-6" />
                                        View Projects
                                    </Link>
                                </GlowWrapper>
                            </motion.div>

                            <motion.div 
                                whileHover={{ scale: 1.05 }} 
                                whileTap={{ scale: 0.95 }}
                            >
                                <GlowWrapper preset="button" className="rounded-xl">
                                    <Link href="/resume" className="flex items-center gap-3 px-8 py-4 bg-white/10 text-white rounded-xl font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm">
                                        <FileText className="w-6 h-6" />
                                        Resume
                                    </Link>
                                </GlowWrapper>
                            </motion.div>
                        </div>
                    </div>

                    {/* Bottom Down Arrow */}
                    <motion.div
                        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/40"
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <ArrowDown className="w-6 h-6 text-accent" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
