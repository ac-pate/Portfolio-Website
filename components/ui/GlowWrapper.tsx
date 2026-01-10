"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useTheme } from "next-themes";
import { useSound } from "@/components/providers/SoundProvider";

/**
 * GLOW WRAPPER COMPONENT - DISPERSE STOCHASTIC BOUNDARY
 * 
 * GLOBAL TWEAKABLES:
 * You can change these constants to update the feel across the entire site.
 */
const GLOBAL_CONFIG = {
  // ========== COLORS ==========
  // The default glow color (can be overridden per component)
  // defaultGlowColor: "#a3002a",
  defaultGlowColor: "#a30036",
  // Light mode alternative color (automatically used when light mode is active)
  lightModeGlowColor: "#e71b47",
  // Border color on hover
  hoverBorderColor: "rgba(163, 0, 42, 0.6)", // accent-light/60
  // Subtle inner shadow color when not hovering
  insetShadowColor: "rgba(163, 0, 42, 0.05)",
  
  // ========== ANIMATION ==========
  // Speed of the static particle buzzing/grain animation
  animationSpeed: 0.04,
  // Duration for fade in/out transitions (seconds)
  transitionDuration: 0.4,
  // Extra duration added to fade out (makes it slightly slower)
  fadeOutDelay: 0.2,
  
  // ========== INTENSITY & FEEL ==========
  // Mouse tracking smoothness (0.01 = very smooth, 0.3 = snappy)
  mouseTrackingSpeed: 0.30,
  // Mouse influence radius in pixels
  mouseInfluenceRadius: 250,
  // Bloom intensity (soft glow at high density areas)
  bloomIntensity: 0.5,
  // Bloom falloff power (higher = tighter bloom)
  bloomPower: 4.0,
  // Hover particle size (controls the rendered particle/grain scale)
  // 0 = very fine particles, 0.5 = medium, 1 = large particles
  particleSize: 1,
  
  // ========== RENDERING ==========
  // Maximum pixel ratio (prevents too high res on retina displays)
  maxPixelRatio: 2,
  // Padding around component for glow overflow (auto-calculated by default)
  paddingMultiplier: 1.2, // multiply by spread to get padding
  minPadding: 40,
};

/**
 * PRESETS for different component sizes
 */
type GlowPreset = "card" | "button" | "badge" | "none";

interface PresetSettings {
  spread: number;
  innerBleed: number;
  baseIntensity: number;
  mouseIntensity: number;
  falloffPower: number;
  borderRadius: number; // in pixels
}

