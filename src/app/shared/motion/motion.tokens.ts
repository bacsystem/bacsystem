/**
 * Motion timing for the Motion library (seconds), mirroring the motion section of
 * src/styles/tokens.css so CSS and JS share one rhythm. Change both together.
 *
 *   --duration-fast 150ms · --duration-base 250ms · --duration-slow 500ms
 *   --duration-enter 700ms · --duration-slower 1600ms · --stagger-step 70ms
 *   --ease-out cubic-bezier(0.22, 1, 0.36, 1) · --ease-in-out cubic-bezier(0.45, 0, 0.55, 1)
 */
export const DURATION = {
  fast: 0.15,
  base: 0.25,
  slow: 0.5,
  enter: 0.7,
  slower: 1.6,
} as const;

/** One stagger step for every group on the page. */
export const STAGGER = 0.07;

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_IN_OUT: [number, number, number, number] = [0.45, 0, 0.55, 1];

/**
 * Springs, tuned by eye on the frame sheets:
 * - click: the teal piece snapping into the C (fast, one visible overshoot)
 * - settle: cards and markers arriving (soft, barely overshoots)
 * - follow: things that track the pointer (no overshoot, smooth catch-up)
 */
export const SPRING = {
  click: { type: 'spring', stiffness: 620, damping: 20, mass: 1 },
  settle: { type: 'spring', stiffness: 220, damping: 26, mass: 1 },
  follow: { type: 'spring', stiffness: 160, damping: 22, mass: 1 },
} as const;

/** Short text sharpens in from this blur (small radius, headings and eyebrows only). */
export const BLUR_FROM = 'blur(4px)';
export const BLUR_TO = 'blur(0px)';

/** Distance (px) cards and short lines rise from. */
export const RISE = 24;
export const RISE_SM = 12;
