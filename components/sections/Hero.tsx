'use client';

import { useEffect, useRef, useState, memo } from 'react';
import { motion } from 'framer-motion';
import { FileText, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSound } from '@/components/providers/SoundProvider';
import GlowWrapper from '@/components/ui/GlowWrapper';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const USE_YOUTUBE = true;
const YOUTUBE_ID = 'aq0iCOYylgI';

const VideoBackground = memo(({ videoLoaded, shouldLoadVideo, videoRef }: any) => {
    if (!shouldLoadVideo) return <div className="absolute inset-0 bg-black" />;
    return (
        <div className={`absolute inset-0 h-full w-full overflow-hidden transition-opacity duration-1000 ${videoLoaded ? 'opacity-50' : 'opacity-0'}`} ref={videoRef} style={{ willChange: 'opacity, transform', pointerEvents: 'none' }}>
            {USE_YOUTUBE ? (
                <div id="hero-youtube-video" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[102vw] h-[57.37vw] min-h-[102vh] min-w-[181.33vh]" />
            ) : (
                <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline onCanPlay={() => window.dispatchEvent(new CustomEvent('hero-video-ready'))}>
                    <source src="/videos/bg_1080p.mp4" type="video/mp4" />
                </video>
            )}
        </div>
    );
});

export function Hero() {
    const heroRef = useRef<HTMLDivElement>(null);
    const stickyRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<any>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const captionRef = useRef<HTMLDivElement>(null);
    const nameFirstRef = useRef<HTMLDivElement>(null);
    const nameSecondRef = useRef<HTMLDivElement>(null);
    const portfolioLabelRef = useRef<HTMLDivElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any>(null);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
    const [preloaderDone, setPreloaderDone] = useState(false);
    const { fadeBackgroundAudio, soundsEnabled } = useSound();
    const soundsEnabledRef = useRef(soundsEnabled);
    const currentPhaseRef = useRef(1);

    soundsEnabledRef.current = soundsEnabled;

    useEffect(() => {
        const handleReady = () => setVideoLoaded(true);
        const handlePreloaderDone = () => setPreloaderDone(true);
        
        window.addEventListener('hero-video-ready', handleReady);
        window.addEventListener('preloader-done', handlePreloaderDone);
        
        const timer = setTimeout(() => setShouldLoadVideo(true), 100);
        // Fallback if preloader event never fires
        const preloaderFallback = setTimeout(() => setPreloaderDone(true), 3000);
        
        return () => {
            window.removeEventListener('hero-video-ready', handleReady);
            window.removeEventListener('preloader-done', handlePreloaderDone);
            clearTimeout(timer);
            clearTimeout(preloaderFallback);
        };
    }, []);

    const syncAudio = (phase: number) => {
        currentPhaseRef.current = phase;
        const isVideoActive = phase === 2;
        const shouldBeAudible = soundsEnabledRef.current && isVideoActive;
        const musicVolume = isVideoActive ? 0 : 0.1;

        fadeBackgroundAudio(musicVolume, 500);

        if (USE_YOUTUBE && playerRef.current?.mute) {
            shouldBeAudible ? (playerRef.current.unMute(), playerRef.current.setVolume(100)) : playerRef.current.mute();
        } else if (videoRef.current) {
            videoRef.current.muted = !shouldBeAudible;
            videoRef.current.volume = shouldBeAudible ? 1 : 0;
        }
    };

    useEffect(() => syncAudio(currentPhaseRef.current), [soundsEnabled]);

    useEffect(() => {
        if (!USE_YOUTUBE || !shouldLoadVideo || !videoRef.current || playerRef.current) return;
        const initPlayer = () => {
            if (playerRef.current) return;
            playerRef.current = new window.YT.Player('hero-youtube-video', {
                videoId: YOUTUBE_ID,
                playerVars: { 
                    autoplay: 1, 
                    mute: 1, 
                    loop: 1, 
                    playlist: YOUTUBE_ID, 
                    controls: 0, 
                    showinfo: 0, 
                    rel: 0, 
                    modestbranding: 1, 
                    enablejsapi: 1, 
                    origin: window.location.origin,
                    vq: 'hd1080' // Request highest quality
                },
                events: {
                    'onReady': (event: any) => {
                        // Force highest available quality
                        const player = event.target;
                        const qualities = player.getAvailableQualityLevels?.() || [];
                        // Prefer hd1080, then hd720, then highres
                        const preferredQuality = qualities.includes('hd1080') ? 'hd1080' 
                            : qualities.includes('hd720') ? 'hd720' 
                            : qualities.includes('large') ? 'large' 
                            : 'default';
                        player.setPlaybackQuality(preferredQuality);
                        syncAudio(currentPhaseRef.current);
                    },
                    'onStateChange': (e: any) => {
                        if (e.data === 1) {
                            // When video starts playing, ensure quality
                            const player = e.target;
                            const currentQuality = player.getPlaybackQuality?.() || '';
                            const lowQualities = ['tiny', 'small', 'medium'];
                            if (lowQualities.includes(currentQuality)) {
                                player.setPlaybackQuality('hd720');
                            }
                            window.dispatchEvent(new CustomEvent('hero-video-ready'));
                        }
                    },
                    'onPlaybackQualityChange': (event: any) => {
                        // Enforce minimum 720p quality
                        const quality = event.data;
                        const lowQualities = ['tiny', 'small', 'medium'];
                        if (lowQualities.includes(quality)) {
                            event.target.setPlaybackQuality('hd720');
                        }
                    }
                }
            });
        };
        if (window.YT?.Player) initPlayer();
        else {
            if (!document.getElementById('yt-api')) {
                const t = document.createElement('script'); t.id = 'yt-api'; t.src = "https://www.youtube.com/iframe_api";
                document.head.appendChild(t);
            }
            window.onYouTubeIframeAPIReady = initPlayer;
        }
        return () => playerRef.current?.destroy?.();
    }, [shouldLoadVideo]);

    useEffect(() => {
        if (!heroRef.current || !stickyRef.current || !videoRef.current || !captionRef.current || !nameFirstRef.current || !nameSecondRef.current) return;
        const nav = document.querySelector('[data-navbar="main"]') as HTMLElement;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: heroRef.current, start: 'top top', end: 'bottom top', pin: stickyRef.current, scrub: true,
                onUpdate: (self) => {
                    const p = self.progress;
                    let newPhase = 1;
                    if (p > 0.2 && p < 0.75) newPhase = 2;
                    else if (p >= 0.75) newPhase = 3;
                    if (newPhase !== currentPhaseRef.current) syncAudio(newPhase);
                }
            }
        });

        // Phase 1 (0-0.5): Name transforms to outline - other elements stay put
        tl.to(nameFirstRef.current, { 
              webkitTextFillColor: 'transparent',
              webkitTextStroke: '3px rgba(255,255,255,0.9)',
              duration: 0.5 
          }, 0)
          .to(nameSecondRef.current, {
              webkitTextStroke: '4px rgba(255,255,255,1)',
              duration: 0.5
          }, 0);

        // Phase 2 (0.5-1.2): Other elements fade out FAST
        tl.to(portfolioLabelRef.current, { opacity: 0, y: -30, duration: 0.4 }, 0.5)
          .to(subtitleRef.current, { opacity: 0, y: 30, duration: 0.4 }, 0.5)
          .to(buttonsRef.current, { opacity: 0, y: 40, duration: 0.4 }, 0.5)
          .to(overlayRef.current, { opacity: 0, duration: 0.6 }, 0.5);

        // Phase 3 (1.2-2.0): Name fades out SLOWER (stays longer)
        tl.to(nameFirstRef.current, { opacity: 0, y: -60, duration: 0.8 }, 1.2)
          .to(nameSecondRef.current, { opacity: 0, y: -40, duration: 0.8 }, 1.2);

        // Video fades in throughout
        tl.to(videoRef.current, { opacity: 1, duration: 1.5 }, 0.8)
          .to(captionRef.current, { opacity: 1, duration: 0.8 }, 1.0)
          .to(captionRef.current.querySelector('p'), { color: '#a3002a', fontSize: '0.875rem', duration: 0.8 }, 1.0);

        if (nav) {
            tl.to(nav, { opacity: 0, duration: 0.4 }, 0.6)
              .to(nav, { opacity: 1, duration: 0.5 }, 2.5);
        }

        return () => { tl.scrollTrigger?.kill(); tl.kill(); };
    }, [videoLoaded]);

    return (
        <section ref={heroRef} className="relative h-[500vh] w-full bg-black" id="hero">
            <div ref={stickyRef} className="h-screen w-full overflow-hidden">
                <VideoBackground videoLoaded={videoLoaded} shouldLoadVideo={shouldLoadVideo} videoRef={videoRef} />
                
                {/* Vignette overlay - subtle, lets image breathe while ensuring text contrast */}
                <div ref={overlayRef} className="absolute inset-0 z-[5] pointer-events-none" style={{
                    background: 'radial-gradient(ellipse 80% 70% at 50% 45%, transparent 0%, rgba(0,0,0,0.6) 100%)'
                }} />
                
                {/* Video caption - stays with video layer */}
                <div 
                    ref={captionRef}
                    style={{ opacity: 0.1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[6] text-center pointer-events-none"
                >
                    <p className="text-white/70 text-[11px] md:text-xs font-['Poppins'] font-normal tracking-wide px-5 py-2 rounded-full backdrop-blur-md bg-black/40 whitespace-nowrap border border-white/10" 
                        style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                        Autonomous Bimanual Handover Using VLA model on LeRobot Framework — Mimic Robotics Capstone Project
                    </p>
                </div>

                {/* Main content - intentional vertical rhythm */}
                <div ref={contentRef} className="relative z-10 flex h-full flex-col items-center justify-between py-[12vh] md:py-[14vh] px-6 pointer-events-none">
                    
                    {/* Top: Undergraduate Portfolio label - accent color, pushed to top */}
                    <motion.div 
                        ref={portfolioLabelRef}
                        initial={{ opacity: 0, y: -10 }} 
                        animate={preloaderDone ? { opacity: 1, y: 0 } : {}} 
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="pointer-events-none"
                    >
                        <span 
                            className="text-accent text-sm md:text-base lg:text-lg font-['Poppins'] font-bold tracking-[0.25em] uppercase"
                            style={{
                                textShadow: '0 0 15px rgba(var(--accent-rgb), 1), 0 0 30px rgba(var(--accent-rgb), 0.7), 0 0 45px rgba(var(--accent-rgb), 0.4)'
                            }}
                        >
                            Undergraduate Portfolio
                        </span>
                    </motion.div>

                    {/* Center: Name - dominant focal point with generous whitespace */}
                    <div className="flex flex-col items-center pointer-events-none -mt-4">
                        {/* ACHAL - Solid white, establishes weight */}
                        <div className="overflow-hidden pr-[0.15em]" ref={nameFirstRef}>
                            <motion.h1 
                                className="text-[15vw] md:text-[12vw] lg:text-[11vw] font-['Poppins'] font-black italic leading-[0.9] tracking-[-0.02em] flex text-white pr-[0.05em]"
                            >
                                {'ACHAL'.split('').map((letter, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ y: '110%', opacity: 0 }}
                                        animate={preloaderDone ? { y: 0, opacity: 1 } : {}}
                                        transition={{ 
                                            duration: 0.7, 
                                            delay: 0.2 + i * 0.05,
                                            ease: [0.33, 1, 0.68, 1]
                                        }}
                                        className="inline-block"
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </motion.h1>
                        </div>
                        
                        {/* PATEL - Thick hollow outline, creates hierarchy contrast */}
                        <div ref={nameSecondRef} className="overflow-hidden -mt-[1.5vw] pr-[0.1em]">
                            <motion.h1 
                                className="text-[15vw] md:text-[12vw] lg:text-[11vw] font-['Poppins'] font-black italic leading-[0.9] tracking-[-0.02em] flex pr-[0.05em]"
                                style={{
                                    WebkitTextStroke: '3px rgba(255,255,255,0.9)',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                {'PATEL'.split('').map((letter, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ y: '110%', opacity: 0 }}
                                        animate={preloaderDone ? { y: 0, opacity: 1 } : {}}
                                        transition={{ 
                                            duration: 0.7, 
                                            delay: 0.45 + i * 0.05,
                                            ease: [0.33, 1, 0.68, 1]
                                        }}
                                        className="inline-block"
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </motion.h1>
                        </div>

                        {/* Subtitle - single clean line, slightly lower, increased weight */}
                        <motion.p 
                            ref={subtitleRef}
                            initial={{ opacity: 0, y: 15 }} 
                            animate={preloaderDone ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.85 }}
                            className="mt-8 md:mt-10 text-sm md:text-base lg:text-lg text-white/80 font-['Poppins'] font-normal tracking-wide"
                            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
                        >
                            Robotics, Embedded Systems, Code That Moves
                        </motion.p>
                    </div>

                    {/* Bottom: Buttons - anchored, not floating */}
                    <motion.div 
                        ref={buttonsRef}
                        initial={{ opacity: 0 }} 
                        animate={preloaderDone ? { opacity: 1 } : {}}
                        transition={{ duration: 0.5, delay: 1 }}
                        className="flex items-center gap-6 pointer-events-auto"
                    >
                        {/* Projects - primary */}
                        <GlowWrapper preset="button" className="rounded-lg">
                            <Link
                                href="/projects"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent hover:bg-accent-dark text-white font-medium rounded-lg transition-all duration-200 hover:shadow-glow-sm whitespace-nowrap"
                            >
                                <FolderOpen className="w-4 h-4" />
                                View Projects
                            </Link>
                        </GlowWrapper>
                        
                        {/* Resume - secondary, translucent */}
                        <GlowWrapper preset="button" className="rounded-lg">
                            <Link
                                href="/resume"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-glow-sm whitespace-nowrap border border-white/20"
                            >
                                <FileText className="w-4 h-4" />
                                Resume
                            </Link>
                        </GlowWrapper>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
