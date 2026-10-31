import type { MotionService } from './motion.service';
import { hideFade, hideWords, lines, revealFade, revealWords } from './reveal';

/** A Motion stand-in whose animations finish at once, so the cleanup-after-finish path runs. */
function finishingMotion() {
  const calls: unknown[][] = [];
  const motion = {
    animate: (...args: unknown[]) => {
      calls.push(args);
      return { stop: () => undefined, finished: Promise.resolve() };
    },
    stagger: () => 0,
  } as unknown as MotionService;
  return { motion, calls };
}

describe('reveal helpers', () => {
  let box: HTMLElement;

  beforeEach(() => {
    box = document.createElement('div');
    box.style.width = '120px';
    box.innerHTML = ['Software', 'a', 'medida', 'para', 'empresas'].map(w => `<span class="ui-word" style="display:inline-block">${w}</span>`).join(' ');
    document.body.appendChild(box);
  });

  afterEach(() => box.remove());

  const words = () => Array.from(box.querySelectorAll<HTMLElement>('.ui-word'));

  it('groups words by rendered line, in reading order', () => {
    const rows = lines(words());
    expect(rows.length).toBeGreaterThan(1);
    expect(rows.flat().map(w => w.textContent)).toEqual(['Software', 'a', 'medida', 'para', 'empresas']);
  });

  it('hides words behind their mask, then clears every inline style once the reveal finishes', async () => {
    hideWords(words());
    expect(words().every(w => w.style.opacity === '0' && w.style.clipPath !== '')).toBeTrue();
    const { motion, calls } = finishingMotion();
    revealWords(motion, words());
    expect(calls.length).toBe(lines(words()).length); // one animation per line
    await Promise.resolve();
    await Promise.resolve();
    expect(words().every(w => !w.style.opacity && !w.style.transform && !w.style.clipPath && !w.style.filter)).toBeTrue();
  });

  it('fades a group up and clears its inline styles when done', async () => {
    const els = words();
    hideFade(els);
    expect(els[0].style.transform).toBe('translateY(12px)');
    const { motion } = finishingMotion();
    revealFade(motion, els);
    await Promise.resolve();
    await Promise.resolve();
    expect(els.every(el => !el.style.opacity && !el.style.transform)).toBeTrue();
  });

  it('does nothing for an empty group', () => {
    const { motion, calls } = finishingMotion();
    expect(revealFade(motion, [])).toEqual([]);
    expect(calls.length).toBe(0);
  });
});
