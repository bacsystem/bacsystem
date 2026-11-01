import type { Choreography } from '../directives/reveal-group.directive';
import type { MotionService, Stoppable } from './motion.service';
import { DURATION, EASE_OUT, RISE, SPRING } from './motion.tokens';
import { hideHeading, revealHeading } from './reveal';

/*
 * Choreographies and helpers shared by more than one page (played by appRevealGroup).
 * Page-specific ones live next to their page (home.motion.ts, about.motion.ts) or section.
 */

export function clearStyles(els: HTMLElement[], props: string[]): void {
  for (const el of els) for (const p of props) el.style.removeProperty(p);
}

/** A spring rise for a card-like block (opacity on a short tween so it never flickers). */
export function settle(
  motion: MotionService,
  els: HTMLElement[],
  from: { y?: number; scale?: number },
  delay: number | ReturnType<MotionService['stagger']> = 0,
): Stoppable {
  const fade = motion.animate(els, { opacity: [0, 1] }, { duration: DURATION.slow, ease: EASE_OUT, delay });
  const move = motion.animate(els, { y: [from.y ?? RISE, 0], scale: [from.scale ?? 1, 1] }, { ...SPRING.settle, delay });
  Promise.all([fade.finished, move.finished]).then(() => clearStyles(els, ['opacity', 'transform']));
  return { stop: () => (fade.stop(), move.stop()) };
}

/** Section heading: eyebrow, masked title lines, subtitle. */
export const HEADING_REVEAL: Choreography = {
  hide: el => hideHeading(el),
  play: (el, motion) => revealHeading(motion, el).stops,
};
