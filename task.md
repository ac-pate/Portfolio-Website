# Task: Reverse Engineering Studio Lumio Effects

## User Request
Analyze visual and interactive effects on `https://studiolumio.com/` (Home, Works, Labs) and explain how to reproduce them using GSAP and CSS.

## Plan
1.  **Visual Analysis via Browser**:
    *   Visit `https://studiolumio.com/`.
    *   Observe "Heavy Film Grain/Noise".
    *   Observe "Grainy Glow Hover" on text.
    *   Navigate to `https://studiolumio.com/works` to observe "Glitch Hover".
    *   Navigate to `https://studiolumio.com/labs` to observe scroll effects (parallax, transitions).
2.  **Technical Breakdown**:
    *   Deduce implementation (CSS filters, SVG filters, Canvas, WebGL, etc.).
    *   Map observations to GSAP patterns (ScrollTrigger, Timelines).
3.  **Deliverable**:
    *   Detailed report with Observed Behavior, Likely Implementation, and GSAP Code Snippets for each effect.

## Todo
- [ ] Visit Home Page and analyze Grain & Text Hover <!-- id: 0 -->
- [ ] Visit Work Page and analyze Glitch Hover <!-- id: 1 -->
- [ ] Visit Labs Page and analyze Scroll Effects <!-- id: 2 -->
- [ ] Synthesize findings and write report <!-- id: 3 -->
