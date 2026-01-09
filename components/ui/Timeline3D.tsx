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
import { useTheme } from 'next-themes';
import { TimelineItem } from '@/lib/mdx';
import { sortTimelineItems, groupItemsByTerm, formatDateRange } from '@/lib/timeline';
import GlowWrapper from '@/components/ui/GlowWrapper';

interface Timeline3DProps {
  items: TimelineItem[];
  onToggleView: () => void;
}

// How long to keep the timeline pinned *after* the camera animation completes,
// before allowing the next section to wipe over.
const EXIT_HOLD_VH = 150;

// Lane configuration
const LANES = {
  project: { x: -2.5, parallaxSpeed: 1.0 },
  job: { x: 0, parallaxSpeed: 0.85 },
  education: { x: 0.5, parallaxSpeed: 0.85 },
  extracurricular: { x: 2.5, parallaxSpeed: 0.7 },
};

// ============================================
// ANIMATION CONFIGURATION VARIABLES
// ============================================
//
// ANIMATION PHASES:
// 1. APPROACH: Card starts small, blurred, far back → grows and sharpens as camera approaches
// 2. FOCUS: Card is at full size, sharp, fully visible (stays here for a while)
// 3. FADE OUT: Card stays same size but blurs dramatically and fades to opacity 0
//
// Cards in the same lane are spaced apart so the previous card has time to fade out
// before the next card comes into focus.
//
// ============================================

// Card spacing in Z-depth (increase for more space between cards in same lane)
const CARD_Z_SPACING = 50; // Distance between consecutive cards
const CAMERA_START_Z = 5; // Initial camera Z position

// Scroll speed control (increase to slow down animation)
// Scroll speed control (increase to slow down animation)
const SCROLL_DISTANCE_PER_CARD = 1000; // Pixels per card (higher = slower)
// Switch from vh to px to fix massive scroll height
const SCROLL_SCRUB_SPEED = 5.5; // Scroll smoothing (higher = more lag, smoother)

// Card starting properties (when far back, before coming into focus)
const CARD_START_SCALE = 0.01; // How small cards start (0.01 = 1% size - grow from a point)
const CARD_START_BLUR = 3; // Blur amount when card is far back (in pixels)
const CARD_START_OPACITY = 1.0; // Opacity stays solid (1.0 = no transparency, stars don't show through)

// Focus zone properties (when card is in focus)
const FOCUS_DISTANCE = 8; // Distance range where card is in focus (Z units)
const FOCUS_SCALE = 0.85; // Scale when card is in focus (1.0 = 100% size)
const FOCUS_BLUR = 0; // Blur when card is in focus (0 = sharp)
const FOCUS_OPACITY = 1.0; // Opacity when card is in focus (1.0 = fully visible)

// Focus hold properties (how long card stays in focus before zooming out)
// Card stays in focus for 25% of card spacing distance (quarter scroll) after passing camera
const FOCUS_HOLD_DISTANCE = CARD_Z_SPACING * 0.25; // Distance to hold in focus (Z units, positive value)

// Fade-out properties (after focus, when card zooms out and disappears)
const FADE_OUT_START_DISTANCE = -4; // When card moves behind camera, start fading (negative Z)
const FADE_OUT_RANGE = 10; // Range over which card fades out completely (Z units)
const FADE_OUT_MAX_BLUR = 25; // Maximum blur as card fades out (in pixels)
const FADE_OUT_EXPONENT = 2.5; // Exponential curve for fade-out (higher = faster fade)

// Zoom-out properties (how quickly card shrinks during fade-out)
const ZOOM_OUT_START_DISTANCE = -FOCUS_HOLD_DISTANCE; // Start zooming out after focus hold (negative Z)
const ZOOM_OUT_RANGE = 8; // Range over which card zooms out (Z units)
const ZOOM_OUT_MIN_SCALE = 2.3; // Minimum scale when fully zoomed out (0.3 = 30% size)
const ZOOM_OUT_EXPONENT = 2.0; // Exponential curve for zoom-out (higher = faster zoom)