const PRESETS: Record<GlowPreset, PresetSettings> = {
  card: {
    spread: 100,
    innerBleed: 20,
    baseIntensity: 0.3,
    mouseIntensity: 0.8,
    falloffPower: 1.8,
    borderRadius: 12,
  },
  button: {
    spread: 30,
    innerBleed: 8,
    baseIntensity: 0.4,
    mouseIntensity: 0.3,
    falloffPower: 2.2,
    borderRadius: 8,
  },
  badge: {
    spread: 15,
    innerBleed: 4,
    baseIntensity: 0.5,
    mouseIntensity: 0.2,
    falloffPower: 2.5,
    borderRadius: 6,
  },
  none: {
    spread: 0,
    innerBleed: 0,
    baseIntensity: 0,
    mouseIntensity: 0,
    falloffPower: 1,
    borderRadius: 0,
  }
};

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec2 uMouse;
  uniform float uIntensity;
  uniform float uTime;
  uniform float uOpacity;
  uniform vec2 uResolution;
  uniform vec2 uCardSize; // Actual card dimensions without padding
  uniform vec3 uColor;

  uniform float uSpread;
  uniform float uInnerBleed;
  uniform float uBaseIntensity;
  uniform float uMouseIntensity;
  uniform float uFalloffPower;
  uniform float uBorderRadius;
  uniform float uMouseInfluenceRadius;
  uniform float uBloomIntensity;
  uniform float uBloomPower;
  uniform float uParticleSize;

  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // Signed distance function for rounded rectangle
  float sdRoundedBox(vec2 p, vec2 size, float radius) {
    vec2 d = abs(p) - size + radius;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - radius;
  }

  void main() {
    vec2 fragCoord = vUv * uResolution;
    vec2 cardCenter = uResolution * 0.5;
    
    vec2 p = fragCoord - cardCenter;
    // Use the actual card size passed as uniform
    float distToEdge = sdRoundedBox(p, uCardSize * 0.5, uBorderRadius);
    
    float outwardGlow = clamp(1.0 - (distToEdge / uSpread), 0.0, 1.0);
    float inwardBleed = clamp(1.0 + (distToEdge / uInnerBleed), 0.0, 1.0);
    float combinedMask = (distToEdge > 0.0) ? outwardGlow : inwardBleed;
    float density = pow(combinedMask, uFalloffPower);

    vec2 mousePx = uMouse * uResolution;
    float mouseDist = distance(fragCoord, mousePx);
    float mouseInfluence = smoothstep(uMouseInfluenceRadius, 0.0, mouseDist);
    
    float probability = density * (uBaseIntensity + mouseInfluence * uMouseIntensity);

    // Apply particle size scaling (1.0 + particleSize maps 0-1 range to 0.5-1.5 scale)
    float grainScale = 10.0 * uParticleSize;
    float n = hash((fragCoord / grainScale) + mod(uTime, 10.0));
    float grain = step(1.0 - (probability * uIntensity), n);
    
    float bloom = pow(density, uBloomPower) * uBloomIntensity;
    
    float alpha = (grain + bloom) * uOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

interface GlowWrapperProps {
  children: React.ReactNode;
  className?: string;
  preset?: GlowPreset;
  color?: string;
  showHighlight?: boolean;
  
  // Overrides
  spread?: number;
  innerBleed?: number;
  baseIntensity?: number;
  mouseIntensity?: number;
  falloffPower?: number;
  borderRadius?: number;
}

export default function GlowWrapper({
  children,
  className = "",
  preset = "card",
  color = GLOBAL_CONFIG.defaultGlowColor,
  showHighlight = true,
  ...overrides
}: GlowWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [borderRadiusCss, setBorderRadiusCss] = useState<string | undefined>(undefined);
  
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const currentMouseRef = useRef({ x: 0.5, y: 0.5 });

  const { theme, systemTheme } = useTheme();
  const { playHoverSound, stopHoverSound, playClickSound } = useSound();
  
  // Determine the actual theme (considering system theme)
  const actualTheme = theme === 'system' ? systemTheme : theme;
  const isLightMode = actualTheme === 'light';
  
  // Use light mode color if in light mode and using default color
  const effectiveColor = color === GLOBAL_CONFIG.defaultGlowColor && isLightMode 
    ? GLOBAL_CONFIG.lightModeGlowColor 
    : color;

  // Merge preset with overrides
  const settings = {
    ...PRESETS[preset],
    ...Object.fromEntries(Object.entries(overrides).filter(([_, v]) => v !== undefined))
  };

  // Padding should be enough to contain the spread, with configurable buffer
  const PADDING = Math.max(
    GLOBAL_CONFIG.minPadding, 
    (settings.spread || 0) * GLOBAL_CONFIG.paddingMultiplier
  );

  const getTargetElement = (): HTMLElement | null => {
    // Prefer the first child of the content wrapper (this is the element that
    // actually has the "glass" styles / border / rounded corners in most uses).
    const firstChild = contentRef.current?.firstElementChild as HTMLElement | null;
    return firstChild ?? wrapperRef.current;
  };

  const readBorderRadius = (): { css: string | undefined; px: number } => {
    const target = getTargetElement();
    if (!target) {
      return { css: undefined, px: settings.borderRadius };
    }

    const computedStyle = window.getComputedStyle(target);
    const css = computedStyle.borderRadius || undefined;
    const px = parseFloat(css || "");

    if (!isNaN(px) && px > 0) {
      return { css: css || `${settings.borderRadius}px`, px };
    }

    return { css: `${settings.borderRadius}px`, px: settings.borderRadius };
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const target = getTargetElement();
    if (!target) return;

    // Read actual border radius from the visual card element (not the wrapper)
    const { css: resolvedBorderRadiusCss, px: actualBorderRadiusPx } = readBorderRadius();
    setBorderRadiusCss(resolvedBorderRadiusCss);

    const targetRect = target.getBoundingClientRect();
    // Round up to avoid subpixel drift between DOM and shader math
    const width = Math.ceil(targetRect.width);
    const height = Math.ceil(targetRect.height);

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: false,
      powerPreference: "high-performance"
    });
    
    const canvasWidth = width + PADDING * 2;
    const canvasHeight = height + PADDING * 2;
    
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, GLOBAL_CONFIG.maxPixelRatio));
    renderer.setClearColor(0x000000, 0); 
    
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = `-${PADDING}px`;
    renderer.domElement.style.left = `-${PADDING}px`;
    renderer.domElement.style.width = `${canvasWidth}px`;
    renderer.domElement.style.height = `${canvasHeight}px`;
    renderer.domElement.style.pointerEvents = "none";
    renderer.domElement.style.zIndex = "0";
    
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const threeColor = new THREE.Color(effectiveColor);
    
    const uniforms = {
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uIntensity: { value: 0.0 },
      uTime: { value: 0.0 },
      uOpacity: { value: 0.0 },
      uResolution: { value: new THREE.Vector2(canvasWidth, canvasHeight) },
      uCardSize: { value: new THREE.Vector2(width, height) }, // Actual card size without padding
      uColor: { value: new THREE.Vector3(threeColor.r, threeColor.g, threeColor.b) },
      uSpread: { value: settings.spread },
      uInnerBleed: { value: settings.innerBleed },
      uBaseIntensity: { value: settings.baseIntensity },
      uMouseIntensity: { value: settings.mouseIntensity },
      uFalloffPower: { value: settings.falloffPower },
      uBorderRadius: { value: actualBorderRadiusPx },
      uMouseInfluenceRadius: { value: GLOBAL_CONFIG.mouseInfluenceRadius },
      uBloomIntensity: { value: GLOBAL_CONFIG.bloomIntensity },
      uBloomPower: { value: GLOBAL_CONFIG.bloomPower },
      uParticleSize: { value: GLOBAL_CONFIG.particleSize },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    materialRef.current = material;

    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    const animate = () => {
      currentMouseRef.current.x += (mouseRef.current.x - currentMouseRef.current.x) * GLOBAL_CONFIG.mouseTrackingSpeed;
      currentMouseRef.current.y += (mouseRef.current.y - currentMouseRef.current.y) * GLOBAL_CONFIG.mouseTrackingSpeed;
      
      uniforms.uMouse.value.set(currentMouseRef.current.x, currentMouseRef.current.y);
      uniforms.uTime.value += GLOBAL_CONFIG.animationSpeed;

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !materialRef.current) return;

      const resizeTarget = getTargetElement();
      if (!resizeTarget) return;

      // Re-read border radius on resize (in case it changed)
      const { css: updatedBorderRadiusCss, px: updatedBorderRadiusPx } = readBorderRadius();
      setBorderRadiusCss(updatedBorderRadiusCss);

      const r = resizeTarget.getBoundingClientRect();
      const w = Math.ceil(r.width);
      const h = Math.ceil(r.height);
      const cw = w + PADDING * 2;
      const ch = h + PADDING * 2;
      
      rendererRef.current.setSize(cw, ch);
      
      // Update resolution uniform (canvas size with padding)
      materialRef.current.uniforms.uResolution.value.set(cw, ch);
      
      // Update card size uniform (actual card dimensions without padding)
      materialRef.current.uniforms.uCardSize.value.set(w, h);
      
      // Update border radius uniform
      materialRef.current.uniforms.uBorderRadius.value = updatedBorderRadiusPx;
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(target);
    
    // Trigger initial resize to ensure everything is properly sized
    handleResize();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      resizeObserver.disconnect();
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      geometry.dispose();
      material.dispose();
    };
  }, [effectiveColor, settings.spread, settings.innerBleed, settings.baseIntensity, settings.mouseIntensity, settings.falloffPower, settings.borderRadius, PADDING]);

  const handleMouseEnter = () => {
    playHoverSound();
    if (!materialRef.current) return;
    gsap.to(materialRef.current.uniforms.uOpacity, { value: 1.0, duration: GLOBAL_CONFIG.transitionDuration });
    gsap.to(materialRef.current.uniforms.uIntensity, { value: 1.0, duration: GLOBAL_CONFIG.transitionDuration });
  };

  const handleMouseLeave = () => {
    stopHoverSound();
    if (!materialRef.current) return;
    gsap.to(materialRef.current.uniforms.uOpacity, { value: 0.0, duration: GLOBAL_CONFIG.transitionDuration + GLOBAL_CONFIG.fadeOutDelay });
    gsap.to(materialRef.current.uniforms.uIntensity, { value: 0.0, duration: GLOBAL_CONFIG.transitionDuration + GLOBAL_CONFIG.fadeOutDelay });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = getTargetElement();
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const x = (e.clientX - (rect.left - PADDING)) / (rect.width + PADDING * 2);
    const y = 1.0 - (e.clientY - (rect.top - PADDING)) / (rect.height + PADDING * 2);
    mouseRef.current = { x, y };
  };

  return (
    <div 
      ref={wrapperRef}
      className={`relative group transition-all duration-300 overflow-visible ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={playClickSound}
    >
      {/* GLOW LAYER */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 pointer-events-none overflow-visible"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      />
      
      {/* CONTENT */}
      <div ref={contentRef} className="relative z-10">
        {children}

        {/* SHARP BORDER HIGHLIGHT (attached to the actual content box) */}
        {showHighlight && (
          <div
            className="absolute inset-0 border border-transparent group-hover:border-[var(--hover-border-color)] transition-colors duration-500 pointer-events-none"
            style={{
              '--hover-border-color': GLOBAL_CONFIG.hoverBorderColor,
              borderRadius: borderRadiusCss,
              boxShadow: `inset 0 0 0 2px ${GLOBAL_CONFIG.insetShadowColor}`,
            } as React.CSSProperties}
          />
        )}
      </div>
    </div>
  );
}
