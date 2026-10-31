/**
 * Motion timing for the Motion library (seconds), mirroring the motion section of
 * src/styles/tokens.css so CSS and JS share one rhythm. Change both together.
 *
 *   --duration-fast 150ms · --duration-base 250ms · --duration-slow 500ms
 *   --duration-enter 700ms · --duration-slower 1600ms · --duration-failsafe 2500ms
 *   (the stagger step lives only here: every stagger is played by Motion)
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

/** Hero intro failsafe (s), mirrors --duration-failsafe: after this the CSS hold has revealed the hero itself. */
export const INTRO_FAILSAFE = 2.5;

/** As the hero scrolls away the brand mark recedes this far (never the text). */
export const SCROLL_AWAY = { scale: 0.94, y: -24, opacity: 0.6 } as const;

/** Product cards lean toward a fine pointer at most `max` degrees (CSS --tilt-perspective gives the depth). */
export const TILT = { max: 4 } as const;

/** A stat's counter starts when its rule has finished growing (ms after its group enters). */
export function countDelay(index: number): number {
  return Math.round((DURATION.enter + index * STAGGER) * 1000);
}

/**
 * Brand mark choreography (seconds; distances in SVG user units inside the 0.86-scaled group:
 * 1 unit is about 0.48px on screen at 1280, 0.25px at 360).
 */
export const MARK = {
  /** Starts a beat after the hero text, so the two overlap instead of competing. */
  delay: 0.2,
  draw: { duration: 0.8 },
  fill: { at: 0.45, duration: 0.45 },
  lineOut: { at: 0.95 },
  slot: { at: 0.3, duration: 0.4, opacity: 0.7 },
  /** The intro arc: from above and outside the composition to a slight overshoot. */
  arc: { at: 0.7, duration: 0.75, x: [100, 150, -6], y: [-480, -150, 6], rotate: [30, 14, -1.5], times: [0, 0.5, 1] },
  /** The click: scale from, slot pulse, the C's recoil (~3px on desktop). */
  click: { scale: 1.06, slotScale: 1.08, recoil: 6, recoilDuration: 0.4 },
  /** The echo slides out of the C into its offset (the x/y of its <use>), then breathes. */
  echo: { offset: 48, after: 0.15, breath: 6, breathDuration: 6 },
  /** The docking cycle: rest, then lift out, a short arc around, back to the overshoot. */
  cycle: {
    rest: 5.1,
    duration: 1.9,
    x: [0, -12, 110, 160, -6],
    y: [0, -80, -210, -30, 6],
    rotate: [0, -4, 14, 22, -1.5],
    times: [0, 0.14, 0.45, 0.72, 1],
  },
} as const;