// Approach properties (as card comes from far back toward focus)
const APPROACH_START_DISTANCE = 35; // Distance where card starts becoming visible (Z units)
const APPROACH_RANGE = 47; // Range over which card grows from small to focus (Z units: APPROACH_START to FOCUS)
const APPROACH_BLUR_DECAY = 12; // How quickly blur reduces as card approaches (matches CARD_START_BLUR)

// Visibility boundaries (cards beyond these distances are hidden)
const MAX_DISTANCE_BEHIND = 20; // Hide cards that are too far behind camera
const MAX_DISTANCE_AHEAD = 1000; // Hide cards that are too far ahead

// Starfield configuration (inspired by studiolumio.com/labs)
const STARFIELD_CONFIG = {
  count: 6000, // Number of stars
  depth: 300, // How far back stars extend (Z units)
  speed: 0.5, // Base speed multiplier for star movement
  twinkleSpeed: 100, // Speed of twinkling animation (lower = slower, softer blink)
  size: 0.35, // Base star size (reduced for smaller stars)
  color: 0xffffff, // Star color (white)
  opacity: 0.99, // Base star opacity
};

export function Timeline3D({ items, onToggleView }: Timeline3DProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [show3D, setShow3D] = useState(true);
  
  // Get theme for star color and star count
  const { theme, resolvedTheme } = useTheme();
  const isLightMode = resolvedTheme === 'light' || theme === 'light';
  const starColor = isLightMode ? 0x000000 : 0xffffff; // Black for light mode, white for dark mode
  const starCount = isLightMode ? STARFIELD_CONFIG.count * 3 : STARFIELD_CONFIG.count; // 3x more stars in light mode for visibility
  
  // Refs for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const starfieldRef = useRef<THREE.Points | null>(null);
  const starfieldTimeRef = useRef<number>(0); // For twinkling animation
  const starfieldDepthRef = useRef<number>(300); // Store dynamic starfield depth
  
  // Sort items by term (newest first - descending order: Summer 2025, Winter 2025, Fall 2025, etc.)
  const sortedItems = useMemo(() => sortTimelineItems(items, false), [items]);
  
  // Card positions calculated based on item order
  // ALL cards appear sequentially one at a time, regardless of lane
  // Each card is spaced apart so the previous card has time to fade out
  const cardPositions = useMemo(() => {
    return sortedItems.map((item, index) => {
      const lane = LANES[item.type as keyof typeof LANES] || LANES.project;
      
      // Sequential Z positioning: each card appears one after another
      // Cards go INTO the screen (negative Z)
      const z = -(index * CARD_Z_SPACING);
      
      return {
        x: lane.x,
        y: 0,
        z: z,
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

    // Calculate starfield depth to cover entire animation
    // Camera starts at CAMERA_START_Z and moves to CAMERA_START_Z - totalDepth
    // We need stars to extend from camera start position all the way to the end
    // CORRECTION: totalDepth is now calcualted to stop EXACTLY at the last card
    const lastCardZ = -((cardPositions.length - 1) * CARD_Z_SPACING);
    const totalDepth = Math.max(0, CAMERA_START_Z - lastCardZ);
    const cameraEndZ = CAMERA_START_Z - totalDepth;
    // Starfield should extend from slightly ahead of camera to well beyond the end
    // Add extra buffer to ensure stars are always available
    const starfieldDepth = Math.max(STARFIELD_CONFIG.depth, Math.abs(cameraEndZ) + 200);
    starfieldDepthRef.current = starfieldDepth;
    
    // Create starfield particle system
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    const starOpacities = new Float32Array(starCount);
    const starDepths = new Float32Array(starCount); // Store Z depth for parallax
    const starPhases = new Float32Array(starCount); // Random phase offset for each star
    const starFrequencies = new Float32Array(starCount); // Random twinkle frequency
    
    // Initialize stars with random positions across the full animation range
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      
      // Random X, Y positions (spread across viewport)
      starPositions[i3] = (Math.random() - 0.5) * 20; // X
      starPositions[i3 + 1] = (Math.random() - 0.5) * 20; // Y
      
      // Random Z depth (negative, going into screen) - cover entire animation range
      const depth = -Math.random() * starfieldDepth;
      starPositions[i3 + 2] = depth;
      starDepths[i] = depth;
      
      // Random size variation
      starSizes[i] = STARFIELD_CONFIG.size * (0.5 + Math.random() * 0.5);
      
      // Random opacity for twinkling variation
      starOpacities[i] = STARFIELD_CONFIG.opacity * (0.6 + Math.random() * 0.4);
      
      // Random phase offset (0 to 2π) for unique twinkle timing
      starPhases[i] = Math.random() * Math.PI * 2;
      
      // Random frequency multiplier (0.3 to 1.5) for varied twinkle speeds
      starFrequencies[i] = 0.3 + Math.random() * 1.2;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
    starGeometry.setAttribute('opacity', new THREE.BufferAttribute(starOpacities, 1));
    starGeometry.setAttribute('depth', new THREE.BufferAttribute(starDepths, 1));
    starGeometry.setAttribute('phase', new THREE.BufferAttribute(starPhases, 1));
    starGeometry.setAttribute('frequency', new THREE.BufferAttribute(starFrequencies, 1));
    
    // Custom shader material for stars with twinkling
    // Convert star color from hex to RGB (0-1 range) for initial uniform
    const starColorR = ((starColor >> 16) & 0xff) / 255;
    const starColorG = ((starColor >> 8) & 0xff) / 255;
    const starColorB = (starColor & 0xff) / 255;
    
    const starMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        cameraZ: { value: CAMERA_START_Z },
        scrollProgress: { value: 0 },
        starfieldDepth: { value: starfieldDepth }, // Pass dynamic depth to shader
        twinkleSpeed: { value: STARFIELD_CONFIG.twinkleSpeed }, // Pass twinkle speed to shader
        starColor: { value: new THREE.Vector3(starColorR, starColorG, starColorB) }, // Initialize star color
      },
      vertexShader: `
        attribute float size;
        attribute float opacity;
        attribute float depth;
        attribute float phase;
        attribute float frequency;
        
        varying float vOpacity;
        varying float vDepth;
        
        uniform float time;
        uniform float cameraZ;
        uniform float scrollProgress;
        uniform float starfieldDepth;
        uniform float twinkleSpeed;
        
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Parallax effect: stars move toward camera based on scroll
          // Closer stars (less negative Z) move faster - light speed effect
          float depthNormalized = depth / -starfieldDepth;
          float parallaxSpeed = 1.0 + depthNormalized;
          float zOffset = scrollProgress * parallaxSpeed * 0.5;
          mvPosition.z += zOffset;
          
          // Natural twinkling: each star has unique phase and frequency
          // Full dim to bright cycle like real stars
          float twinkleTime = time * 0.03 * frequency; // Slower speed for gentle twinkling
          float twinkleWave = sin(twinkleTime + phase);
          // Full range: 0.0 (completely dim) to 1.0 (full brightness)
          float twinkle = twinkleWave * 0.5 + 0.5;
          vOpacity = opacity * twinkle;
          vDepth = depth;
          
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vOpacity;
        varying float vDepth;
        
        uniform vec3 starColor;
        
        void main() {
          // Create circular star shape
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          // Soft edge with slight glow
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          alpha *= vOpacity;
          
          // Use star color from uniform (black for light mode, white for dark mode)
          vec3 color = starColor;
          
          // Slight color variation based on depth (only in dark mode)
          if (starColor.r > 0.5) { // Only if white (dark mode)
            if (vDepth > -50.0) {
              // Closer stars slightly brighter
              color = vec3(1.0, 1.0, 0.95);
            }
          }
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    
    const stars = new THREE.Points(starGeometry, starMaterial);
    starfieldRef.current = stars;
    scene.add(stars);

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
      
      // Update starfield twinkling (slow increment for gentle, natural twinkling)
      if (starfieldRef.current) {
        starfieldTimeRef.current += 1.0; // Increment steadily, shader uses 0.002 multiplier for slow effect
        (starfieldRef.current.material as THREE.ShaderMaterial).uniforms.time.value = starfieldTimeRef.current;
      }
      
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
  }, [isMounted, cardPositions]); // Don't include starColor - update it separately

  // Update star color when theme changes (without recreating the entire scene)
  useEffect(() => {
    if (!starfieldRef.current) return;
    
    const starMaterial = starfieldRef.current.material as THREE.ShaderMaterial;
    if (!starMaterial || !starMaterial.uniforms?.starColor) return;
    
    // Convert star color from hex to RGB (0-1 range)
    const starColorR = ((starColor >> 16) & 0xff) / 255;
    const starColorG = ((starColor >> 8) & 0xff) / 255;
    const starColorB = (starColor & 0xff) / 255;
    
    // Update the uniform
    starMaterial.uniforms.starColor.value.set(starColorR, starColorG, starColorB);
  }, [starColor]); // Only update when starColor changes

  // Setup GSAP ScrollTrigger for camera movement AND HTML overlay syncing
  useEffect(() => {
    if (!isMounted || !wrapperRef.current || !containerRef.current || !cameraRef.current || cardPositions.length === 0) return;

    let ctx: any;

    const setupScrollAnimation = async () => {
      try {
        const { default: gsap } = await import('gsap');
        const { default: ScrollTrigger } = await import('gsap/ScrollTrigger');
        
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          const wrapper = wrapperRef.current;
          const container = containerRef.current;
          const camera = cameraRef.current;
          if (!wrapper || !container || !camera) return;

          // CORRECTION: Calculate depth to stop EXACTLY at the last card
          const lastCardZ = -((cardPositions.length - 1) * CARD_Z_SPACING);
          const totalDepth = Math.max(0, CAMERA_START_Z - lastCardZ);
          // FIX: Use (length - 1) because the first card is already visible at start
          // We only need scroll for transitions BETWEEN cards, not for each card
          // SWITCH to PX: Calculate in pixels, not vh
          const scrollDistancePx = Math.max(1, cardPositions.length - 1) * SCROLL_DISTANCE_PER_CARD;
          
          // Convert EXIT_HOLD from vh to px
          const viewportHeight = container.clientHeight;
          const exitHoldPx = (EXIT_HOLD_VH / 100) * viewportHeight;
          const totalScrollPx = scrollDistancePx + exitHoldPx;
          
          const fadeStart = scrollDistancePx / totalScrollPx;

          ScrollTrigger.create({
            trigger: wrapper,
            start: 'top top',
            end: `+=${totalScrollPx}px`,
            pin: container,
            pinSpacing: false,
            scrub: SCROLL_SCRUB_SPEED,
            onEnter: () => setIsActive(true),
            onLeave: () => setIsActive(false),
            onEnterBack: () => setIsActive(true),
            onLeaveBack: () => setIsActive(false),
            onUpdate: (self: any) => {
              // While in the EXIT_HOLD_VH window, freeze the camera on the final frame.
              const progress = self.progress;
              const cameraProgress = Math.min(progress / fadeStart, 1);
              const targetZ = CAMERA_START_Z - (cameraProgress * totalDepth);
              camera.position.z = targetZ;

              // Fade out during the exit hold so the next section can wipe over.
              if (progress >= fadeStart) {
                const fadeT = Math.min(Math.max((progress - fadeStart) / (1 - fadeStart), 0), 1);
                container.style.opacity = String(1 - fadeT);
              } else if (container.style.opacity !== '1') {
                container.style.opacity = '1';
              }
              
              // Update starfield scroll progress for parallax effect
              if (starfieldRef.current) {
                const starMaterial = starfieldRef.current.material as THREE.ShaderMaterial;
                starMaterial.uniforms.scrollProgress.value = cameraProgress;
                starMaterial.uniforms.cameraZ.value = targetZ;
                
                // Update star color based on theme (only if uniform exists)
                if (starMaterial.uniforms.starColor?.value) {
                  const currentIsLightMode = resolvedTheme === 'light' || theme === 'light';
                  const currentStarColor = currentIsLightMode ? 0x000000 : 0xffffff;
                  const starColorR = ((currentStarColor >> 16) & 0xff) / 255;
                  const starColorG = ((currentStarColor >> 8) & 0xff) / 255;
                  const starColorB = (currentStarColor & 0xff) / 255;
                  starMaterial.uniforms.starColor.value.set(starColorR, starColorG, starColorB);
                }
                
                // Recycle stars bidirectionally (infinite starfield for scrolling up/down)
                const starGeometry = starfieldRef.current.geometry;
                const positions = starGeometry.attributes.position.array as Float32Array;
                const depths = starGeometry.attributes.depth.array as Float32Array;
                const phases = starGeometry.attributes.phase.array as Float32Array;
                const frequencies = starGeometry.attributes.frequency.array as Float32Array;
                
                // Define visible range around camera
                const visibleRangeAhead = 100; // Stars visible this far ahead
                const visibleRangeBehind = starfieldDepthRef.current + 50; // Stars visible this far behind
                
                for (let i = 0; i < STARFIELD_CONFIG.count; i++) {
                  const i3 = i * 3;
                  const currentZ = positions[i3 + 2];
                  const distanceFromCamera = currentZ - targetZ; // Positive = ahead, negative = behind
                  
                  let needsRecycle = false;
                  let newZ = currentZ;
                  
                  // If star has passed the camera too much (scrolling down/zooming in)
                  if (distanceFromCamera > visibleRangeAhead) {
                    // Reset to a position behind the camera (distribute across full depth)
                    newZ = targetZ - Math.random() * starfieldDepthRef.current;
                    needsRecycle = true;
                  }
                  // If star is too far behind camera (scrolling up/zooming out)
                  else if (distanceFromCamera < -visibleRangeBehind) {
                    // Reset to a position ahead of the camera (distribute across visible range)
                    newZ = targetZ + Math.random() * visibleRangeAhead;
                    needsRecycle = true;
                  }
                  
                  if (needsRecycle) {
                    positions[i3 + 2] = newZ;
                    depths[i] = newZ;
                    
                    // Randomize X, Y for variation
                    positions[i3] = (Math.random() - 0.5) * 20;
                    positions[i3 + 1] = (Math.random() - 0.5) * 20;
                    
                    // Randomize phase and frequency for new stars
                    phases[i] = Math.random() * Math.PI * 2;
                    frequencies[i] = 0.3 + Math.random() * 1.2;
                  }
                }
                
                starGeometry.attributes.position.needsUpdate = true;
                starGeometry.attributes.depth.needsUpdate = true;
                starGeometry.attributes.phase.needsUpdate = true;
                starGeometry.attributes.frequency.needsUpdate = true;
              }

              // DIRECT DOM CONTROL: Update HTML cards directly for 60fps performance
              // This bypasses React render loop for smooth animation
              cardPositions.forEach((pos, i) => {
                const cardEl = cardRefs.current[i];
                if (!cardEl) return;

                const distanceZ = targetZ - pos.z; // Positive = card ahead, Negative = card behind
                
                // Hide cards that are too far away
                if (distanceZ < -MAX_DISTANCE_BEHIND || distanceZ > MAX_DISTANCE_AHEAD) {
                   if (cardEl.style.visibility !== 'hidden') {
                     cardEl.style.opacity = '0';
                     cardEl.style.visibility = 'hidden';
                   }
                   return;
                }

                // ============================================
                // PHASE 1: APPROACH (card coming from far back toward focus)
                // Card starts small, blurred, and grows as it approaches
                // ============================================
                let scale = FOCUS_SCALE;
                let blur = FOCUS_BLUR;
                let opacity = FOCUS_OPACITY;
                
                if (distanceZ > FOCUS_DISTANCE) {
                  // Card is ahead (positive distanceZ) but not yet in focus
                  const approachProgress = Math.min(
                    (distanceZ - FOCUS_DISTANCE) / APPROACH_RANGE,
                    1
                  );
                  const clampedProgress = Math.max(0, approachProgress);
                  
                  // Scale: grow from small to full size
                  scale = CARD_START_SCALE + (FOCUS_SCALE - CARD_START_SCALE) * (1 - clampedProgress);
                  
                  // Blur: reduce from high blur to sharp
                  blur = CARD_START_BLUR * clampedProgress;
                  
                  // Opacity: increase from low to full
                  opacity = CARD_START_OPACITY + (FOCUS_OPACITY - CARD_START_OPACITY) * (1 - clampedProgress);
                }
                
                // ============================================
                // PHASE 2: FOCUS (card is in focus zone)
                // Card is at full size, sharp, fully visible
                // ============================================
                else if (distanceZ >= 0 && distanceZ <= FOCUS_DISTANCE) {
                  scale = FOCUS_SCALE;
                  blur = FOCUS_BLUR;
                  opacity = FOCUS_OPACITY;
                }
                
                // ============================================
                // PHASE 3: FOCUS HOLD (card behind camera, staying in focus)
                // Card stays at focus size for a quarter scroll
                // ============================================
                else if (distanceZ < 0 && distanceZ >= ZOOM_OUT_START_DISTANCE) {
                  // Card just passed focus, hold it at focus scale for quarter scroll
                  scale = FOCUS_SCALE;
                  blur = FOCUS_BLUR;
                  opacity = FOCUS_OPACITY;
                }
                
                // ============================================
                // PHASE 4: ZOOM OUT + FADE OUT (card zooming out while fading)
                // Card zooms out quickly while also blurring and fading
                // ============================================
                else if (distanceZ < ZOOM_OUT_START_DISTANCE) {
                  // Calculate zoom-out progress
                  const zoomOutProgress = Math.min(
                    Math.abs(distanceZ - ZOOM_OUT_START_DISTANCE) / ZOOM_OUT_RANGE,
                    1
                  );
                  
                  // Calculate fade-out progress (starts from ZOOM_OUT_START_DISTANCE)
                  const fadeOutStart = ZOOM_OUT_START_DISTANCE;
                  const fadeOutProgress = Math.min(
                    Math.abs(distanceZ - fadeOutStart) / FADE_OUT_RANGE,
                    1
                  );
                  
                  // Scale: zoom out from focus to minimum scale
                  const scaleProgress = Math.pow(zoomOutProgress, ZOOM_OUT_EXPONENT);
                  scale = FOCUS_SCALE - (FOCUS_SCALE - ZOOM_OUT_MIN_SCALE) * scaleProgress;
                  
                  // Blur: increases dramatically
                  blur = Math.pow(fadeOutProgress, 2) * FADE_OUT_MAX_BLUR;
                  
                  // Opacity: decreases exponentially to 0
                  opacity = Math.max(0, FOCUS_OPACITY - Math.pow(fadeOutProgress, FADE_OUT_EXPONENT));
                }
                
                // ============================================
                // PERSPECTIVE CONVERGENCE (vanishing point effect)
                // Far cards appear at CENTER (vanishing point), travel in straight rays to lanes
                // Like stars - perfectly LINEAR trajectory, no curves
                // ============================================
                // Calculate perspective factor based on distance
                const maxPerspectiveDistance = APPROACH_START_DISTANCE + FOCUS_DISTANCE;
                const perspectiveProgress = Math.max(0, Math.min(1, distanceZ / maxPerspectiveDistance));
                
                // LINEAR interpolation (no exponent) for straight trajectories
                // When far (perspectiveProgress = 1): cards at CENTER (X = 0)
                // When close (perspectiveProgress = 0): cards at lane position
                const convergenceFactor = perspectiveProgress; // Linear, not exponential!
                const targetX = pos.x * 10; // Lane offset from center (negative = left, positive = right)
                const convergenceX = targetX * (1 - convergenceFactor); // Interpolate from center (0) to lane
                const xPercent = 50 + convergenceX; // 50% = center
                
                const zIndex = 100 - i;

                // Apply styles directly to DOM element
                cardEl.style.visibility = 'visible';
                cardEl.style.opacity = String(opacity);
                // Important: Use translate3d for hardware acceleration
                cardEl.style.transform = `translate(-50%, -50%) scale(${scale})`;
                cardEl.style.filter = `blur(${blur}px)`;
                cardEl.style.zIndex = String(zIndex);
                cardEl.style.left = `${xPercent}%`;
                // Add ring focus class manually if needed, or rely on React state for the ring (less critical if delayed)
                // Card is "focused" when in focus zone OR during focus hold period
                const isFocusedNow = (distanceZ >= 0 && distanceZ <= FOCUS_DISTANCE) || 
                                     (distanceZ < 0 && distanceZ >= ZOOM_OUT_START_DISTANCE);
                if (isFocusedNow) {
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

  // Get term info for indicator (newest first - descending order)
  const termGroups = useMemo(() => groupItemsByTerm(sortedItems, false), [sortedItems]);
  const termKeys = useMemo(() => {
    const keys = Array.from(termGroups.keys());
    // Sort in descending order (newest first) - top should be most recent
    return keys.sort((a, b) => {
      // Parse term string using calendar chronology (e.g., "Fall 2025" -> [2025, 11])
      const parseTerm = (termStr: string): [number, number] => {
        const parts = termStr.trim().split(' ');
        const season = parts[0]; // "Fall", "Winter", or "Summer"
        const year = parseInt(parts[1] || '0', 10);
        // Map to representative calendar months: Winter=2, Summer=7, Fall=11
        const seasonToMonth: Record<string, number> = { Winter: 2, Summer: 7, Fall: 11 };
        return [year, seasonToMonth[season] || 0];
      };

      const [aYear, aMonth] = parseTerm(a);
      const [bYear, bMonth] = parseTerm(b);

      // Compare years first (descending - newer years first)
      if (aYear !== bYear) {
        return bYear - aYear; // Descending: 2025 comes before 2024
      }

      // Then compare months (descending: Fall(11) > Summer(7) > Winter(2))
      return bMonth - aMonth; // Descending: Fall comes before Summer comes before Winter
    });
  }, [termGroups]);

  if (!isMounted || sortedItems.length === 0) {
    return <div className="min-h-screen" />;
  }

  // FIX: Use (length - 1) because the first card is already visible at start
  // SWITCH to PX unit for style height
  const scrollDistancePx = Math.max(1, sortedItems.length - 1) * SCROLL_DISTANCE_PER_CARD; 
  // We can't know absolute px height here easily for the style tag without window calc,
  // but we can estimate or use a large vh equivalent if needed, 
  // OR just calculate it assuming standard viewport or use a direct pixel value.
  // Better approach: use calc() with vh for the hold part
  // total = pixels + 100vh (exit hold)
  const totalHeightStyle = `calc(${scrollDistancePx}px + ${EXIT_HOLD_VH}vh)`;

  return (
    // SAFETY WRAPPER: Essential for GSAP ScrollTrigger + React
    // This div is never touched by GSAP, giving React a stable handle to unmount.
    // The inner div (containerRef) gets wrapped/pinned by GSAP.
    <div ref={wrapperRef} className="relative w-full" style={{ height: totalHeightStyle }}> 
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
      <div className="absolute top-20 md:top-44 lg:top-48 left-0 right-0 flex justify-center gap-24 md:gap-36 lg:gap-48 px-8 z-20 pointer-events-none">
        <span className="relative text-sm font-medium text-muted uppercase tracking-[0.15em] pb-2">
          Projects
          <span className="absolute bottom-0 left-0 right-0 h-px bg-blue-500 shadow-[0_0_6px_1px_rgba(59,130,246,0.6)]" />
        </span>
        <span className="relative text-sm font-medium text-muted uppercase tracking-[0.15em] pb-2">
          Experience
          <span className="absolute bottom-0 left-0 right-0 h-px bg-emerald-500 shadow-[0_0_6px_1px_rgba(16,185,129,0.6)]" />
        </span>
        <span className="relative text-sm font-medium text-muted uppercase tracking-[0.15em] pb-2">
          Activities
          <span className="absolute bottom-0 left-0 right-0 h-px bg-amber-500 shadow-[0_0_6px_1px_rgba(245,158,11,0.6)]" />
        </span>
      </div>

      {/* Timeline Scroll Indicator */}
      <TimelineIndicator
        termKeys={termKeys}
        currentIndex={currentIndex}
        items={sortedItems}
        isActive={isActive}
      />

      {/* Seek Bar with Counter */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-[calc(100%-200px)] max-w-4xl flex items-center gap-4 z-20">
        {/* Seek Bar Container */}
        <div 
          className="flex-1 h-1.5 bg-white/10 backdrop-blur-sm rounded-full cursor-pointer group relative overflow-visible"
          onClick={(e) => {
            // Calculate click position as percentage
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            const targetIndex = Math.floor(percentage * sortedItems.length);
            const clampedIndex = Math.max(0, Math.min(sortedItems.length - 1, targetIndex));
            
            // Calculate scroll position to reach this card
            const targetScrollProgress = clampedIndex / Math.max(1, sortedItems.length - 1);
            const scrollDistancePx = Math.max(1, sortedItems.length - 1) * SCROLL_DISTANCE_PER_CARD;
            const targetScroll = targetScrollProgress * scrollDistancePx;
            
            // Scroll to position
            if (wrapperRef.current) {
              const wrapperTop = wrapperRef.current.offsetTop;
              window.scrollTo({
                top: wrapperTop + targetScroll,
                behavior: 'smooth'
              });
            }
          }}
        >
          {/* Background Track */}
          <div className="absolute inset-0 bg-white/5 rounded-full" />
          
          {/* Item Markers */}
          {sortedItems.map((_, index) => (
            <div
              key={index}
              className="absolute top-1/2 -translate-y-1/2 w-px h-3 bg-white/20"
              style={{
                left: `${(index / (sortedItems.length - 1)) * 100}%`
              }}
            />
          ))}
          
          {/* Progress Bar (Accent Color) */}
          <div 
            className="absolute left-0 top-0 bottom-0 bg-accent shadow-[0_0_12px_2px_rgba(var(--accent-rgb),0.5)] transition-all duration-300 rounded-full"
            style={{
              width: `${((currentIndex + 1) / sortedItems.length) * 100}%`
            }}
          />
          
          {/* Hover Indicator */}
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
        </div>
        
        {/* Card Counter */}
        <div className="text-sm text-muted font-mono whitespace-nowrap">
          {String(currentIndex + 1).padStart(2, '0')} / {String(sortedItems.length).padStart(2, '0')}
        </div>
      </div>
      
      {/* View Toggle Button */}
      <div className="absolute top-24 right-8 z-50 overflow-visible">
        <GlowWrapper preset="button" className="rounded-full">
          <button
            onClick={onToggleView}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted hover:text-accent bg-background/50 backdrop-blur-sm border border-white/10 rounded-full transition-all"
          >
            <span>List View</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </button>
        </GlowWrapper>
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
  const dateRange = item.date ? formatDateRange(item.date, item.endDate) : '';
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
  // Get current item's term (using term property directly, not calculated from date)
  // NOTE: Date-based term calculation is not being used anymore
  const getCurrentTerm = () => {
    const item = items[currentIndex];
    if (!item) return '';
    return item.term || ''; // Use term property directly
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
              ${isCurrentTerm ? 'opacity-100' : 'opacity-99'}
            `}
          >
            <span
              className={`
                text-[10px] font-medium uppercase tracking-[0.1em] transition-all duration-300
                ${isCurrentTerm ? 'text-accent' : 'text-white/50'}
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
