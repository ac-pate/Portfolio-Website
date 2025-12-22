"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";

/**
 * GLOW WRAPPER COMPONENT - DISPERSE STOCHASTIC BOUNDARY
 * 
 * GLOBAL TWEAKABLES:
 * You can change these constants to update the feel across the entire site.
 */
const GLOBAL_CONFIG = {
  // Speed of the static buzzing
  animationSpeed: 0.04,
  // Ease and duration for GSAP transitions
  transitionDuration: 0.4,
  // The color hex used if not overridden
  defaultColor: "#a3002a",
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
}

const PRESETS: Record<GlowPreset, PresetSettings> = {
  card: {
    spread: 100,
    innerBleed: 20,
    baseIntensity: 0.3,
    mouseIntensity: 0.8,
    falloffPower: 1.8,
  },
  button: {
    spread: 30,
    innerBleed: 8,
    baseIntensity: 0.4,
    mouseIntensity: 0.3,
    falloffPower: 2.2,
  },
  badge: {
    spread: 15,
    innerBleed: 4,
    baseIntensity: 0.5,
    mouseIntensity: 0.2,
    falloffPower: 2.5,
  },
  none: {
    spread: 0,
    innerBleed: 0,
    baseIntensity: 0,
    mouseIntensity: 0,
    falloffPower: 1,
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
  uniform vec4 uPadding; 
  uniform vec3 uColor;

  uniform float uSpread;
  uniform float uInnerBleed;
  uniform float uBaseIntensity;
  uniform float uMouseIntensity;
  uniform float uFalloffPower;

  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  void main() {
    vec2 fragCoord = vUv * uResolution;
    vec2 cardSize = uResolution - vec2(uPadding.y + uPadding.w, uPadding.x + uPadding.z);
    vec2 cardCenter = uResolution * 0.5;
    
    vec2 p = fragCoord;
    vec2 d = abs(p - cardCenter) - cardSize * 0.5;
    float distToEdge = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
    
    float outwardGlow = clamp(1.0 - (distToEdge / uSpread), 0.0, 1.0);
    float inwardBleed = clamp(1.0 + (distToEdge / uInnerBleed), 0.0, 1.0);
    float combinedMask = (distToEdge > 0.0) ? outwardGlow : inwardBleed;
    float density = pow(combinedMask, uFalloffPower);

    vec2 mousePx = uMouse * uResolution;
    float mouseDist = distance(fragCoord, mousePx);
    float mouseInfluence = smoothstep(180.0, 0.0, mouseDist);
    
    float probability = density * (uBaseIntensity + mouseInfluence * uMouseIntensity);

    float n = hash(fragCoord + mod(uTime, 10.0));
    float grain = step(1.0 - (probability * uIntensity), n);
    
    float bloom = pow(density, 8.0) * 0.3;
    
    float alpha = (grain + bloom) * uOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

interface GlowWrapperProps {
  children: React.ReactNode;
  className?: string;
  preset?: GlowPreset;
  color?: string;
  
  // Overrides
  spread?: number;
  innerBleed?: number;
  baseIntensity?: number;
  mouseIntensity?: number;
  falloffPower?: number;
}

export default function GlowWrapper({
  children,
  className = "",
  preset = "card",
  color = GLOBAL_CONFIG.defaultColor,
  ...overrides
}: GlowWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const currentMouseRef = useRef({ x: 0.5, y: 0.5 });

  // Merge preset with overrides
  const settings = {
    ...PRESETS[preset],
    ...Object.fromEntries(Object.entries(overrides).filter(([_, v]) => v !== undefined))
  };

  // Padding should be enough to contain the spread, plus a small buffer
  const PADDING = Math.max(40, (settings.spread || 0) + 20);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
    const threeColor = new THREE.Color(color);
    
    const uniforms = {
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uIntensity: { value: 0.0 },
      uTime: { value: 0.0 },
      uOpacity: { value: 0.0 },
      uResolution: { value: new THREE.Vector2(canvasWidth, canvasHeight) },
      uPadding: { value: new THREE.Vector4(PADDING, PADDING, PADDING, PADDING) },
      uColor: { value: new THREE.Vector3(threeColor.r, threeColor.g, threeColor.b) },
      uSpread: { value: settings.spread },
      uInnerBleed: { value: settings.innerBleed },
      uBaseIntensity: { value: settings.baseIntensity },
      uMouseIntensity: { value: settings.mouseIntensity },
      uFalloffPower: { value: settings.falloffPower },
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
      currentMouseRef.current.x += (mouseRef.current.x - currentMouseRef.current.x) * 0.12;
      currentMouseRef.current.y += (mouseRef.current.y - currentMouseRef.current.y) * 0.12;
      
      uniforms.uMouse.value.set(currentMouseRef.current.x, currentMouseRef.current.y);
      uniforms.uTime.value += GLOBAL_CONFIG.animationSpeed;

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !materialRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      const cw = w + PADDING * 2;
      const ch = h + PADDING * 2;
      rendererRef.current.setSize(cw, ch);
      materialRef.current.uniforms.uResolution.value.set(cw, ch);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

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
  }, [color, settings.spread, settings.innerBleed, settings.baseIntensity, settings.mouseIntensity, settings.falloffPower, PADDING]);

  const handleMouseEnter = () => {
    if (!materialRef.current) return;
    gsap.to(materialRef.current.uniforms.uOpacity, { value: 1.0, duration: GLOBAL_CONFIG.transitionDuration });
    gsap.to(materialRef.current.uniforms.uIntensity, { value: 1.0, duration: GLOBAL_CONFIG.transitionDuration });
  };

  const handleMouseLeave = () => {
    if (!materialRef.current) return;
    gsap.to(materialRef.current.uniforms.uOpacity, { value: 0.0, duration: GLOBAL_CONFIG.transitionDuration + 0.2 });
    gsap.to(materialRef.current.uniforms.uIntensity, { value: 0.0, duration: GLOBAL_CONFIG.transitionDuration + 0.2 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left - PADDING)) / (rect.width + PADDING * 2);
    const y = 1.0 - (e.clientY - (rect.top - PADDING)) / (rect.height + PADDING * 2);
    mouseRef.current = { x, y };
  };

  return (
    <div 
      ref={wrapperRef}
      className={`relative group transition-all duration-300 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* GLOW LAYER */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      />
      
      {/* SHARP BORDER HIGHLIGHT */}
      <div 
        className="absolute inset-0 rounded-[inherit] border border-transparent transition-colors duration-500 z-20 pointer-events-none shadow-[inset_0_0_0_1px_rgba(163,0,42,0.05)]"
        style={{ 
          borderColor: 'transparent',
        }}
        // Using a data attribute or class to handle hover via group-hover
      />
      <div className="absolute inset-0 rounded-[inherit] border border-transparent group-hover:border-accent-light/60 transition-colors duration-500 z-20 pointer-events-none" />

      {/* CONTENT */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
