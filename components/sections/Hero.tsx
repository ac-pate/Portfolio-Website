'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, FileText, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '@/lib/config';
import GlowWrapper from '@/components/ui/GlowWrapper';
import { useSound } from '@/components/providers/SoundProvider';

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
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
    const { fadeBackgroundAudio } = useSound();

    // Lazy load video - only start loading when component is mounted
    useEffect(() => {
        // Small delay to let page render first
        const timer = setTimeout(() => {
            setShouldLoadVideo(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // Optimize video playback
    useEffect(() => {
        if (!videoRef.current || !shouldLoadVideo) return;

        const video = videoRef.current;
        
        // Set video quality/performance hints
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        
        // Handle video loading
        const handleCanPlay = () => {
            setVideoLoaded(true);
            // Request video frame for smoother playback
            if (video.requestVideoFrameCallback) {
                video.requestVideoFrameCallback(() => {
                    // Video is ready
                });
            }
        };

        video.addEventListener('canplay', handleCanPlay);
        
        // Set initial video volume to 0 (will be controlled by GSAP)
        video.volume = 0;
        
        // Try to play video
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Autoplay was prevented, will play on user interaction
            });
        }

        return () => {
            video.removeEventListener('canplay', handleCanPlay);
        };
    }, [shouldLoadVideo]);

    useEffect(() => {
        if (!heroRef.current || !stickyRef.current || !contentRef.current || !videoRef.current || !overlayRef.current) return;

        // Find navbar element
        const navbarElement = document.querySelector('[data-navbar="main"]') as HTMLElement;
        if (!navbarElement) {
            // If navbar not found, continue without navbar animation
            console.warn('Navbar element not found for animation');
        }

        // Set initial states via GSAP (not className) to ensure GSAP has full control
        gsap.set(videoRef.current, { opacity: 0.5 }); // Start at 50% opacity
        gsap.set(overlayRef.current, { opacity: 1 }); // Start overlay visible
        gsap.set(contentRef.current, { opacity: 1 }); // Start content visible
        if (navbarElement) {
            gsap.set(navbarElement, { opacity: 1 }); // Start navbar visible
        }

        // Total scroll distance is 400vh (height of heroRef)
        // This provides 3 phases:
        // 1. 0-100vh: Hero Text Wipes Out + Overlay fades
        // 2. 100-300vh: Video Hold (Video stays at full opacity for 200vh, Navbar fades out)
        // 3. 300-400vh: About Me Wipes In (covers the video, Navbar fades back in)
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

        // Phase 1: Text Disappears + Overlay fades (0 to 100vh = 1/4 of the 400vh scroll)
        tl.to(contentRef.current, {
            opacity: 0,
            y: -100,
            duration: 1, 
            ease: 'none',
        }, 0);
        
        // Fade out overlay in parallel with text
        tl.to(overlayRef.current, {
            opacity: 0,
            duration: 1,
            ease: 'none',
        }, 0);

        // Phase 2: Video goes to full opacity and stays, Navbar fades out (100vh to 300vh = 200vh = 1/2 of the scroll)
        // Start slightly before Phase 1 ends for smoothness
        tl.to(videoRef.current, {
            opacity: 1,
            duration: 2, // 200vh duration (half of 400vh total)
            ease: 'power2.inOut'
        }, "-=0.5");
        
        // Fade out navbar during Phase 2 (starts at beginning of Phase 2)
        if (navbarElement) {
            tl.to(navbarElement, {
                opacity: 0,
                duration: 0.5, // Quick fade out at start of Phase 2
                ease: 'power2.inOut'
            }, "1"); // Start at position 1 (beginning of Phase 2)
        }
        
        // Audio transitions at Phase 2 start (position 1)
        // Fade out background audio and fade in video audio
        tl.add(() => {
            if (videoRef.current) {
                // Fade out background audio
                fadeBackgroundAudio(0, 500);
                
                // Unmute and fade in video audio
                videoRef.current.muted = false;
                const videoVolume = { value: 0 };
                gsap.to(videoVolume, {
                    value: 1,
                    duration: 1,
                    ease: 'power2.inOut',
                    onUpdate: () => {
                        if (videoRef.current) {
                            videoRef.current.volume = videoVolume.value;
                        }
                    }
                });
            }
        }, "1");

        // Phase 3: Transition, Navbar fades back in (300vh to 400vh = 100vh = 1/4 of the scroll)
        // This phase is where the next section (starting at 400vh) moves from 100vh to 0vh
        tl.to({}, { duration: 1 });
        
        // Fade in navbar at start of Phase 3
        if (navbarElement) {
            tl.to(navbarElement, {
                opacity: 1,
                duration: 0.5, // Quick fade in at start of Phase 3
                ease: 'power2.inOut'
            }, "<"); // Start at the same time as Phase 3 (when next section starts wiping up)
        }
        
        // Audio transitions at Phase 3 start (position 3)
        // Fade out video audio and fade in background audio
        tl.add(() => {
            if (videoRef.current) {
                // Fade out video audio
                const videoVolume = { value: videoRef.current.volume };
                gsap.to(videoVolume, {
                    value: 0,
                    duration: 0.5,
                    ease: 'power2.inOut',
                    onUpdate: () => {
                        if (videoRef.current) {
                            videoRef.current.volume = videoVolume.value;
                        }
                    },
                    onComplete: () => {
                        // Mute video after fade out
                        if (videoRef.current) {
                            videoRef.current.muted = true;
                        }
                    }
                });
                
                // Fade in background audio
                fadeBackgroundAudio(0.1, 500);
            }
        }, "<");

        return () => {
            if (tl.scrollTrigger) tl.scrollTrigger.kill();
            tl.kill();
        };
    }, [videoLoaded, fadeBackgroundAudio]); // Re-run when video loads to ensure refs are ready

    return (
        /* 
          HERO TRACK:
          Provides the scroll length for pinning. 
          Height is 400vh to accommodate text exit, video hold (200vh), and wipe entry.
          
          SCROLL DISTANCE CONTROL:
          - h-[400vh] on line 143 controls the total scroll distance
          - This creates a 400vh (4 viewport heights) scroll track
          - GSAP ScrollTrigger uses this height to determine animation phases
          - Phase 1: 100vh (text/overlay fade), Phase 2: 200vh (video at full opacity), Phase 3: 100vh (transition)
        */
        <section 
            ref={heroRef} 
            className="relative h-[400vh] w-full bg-black z-0"
            id="hero"
        >
            {/* 
                STICKY WRAPPER:
                Pinned for the entire duration of heroRef.
            */}
            <div ref={stickyRef} className="h-screen w-full overflow-hidden">
                {/* Video Background */}
                <div className="absolute inset-0 z-0">
                    {shouldLoadVideo ? (
                    <video
                        ref={videoRef}
                        className={`absolute inset-0 h-full w-full object-cover ${
                            videoLoaded ? '' : 'opacity-0'
                        }`}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata" // Only loads metadata, not full video
                        crossOrigin="anonymous" // Required for external video sources
                        poster="/images/hero/video-poster.jpg" // Show poster while loading (create this)
                        style={{
                            willChange: 'opacity, transform',
                            transform: 'translateZ(0)', // HW acceleration
                            objectFit: 'cover',
                            // Additional performance optimizations
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                        }}
                    >
                        {/* WebM format (better compression) - add if available */}
                        <source src="/videos/hero_bg_1_1080p.mp4" type="video/mp4" />
                    </video>
                    ) : (
                        // Placeholder while video loads
                        <div className="absolute inset-0 bg-gradient-to-br from-background via-background-secondary to-background" />
                    )}
                </div>

                {/* Dark Overlay for contrast (separate layer to animate out) */}
                <div 
                    ref={overlayRef}
                    className="absolute inset-0 z-[5] bg-gradient-to-b from-black/80 via-black/20 to-black pointer-events-none" />

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
