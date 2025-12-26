/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Timeline3D } from '@/components/ui/Timeline3D';
import { TimelineStatic } from '@/components/ui/TimelineStatic';
import type { TimelineItem } from '@/lib/mdx';

// Ensure ScrollTrigger is registered
if (typeof window !== 'undefined') {
	gsap.registerPlugin(ScrollTrigger);
}

const EXIT_HOLD_VH = 100;

interface TimelineSectionProps {
	items: TimelineItem[];
}

export function TimelineSection({ items }: TimelineSectionProps) {
	const [variant, setVariant] = useState<'3d' | 'static'>('3d');

	// Static view fallback for reduced motion / small screens.
	useEffect(() => {
		if (typeof window === 'undefined') return;

		const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
		const smallScreen = window.matchMedia?.('(max-width: 768px)');

		const compute = () => {
			const shouldStatic = Boolean(reduceMotion?.matches || smallScreen?.matches);
			setVariant(shouldStatic ? 'static' : '3d');
		};

		compute();
		reduceMotion?.addEventListener?.('change', compute);
		smallScreen?.addEventListener?.('change', compute);
		return () => {
			reduceMotion?.removeEventListener?.('change', compute);
			smallScreen?.removeEventListener?.('change', compute);
		};
	}, []);

	// GSAP pin/wipe for the STATIC variant.
	const sectionRef = useRef<HTMLElement>(null);
	const stickyRef = useRef<HTMLDivElement>(null);
	const scrollContentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (variant !== 'static') return;
		if (!sectionRef.current || !stickyRef.current || !scrollContentRef.current) return;

		const sectionEl = sectionRef.current;
		const stickyEl = stickyRef.current;
		const contentEl = scrollContentRef.current;

		const setup = () => {
			const viewportH = window.innerHeight;
			const holdPx = (EXIT_HOLD_VH / 100) * viewportH;
			const contentH = contentEl.scrollHeight;
			const scrollable = Math.max(0, contentH - viewportH);
			const totalPx = scrollable + holdPx;
			const fadeStart = totalPx === 0 ? 0 : scrollable / totalPx;
			const fadeDur = totalPx === 0 ? 1 : holdPx / totalPx;

			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: sectionEl,
					start: 'top top',
					end: `+=${totalPx}`,
					pin: stickyEl,
					pinSpacing: false,
					scrub: true,
					invalidateOnRefresh: true,
				},
			});

			if (scrollable > 0) {
				tl.to(contentEl, {
					y: -scrollable,
					ease: 'none',
					duration: fadeStart,
				});
			}

			tl.to(
				stickyEl,
				{
					opacity: 0,
					ease: 'power1.in',
					duration: fadeDur,
				},
				fadeStart
			);

			return tl;
		};

		const tl = setup();
		const onRefresh = () => {
			tl.scrollTrigger?.kill();
			tl.kill();
			setup();
		};

		ScrollTrigger.addEventListener('refreshInit', onRefresh);
		ScrollTrigger.refresh();

		return () => {
			ScrollTrigger.removeEventListener('refreshInit', onRefresh);
			if (tl.scrollTrigger) tl.scrollTrigger.kill();
			tl.kill();
		};
	}, [variant, items]);

	return (
		<section
			ref={sectionRef}
			id="timeline"
			className="relative bg-background z-40"
		>
			{variant === '3d' ? (
				<div className="relative">
					<div className="pointer-events-none absolute top-0 left-0 right-0 z-30 px-4 sm:px-6 lg:px-8">
						<div className="max-w-7xl mx-auto pt-16">
							<SectionHeading
								title="Journey"
								subtitle="My path through education, work, and projects."
							/>
						</div>
					</div>
					<Timeline3D items={items} />
				</div>
			) : (
				<div ref={stickyRef} className="h-screen w-full overflow-hidden">
					<div ref={scrollContentRef} className="w-full">
						<TimelineStatic items={items} />
					</div>
				</div>
			)}
		</section>
	);
}

