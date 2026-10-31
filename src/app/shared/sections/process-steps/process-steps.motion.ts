import type { Choreography } from '../../directives/reveal-group.directive';
import type { MotionService } from '../../motion/motion.service';
import { clearStyles, settle } from '../../motion/choreo';
import { STAGGER } from '../../motion/motion.tokens';
import { all, hideFade, hideHeading, revealFade, revealHeading } from '../../motion/reveal';

const DESKTOP = '(min-width: 64em)';

/** The process line runs across on desktop and down on mobile: one source for hide, play and draw. */
const axisOf = (motion: MotionService) => (motion.matches(DESKTOP) ? 'scaleX' : 'scaleY');

/**
 * Process: heading first; then the connecting line is drawn by scroll progress (never backwards),
 * and each marker pops (spring, 0.8 → 1) when the line reaches it, its title and text fading up.
 */
export const PROCESS_REVEAL: Choreography = {
  hide: (el, motion) => {
    hideHeading(el);
    all(el, '.process__marker').forEach(m => {
      m.style.opacity = '0';
      m.style.transform = 'scale(0.8)';
    });
    hideFade(all(el, '.process__body'));
    all(el, '.process__link').forEach(l => (l.style.transform = `${axisOf(motion)}(0)`));
  },
  play: (el, motion) => {
    const { stops, next } = revealHeading(motion, el);
    const steps = all(el, '.process__step');
    const links = all(el, '.process__link');
    const popped = new Set<number>();
    let reached = 0;
    let cancelScroll: (() => void) | undefined;

    const pop = (i: number) => {
      popped.add(i);
      const marker = all(steps[i], '.process__marker');
      stops.push(settle(motion, marker, { y: 0, scale: 0.8 }), ...revealFade(motion, all(steps[i], '.process__body'), { delay: STAGGER }));
    };

    const draw = (progress: number) => {
      reached = Math.max(reached, progress);
      const along = reached * (steps.length - 1); // 0 at marker 01 … n-1 at the last marker
      const axis = axisOf(motion); // re-read: the layout may have crossed the breakpoint
      links.forEach((link, i) => (link.style.transform = `${axis}(${Math.min(Math.max(along - i, 0), 1)})`));
      steps.forEach((_, i) => along >= i - 0.02 && !popped.has(i) && pop(i));
      if (reached >= 1) {
        clearStyles(links, ['transform']);
        cancelScroll?.();
        cancelScroll = undefined;
      }
    };

    // The line starts as the heading settles (overlapping, not after it).
    const timer = setTimeout(() => {
      cancelScroll = motion.scroll(draw, { target: el.querySelector('.process__steps') ?? el, offset: ['start 85%', 'end 55%'] });
    }, next * 1000);
    stops.push({ stop: () => (clearTimeout(timer), cancelScroll?.()) });
    return stops;
  },
};
