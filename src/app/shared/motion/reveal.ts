import type { MotionService, Stoppable } from './motion.service';
import { BLUR_FROM, BLUR_TO, DURATION, EASE_OUT, RISE_SM, STAGGER } from './motion.tokens';

/*
 * Small building blocks shared by every entrance on the page. Each pair is
 * hide (sets the pre-state inline, right before the element is watched or played)
 * + reveal (plays it and clears the inline styles once done, so nothing lingers:
 * no leftover filter layers, clip paths or transforms that would fight hover states).
 */

type Els = HTMLElement[];

/** The mask a word starts behind: fully clipped from its bottom edge (top/sides left loose for accents). */
const CLIP_HIDDEN = 'inset(-30% -10% 100% -10%)';
const CLIP_SHOWN = 'inset(-30% -10% 0% -10%)';

export function all(root: ParentNode, selector: string): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

function clear(els: Els, props: string[]): void {
  for (const el of els) for (const p of props) el.style.removeProperty(p);
}

/** Groups word spans by rendered line (same offsetTop), in reading order. */
export function lines(words: Els): HTMLElement[][] {
  const rows = new Map<number, HTMLElement[]>();
  for (const w of words) {
    const top = Math.round(w.offsetTop);
    const key = [...rows.keys()].find(k => Math.abs(k - top) < 4) ?? top;
    rows.set(key, [...(rows.get(key) ?? []), w]);
  }
  return [...rows.entries()].sort((a, b) => a[0] - b[0]).map(([, row]) => row);
}

export function hideWords(words: Els): void {
  for (const w of words) {
    w.style.opacity = '0';
    w.style.transform = 'translateY(100%)';
    w.style.clipPath = CLIP_HIDDEN;
  }
}

/**
 * Masked line-up: each rendered line rises from behind its own bottom edge, sharpening from a
 * small blur. Words on one line move as one, lines follow one stagger step apart.
 */
export function revealWords(motion: MotionService, words: Els, delay = 0, blur = true): Stoppable[] {
  return lines(words).map((line, i) => {
    const controls = motion.animate(
      line,
      {
        opacity: [0, 1],
        transform: ['translateY(100%)', 'translateY(0%)'],
        clipPath: [CLIP_HIDDEN, CLIP_SHOWN],
        ...(blur ? { filter: [BLUR_FROM, BLUR_TO] } : {}),
      },
      { duration: DURATION.enter, ease: EASE_OUT, delay: delay + i * STAGGER },
    );
    controls.finished.then(() => clear(line, ['opacity', 'transform', 'clip-path', 'filter']));
    return controls;
  });
}

export function hideFade(els: Els, rise = RISE_SM): void {
  for (const el of els) {
    el.style.opacity = '0';
    el.style.transform = `translateY(${rise}px)`;
  }
}

/** Fade up, one stagger step apart. `blur` only for short text. */
export function revealFade(
  motion: MotionService,
  els: Els,
  { delay = 0, rise = RISE_SM, blur = false, step = STAGGER }: { delay?: number; rise?: number; blur?: boolean; step?: number } = {},
): Stoppable[] {
  if (!els.length) return [];
  const controls = motion.animate(
    els,
    {
      opacity: [0, 1],
      transform: [`translateY(${rise}px)`, 'translateY(0px)'],
      ...(blur ? { filter: [BLUR_FROM, BLUR_TO] } : {}),
    },
    { duration: DURATION.enter, ease: EASE_OUT, delay: motion.stagger(step, { startDelay: delay }) },
  );
  controls.finished.then(() => clear(els, ['opacity', 'transform', 'filter']));
  return [controls];
}

/** A section heading (ui-section-heading or the same parts): eyebrow, title lines, subtitle. */
export const HEADING = {
  eyebrow: '.ui-section-heading__eyebrow',
  words: '.ui-section-heading__title .ui-word',
  subtitle: '.ui-section-heading__subtitle',
};

export function hideHeading(root: ParentNode, parts = HEADING): void {
  hideFade(all(root, parts.eyebrow));
  hideWords(all(root, parts.words));
  hideFade(all(root, parts.subtitle));
}

/** Eyebrow first, title lines overlapping it, subtitle as the title settles. Returns when the subtitle starts. */
export function revealHeading(motion: MotionService, root: ParentNode, delay = 0, parts = HEADING): { stops: Stoppable[]; next: number } {
  const eyebrow = all(root, parts.eyebrow);
  const words = all(root, parts.words);
  const titleAt = delay + (eyebrow.length ? STAGGER : 0);
  const titleLines = Math.max(lines(words).length, 1);
  const subtitleAt = titleAt + STAGGER * (titleLines + 2);
  return {
    stops: [
      ...revealFade(motion, eyebrow, { delay, blur: true }),
      ...revealWords(motion, words, titleAt),
      ...revealFade(motion, all(root, parts.subtitle), { delay: subtitleAt }),
    ],
    next: subtitleAt + STAGGER,
  };
}
