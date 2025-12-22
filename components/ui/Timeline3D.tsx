/**
 * Timeline3D Component
 * 
 * TRUE 3D camera-movement timeline using Three.js + GSAP.
 * 
 * The CAMERA moves through 3D space toward stationary cards.
 * Cards are positioned at FIXED locations along the Z-axis.
 * 
 * Optimization:
 * - Uses direct DOM manipulation in GSAP onUpdate for 60fps smooth overlay updates
 * - Uses gsap.context for proper cleanup
 * - Syncs HTML overlays perfectly with Three.js camera movement
 */
'use client';

import { useEffect, useRef, useState, useMemo, forwardRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as THREE from 'three';
import { TimelineItem } from '@/lib/mdx';
import { sortTimelineItems, groupItemsByTerm, formatDateRange } from '@/lib/timeline';

interface Timeline3DProps {
  items: TimelineItem[];
}

// Lane configuration
const LANES = {
  project: { x: -3.5, parallaxSpeed: 1.0 },
  job: { x: 0, parallaxSpeed: 0.85 },
  education: { x: 0.5, parallaxSpeed: 0.85 },
  extracurricular: { x: 3.5, parallaxSpeed: 0.7 },
};

// Card spacing in Z-depth
const CARD_Z_SPACING = 12;
const CAMERA_START_Z = 5;

export function Timeline3D({ items }: Timeline3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Refs for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Sort items by start date
  const sortedItems = useMemo(() => sortTimelineItems(items, true), [items]);
  
  // Card positions calculated based on item order and lane
  const cardPositions = useMemo(() => {
    return sortedItems.map((item, index) => {
      const lane = LANES[item.type as keyof typeof LANES] || LANES.project;
      return {
        x: lane.x,
        y: 0,
        z: -(index * CARD_Z_SPACING), // Cards are positioned going INTO the screen (negative Z)
        parallaxSpeed: lane.parallaxSpeed,
        item,
        index,
      };
    });
  }, [sortedItems]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    if (!isMounted || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null; // Transparent background
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, CAMERA_START_Z);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 5, 10);
    scene.add(directionalLight);

    // Create card meshes (invisible - we use HTML overlay for actual content)
    // These are just for depth reference
    cardPositions.forEach((pos, i) => {
      const geometry = new THREE.PlaneGeometry(4, 3);
      const material = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(pos.x, pos.y, pos.z);
      mesh.userData = { index: i };
      scene.add(mesh);
    });

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      renderer.dispose();
      scene.clear();
    };
  }, [isMounted, cardPositions]);

  // Setup GSAP ScrollTrigger for camera movement AND HTML overlay syncing
  useEffect(() => {
    if (!isMounted || !containerRef.current || !cameraRef.current || cardPositions.length === 0) return;

    let ctx: any;

    const setupScrollAnimation = async () => {
      try {
        const { default: gsap } = await import('gsap');
        const { default: ScrollTrigger } = await import('gsap/ScrollTrigger');
        
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          const container = containerRef.current;
          const camera = cameraRef.current;
          if (!container || !camera) return;

          const totalDepth = cardPositions.length * CARD_Z_SPACING;
          const scrollDistance = cardPositions.length * 100; // 100vh per card

          ScrollTrigger.create({
            trigger: container,
            start: 'top top',
            end: `+=${scrollDistance}vh`,
            pin: true,
            pinSpacing: true,
            scrub: 1.5,
            onEnter: () => setIsActive(true),
            onLeave: () => setIsActive(false),
            onEnterBack: () => setIsActive(true),
            onLeaveBack: () => setIsActive(false),
            onUpdate: (self: any) => {
              // Move camera along Z-axis based on scroll progress
              const progress = self.progress;
              const targetZ = CAMERA_START_Z - (progress * totalDepth);
              camera.position.z = targetZ;

              // DIRECT DOM CONTROL: Update HTML cards directly for 60fps performance
              // This bypasses React render loop for smooth animation
              cardPositions.forEach((pos, i) => {
                const cardEl = cardRefs.current[i];
                if (!cardEl) return;

                const distanceZ = targetZ - pos.z;
                
                // Visibility optimization
                if (distanceZ < -5 || distanceZ > CARD_Z_SPACING * 3) {
                   if (cardEl.style.visibility !== 'hidden') {
                     cardEl.style.opacity = '0';
                     cardEl.style.visibility = 'hidden';
                   }
                   return;
                }

                // Calculate visual properties based on 3D distance
                const maxDistance = CARD_Z_SPACING * 3;
                const normalizedDistance = Math.min(distanceZ / maxDistance, 1);
                const focusDistance = CARD_Z_SPACING * 0.8;
                const isFocused = distanceZ > 0 && distanceZ < focusDistance;

                const scale = isFocused ? 1 : Math.max(0.3, 1 - normalizedDistance * 0.7);
                const opacity = isFocused ? 1 : Math.max(0.1, 1 - normalizedDistance);
                const zIndex = 100 - i;
                const xPercent = 50 + (pos.x * 10);

                // Apply styles directly to DOM element
                cardEl.style.visibility = 'visible';
                cardEl.style.opacity = String(opacity);
                // Important: Use translate3d for hardware acceleration
                cardEl.style.transform = `translate(-50%, -50%) scale(${scale})`;
                cardEl.style.zIndex = String(zIndex);
                cardEl.style.left = `${xPercent}%`;
                // Add ring focus class manually if needed, or rely on React state for the ring (less critical if delayed)
                if (isFocused) {
                  cardEl.classList.add('ring-2', 'ring-accent/50');
                } else {
                  cardEl.classList.remove('ring-2', 'ring-accent/50');
                }
              });

              // Update React state for UI indicators (less frequent)
              const currentCardIndex = Math.min(
                Math.floor(progress * cardPositions.length),
                cardPositions.length - 1
              );
              if (currentCardIndex !== currentIndex) {
                 setCurrentIndex(currentCardIndex);
              }
            },
          });
        }, containerRef); // Scope to container for easy cleanup

      } catch (error) {
        console.warn('Timeline3D scroll setup error:', error);
      }
    };

    setupScrollAnimation();

    return () => {
      if (ctx) ctx.revert();
    };
  }, [isMounted, cardPositions, currentIndex]);

  // Get term info for indicator
  const termGroups = useMemo(() => groupItemsByTerm(sortedItems), [sortedItems]);
  const termKeys = useMemo(() => Array.from(termGroups.keys()), [termGroups]);

  if (!isMounted || sortedItems.length === 0) {
    return <div className="min-h-screen" />;
  }

  return (
    // SAFETY WRAPPER: Essential for GSAP ScrollTrigger + React
    // This div is never touched by GSAP, giving React a stable handle to unmount.
    // The inner div (containerRef) gets wrapped/pinned by GSAP.
    <div className="relative w-full"> 
      <div
        ref={containerRef}
        className="relative w-full h-screen overflow-hidden bg-background"
      >
      {/* Three.js Canvas (background) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />

      {/* HTML Card Overlays */}
      <div
        ref={overlayRef}
        className="absolute inset-0"
        style={{ zIndex: 10 }}
      >
        {cardPositions.map((pos, index) => (
          <TimelineCard3D
            key={pos.item.slug || index}
            ref={(el) => { cardRefs.current[index] = el; }}
            item={pos.item}
            isFocused={index === currentIndex}
            // Initial styles (will be overridden by GSAP almost immediately)
            style={{
              opacity: 0, 
              visibility: 'hidden',
              left: `${50 + (pos.x * 10)}%`,
              top: '50%',
              transform: 'translate(-50%, -50%) scale(0.5)'
            }} 
          />
        ))}
      </div>

      {/* Lane Labels */}
      <div className="absolute top-8 left-0 right-0 flex justify-between px-8 z-20 pointer-events-none">
        <span className="text-xs font-medium text-muted uppercase tracking-[0.2em]">Projects</span>
        <span className="text-xs font-medium text-muted uppercase tracking-[0.2em]">Experience</span>
        <span className="text-xs font-medium text-muted uppercase tracking-[0.2em]">Activities</span>
      </div>

      {/* Timeline Scroll Indicator */}
      <TimelineIndicator
        termKeys={termKeys}
        currentIndex={currentIndex}
        items={sortedItems}
        isActive={isActive}
      />

      {/* Progress Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {sortedItems.slice(0, 10).map((_, i) => (
          <div
            key={i}
            className={`
              w-1.5 h-1.5 rounded-full transition-all duration-300
              ${i === currentIndex ? 'bg-accent w-6' : 'bg-muted/40'}
            `}
          />
        ))}
        {sortedItems.length > 10 && (
          <span className="text-xs text-muted">+{sortedItems.length - 10}</span>
        )}
      </div>

      {/* Card Counter */}
      <div className="absolute bottom-8 right-8 text-sm text-muted font-mono z-20">
        {String(currentIndex + 1).padStart(2, '0')} / {String(sortedItems.length).padStart(2, '0')}
      </div>
    </div>
  </div>
  );
}

