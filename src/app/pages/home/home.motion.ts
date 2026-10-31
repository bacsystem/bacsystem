import type { Choreography } from '../../shared/directives/reveal-group.directive';
import type { MotionService, Stoppable } from '../../shared/motion/motion.service';
import { DURATION, EASE_OUT, RISE, RISE_SM, SPRING, STAGGER } from '../../shared/motion/motion.tokens';
import { all, hideFade, hideHeading, hideWords, lines, revealFade, revealHeading, revealWords } from '../../shared/motion/reveal';

/*
 * Home page choreography, played with Motion by appRevealGroup (scroll entrances, once) and by
 * HomePageComponent (the hero intro). Rhythm: one stagger step (STAGGER), eased tweens for
 * text, springs for things with mass (cards, markers). Timelines overlap instead of waiting.
 */

const DESKTOP = '(min-width: 64em)';

/** The process line runs across on desktop and down on mobile: one source for hide, play and draw. */
const axisOf = (motion: MotionService) => (motion.matches(DESKTOP) ? 'scaleX' : 'scaleY');

function clear(els: HTMLElement[], props: string[]): void {
  for (const el of els) for (const p of props) el.style.removeProperty(p);
}

/** A spring rise for a card-like block (opacity on a short tween so it never flickers). */
function settle(motion: MotionService, els: HTMLElement[], from: { y?: number; scale?: number }, delay: number | ReturnType<MotionService['stagger']> = 0): Stoppable {
  const fade = motion.animate(els, { opacity: [0, 1] }, { duration: DURATION.slow, ease: EASE_OUT, delay });
  const move = motion.animate(els, { y: [from.y ?? RISE, 0], scale: [from.scale ?? 1, 1] }, { ...SPRING.settle, delay });
  Promise.all([fade.finished, move.finished]).then(() => clear(els, ['opacity', 'transform']));
  return { stop: () => (fade.stop(), move.stop()) };
}

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

/** Section heading: eyebrow, masked title lines, subtitle. */
export const HEADING_REVEAL: Choreography = {
  hide: el => hideHeading(el),
  play: (el, motion) => revealHeading(motion, el).stops,
};

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
        clear(links, ['transform']);
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

/** Stats: each top rule grows left to right, then its figure and label fade up (the counter runs on its own). */
export const STATS_REVEAL: Choreography = {
  hide: el => {
    all(el, '.stats__item').forEach(item => item.style.setProperty('--rule', '0'));
    hideFade(all(el, '.stats__item > *'));
  },
  play: (el, motion) => {
    const items = all(el, '.stats__item');
    const rules = motion.animate(items, { '--rule': [0, 1] }, { duration: DURATION.enter, ease: EASE_OUT, delay: motion.stagger(STAGGER) });
    rules.finished.then(() => clear(items, ['--rule']));
    return [rules, ...revealFade(motion, all(el, '.stats__item > *'), { delay: STAGGER * 2 })];
  },
};

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

/** Product cards rise in a stagger (springs). */
export const PRODUCTS_REVEAL: Choreography = {
  hide: el => hideFade(all(el, ':scope > *'), RISE),
  play: (el, motion) => [settle(motion, all(el, ':scope > *'), { y: RISE }, motion.stagger(STAGGER))],
};

export const HOME_CHOREO = {
  heading: HEADING_REVEAL,
  services: SERVICES_REVEAL,
  process: PROCESS_REVEAL,
  products: PRODUCTS_REVEAL,
  stats: STATS_REVEAL,
  contact: CONTACT_REVEAL,
};
