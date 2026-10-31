import type { Choreography } from '../../directives/reveal-group.directive';
import type { MotionService } from '../../motion/motion.service';
import { clearStyles, settle } from '../../motion/choreo';
import { STAGGER, cascadeStep } from '../../motion/motion.tokens';
import { all, hideFade, hideHeading, revealFade, revealHeading } from '../../motion/reveal';

const DESKTOP = '(min-width: 64em)';

/** The process line runs across on desktop and down on mobile: one source for hide, play and draw. */
const axisOf = (motion: MotionService) => (motion.matches(DESKTOP) ? 'scaleX' : 'scaleY');

/**
 * Process: heading first; then the connecting line draws itself from marker to marker and each marker
 * pops (spring, 0.8 → 1) as the line reaches it, its title and text fading up. Timed, not tied to
 * scroll: driven by scroll progress, the last steps stayed invisible until the list was halfway up the
 * screen, so a visitor who stopped earlier (above all on phones) saw empty steps.
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
    const axis = axisOf(motion);
    // The whole run (line and markers) fits in one capped cascade, starting as the heading settles.
    const gap = cascadeStep(steps.length);

    steps.forEach((step, i) => {
      const at = next + i * gap;
      stops.push(
        settle(motion, all(step, '.process__marker'), { y: 0, scale: 0.8 }, at),
        ...revealFade(motion, all(step, '.process__body'), { delay: at + STAGGER }),
      );
    });
    links.forEach((link, i) => {
      const draw = motion.animate(link, { transform: [`${axis}(0)`, `${axis}(1)`] }, { duration: gap, ease: 'linear', delay: next + i * gap });
      draw.finished.then(() => clearStyles([link], ['transform']));
      stops.push(draw);
    });
    return stops;
  },
};