/**
 * TimelineCard3D - Individual card in the 3D space
 * Wrapped in forwardRef to allow direct DOM manipulation for performance
 */
interface TimelineCard3DProps {
  item: TimelineItem;
  style: React.CSSProperties;
  isFocused: boolean;
}

// ForwardRef is crucial for the performance optimization!
const TimelineCard3D = forwardRef<HTMLAnchorElement, TimelineCard3DProps>(({ item, style, isFocused }, ref) => {
  const dateRange = formatDateRange(item.date, item.endDate);
  const link = item.link || '#';

  const typeColors: Record<string, string> = {
    project: 'from-blue-500/80 to-blue-600/80',
    job: 'from-emerald-500/80 to-emerald-600/80',
    education: 'from-violet-500/80 to-violet-600/80',
    extracurricular: 'from-amber-500/80 to-amber-600/80',
  };

  const typeLabels: Record<string, string> = {
    project: 'Project',
    job: 'Work',
    education: 'Education',
    extracurricular: 'Activity',
  };

  return (
    <Link
      ref={ref}
      href={link}
      className={`
        absolute w-[min(80vw,600px)] aspect-[16/10] rounded-2xl overflow-hidden
        transition-none ease-out group
        ${isFocused ? 'ring-2 ring-accent/50' : ''}
      `}
      style={{
        ...style,
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        // Transition removed here to allow GSAP to drive it smoothly
        // We only transition hover effects
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 bg-background-secondary">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-background-secondary to-background flex items-center justify-center">
            <span className="text-6xl font-display font-bold text-accent/20">
              {item.title.charAt(0)}
            </span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
      </div>

      {/* Type Accent Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${typeColors[item.type] || 'from-gray-500/80 to-gray-600/80'}`} />

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        {/* Type Badge */}
        <span className="absolute top-4 right-4 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white/80 bg-white/10 backdrop-blur-sm rounded-full">
          {typeLabels[item.type] || item.type}
        </span>

        {/* Date */}
        <span className="text-xs font-medium text-white/50 uppercase tracking-[0.15em] mb-1">
          {dateRange}
        </span>

        {/* Title */}
        <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2 group-hover:text-accent transition-colors">
          {item.title}
        </h3>

        {/* Subtitle */}
        <p className="text-sm text-white/60 mb-3 line-clamp-2">
          {item.subtitle}
        </p>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[10px] font-medium text-white/70 bg-white/10 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
});

TimelineCard3D.displayName = 'TimelineCard3D';

/**
 * TimelineIndicator - Shows term segments and current position
 */
interface TimelineIndicatorProps {
  termKeys: string[];
  currentIndex: number;
  items: TimelineItem[];
  isActive: boolean;
}

function TimelineIndicator({ termKeys, currentIndex, items, isActive }: TimelineIndicatorProps) {
  // Get current item's term
  const getCurrentTerm = () => {
    const item = items[currentIndex];
    if (!item) return '';
    const date = new Date(item.date);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    if (month >= 9 && month <= 12) return `Fall ${year}`;
    if (month >= 1 && month <= 4) return `Winter ${year}`;
    return `Summer ${year}`;
  };

  const currentTerm = getCurrentTerm();

  return (
    <div
      className={`
        fixed right-6 top-1/2 -translate-y-1/2 z-50
        flex flex-col items-end gap-2
        transition-all duration-500
        ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}
      `}
    >
      {termKeys.map((termKey) => {
        const isCurrentTerm = termKey === currentTerm;

        return (
          <div
            key={termKey}
            className={`
              flex items-center gap-2 transition-all duration-300
              ${isCurrentTerm ? 'opacity-100' : 'opacity-30'}
            `}
          >
            <span
              className={`
                text-[9px] font-medium uppercase tracking-[0.1em] transition-all duration-300
                ${isCurrentTerm ? 'text-accent' : 'text-muted'}
              `}
            >
              {termKey}
            </span>
            <div
              className={`
                w-1.5 h-1.5 rounded-full transition-all duration-300
                ${isCurrentTerm ? 'bg-accent scale-150' : 'bg-muted/40'}
              `}
            />
          </div>
        );
      })}
    </div>
  );
}

export default Timeline3D;
