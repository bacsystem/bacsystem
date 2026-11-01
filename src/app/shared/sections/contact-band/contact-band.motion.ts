import type { Choreography } from '../../directives/reveal-group.directive';
import { STAGGER } from '../../motion/motion.tokens';
import { all, hideFade, hideWords, lines, revealFade, revealWords } from '../../motion/reveal';

/** Contact band: masked title lines, then the subtitle, then the actions. */
export const CONTACT_REVEAL: Choreography = {
  hide: el => {
    hideWords(all(el, '.contact__title .ui-word'));
    hideFade(all(el, '.contact__subtitle'));
    hideFade(all(el, '.contact__actions > *'));
  },
  play: (el, motion) => {
    const words = all(el, '.contact__title .ui-word');
    const subtitleAt = STAGGER * (lines(words).length + 1);
    return [
      ...revealWords(motion, words),
      ...revealFade(motion, all(el, '.contact__subtitle'), { delay: subtitleAt }),
      ...revealFade(motion, all(el, '.contact__actions > *'), { delay: subtitleAt + STAGGER * 1.5 }),
    ];
  },
};
