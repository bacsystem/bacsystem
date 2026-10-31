import { introHeld } from './intro';
import { INTRO_FAILSAFE } from './motion.tokens';

describe('introHeld', () => {
  const html = document.documentElement;
  afterEach(() => {
    html.classList.remove('motion-intro');
    delete html.dataset['introAt'];
  });

  function flag(at: number): void {
    html.classList.add('motion-intro');
    html.dataset['introAt'] = String(at);
  }

  it('is false without the head-script flag', () => {
    expect(introHeld(document)).toBeFalse();
  });

  it('is true right after the flag was set', () => {
    flag(performance.now());
    expect(introHeld(document)).toBeTrue();
  });

  it('is false once the failsafe is (nearly) due', () => {
    flag(performance.now() - INTRO_FAILSAFE * 1000);
    expect(introHeld(document)).toBeFalse();
  });

  it('is false without a valid timestamp', () => {
    html.classList.add('motion-intro');
    expect(introHeld(document)).toBeFalse();
  });

  it('is false when the given element is not actually hidden', () => {
    flag(performance.now());
    const el = document.createElement('p');
    document.body.appendChild(el);
    expect(introHeld(document, el)).toBeFalse();
    el.style.opacity = '0';
    expect(introHeld(document, el)).toBeTrue();
    el.remove();
  });
});
