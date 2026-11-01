import type { Choreography } from '../../shared/directives/reveal-group.directive';
import type { Stoppable } from '../../shared/motion/motion.service';
import { clearStyles } from '../../shared/motion/choreo';
import { DURATION, EASE_OUT, RISE, STAGGER } from '../../shared/motion/motion.tokens';
import { all, hideFade, revealFade } from '../../shared/motion/reveal';

/*
 * Servicios choreography, played with Motion by appRevealGroup (scroll entrances, once).
 * Each service block is its own group, so blocks enter one by one as they reach the viewport.
 * The intro is on screen at load and is never hidden. The contact band brings its own.
 */

const SERVICE = {
  number: '.service__number',
  text: '.service__title, .service__summary',
  labels: '.service__label',
  items: '.service__item',
};

/** The number slides in from the side it sits on (from the right on flipped blocks). */
const slideFrom = (block: HTMLElement) => (block.classList.contains('service--flip') ? RISE : -RISE);

/**
 * Service block: the big number slides in, title and summary rise, then both lists come in together
 * (label, then its items). They used to chain, so "Qué recibes" sat empty until "Te sirve si" ended.
 */
export const SERVICE_REVEAL: Choreography = {
  hide: el => {
    all(el, SERVICE.number).forEach(n => {
      n.style.opacity = '0';
      n.style.transform = `translateX(${slideFrom(el)}px)`;
    });
    hideFade(all(el, SERVICE.text));
    hideFade(all(el, SERVICE.labels));
    hideFade(all(el, SERVICE.items));
  },
  play: (el, motion) => {
    const number = all(el, SERVICE.number);
    const slide = motion.animate(
      number,
      { opacity: [0, 1], transform: [`translateX(${slideFrom(el)}px)`, 'translateX(0px)'] },
      { duration: DURATION.enter, ease: EASE_OUT },
    );
    slide.finished.then(() => clearStyles(number, ['opacity', 'transform']));
    const stops: Stoppable[] = [slide, ...revealFade(motion, all(el, SERVICE.text), { delay: STAGGER })];
    const at = STAGGER * 3;
    all(el, '.service__details > *').forEach(list => {
      stops.push(
        ...revealFade(motion, all(list, SERVICE.labels), { delay: at }),
        ...revealFade(motion, all(list, SERVICE.items), { delay: at + STAGGER, step: STAGGER / 2 }),
      );
    });
    return stops;
  },
};

export const SERVICES_PAGE_CHOREO = {
  service: SERVICE_REVEAL,
};
