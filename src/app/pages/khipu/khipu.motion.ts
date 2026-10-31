import type { Choreography } from '../../shared/directives/reveal-group.directive';
import { HEADING_REVEAL } from '../../shared/motion/choreo';
import { RISE, STAGGER } from '../../shared/motion/motion.tokens';
import { all, hideFade, revealFade } from '../../shared/motion/reveal';

/*
 * khipu choreography, played with Motion by appRevealGroup (scroll entrances, once). The intro is on
 * screen at load and is never hidden; its invoice illustration runs its own loop. The contact band
 * brings its own.
 */

/** A step group: its "how often" label first, then the steps rise one after another. */
export const STEPS_REVEAL: Choreography = {
  hide: el => {
    hideFade(all(el, '.how__when'));
    hideFade(all(el, '.how__step'), RISE);
  },
  play: (el, motion) => [
    ...revealFade(motion, all(el, '.how__when')),
    ...revealFade(motion, all(el, '.how__step'), { delay: STAGGER * 2, rise: RISE, step: STAGGER * 2 }),
  ],
};

export const KHIPU_CHOREO = {
  heading: HEADING_REVEAL,
  steps: STEPS_REVEAL,
};
