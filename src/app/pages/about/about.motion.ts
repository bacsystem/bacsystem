import type { Choreography } from '../../shared/directives/reveal-group.directive';
import { HEADING_REVEAL, clearStyles } from '../../shared/motion/choreo';
import { DURATION, EASE_OUT, STAGGER } from '../../shared/motion/motion.tokens';
import { all, hideFade, revealFade } from '../../shared/motion/reveal';

/*
 * Nosotros choreography, played with Motion by appRevealGroup (scroll entrances, once).
 * Calm on purpose: headings line up, groups rise in one stagger step apart. The intro is on
 * screen at load and is never hidden. The contact band brings its own.
 */

/** Values: each top rule grows left to right, then its number, name and sentence fade up. */
export const VALUES_REVEAL: Choreography = {
  hide: el => {
    all(el, '.values__item').forEach(item => item.style.setProperty('--rule', '0'));
    hideFade(all(el, '.values__item > *'));
  },
  play: (el, motion) => {
    const items = all(el, '.values__item');
    const rules = motion.animate(items, { '--rule': [0, 1] }, { duration: DURATION.enter, ease: EASE_OUT, delay: motion.stagger(STAGGER) });
    rules.finished.then(() => clearStyles(items, ['--rule']));
    return [rules, ...revealFade(motion, all(el, '.values__item > *'), { delay: STAGGER * 2, step: STAGGER / 2 })];
  },
};

export const ABOUT_CHOREO = {
  heading: HEADING_REVEAL,
  values: VALUES_REVEAL,
};
