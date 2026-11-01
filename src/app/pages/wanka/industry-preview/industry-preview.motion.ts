import type { MotionService, Stoppable } from '../../../shared/motion/motion.service';
import { DURATION, EASE_OUT, INDUSTRY_CYCLE, RISE_SM, STAGGER } from '../../../shared/motion/motion.tokens';
import { all } from '../../../shared/motion/reveal';

/**
 * Steps through the industries in a loop: the active tab moves (CSS transition on .is-active) and the
 * industry's own menu items rise in one after the other. Only classes and one entrance per switch.
 */
export function playIndustries(host: HTMLElement, motion: MotionService): Stoppable[] {
  const tabs = all(host, '.tabs__item');
  const lists = all(host, '.menu__list--specific');
  if (tabs.length < 2 || tabs.length !== lists.length) return [];

  let current = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const show = (next: number) => {
    tabs[current].classList.remove('is-active');
    lists[current].classList.remove('is-active');
    tabs[next].classList.add('is-active');
    lists[next].classList.add('is-active');
    motion.animate(
      all(lists[next], '.menu__item'),
      { opacity: [0, 1], transform: [`translateY(${RISE_SM}px)`, 'translateY(0px)'] },
      { duration: DURATION.slow, ease: EASE_OUT, delay: motion.stagger(STAGGER) },
    );
    current = next;
  };

  const tick = () => {
    show((current + 1) % tabs.length);
    timer = setTimeout(tick, INDUSTRY_CYCLE.hold * 1000);
  };

  motion.run(() => (timer = setTimeout(tick, INDUSTRY_CYCLE.hold * 1000)));
  return [{ stop: () => clearTimeout(timer) }];
}
