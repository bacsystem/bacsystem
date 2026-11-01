import type { Choreography } from '../../shared/directives/reveal-group.directive';
import type { MotionService, Stoppable } from '../../shared/motion/motion.service';
import { HEADING_REVEAL, clearStyles as clear, settle } from '../../shared/motion/choreo';
import { DURATION, EASE_OUT, RISE, RISE_SM, STAGGER } from '../../shared/motion/motion.tokens';
import { all, hideFade, hideWords, lines, revealFade, revealWords } from '../../shared/motion/reveal';

/*
 * Home page choreography, played with Motion by appRevealGroup (scroll entrances, once) and by
 * HomePageComponent (the hero intro). Rhythm: one stagger step (STAGGER), eased tweens for
 * text, springs for things with mass (cards, markers). Timelines overlap instead of waiting.
 * The process steps and the contact band are shared sections with their own choreography
 * (shared/sections/*); section headings use the shared HEADING_REVEAL.
 */

/* ---------- Hero intro (on load) ---------- */

export const HERO = {
  rule: '.eyebrow__rule',
  eyebrow: '.eyebrow__text',
  words: '.hero__title .ui-word',
  subtitle: '.hero__subtitle',
  actions: '.hero__actions > *',
};

export function hideHero(root: HTMLElement): void {
  all(root, HERO.rule).forEach(r => (r.style.transform = 'scaleX(0)'));
  hideFade(all(root, HERO.eyebrow));
  hideWords(all(root, HERO.words));
  hideFade(all(root, HERO.subtitle));
  hideFade(all(root, HERO.actions));
}

/**
 * Hero text, ~1.45s in all: the eyebrow rule grows, its label sharpens in, the title rises line
 * by line from behind its mask, the subtitle and the actions follow one step apart.
 */
export function playHero(motion: MotionService, root: HTMLElement): Stoppable[] {
  const rule = all(root, HERO.rule);
  const words = all(root, HERO.words);
  const titleAt = 0.25;
  const subtitleAt = titleAt + STAGGER * (lines(words).length + 2);
  const ruleAnim = motion.animate(rule, { transform: ['scaleX(0)', 'scaleX(1)'] }, { duration: DURATION.enter, ease: EASE_OUT });
  ruleAnim.finished.then(() => clear(rule, ['transform']));
  return [
    ruleAnim,
    ...revealFade(motion, all(root, HERO.eyebrow), { delay: STAGGER, blur: true }),
    ...revealWords(motion, words, titleAt),
    ...revealFade(motion, all(root, HERO.subtitle), { delay: subtitleAt }),
    ...revealFade(motion, all(root, HERO.actions), { delay: subtitleAt + STAGGER * 1.5 }),
  ];
}

/* ---------- Scroll entrances ---------- */

/** Services: the lead card rises and settles from 0.98; the list follows item by item, each number a beat before its text. */
export const SERVICES_REVEAL: Choreography = {
  hide: el => {
    all(el, '.services__lead').forEach(lead => {
      lead.style.opacity = '0';
      lead.style.transform = `translateY(${RISE}px) scale(0.98)`;
    });
    all(el, '.services__item .services__index').forEach(n => {
      n.style.opacity = '0';
      n.style.transform = `translateX(-${RISE_SM}px)`;
    });
    hideFade(all(el, '.services__item > div'));
  },
  play: (el, motion) => {
    const stops: Stoppable[] = [settle(motion, all(el, '.services__lead'), { y: RISE, scale: 0.98 })];
    all(el, '.services__item').forEach((item, i) => {
      const at = 0.15 + i * STAGGER * 2;
      const index = all(item, '.services__index');
      const n = motion.animate(index, { opacity: [0, 1], transform: [`translateX(-${RISE_SM}px)`, 'translateX(0px)'] }, { duration: DURATION.enter, ease: EASE_OUT, delay: at });
      n.finished.then(() => clear(index, ['opacity', 'transform']));
      stops.push(n, ...revealFade(motion, all(item, ':scope > div'), { delay: at + STAGGER }));
    });
    return stops;
  },
};

/** Product cards rise in a stagger (springs). */
export const PRODUCTS_REVEAL: Choreography = {
  hide: el => hideFade(all(el, ':scope > *'), RISE),
  play: (el, motion) => [settle(motion, all(el, ':scope > *'), { y: RISE }, motion.stagger(STAGGER))],
};

export const HOME_CHOREO = {
  heading: HEADING_REVEAL,
  services: SERVICES_REVEAL,
  products: PRODUCTS_REVEAL,
};
