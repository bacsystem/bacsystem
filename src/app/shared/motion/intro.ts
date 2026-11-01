import { INTRO_FAILSAFE } from './motion.tokens';

/** Safety margin (ms): give up the intro slightly before the CSS failsafe is due. */
const MARGIN = 150;

/**
 * True while the hero intro is still held hidden: the head script in index.html set
 * <html class="motion-intro" data-intro-at="…">, the failsafe (INTRO_FAILSAFE) is not due yet
 * and, when given, `el` is actually hidden (computed opacity 0).
 * When this is false (no flag, a later visit within the SPA, or the app hydrated so late that the
 * failsafe already revealed the hero) the intro must be skipped: hiding again would make the
 * visible headline vanish and replay.
 */
export function introHeld(doc: Document, el?: Element): boolean {
  const html = doc.documentElement;
  if (!html.classList.contains('motion-intro')) return false;
  const at = Number(html.dataset['introAt']);
  if (!Number.isFinite(at)) return false;
  if (performance.now() - at >= INTRO_FAILSAFE * 1000 - MARGIN) return false;
  // Belt and braces: if the element is not actually hidden right now, it is already on screen.
  return !el || doc.defaultView?.getComputedStyle(el).opacity === '0';
}
